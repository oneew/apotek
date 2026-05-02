<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class SwamedikasiController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_swamedikasi as s')
            ->select('s.*, p.nama_pelanggan, p.no_telepon, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = s.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = s.apoteker_id', 'left');

        $filterTanggal = $this->request->getGet('filter_tanggal');
        if ($filterTanggal === 'Hari ini') {
            $builder->where('DATE(s.tanggal_swamedikasi)', date('Y-m-d'));
        } elseif ($filterTanggal === 'Bulan ini') {
            $builder->where("DATE_FORMAT(s.tanggal_swamedikasi, '%Y-%m')", date('Y-m'));
        } elseif ($filterTanggal === 'Tahun ini') {
            $builder->where("DATE_FORMAT(s.tanggal_swamedikasi, '%Y')", date('Y'));
        }

        $search = $this->request->getGet('search');
        if ($search) {
            $builder->groupStart()
                ->like('s.no_swamedikasi', $search)
                ->orLike('p.nama_pelanggan', $search)
                ->orLike('s.keluhan', $search)
                ->groupEnd();
        }

        $data = $builder->orderBy('s.tanggal_swamedikasi', 'DESC')->get()->getResultArray();
        
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_swamedikasi as s')
            ->select('s.*, p.nama_pelanggan, p.no_telepon, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = s.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = s.apoteker_id', 'left');
            
        if (strpos($id, 'SWA-') === 0) {
            $builder->where('s.no_swamedikasi', $id);
        } else {
            $builder->where('s.id', $id);
        }
        
        $swamedikasi = $builder->get()->getRowArray();
        
        if (!$swamedikasi) return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);

        $items = $db->table('t_swamedikasi_detail as d')
            ->select('d.*, pr.nama_produk, pr.sku, pr.harga_beli_referensi, pr.harga_jual_utama, pr.nama_satuan, pr.nama_satuan_terkecil')
            ->join('m_produk as pr', 'pr.id = d.produk_id', 'left')
            ->where('d.swamedikasi_id', $swamedikasi['id'])
            ->get()->getResultArray();
            
        $swamedikasi['items'] = $items;

        return $this->respond(['status' => true, 'data' => $swamedikasi]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $db->transStart();
        
        $count = $db->table('t_swamedikasi')->countAllResults() + 1;
        $noSwa = 'SWA-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
        
        $swaData = [
            'no_swamedikasi'      => $noSwa,
            'tanggal_swamedikasi' => $data['tanggal_swamedikasi'] ?? date('Y-m-d H:i:s'),
            'pelanggan_id'        => !empty($data['pelanggan_id']) ? $data['pelanggan_id'] : null,
            'apoteker_id'         => !empty($data['apoteker_id']) ? $data['apoteker_id'] : null,
            'keluhan'             => $data['keluhan'] ?? '',
            'status'              => 'Open',
            'created_at'          => date('Y-m-d H:i:s'),
        ];
        
        $db->table('t_swamedikasi')->insert($swaData);
        $swaId = $db->insertID();
        
        if (!empty($data['items']) && is_array($data['items'])) {
            $details = [];
            foreach ($data['items'] as $item) {
                $details[] = [
                    'swamedikasi_id' => $swaId,
                    'produk_id'      => $item['produk_id'],
                    'jumlah'         => $item['jumlah'] ?? 1,
                    'dosis_aturan'   => $item['dosis_aturan'] ?? ''
                ];
            }
            $db->table('t_swamedikasi_detail')->insertBatch($details);
        }
        
        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal mencatat swamedikasi'], 500);
        }

        return $this->respondCreated(['status' => true, 'message' => 'Swamedikasi berhasil dicatat', 'data' => ['id' => $swaId, 'no_swamedikasi' => $noSwa]]);
    }
}
