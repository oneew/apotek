<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\JenisPelayananModel;

class JenisPelayananController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new JenisPelayananModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function create()
    {
        $model = new JenisPelayananModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Master Pelayanan', 'Tambah jenis pelayanan: ' . ($data['nama_pelayanan'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Jenis pelayanan berhasil ditambahkan'
            ]);
        }

        return $this->fail('Gagal menambahkan jenis pelayanan');
    }

    public function update($id = null)
    {
        $model = new JenisPelayananModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Master Pelayanan', 'Update data jenis pelayanan ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Jenis pelayanan berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui jenis pelayanan');
    }

    public function delete($id = null)
    {
        $model = new JenisPelayananModel();
        if ($model->delete($id)) {
            $this->logActivity('Master Pelayanan', 'Hapus jenis pelayanan ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Jenis pelayanan berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus jenis pelayanan');
    }
}
