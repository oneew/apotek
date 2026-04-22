<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ProdukModel;

class ProdukController extends BaseController
{
    use ResponseTrait;

    protected $format = 'json';

    public function index()
    {
        $model = new ProdukModel();
        // Join ke master data + stok untuk menampilkan info lengkap
        $data = $model->select('m_produk.*, m_satuan.nama_satuan, m_kategori.nama_kategori, COALESCE(stok.stok_total, 0) as stok_total')
                      ->join('m_satuan', 'm_satuan.id = m_produk.satuan_utama_id', 'left')
                      ->join('m_kategori', 'm_kategori.id = m_produk.kategori_1_id', 'left')
                      ->join('(SELECT produk_id, SUM(stok_tersedia) as stok_total FROM t_stok_batch GROUP BY produk_id) stok', 'stok.produk_id = m_produk.id', 'left')
                      ->findAll();

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function create()
    {
        // 1. Ambil payload HTTP berupa JSON
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        // 2. Validasi dasar
        if (!$this->validate([
            'nama_produk' => 'required',
            'tipe_produk' => 'required',
        ])) {
            return $this->respond([
                'status'  => false,
                'message' => 'Validasi gagal',
                'errors'  => $this->validator->getErrors()
            ], 400);
        }

        $id = $data['id'] ?? null;
        $insertData = [
            'tipe_produk' => strtolower($data['tipe_produk'] ?? 'umum'),
            'nama_produk' => $data['nama_produk'],
            'pabrik_prinsipal' => $data['pabrik_prinsipal'] ?? null,
            'sku' => !empty($data['sku']) ? $data['sku'] : 'SKU-' . strtoupper(uniqid()),
            'barcode' => $data['barcode'] ?? null,
            'kategori_1_id' => !empty($data['kategori_1_id']) ? $data['kategori_1_id'] : null,
            'lokasi_rak_id' => !empty($data['rak_penyimpanan']) ? $data['rak_penyimpanan'] : null,
            'satuan_utama_id' => !empty($data['satuan_utama_id']) ? $data['satuan_utama_id'] : 1,
            'harga_beli_referensi' => $data['harga_beli_referensi'] ?? 0,
            'reorder_point' => $data['reorder_point'] ?? 0,
            'kfa_code' => $data['kfa_code'] ?? null,
            'kfa_name' => $data['kfa_name'] ?? null,
            
            'is_dijual' => (isset($data['status_penjualan']) && $data['status_penjualan'] === 'Tidak Dijual') ? 'tidak' : 'ya',
            'is_wajib_resep' => (isset($data['resep_wajib']) && $data['resep_wajib'] === 'Wajib') ? 'ya' : 'tidak',
            'is_tampil_katalog' => (isset($data['katalog_online']) && $data['katalog_online'] === 'Sembunyikan') ? 'tidak' : 'ya',
            
            'zat_aktif' => $data['zat_aktif'] ?? null,
            'bentuk_sediaan' => $data['bentuk_sediaan'] ?? null,
        ];

        try {
            if ($id) {
                $model->update($id, $insertData);
                $this->logActivity('Master Produk', 'Update produk: ' . $insertData['nama_produk'], $id, $insertData);
                return $this->respond([
                    'status'  => true,
                    'message' => 'Produk berhasil diupdate'
                ]);
            } else {
                $newId = $model->insert($insertData);
                $this->logActivity('Master Produk', 'Tambah produk baru: ' . $insertData['nama_produk'], $newId, $insertData);
                return $this->respondCreated([
                    'status'  => true,
                    'message' => 'Produk berhasil ditambahkan',
                    'data'    => ['id' => $newId]
                ]);
            }
        } catch (\Exception $e) {
            return $this->respond([
                'status'  => false,
                'message' => 'Gagal menyimpan produk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/inventory/forecasting
     * Returns product list with AI-calculated inventory recommendations
     */
    public function forecasting()
    {
        $db = \Config\Database::connect();
        
        // Sum total sales per product for the last 30 days
        $subquery = $db->table('t_penjualan_detail as d')
            ->select('d.produk_id, SUM(d.jumlah_jual) as total_qty')
            ->join('t_penjualan as p', 'p.id = d.penjualan_id')
            ->where('p.tanggal_penjualan >=', date('Y-m-d H:i:s', strtotime('-30 days')))
            ->groupBy('d.produk_id')
            ->getCompiledSelect();

        $query = $db->table('m_produk as pr')
            ->select('pr.id, pr.nama_produk, pr.sku, pr.stok_minimal, pr.stok_maksimal, pr.reorder_point')
            ->select('COALESCE(sales.total_qty, 0) as 30d_sales')
            ->select('COALESCE(stok.stok_total, 0) as stok_skrg')
            ->join("($subquery) sales", 'sales.produk_id = pr.id', 'left')
            ->join('(SELECT produk_id, SUM(stok_tersedia) as stok_total FROM t_stok_batch GROUP BY produk_id) stok', 'stok.produk_id = pr.id', 'left');

        $data = $query->get()->getResultArray();

        // Add recommendations to each item
        foreach ($data as &$item) {
            $adv = $item['30d_sales'] / 30; // Average Daily Volume
            $item['adv'] = round($adv, 2);
            $item['rec_stok_min'] = ceil($adv * 3); // Safety stock for 3 days
            $item['rec_rop'] = ceil($adv * 7);      // Reorder after 7 days of stock left
            $item['rec_stok_max'] = ceil($adv * 30); // Target for monthly replenishment
            
            // Status flags
            $item['needs_reorder'] = $item['stok_skrg'] <= $item['reorder_point'];
            $item['below_min'] = $item['stok_skrg'] <= $item['stok_minimal'];
        }

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * POST /api/inventory/forecasting/sync
     * Updates the product master with AI-calculated ROP/Min/Max
     */
    public function syncForecasting()
    {
        $db = \Config\Database::connect();
        $model = new ProdukModel();

        // Fetch sales data
        $sales = $db->table('t_penjualan_detail as d')
            ->select('d.produk_id, SUM(d.jumlah_jual) as total_qty')
            ->join('t_penjualan as p', 'p.id = d.penjualan_id')
            ->where('p.tanggal_penjualan >=', date('Y-m-d H:i:s', strtotime('-30 days')))
            ->groupBy('d.produk_id')
            ->get()->getResultArray();

        $updatedCount = 0;
        foreach ($sales as $row) {
            $adv = $row['total_qty'] / 30;
            $updates = [
                'stok_minimal'  => ceil($adv * 3),
                'reorder_point' => ceil($adv * 7),
                'stok_maksimal' => ceil($adv * 30)
            ];
            
            if ($model->update($row['produk_id'], (object)$updates)) {
                $updatedCount++;
            }
        }

        $this->logActivity('Inventory Intelligence', 'Sync AI Forecasting: Updated ' . $updatedCount . ' products based on 30d sales history');

        return $this->respond([
            'status'  => true,
            'message' => 'Berhasil sinkronisasi intelijen stok untuk ' . $updatedCount . ' produk.'
        ]);
    }
}
