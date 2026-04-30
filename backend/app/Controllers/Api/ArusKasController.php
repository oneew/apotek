<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ArusKasModel;

class ArusKasController extends BaseController
{
    use ResponseTrait;

    protected $format = 'json';
    protected ArusKasModel $model;

    public function __construct()
    {
        $this->model = new ArusKasModel();
    }

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
        if (!$data) {
            return $this->fail('Data tidak valid atau kosong.');
        }
        if ($this->model->insert($data)) {
            $insertID = $this->model->getInsertID();
            try {
                $this->logActivity('Keuangan', 'Entri Kas Baru: ' . ($data['keterangan'] ?? 'N/A'), $insertID, $data);
            } catch (\Throwable $e) {
                log_message('warning', 'logActivity failed in ArusKasController: ' . $e->getMessage());
            }
            return $this->respondCreated(['status' => true, 'message' => 'Entri kas berhasil disimpan']);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            try {
                $this->logActivity('Keuangan', 'Hapus Entri Kas ID: ' . $id, $id);
            } catch (\Throwable $e) {
                log_message('warning', 'logActivity failed in ArusKasController delete: ' . $e->getMessage());
            }
            return $this->respondDeleted(['status' => true, 'message' => 'Entri kas berhasil dihapus']);
        }
        return $this->failNotFound();
    }
}
