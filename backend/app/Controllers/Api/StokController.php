<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProdukModel;

class StokController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        
        // Sum stock from batches for each product
        $data = $db->table('m_produk p')
            ->select('p.id, p.nama_produk, p.sku, p.stok_minimal, r.nama_rak, IFNULL(SUM(b.stok_tersedia), 0) as stok_total, p.harga_beli_referensi, p.is_dijual')
            ->join('t_stok_batch b', 'b.produk_id = p.id', 'left')
            ->join('m_rak r', 'r.id = p.lokasi_rak_id', 'left')
            ->groupBy('p.id')
            ->get()->getResultArray();

        // Calculate summary metrics
        $summary = [
            'total_produk' => count($data),
            'stok_menipis' => 0,
            'akan_kadaluarsa' => 0
        ];

        foreach ($data as &$row) {
            if ($row['stok_minimal'] > 0 && $row['stok_total'] <= $row['stok_minimal']) {
                $summary['stok_menipis']++;
            }
        }

        // Get expired count (within 90 days)
        $summary['akan_kadaluarsa'] = $db->table('t_stok_batch')
            ->where('tanggal_expired <=', date('Y-m-d', strtotime('+90 days')))
            ->where('tanggal_expired >=', date('Y-m-d'))
            ->where('stok_tersedia >', 0)
            ->countAllResults();

        return $this->respond([
            'status' => true,
            'data' => $data,
            'summary' => $summary
        ]);
    }

    public function detail($id = null)
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_stok_batch')
            ->where('produk_id', $id)
            ->where('stok_tersedia >', 0)
            ->orderBy('tanggal_expired', 'ASC')
            ->get()->getResultArray();

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function card($id = null)
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_kartu_stok')
            ->where('produk_id', $id)
            ->orderBy('tanggal', 'DESC')
            ->orderBy('id', 'DESC')
            ->get()->getResultArray();

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function opname()
    {
        $input = $this->request->getPost();
        if (empty($input)) {
            $input = $this->request->getJSON(true);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        foreach ($input['items'] as $item) {
            // Update specific batch if provided, or create adjustment batch
            if (!empty($item['batch_id'])) {
                $batch = $db->table('t_stok_batch')->where('id', $item['batch_id'])->get()->getRow();
                if ($batch) {
                    $selisih = $item['stok_fisik'] - $batch->stok_tersedia;
                    if ($selisih != 0) {
                        $db->table('t_stok_batch')
                            ->where('id', $item['batch_id'])
                            ->update(['stok_tersedia' => $item['stok_fisik']]);

                        // Log to Kartu Stok
                        $currentTotal = $db->table('t_stok_batch')
                            ->where('produk_id', $item['produk_id'])
                            ->selectSum('stok_tersedia')
                            ->get()->getRow()->stok_tersedia;

                        $db->table('t_kartu_stok')->insert([
                            'produk_id' => $item['produk_id'],
                            'tanggal' => date('Y-m-d H:i:s'),
                            'jenis_mutasi' => $selisih > 0 ? 'Masuk' : 'Keluar',
                            'jumlah' => abs($selisih),
                            'sisa_stok' => $currentTotal,
                            'referensi' => $input['no_opname'] ?? 'OPNAME-' . date('YmdHis'),
                            'keterangan' => 'Penyesuaian Stok Opname'
                        ]);
                    }
                }
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menyimpan stok opname');
        }

        return $this->respond(['status' => true, 'message' => 'Stok opname berhasil disimpan']);
    }

    public function expired()
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_stok_batch b')
            ->select('b.*, p.nama_produk, p.sku')
            ->join('m_produk p', 'p.id = b.produk_id')
            ->where('b.tanggal_expired <=', date('Y-m-d', strtotime('+90 days')))
            ->where('b.stok_tersedia >', 0)
            ->orderBy('b.tanggal_expired', 'ASC')
            ->get()->getResultArray();

        return $this->respond(['status' => true, 'data' => $data]);
    }
}
