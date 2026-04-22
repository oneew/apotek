<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\KategoriModel;

class KategoriController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new KategoriModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new KategoriModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Kategori', 'Tambah kategori baru: ' . ($data['nama_kategori'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Kategori berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan kategori');
    }

    public function update($id = null)
    {
        $model = new KategoriModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Kategori', 'Update data kategori ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Kategori berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui kategori');
    }

    public function delete($id = null)
    {
        $model = new KategoriModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Kategori', 'Hapus kategori ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Kategori berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus kategori');
    }
}
