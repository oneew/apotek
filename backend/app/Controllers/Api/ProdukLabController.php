<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ProdukLabModel;

class ProdukLabController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new ProdukLabModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new ProdukLabModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Produk Lab', 'Tambah produk lab: ' . ($data['nama_produk'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Produk lab berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan produk lab');
    }

    public function update($id = null)
    {
        $model = new ProdukLabModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Produk Lab', 'Update data produk lab ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Produk lab berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui produk lab');
    }

    public function delete($id = null)
    {
        $model = new ProdukLabModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Produk Lab', 'Hapus produk lab ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Produk lab berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus produk lab');
    }
}
