<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ArusKasModel;

class ArusKasController extends BaseController
{
    use ResponseTrait;

    protected $modelName = 'App\Models\ArusKasModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond([
            'status' => true,
            'data'   => $this->model->orderBy('tanggal', 'DESC')->findAll()
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if ($this->model->insert($data)) {
            $insertID = $this->model->getInsertID();
            $this->logActivity('Keuangan', 'Entri Kas Baru: ' . ($data['keterangan'] ?? 'N/A'), $insertID, $data);
            return $this->respondCreated(['status' => true, 'message' => 'Entri kas berhasil disimpan']);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            $this->logActivity('Keuangan', 'Hapus Entri Kas ID: ' . $id, $id);
            return $this->respondDeleted(['status' => true, 'message' => 'Entri kas berhasil dihapus']);
        }
        return $this->failNotFound();
    }
}
