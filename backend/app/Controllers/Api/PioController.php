<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class PioController extends BaseController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_pio as t')
            ->select('t.*, p.nama_pelanggan, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = t.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = t.apoteker_id', 'left')
            ->orderBy('t.tanggal_pio', 'DESC')
            ->get()->getResultArray();
            
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'pelanggan_id'   => (!empty($input['pelanggan_id'])) ? $input['pelanggan_id'] : null,
            'apoteker_id'    => $input['apoteker_id'] ?? null,
            'tanggal_pio'    => $input['tanggal_pio'] ?? date('Y-m-d H:i:s'),
            'nama_obat'      => $input['nama_obat'] ?? '',
            'aturan_pakai'   => $input['aturan_pakai'] ?? '',
            'efek_samping'   => $input['efek_samping'] ?? '',
            'catatan_khusus' => $input['catatan_khusus'] ?? '',
            'created_at'     => date('Y-m-d H:i:s'),
        ];
        
        if ($db->table('t_pio')->insert($data)) {
            return $this->respondCreated(['status' => true, 'message' => 'Informasi obat berhasil dicatat']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal mencatat informasi'], 500);
    }

    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'pelanggan_id'   => (!empty($input['pelanggan_id'])) ? $input['pelanggan_id'] : null,
            'apoteker_id'    => $input['apoteker_id'],
            'tanggal_pio'    => $input['tanggal_pio'],
            'nama_obat'      => $input['nama_obat'],
            'aturan_pakai'   => $input['aturan_pakai'],
            'efek_samping'   => $input['efek_samping'],
            'catatan_khusus' => $input['catatan_khusus'],
        ];
        
        if ($db->table('t_pio')->where('id', $id)->update($data)) {
            return $this->respond(['status' => true, 'message' => 'Informasi obat berhasil diperbarui']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui informasi'], 500);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        if ($db->table('t_pio')->where('id', $id)->delete()) {
            return $this->respond(['status' => true, 'message' => 'Data berhasil dihapus']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal menghapus data'], 500);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_pio as t')
            ->select('t.*, p.nama_pelanggan, a.nama_apoteker')
            ->join('m_pelanggan as p', 'p.id = t.pelanggan_id', 'left')
            ->join('m_apoteker as a', 'a.id = t.apoteker_id', 'left')
            ->where('t.id', $id)
            ->get()->getRowArray();
            
        if (!$data) return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        return $this->respond(['status' => true, 'data' => $data]);
    }
}
