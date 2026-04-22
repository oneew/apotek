<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\PembelianModel;
use App\Models\PembelianDetailModel;
use App\Models\StokBatchModel;
use App\Models\KartuStokModel;
use App\Models\SupplierModel;
use App\Models\ProdukModel;

class PembelianController extends BaseController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $model = new PembelianModel();
        $data = $model->select('t_pembelian.*, m_supplier.nama_supplier')
                      ->join('m_supplier', 'm_supplier.id = t_pembelian.supplier_id', 'left')
                      ->orderBy('t_pembelian.created_at', 'DESC')
                      ->findAll();

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function show($id = null)
    {
        $model = new PembelianModel();
        $pembelian = $model->select('t_pembelian.*, m_supplier.nama_supplier')
                           ->join('m_supplier', 'm_supplier.id = t_pembelian.supplier_id', 'left')
                           ->find($id);

        if (!$pembelian) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $detailModel = new PembelianDetailModel();
        $details = $detailModel->select('t_pembelian_detail.*, m_produk.nama_produk')
                               ->join('m_produk', 'm_produk.id = t_pembelian_detail.produk_id', 'left')
                               ->where('pembelian_id', $id)
                               ->findAll();

        return $this->respond([
            'status' => true,
            'data'   => array_merge($pembelian, ['items' => $details])
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $db->transStart();

        $pembelianModel = new PembelianModel();
        $detailModel = new PembelianDetailModel();
        $stokBatchModel = new StokBatchModel();
        $kartuStokModel = new KartuStokModel();

        // 1. Save Main Purchase Data
        $pembelianData = [
            'no_faktur'           => $data['noFaktur'],
            'tanggal_pembelian'   => $data['tanggalTerima'],
            'tanggal_jatuh_tempo' => $data['tanggalJatuhTempo'] ?: null,
            'supplier_id'         => $data['supplier_id'],
            'total_tagihan'       => $data['totalTagihan'],
            'diskon_total'        => $data['diskonTotal'] ?? 0,
            'pajak'               => $data['pajak'] ?? 0,
            'grand_total'         => $data['grandTotal'],
            'status_pembayaran'   => $data['statusPembayaran'] ?? 'Belum Lunas',
            'keterangan'          => $data['catatan'] ?? '',
            'status'              => $data['status'] ?? 'Posted',
            'po_id'               => $data['po_id'] ?? null,
            'created_at'          => date('Y-m-d H:i:s')
        ];

        $pembelianId = $pembelianModel->insert((object)$pembelianData);

        // 2. Save Details & Update Stock (Only if Posted)
        foreach ($data['items'] as $item) {
            // Fetch product info if satuan_id is missing
            $satuanId = $item['satuan_id'] ?? null;
            if (!$satuanId) {
                $pModel = new ProdukModel();
                $pInfo = $pModel->find($item['produk_id']);
                $satuanId = $pInfo['satuan_utama_id'] ?? 1;
            }

            // Save Detail
            $detailModel->insert((object)[
                'pembelian_id'          => $pembelianId,
                'produk_id'             => (int)$item['produk_id'],
                'satuan_id'             => (int)$satuanId,
                'jumlah_beli'           => $item['qty'],
                'harga_beli_per_satuan' => $item['harga_beli'],
                'diskon'                => $item['diskon'] ?? 0,
                'subtotal'              => $item['subtotal'],
                'no_batch'              => $item['no_batch'],
                'tanggal_expired'       => $item['tanggal_expired']
            ]);

            // ONLY UPDATE STOCK IF STATUS IS POSTED
            if ($pembelianData['status'] === 'Posted') {
                // Update/Create Stok Batch
                $existingBatch = $stokBatchModel->where([
                    'produk_id' => $item['produk_id'],
                    'no_batch'  => $item['no_batch']
                ])->first();

                if ($existingBatch) {
                    $stokBatchModel->update($existingBatch['id'], (object)[
                        'stok_tersedia' => $existingBatch['stok_tersedia'] + $item['qty']
                    ]);
                    $currentStok = $existingBatch['stok_tersedia'] + $item['qty'];
                } else {
                    $stokBatchModel->insert((object)[
                        'produk_id'       => (int)$item['produk_id'],
                        'no_batch'        => $item['no_batch'],
                        'tanggal_expired' => $item['tanggal_expired'],
                        'stok_tersedia'   => (int)$item['qty'],
                        'created_at'      => date('Y-m-d H:i:s')
                    ]);
                    $currentStok = $item['qty'];
                }

                // Record and Kartu Stok
                $resSum = $stokBatchModel->where('produk_id', $item['produk_id'])->selectSum('stok_tersedia')->first();
                $totalStok = $resSum ? (int)$resSum['stok_tersedia'] : (int)$item['qty'];

                $kartuStokModel->insert((object)[
                    'produk_id'    => (int)$item['produk_id'],
                    'tanggal'      => date('Y-m-d H:i:s'),
                    'jenis_mutasi' => 'Masuk',
                    'jumlah'       => (int)$item['qty'],
                    'sisa_stok'    => $totalStok,
                    'referensi'    => $pembelianData['no_faktur'],
                    'keterangan'   => 'Pembelian dari Supplier'
                ]);
            }
        }

        // 3. Update PO status if reference exists and status is Posted
        if ($pembelianData['status'] === 'Posted' && !empty($pembelianData['po_id'])) {
            $db->table('t_pesanan_pembelian')
               ->where('id', $pembelianData['po_id'])
               ->update(['status' => 'Received']);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menyimpan pembelian'], 500);
        }

        // LOGGING: Record new purchase
        $this->logActivity('Pembelian', 'Penerimaan Faktur Baru: ' . $pembelianData['no_faktur'], $pembelianId, $pembelianData);

        return $this->respond(['status' => true, 'message' => 'Pembelian berhasil disimpan']);
    }

    public function suppliers()
    {
        $model = new SupplierModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->where('status', 'aktif')->findAll() ?: $model->findAll()
        ]);
    }
}
