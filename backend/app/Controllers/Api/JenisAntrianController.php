<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\JenisAntrianModel;

class JenisAntrianController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new JenisAntrianModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new JenisAntrianModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Antrian', 'Tambah jenis antrian: ' . ($data['nama_antrian'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Jenis antrian berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan jenis antrian');
    }

    public function update($id = null)
    {
        $model = new JenisAntrianModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Antrian', 'Update data jenis antrian ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Jenis antrian berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui jenis antrian');
    }

    public function delete($id = null)
    {
        $model = new JenisAntrianModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Antrian', 'Hapus jenis antrian ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Jenis antrian berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus jenis antrian');
    }
}
