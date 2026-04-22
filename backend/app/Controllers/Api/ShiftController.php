<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ShiftModel;

class ShiftController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new ShiftModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new ShiftModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Shift', 'Tambah shift baru: ' . ($data['nama_shift'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Shift berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan shift');
    }

    public function update($id = null)
    {
        $model = new ShiftModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Shift', 'Update data shift ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Shift berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui shift');
    }

    public function delete($id = null)
    {
        $model = new ShiftModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Shift', 'Hapus shift ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Shift berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus shift');
    }
}
