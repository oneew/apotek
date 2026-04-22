<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RencanaPembelianModel;
use App\Models\RencanaPembelianDetailModel;

class RencanaPembelianController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new RencanaPembelianModel();
        $data = $model->orderBy('created_at', 'DESC')->findAll();
        return $this->respond([
            'status' => true,
            'data' => $data
        ]);
    }

    public function create()
    {
        $payload = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        $db->transStart();

        $rencanaModel = new RencanaPembelianModel();
        $detailModel = new RencanaPembelianDetailModel();

        // Simple generator for No Rencana
        $date = date('Ymd');
        $count = $rencanaModel->where('DATE(created_at)', date('Y-m-d'))->countAllResults() + 1;
        $noRencana = "PR-{$date}-" . str_pad($count, 3, '0', STR_PAD_LEFT);

        $rencanaId = $rencanaModel->insert((object)[
            'no_rencana' => $noRencana,
            'tanggal' => $payload['tanggal'] ?? date('Y-m-d'),
            'keterangan' => $payload['keterangan'] ?? '',
            'status' => 'Draft',
            'created_by' => 1 // Temporary
        ]);

        foreach ($payload['items'] as $item) {
            $detailModel->insert((object)[
                'rencana_id' => $rencanaId,
                'produk_id' => $item['produk_id'],
                'jumlah' => $item['qty'],
                'satuan_id' => $item['satuan_id'] ?? null,
                'supplier_id' => $item['supplier_id'] ?? null
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menyimpan rencana pembelian');
        }

        return $this->respondCreated(['status' => true, 'message' => 'Rencana pembelian berhasil disimpan', 'id' => $rencanaId]);
    }

    public function show($id = null)
    {
        $model = new RencanaPembelianModel();
        $detailModel = new RencanaPembelianDetailModel();

        $data = $model->find($id);
        if (!$data) return $this->failNotFound('Data tidak ditemukan');

        $data['items'] = $detailModel->select('t_rencana_pembelian_detail.*, m_produk.nama_produk, m_supplier.nama_supplier')
            ->join('m_produk', 'm_produk.id = t_rencana_pembelian_detail.produk_id', 'left')
            ->join('m_supplier', 'm_supplier.id = t_rencana_pembelian_detail.supplier_id', 'left')
            ->where('rencana_id', $id)
            ->findAll();

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function defecta()
    {
        $db = \Config\Database::connect();
        // Get products where total stock from t_stok_batch < stok_minimal
        $data = $db->table('m_produk p')
            ->select('p.id, p.nama_produk, p.sku, p.stok_minimal, IFNULL(SUM(b.stok_tersedia), 0) as stok_sekarang, p.pabrik_prinsipal, p.harga_beli_referensi')
            ->join('t_stok_batch b', 'b.produk_id = p.id', 'left')
            ->groupBy('p.id')
            ->having('stok_sekarang < p.stok_minimal')
            ->where('p.stok_minimal >', 0)
            ->get()->getResultArray();

        return $this->respond([
            'status' => true,
            'data' => $data
        ]);
    }

    public function analisis()
    {
        $db = \Config\Database::connect();
        $date7 = date('Y-m-d', strtotime('-7 days'));
        $date30 = date('Y-m-d', strtotime('-30 days'));

        // Query to get sales velocity in last 7 and 30 days
        $sql = "
            SELECT 
                p.id, p.nama_produk, p.sku, p.stok_minimal,
                IFNULL(SUM(b.stok_tersedia), 0) as stok_sekarang,
                (SELECT IFNULL(SUM(jumlah_jual), 0) FROM t_penjualan_detail pd JOIN t_penjualan pj ON pj.id = pd.penjualan_id WHERE pd.produk_id = p.id AND pj.tanggal >= ?) as sales_7d,
                (SELECT IFNULL(SUM(jumlah_jual), 0) FROM t_penjualan_detail pd JOIN t_penjualan pj ON pj.id = pd.penjualan_id WHERE pd.produk_id = p.id AND pj.tanggal >= ?) as sales_30d
            FROM m_produk p
            LEFT JOIN t_stok_batch b ON b.produk_id = p.id
            GROUP BY p.id
            ORDER BY sales_30d DESC
            LIMIT 50
        ";

        $data = $db->query($sql, [$date7, $date30])->getResultArray();

        // Add suggestion logic
        foreach ($data as &$item) {
            $velocity = $item['sales_30d'] / 30; // units per day
            $suggested = ceil($velocity * 15); // suggest for 15 days coverage
            if ($item['stok_sekarang'] > $suggested) {
                $item['saran_order'] = 0;
            } else {
                $item['saran_order'] = $suggested - $item['stok_sekarang'];
            }
        }

        return $this->respond([
            'status' => true,
            'data' => $data
        ]);
    }
}
