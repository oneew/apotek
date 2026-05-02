<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class KonselingController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_konseling as k')
            ->select('k.*, p.nama_pelanggan, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = k.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = k.apoteker_id', 'left');
            
        $data = $builder->orderBy('k.tanggal_konseling', 'DESC')->get()->getResultArray();
        
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'pelanggan_id'      => $input['pelanggan_id'],
            'apoteker_id'       => $input['apoteker_id'],
            'tanggal_konseling' => $input['tanggal_konseling'] ?? date('Y-m-d H:i:s'),
            'subjective'        => $input['subjective'] ?? '',
            'objective'         => $input['objective'] ?? '',
            'assessment'        => $input['assessment'] ?? '',
            'plan'              => $input['plan'] ?? '',
            'catatan'           => $input['catatan'] ?? '',
            'created_at'        => date('Y-m-d H:i:s'),
        ];
        
        if ($db->table('t_konseling')->insert($data)) {
            return $this->respondCreated(['status' => true, 'message' => 'Konseling berhasil dicatat']);
        }
        
        return $this->respond(['status' => false, 'message' => 'Gagal mencatat konseling'], 500);
    }

    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'pelanggan_id'      => $input['pelanggan_id'],
            'apoteker_id'       => $input['apoteker_id'],
            'tanggal_konseling' => $input['tanggal_konseling'] ?? date('Y-m-d H:i:s'),
            'subjective'        => $input['subjective'] ?? '',
            'objective'         => $input['objective'] ?? '',
            'assessment'        => $input['assessment'] ?? '',
            'plan'              => $input['plan'] ?? '',
            'catatan'           => $input['catatan'] ?? '',
        ];
        
        if ($db->table('t_konseling')->update($data, ['id' => $id])) {
            return $this->respond(['status' => true, 'message' => 'Konseling berhasil diperbarui']);
        }
        
        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui konseling'], 500);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('t_konseling as k')
            ->select('k.*, p.nama_pelanggan, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = k.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = k.apoteker_id', 'left')
            ->where('k.id', $id);
            
        $data = $builder->get()->getRowArray();
        
        if (!$data) return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        if ($db->table('t_konseling')->delete(['id' => $id])) {
            return $this->respond(['status' => true, 'message' => 'Data berhasil dihapus']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal menghapus data'], 500);
    }
}
