<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\KunjunganModel;

class KunjunganController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new KunjunganModel();
        $search = $this->request->getGet('search');
        $date = $this->request->getGet('date');
        
        $data = $model->getKunjunganWithDetails($search, $date);
        
        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function create()
    {
        $model = new KunjunganModel();
        $data = $this->request->getJSON(true);

        if (empty($data['tanggal_kunjungan'])) {
            $data['tanggal_kunjungan'] = date('Y-m-d H:i:s');
        }

        // Generate nomor antrian if not provided
        if (empty($data['nomor_antrian'])) {
            $prefix = $this->getPrefix($data['jenis_antrian_id'] ?? 1);
            $count = $model->where('DATE(tanggal_kunjungan)', date('Y-m-d', strtotime($data['tanggal_kunjungan'])))
                           ->where('jenis_antrian_id', $data['jenis_antrian_id'])
                           ->countAllResults();
            $data['nomor_antrian'] = $prefix . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
        }

        if ($model->insert($data)) {
            $insertID = $model->getInsertID();
            $this->logActivity('Kunjungan', 'Registrasi kunjungan baru: ' . $data['nomor_antrian'], $insertID, $data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'Kunjungan berhasil didaftarkan',
                'id'      => $insertID
            ]);
        }

        return $this->fail('Gagal mendaftarkan kunjungan');
    }

    public function update($id = null)
    {
        $model = new KunjunganModel();
        $data = $this->request->getJSON(true);

        if ($model->update($id, $data)) {
            $this->logActivity('Kunjungan', 'Update data kunjungan ID: ' . $id, $id, $data);
            return $this->respond([
                'status'  => true,
                'message' => 'Data kunjungan berhasil diperbarui'
            ]);
        }

        return $this->fail('Gagal memperbarui data kunjungan');
    }

    public function delete($id = null)
    {
        $model = new KunjunganModel();
        if ($model->delete($id)) {
            $this->logActivity('Kunjungan', 'Hapus data kunjungan ID: ' . $id, $id);
            return $this->respond([
                'status'  => true,
                'message' => 'Data kunjungan berhasil dihapus'
            ]);
        }

        return $this->fail('Gagal menghapus data kunjungan');
    }

    private function getPrefix($jenisAntrianId)
    {
        $db = \Config\Database::connect();
        $row = $db->table('m_jenis_antrian')->where('id', $jenisAntrianId)->get()->getRow();
        return $row ? $row->kode_prefix : 'VST';
    }
}
