<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\SatuanModel;

class SatuanController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new SatuanModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new SatuanModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Satuan', 'Tambah satuan baru: ' . ($data['nama_satuan'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Satuan berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan satuan');
    }

    public function update($id = null)
    {
        $model = new SatuanModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Satuan', 'Update data satuan ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Satuan berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui satuan');
    }

    public function delete($id = null)
    {
        $model = new SatuanModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Satuan', 'Hapus satuan ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Satuan berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus satuan');
    }
}
