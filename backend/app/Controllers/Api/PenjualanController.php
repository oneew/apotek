<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\PenjualanModel;
use App\Models\PenjualanDetailModel;
use App\Models\ProdukModel;

class PenjualanController extends BaseController
{
    use ResponseTrait;
    protected $format = 'json';

    /**
     * GET /api/master/penjualan
     * List all sales with optional filters
     */
    public function index()
    {
        $db = \Config\Database::connect();

        $builder = $db->table('t_penjualan as p')
            ->select('p.*, pel.nama_pelanggan, dok.nama_dokter')
            ->join('m_pelanggan as pel', 'pel.id = p.pelanggan_id', 'left')
            ->join('m_dokter as dok', 'dok.id = p.dokter_id', 'left');

        // Filter by status
        $status = $this->request->getGet('status');
        if ($status) {
            $builder->where('p.status_penjualan', $status);
        }

        // Filter by payment type
        $paymentType = $this->request->getGet('jenis_pembayaran');
        if ($paymentType) {
            $builder->where('p.jenis_pembayaran', $paymentType);
        }

        // Filter by date range
        $dateFrom = $this->request->getGet('date_from');
        $dateTo   = $this->request->getGet('date_to');
        if ($dateFrom) {
            $builder->where('DATE(p.tanggal_penjualan) >=', $dateFrom);
        }
        if ($dateTo) {
            $builder->where('DATE(p.tanggal_penjualan) <=', $dateTo);
        }

        // Search
        $search = $this->request->getGet('search');
        if ($search) {
            $builder->groupStart()
                ->like('p.no_invoice', $search)
                ->orLike('pel.nama_pelanggan', $search)
                ->orLike('dok.nama_dokter', $search)
                ->groupEnd();
        }

        $data = $builder->orderBy('p.created_at', 'DESC')
            ->get()->getResultArray();

        // Get summary
        $totalNilai = array_sum(array_column($data, 'total_bayar'));

        return $this->respond([
            'status' => true,
            'data'   => $data,
            'summary' => [
                'total_records' => count($data),
                'total_nilai'   => (float) $totalNilai,
            ]
        ]);
    }

    /**
     * GET /api/master/penjualan/:id
     * Show sale detail with items
     */
    public function show($id = null)
    {
        $db = \Config\Database::connect();

        $penjualan = $db->table('t_penjualan as p')
            ->select('p.*, pel.nama_pelanggan, pel.no_telp as telp_pelanggan, dok.nama_dokter')
            ->join('m_pelanggan as pel', 'pel.id = p.pelanggan_id', 'left')
            ->join('m_dokter as dok', 'dok.id = p.dokter_id', 'left')
            ->where('p.id', $id)
            ->get()->getRowArray();

        if (!$penjualan) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $items = $db->table('t_penjualan_detail as d')
            ->select('d.*, pr.nama_produk, pr.sku, s.nama_satuan')
            ->join('m_produk as pr', 'pr.id = d.produk_id', 'left')
            ->join('m_satuan as s', 's.id = d.satuan_id', 'left')
            ->where('d.penjualan_id', $id)
            ->get()->getResultArray();

        $penjualan['items'] = $items;

        return $this->respond([
            'status' => true,
            'data'   => $penjualan,
        ]);
    }

    /**
     * POST /api/master/penjualan
     * Create new sale from POS
     */
    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $db->transStart();

        $penjualanModel = new PenjualanModel();
        $produkModel = new ProdukModel();

        // Map payment type from frontend to DB enum
        $paymentTypeMap = [
            'Tunai'    => 'Tunai',
            'QRIS'     => 'Qris/E-Wallet',
            'Transfer' => 'Kredit',
            'Debit'    => 'Debit',
        ];
        $paymentType = $paymentTypeMap[$data['paymentType'] ?? 'Tunai'] ?? 'Tunai';

        // 1. Prepare Main Transaction Data
        $penjualanData = [
            'no_invoice'        => $penjualanModel->generateInvoiceNumber(),
            'tanggal_penjualan' => date('Y-m-d H:i:s'),
            'pelanggan_id'      => !empty($data['pelanggan_id']) ? $data['pelanggan_id'] : null,
            'dokter_id'         => !empty($data['dokter_id']) ? $data['dokter_id'] : null,
            'total_belanja'     => $data['subTotal'] ?? 0,
            'diskon_nota'       => $data['discountTotal'] ?? 0,
            'total_bayar'       => $data['grandTotal'] ?? 0,
            'uang_diterima'     => $data['cashAmount'] ?? ($data['grandTotal'] ?? 0),
            'uang_kembali'      => ($data['cashAmount'] ?? ($data['grandTotal'] ?? 0)) - ($data['grandTotal'] ?? 0),
            'jenis_pembayaran'  => $paymentType,
            'status_penjualan'  => 'Selesai',
            'keterangan'        => $data['notes'] ?? ''
        ];

        $penjualanId = $penjualanModel->insert((object)$penjualanData);

        // 2. Prepare Details
        if (!empty($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $product = $produkModel->find($item['id']);
                $satuanId = $product['satuan_utama_id'] ?? 1;

                $db->table('t_penjualan_detail')->insert([
                    'penjualan_id'         => $penjualanId,
                    'produk_id'            => $item['id'],
                    'satuan_id'            => $satuanId,
                    'jumlah_jual'          => $item['qty'] ?? 1,
                    'harga_jual_per_satuan'=> $item['price'] ?? 0,
                    'diskon'               => 0,
                    'subtotal'             => ($item['price'] ?? 0) * ($item['qty'] ?? 1),
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Transaksi gagal disimpan'], 500);
        }

        // LOGGING: Record new sale
        $this->logActivity('Penjualan', 'Transaksi Kasir Baru: ' . $penjualanData['no_invoice'], $penjualanId, $penjualanData);

        return $this->respond([
            'status'  => true, 
            'message' => 'Transaksi berhasil disimpan',
            'data'    => ['invoice' => $penjualanData['no_invoice']]
        ]);
    }

    /**
     * DELETE /api/master/penjualan/:id
     * Cancel/void a sale
     */
    public function delete($id = null)
    {
        $db = \Config\Database::connect();

        $penjualan = $db->table('t_penjualan')->where('id', $id)->get()->getRowArray();
        if (!$penjualan) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $db->table('t_penjualan')
            ->where('id', $id)
            ->update(['status_penjualan' => 'Dibatalkan']);

        // LOGGING: Record void sale
        $this->logActivity('Penjualan', 'Transaksi Dibatalkan/Void: ' . $penjualan['no_invoice'], $id);

        return $this->respond([
            'status' => true,
            'message' => 'Penjualan berhasil dibatalkan'
        ]);
    }
}
