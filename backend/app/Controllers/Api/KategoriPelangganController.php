<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\KategoriPelangganModel;

class KategoriPelangganController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new KategoriPelangganModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new KategoriPelangganModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Kategori Pelanggan', 'Tambah kategori pelanggan: ' . ($data['nama_kategori'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Kategori pelanggan berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan kategori pelanggan');
    }

    public function update($id = null)
    {
        $model = new KategoriPelangganModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Kategori Pelanggan', 'Update data kategori pelanggan ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Kategori pelanggan berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui kategori pelanggan');
    }

    public function delete($id = null)
    {
        $model = new KategoriPelangganModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Kategori Pelanggan', 'Hapus kategori pelanggan ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Kategori pelanggan berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus kategori pelanggan');
    }
}
