<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\PajakModel;

class PajakController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new PajakModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new PajakModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Pajak', 'Tambah pajak baru: ' . ($data['nama_pajak'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Pajak berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan pajak');
    }

    public function update($id = null)
    {
        $model = new PajakModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Pajak', 'Update data pajak ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Pajak berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui pajak');
    }

    public function delete($id = null)
    {
        $model = new PajakModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Pajak', 'Hapus pajak ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Pajak berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus pajak');
    }
}
