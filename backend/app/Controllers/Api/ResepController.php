<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class ResepController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_resep as r')
            ->select('r.*, d.nama_dokter, p.nama_pelanggan, p.no_telepon')
            ->join('m_dokter as d', 'd.id = r.dokter_id', 'left')
            ->join('m_pelanggan as p', 'p.id = r.pelanggan_id', 'left');
            
        $sumber = $this->request->getGet('sumber');
        if ($sumber) {
            $builder->where('r.sumber', $sumber);
        }

        $is_racikan = $this->request->getGet('is_racikan');
        if ($is_racikan !== null) {
            $builder->where('r.is_racikan', $is_racikan);
        }

        $filterTanggal = $this->request->getGet('filter_tanggal');
        if ($filterTanggal === 'Hari ini') {
            $builder->where('DATE(r.tanggal_resep)', date('Y-m-d'));
        } elseif ($filterTanggal === 'Bulan ini') {
            $builder->where("DATE_FORMAT(r.tanggal_resep, '%Y-%m')", date('Y-m'));
        } elseif ($filterTanggal === 'Tahun ini') {
            $builder->where("DATE_FORMAT(r.tanggal_resep, '%Y')", date('Y'));
        }
        
        $data = $builder->orderBy('r.tanggal_resep', 'DESC')->get()->getResultArray();
        
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $db->transStart();
        
        $count = $db->table('t_resep')->countAllResults() + 1;
        $noResep = 'RSP-' . date('Ymd') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
        
        $qrCodePath = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($noResep);
        
        $resepData = [
            'no_resep'      => $noResep,
            'tanggal_resep' => $input['tanggal_resep'] ?? date('Y-m-d H:i:s'),
            'dokter_id'     => !empty($input['dokter_id']) ? $input['dokter_id'] : null,
            'pelanggan_id'  => !empty($input['pelanggan_id']) ? $input['pelanggan_id'] : null,
            'catatan'       => $input['catatan'] ?? '',
            'qr_code_path'  => $qrCodePath,
            'status'        => 'Baru',
            'sumber'        => $input['sumber'] ?? 'Pelayanan',
            'is_racikan'    => $input['is_racikan'] ?? false,
            'created_at'    => date('Y-m-d H:i:s'),
        ];
        
        $db->table('t_resep')->insert($resepData);
        $resepId = $db->insertID();
        
        if (!empty($input['items']) && is_array($input['items'])) {
            $details = [];
            foreach ($input['items'] as $item) {
                $details[] = [
                    'resep_id'     => $resepId,
                    'produk_id'    => $item['produk_id'],
                    'jumlah'       => $item['jumlah'],
                    'dosis_aturan' => $item['dosis_aturan'] ?? '',
                    'keterangan'   => $item['keterangan'] ?? '',
                ];
            }
            $db->table('t_resep_detail')->insertBatch($details);
        }
        
        $db->transComplete();
        
        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal membuat resep'], 500);
        }
        
        return $this->respondCreated([
            'status' => true,
            'message'=> 'Resep berhasil dibuat',
            'data'   => ['id' => $resepId, 'no_resep' => $noResep, 'qr_url' => $qrCodePath]
        ]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        
        // Cek dulu apakah $id itu ID integer atau string no_resep (dari scan barcode kasir)
        $builder = $db->table('t_resep as r')
            ->select('r.*, d.nama_dokter, p.nama_pelanggan, p.no_telepon')
            ->join('m_dokter as d', 'd.id = r.dokter_id', 'left')
            ->join('m_pelanggan as p', 'p.id = r.pelanggan_id', 'left');
            
        if (is_numeric($id)) {
            $builder->where('r.id', $id);
        } else {
            $builder->where('r.no_resep', $id);
        }
        
        $resep = $builder->get()->getRowArray();
        
        if (!$resep) return $this->respond(['status' => false, 'message' => 'Resep tidak ditemukan'], 404);
        
        $items = $db->table('t_resep_detail as d')
            ->select('d.*, pr.nama_produk, pr.sku, pr.harga_beli_referensi, pr.harga_jual_utama')
            ->join('m_produk as pr', 'pr.id = d.produk_id', 'left')
            ->where('d.resep_id', $resep['id'])
            ->get()->getResultArray();
            
        $resep['items'] = $items;
        
        return $this->respond(['status' => true, 'data' => $resep]);
    }

    public function updateStatus($id = null)
    {
        $input = $this->request->getJSON(true);
        if (empty($input['status'])) {
            return $this->respond(['status' => false, 'message' => 'Status tidak boleh kosong'], 400);
        }

        $db = \Config\Database::connect();
        $updated = $db->table('t_resep')->where('id', $id)->update(['status' => $input['status']]);

        if ($updated) {
            return $this->respond(['status' => true, 'message' => 'Status resep berhasil diperbarui']);
        }

        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui status resep'], 500);
    }
}
