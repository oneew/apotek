<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ItemPemeriksaanModel;

class ItemPemeriksaanController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new ItemPemeriksaanModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new ItemPemeriksaanModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Item Pemeriksaan', 'Tambah item pemeriksaan: ' . ($data['nama_item'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Item pemeriksaan berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan item pemeriksaan');
    }

    public function update($id = null)
    {
        $model = new ItemPemeriksaanModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Item Pemeriksaan', 'Update data item pemeriksaan ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Item pemeriksaan berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui item pemeriksaan');
    }

    public function delete($id = null)
    {
        $model = new ItemPemeriksaanModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Item Pemeriksaan', 'Hapus item pemeriksaan ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Item pemeriksaan berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus item pemeriksaan');
    }
}
