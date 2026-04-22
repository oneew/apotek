<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\RakModel;

class RakController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new RakModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new RakModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Rak', 'Tambah rak baru: ' . ($data['nama_rak'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Rak berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan rak');
    }

    public function update($id = null)
    {
        $model = new RakModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Rak', 'Update data rak ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Rak berhasil diperbarui'
              ]);
        }

        return $this->fail('Gagal memperbarui rak');
    }

    public function delete($id = null)
    {
        $model = new RakModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Rak', 'Hapus rak ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Rak berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus rak');
    }
}
