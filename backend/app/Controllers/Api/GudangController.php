<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\GudangModel;

class GudangController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new GudangModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new GudangModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Gudang', 'Tambah gudang baru: ' . ($data['nama_gudang'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Gudang berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan gudang');
    }

    public function update($id = null)
    {
        $model = new GudangModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Gudang', 'Update data gudang ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Gudang berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui gudang');
    }

    public function delete($id = null)
    {
        $model = new GudangModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Gudang', 'Hapus gudang ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Gudang berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus gudang');
    }
}
