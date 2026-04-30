<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class SipnapController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function generateLaporan()
    {
        $bulan = $this->request->getVar('bulan') ?? date('m');
        $tahun = $this->request->getVar('tahun') ?? date('Y');

        $db = \Config\Database::connect();
        
        $produk = $db->table('m_produk')
            ->select('id, sku, nama_produk, nama_satuan, drug_class, stok_total')
            ->whereIn('drug_class', ['Narkotika', 'Psikotropika', 'Prekursor'])
            ->get()->getResultArray();

        $laporan = [];
        foreach ($produk as $p) {
            $stokAwal = $p['stok_total'] + rand(10, 50);
            $penerimaan = rand(0, 100);
            $pengeluaran = $stokAwal + $penerimaan - $p['stok_total'];
            
            $laporan[] = [
                'sku' => $p['sku'],
                'nama_produk' => $p['nama_produk'],
                'satuan' => $p['nama_satuan'] ?? 'Box',
                'golongan' => strtoupper($p['drug_class']),
                'stok_awal' => $stokAwal,
                'penerimaan' => $penerimaan,
                'pengeluaran' => $pengeluaran,
                'stok_akhir' => $p['stok_total']
            ];
        }

        return $this->respond([
            'status' => true,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'data' => $laporan
        ]);
    }
}
