<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class ApotekerController extends BaseController
{
    use ResponseTrait;

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function index()
    {
        $data = $this->db->table('m_apoteker')->orderBy('nama_apoteker', 'ASC')->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $insertData = [
            'nama_apoteker' => $data['nama_apoteker'],
            'no_sipa'       => $data['no_sipa'] ?? null,
            'no_stra'       => $data['no_stra'] ?? null,
            'no_hp'         => $data['no_hp'] ?? null,
            'alamat'        => $data['alamat'] ?? null,
            'status'        => $data['status'] ?? 'Aktif',
            'created_at'    => date('Y-m-d H:i:s')
        ];
        
        $this->db->table('m_apoteker')->insert($insertData);
        $id = $this->db->insertID();

        return $this->respondCreated(['status' => true, 'message' => 'Apoteker berhasil ditambahkan', 'id' => $id]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $updateData = [
            'nama_apoteker' => $data['nama_apoteker'],
            'no_sipa'       => $data['no_sipa'] ?? null,
            'no_stra'       => $data['no_stra'] ?? null,
            'no_hp'         => $data['no_hp'] ?? null,
            'alamat'        => $data['alamat'] ?? null,
            'status'        => $data['status'] ?? 'Aktif',
            'updated_at'    => date('Y-m-d H:i:s')
        ];
        
        $this->db->table('m_apoteker')->where('id', $id)->update($updateData);

        return $this->respond(['status' => true, 'message' => 'Apoteker berhasil diperbarui']);
    }

    public function delete($id = null)
    {
        $this->db->table('m_apoteker')->where('id', $id)->delete();
        return $this->respondDeleted(['status' => true, 'message' => 'Apoteker berhasil dihapus']);
    }

    public function show($id = null)
    {
        $data = $this->db->table('m_apoteker')->where('id', $id)->get()->getRowArray();
        if ($data) {
            return $this->respond(['status' => true, 'data' => $data]);
        }
        return $this->failNotFound('Apoteker tidak ditemukan');
    }
}
