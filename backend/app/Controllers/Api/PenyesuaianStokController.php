<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class PenyesuaianStokController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_penyesuaian_stok')
            ->orderBy('tanggal', 'DESC')
            ->get()->getResultArray();

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $header = $db->table('t_penyesuaian_stok')
            ->where('id', $id)
            ->get()->getRowArray();

        if (!$header) return $this->failNotFound('Data tidak ditemukan');

        $details = $db->table('t_penyesuaian_stok_detail d')
            ->select('d.*, p.nama_produk, p.sku')
            ->join('m_produk p', 'p.id = d.produk_id')
            ->where('d.penyesuaian_id', $id)
            ->get()->getResultArray();

        $header['items'] = $details;

        return $this->respond(['status' => true, 'data' => $header]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        if (!$input) $input = $this->request->getPost();

        $db = \Config\Database::connect();
        $db->transStart();

        $noPenyesuaian = 'ADJ-' . date('YmdHis');
        
        $headerData = [
            'no_penyesuaian' => $noPenyesuaian,
            'tanggal'        => $input['tanggal'] ?? date('Y-m-d H:i:s'),
            'keterangan'     => $input['keterangan'] ?? '',
            'total_item'     => count($input['items']),
            'created_at'     => date('Y-m-d H:i:s'),
        ];

        $db->table('t_penyesuaian_stok')->insert($headerData);
        $penyesuaianId = $db->insertID();

        foreach ($input['items'] as $item) {
            $produkId = $item['produk_id'];
            $stokFisik = (float)$item['stok_fisik'];
            $stokSistem = (float)$item['stok_sistem'];
            $selisih = $stokFisik - $stokSistem;

            // Insert detail
            $db->table('t_penyesuaian_stok_detail')->insert([
                'penyesuaian_id' => $penyesuaianId,
                'produk_id'      => $produkId,
                'stok_sistem'    => $stokSistem,
                'stok_fisik'     => $stokFisik,
                'selisih'        => $selisih,
                'keterangan'     => $item['keterangan'] ?? ''
            ]);

            if ($selisih !== 0) {
                // Update batches (Similar logic to opname in StokController)
                $batches = $db->table('t_stok_batch')
                              ->where('produk_id', $produkId)
                              ->orderBy('tanggal_expired', 'ASC')
                              ->get()->getResultArray();

                if ($selisih < 0) {
                    $deficit = abs($selisih);
                    foreach ($batches as $batch) {
                        if ($deficit <= 0) break;
                        $available = (float)$batch['stok_tersedia'];
                        $deduction = min($available, $deficit);
                        $db->table('t_stok_batch')
                           ->where('id', $batch['id'])
                           ->update(['stok_tersedia' => $available - $deduction]);
                        $deficit -= $deduction;
                    }
                } else {
                    if (!empty($batches)) {
                        $newestBatch = end($batches);
                        $db->table('t_stok_batch')
                           ->where('id', $newestBatch['id'])
                           ->update(['stok_tersedia' => (float)$newestBatch['stok_tersedia'] + $selisih]);
                    } else {
                        $db->table('t_stok_batch')->insert([
                            'produk_id'       => $produkId,
                            'no_batch'        => 'ADJ-' . date('Ymd'),
                            'tanggal_expired' => date('Y-m-d', strtotime('+1 year')),
                            'stok_tersedia'   => $selisih,
                            'created_at'      => date('Y-m-d H:i:s')
                        ]);
                    }
                }

                // Log Kartu Stok
                $db->table('t_kartu_stok')->insert([
                    'produk_id'    => $produkId,
                    'tanggal'      => date('Y-m-d H:i:s'),
                    'jenis_mutasi' => $selisih > 0 ? 'Masuk' : 'Keluar',
                    'jumlah'       => abs($selisih),
                    'sisa_stok'    => $stokFisik,
                    'referensi'    => $noPenyesuaian,
                    'keterangan'   => 'Penyesuaian Stok: ' . ($item['keterangan'] ?? $headerData['keterangan'])
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal memproses penyesuaian stok');
        }

        return $this->respondCreated(['status' => true, 'message' => 'Penyesuaian stok berhasil disimpan', 'id' => $penyesuaianId]);
    }
}
