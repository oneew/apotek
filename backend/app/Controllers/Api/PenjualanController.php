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

    public function __construct()
    {
        $this->_initTable();
    }

    private function _initTable()
    {
        $db = \Config\Database::connect();
        $db->query("CREATE TABLE IF NOT EXISTS t_penjualan_tertolak (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            produk_id INTEGER,
            jumlah INTEGER DEFAULT 1,
            tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
            alasan TEXT,
            FOREIGN KEY (produk_id) REFERENCES m_produk(id)
        )");
    }

    public function log_tertolak()
    {
        $data = $this->request->getJSON(true);
        if (empty($data['produk_id'])) {
            return $this->fail('Product ID required');
        }

        $db = \Config\Database::connect();
        $db->table('t_penjualan_tertolak')->insert([
            'produk_id' => $data['produk_id'],
            'jumlah'    => $data['jumlah'] ?? 1,
            'alasan'    => $data['alasan'] ?? 'Stok Habis (Tertolak di Kasir)',
            'tanggal'   => date('Y-m-d H:i:s')
        ]);

        return $this->respondCreated(['status' => true, 'message' => 'Penjualan tertolak berhasil dicatat']);
    }

    /**
     * GET /api/master/penjualan/tertolak
     * List all rejected sales
     */
    public function get_tertolak()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_penjualan_tertolak as t')
            ->select('t.*, p.nama_produk')
            ->join('m_produk as p', 'p.id = t.produk_id', 'left');

        $search = $this->request->getGet('search');
        if ($search) {
            $builder->like('p.nama_produk', $search);
        }

        $data = $builder->orderBy('t.tanggal', 'DESC')->get()->getResultArray();

        return $this->respond([
            'status' => true,
            'data'   => $data,
        ]);
    }

    /**
     * DELETE /api/master/penjualan/tertolak/:id
     * Delete a rejected sale log
     */
    public function delete_tertolak($id = null)
    {
        $db = \Config\Database::connect();
        $deleted = $db->table('t_penjualan_tertolak')->where('id', $id)->delete();
        
        if ($deleted) {
            return $this->respond(['status' => true, 'message' => 'Log tertolak berhasil dihapus']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal menghapus log'], 500);
    }

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

        // Filter by date range or quick filter
        $filterTanggal = $this->request->getGet('filter_tanggal');
        $dateFrom      = $this->request->getGet('date_from');
        $dateTo        = $this->request->getGet('date_to');

        if ($filterTanggal === 'Hari ini') {
            $builder->where('DATE(p.tanggal_penjualan)', date('Y-m-d'));
        } elseif ($filterTanggal === 'Minggu ini') {
            $builder->where('p.tanggal_penjualan >=', date('Y-m-d', strtotime('monday this week')) . ' 00:00:00');
        } elseif ($filterTanggal === 'Bulan ini') {
            $builder->where("DATE_FORMAT(p.tanggal_penjualan, '%Y-%m')", date('Y-m'));
        } elseif ($filterTanggal === 'Tahun ini') {
            $builder->where("DATE_FORMAT(p.tanggal_penjualan, '%Y')", date('Y'));
        } else {
            if ($dateFrom) {
                $builder->where('DATE(p.tanggal_penjualan) >=', $dateFrom);
            }
            if ($dateTo) {
                $builder->where('DATE(p.tanggal_penjualan) <=', $dateTo);
            }
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

        // Get summary (exclude canceled sales from total value)
        $activeSales = array_filter($data, function($s) { 
            return $s['status_penjualan'] !== 'Batal'; 
        });
        $totalNilai = array_sum(array_column($activeSales, 'total_bayar'));

        return $this->respond([
            'status' => true,
            'data'   => $data,
            'summary' => [
                'total_records' => count($data),
                'total_active_records' => count($activeSales),
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
            ->select('p.*, pel.nama_pelanggan, pel.no_telepon as telp_pelanggan, dok.nama_dokter')
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
            'kasir_id'          => $data['kasir_id'] ?? 1,
            'total_belanja'     => $data['subTotal'] ?? 0,
            'diskon_nota'       => ($data['discountTotal'] ?? 0) + ($data['redeemDiscount'] ?? 0),
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

                // NEW: Auto-log to t_resep if it's a racikan or from external resep
                if (strpos($item['id'], 'RCK-') !== false || strpos($item['sku'] ?? '', 'MIX-') !== false || !empty($data['dokter_id'])) {
                    $hasRacikan = true;
                }
            }

            if (!empty($hasRacikan)) {
                $resepCount = $db->table('t_resep')->countAllResults() + 1;
                $noResep = 'RSP-KSR-' . date('Ymd') . '-' . str_pad($resepCount, 4, '0', STR_PAD_LEFT);
                
                $db->table('t_resep')->insert([
                    'no_resep'      => $noResep,
                    'tanggal_resep' => date('Y-m-d H:i:s'),
                    'dokter_id'     => !empty($data['dokter_id']) ? $data['dokter_id'] : null,
                    'pelanggan_id'  => !empty($data['pelanggan_id']) ? $data['pelanggan_id'] : null,
                    'catatan'       => 'Otomatis dari Penjualan Kasir #' . $penjualanData['no_invoice'],
                    'status'        => 'Selesai',
                    'sumber'        => 'Kasir',
                    'is_racikan'    => true,
                    'created_at'    => date('Y-m-d H:i:s'),
                ]);
            }
        }

        // 3. Loyalty Points logic
        if (!empty($data['pelanggan_id'])) {
            $earnedPoints = floor(($data['grandTotal'] ?? 0) / 10000);
            $redeemedPoints = $data['redeemPoints'] ?? 0;
            
            $db->query("
                UPDATE m_pelanggan 
                SET total_belanja = total_belanja + " . ($data['grandTotal'] ?? 0) . ",
                    loyalty_points = loyalty_points + " . ((int)$earnedPoints - (int)$redeemedPoints) . "
                WHERE id = " . (int)$data['pelanggan_id'] . "
            ");
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
     * POST /api/master/penjualan/retur
     * Process item exchange (Tukar Barang)
     */
    public function retur()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $penjualanId = $data['penjualan_id'] ?? null;
        $detailId    = $data['detail_id'] ?? null; 
        $replacementProductId = $data['replacement_product_id'] ?? null;

        if (!$penjualanId || !$detailId || !$replacementProductId) {
            return $this->respond(['status' => false, 'message' => 'Payload tidak lengkap'], 400);
        }

        // 1. Get original detail
        $oldDetail = $db->table('t_penjualan_detail')->where('id', $detailId)->get()->getRowArray();
        if (!$oldDetail) {
            return $this->respond(['status' => false, 'message' => 'Item asal tidak ditemukan'], 404);
        }

        // 2. Get products for logging
        $oldProduct = $db->table('m_produk')->where('id', $oldDetail['produk_id'])->get()->getRowArray();
        $newProduct = $db->table('m_produk')->where('id', $replacementProductId)->get()->getRowArray();

        if (!$newProduct) {
            return $this->respond(['status' => false, 'message' => 'Produk pengganti tidak ditemukan'], 404);
        }

        $db->transStart();

        // A. Return Old Item to Stock
        if ($oldDetail['stok_batch_id']) {
            $db->table('t_stok_batch')
               ->where('id', $oldDetail['stok_batch_id'])
               ->increment('stok_tersedia', $oldDetail['jumlah_jual']);
        }

        // B. Deduct New Item from Stock (Using FEFO)
        $batch = $db->table('t_stok_batch')
                    ->where('produk_id', $replacementProductId)
                    ->where('stok_tersedia >', 0)
                    ->orderBy('tanggal_expired', 'ASC')
                    ->get()->getRowArray();

        $newBatchId = $batch ? $batch['id'] : null;
        if ($newBatchId) {
            $db->table('t_stok_batch')
               ->where('id', $newBatchId)
               ->decrement('stok_tersedia', $oldDetail['jumlah_jual']);
        }

        // C. Update the detail record (Swap Product)
        $db->table('t_penjualan_detail')
           ->where('id', $detailId)
           ->update([
               'produk_id' => $replacementProductId,
               'stok_batch_id' => $newBatchId,
           ]);

        // D. Tag the transaction header
        $db->table('t_penjualan')
           ->where('id', $penjualanId)
           ->update(['status_penjualan' => 'Retur']);

        $db->transComplete();

        if ($db->transStatus() === false) {
             return $this->respond(['status' => false, 'message' => 'Gagal memproses tukar barang'], 500);
        }

        // LOGGING
        $activityMsg = "Tukar Barang di Invoice #{$penjualanId}: " . ($oldProduct['nama_produk'] ?? 'ID:'.$oldDetail['produk_id']) . " -> " . $newProduct['nama_produk'];
        $this->logActivity('Penjualan', $activityMsg, $penjualanId, $data);

        return $this->respond([
            'status' => true, 
            'message' => 'Tukar barang berhasil diproses'
        ]);
    }

    /**
     * DELETE /api/master/penjualan/:id
     * Cancel/void a sale and REVERT STOCK
     */
    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        
        $penjualan = $db->table('t_penjualan')->where('id', $id)->get()->getRowArray();
        if (!$penjualan) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($penjualan['status_penjualan'] === 'Batal') {
            return $this->respond(['status' => false, 'message' => 'Transaksi sudah dibatalkan'], 400);
        }

        $db->transStart();

        // 1. Get all items and revert stock
        $items = $db->table('t_penjualan_detail')->where('penjualan_id', $id)->get()->getResultArray();
        foreach ($items as $item) {
            if ($item['stok_batch_id']) {
                $db->table('t_stok_batch')
                    ->where('id', $item['stok_batch_id'])
                    ->increment('stok_tersedia', $item['jumlah_jual']);
            }
        }

        // 2. Update status
        $db->table('t_penjualan')
            ->where('id', $id)
            ->update(['status_penjualan' => 'Batal']);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal membatalkan transaksi'], 500);
        }

        $this->logActivity('Penjualan', 'Transaksi Dibatalkan/Void (Stock Reverted): ' . $penjualan['no_invoice'], $id);

        return $this->respond([
            'status' => true,
            'message' => 'Penjualan berhasil dibatalkan dan stok dikembalikan'
        ]);
    }

    /**
     * POST /api/master/penjualan/restore/:id
     * Undo a void and REDUCT STOCK again
     */
    public function restore($id = null)
    {
        $db = \Config\Database::connect();
        
        $penjualan = $db->table('t_penjualan')->where('id', $id)->get()->getRowArray();
        if (!$penjualan) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($penjualan['status_penjualan'] !== 'Batal') {
            return $this->respond(['status' => false, 'message' => 'Transaksi tidak dalam status Batal'], 400);
        }

        $db->transStart();

        // 1. Get all items and re-deduct stock
        $items = $db->table('t_penjualan_detail')->where('penjualan_id', $id)->get()->getResultArray();
        foreach ($items as $item) {
            if ($item['stok_batch_id']) {
                // Check if stock still available before re-deducting
                $batch = $db->table('t_stok_batch')->where('id', $item['stok_batch_id'])->get()->getRowArray();
                if (!$batch || $batch['stok_tersedia'] < $item['jumlah_jual']) {
                    return $this->respond(['status' => false, 'message' => 'Stok tidak mencukupi untuk memulihkan transaksi ini'], 400);
                }

                $db->table('t_stok_batch')
                    ->where('id', $item['stok_batch_id'])
                    ->decrement('stok_tersedia', $item['jumlah_jual']);
            }
        }

        // 2. Update status back to Selesai
        $db->table('t_penjualan')
            ->where('id', $id)
            ->update(['status_penjualan' => 'Selesai']);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal memulihkan transaksi'], 500);
        }

        $this->logActivity('Penjualan', 'Transaksi Dipulihkan (Stock Re-deducted): ' . $penjualan['no_invoice'], $id);

        return $this->respond([
            'status' => true,
            'message' => 'Penjualan berhasil dipulihkan'
        ]);
    }
}
