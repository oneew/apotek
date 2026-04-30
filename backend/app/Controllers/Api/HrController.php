<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class HrController extends BaseController
{
    use ResponseTrait;

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    // ==========================================
    // JABATAN
    // ==========================================
    public function getJabatan()
    {
        $data = $this->db->table('m_jabatan')->orderBy('nama_jabatan', 'ASC')->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    // ==========================================
    // PEGAWAI
    // ==========================================
    public function getPegawai()
    {
        $data = $this->db->table('m_pegawai')->select('m_pegawai.*, m_jabatan.nama_jabatan, users.username')
                         ->join('m_jabatan', 'm_jabatan.id = m_pegawai.jabatan_id', 'left')
                         ->join('users', 'users.id = m_pegawai.user_id', 'left')
                         ->orderBy('m_pegawai.nama_lengkap', 'ASC')
                         ->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function createPegawai()
    {
        $data = $this->request->getJSON(true);
        $insertData = [
            'nama_lengkap' => $data['nama_lengkap'],
            'nik'          => $data['nik'] ?? null,
            'sipa_stra'    => $data['sipa_stra'] ?? null,
            'no_hp'        => $data['no_hp'] ?? null,
            'email'        => $data['email'] ?? null,
            'alamat'       => $data['alamat'] ?? null,
            'jabatan_id'   => $data['jabatan_id'] ?? null,
            'user_id'      => $data['user_id'] ?? null,
            'status_pegawai' => $data['status_pegawai'] ?? 'Aktif',
            'tanggal_gabung' => $data['tanggal_gabung'] ?? null,
            'created_at'   => date('Y-m-d H:i:s')
        ];
        
        $this->db->table('m_pegawai')->insert($insertData);
        $id = $this->db->insertID();

        $this->logActivity('Manajemen SDM', 'Tambah pegawai baru: ' . $data['nama_lengkap'], $id);

        return $this->respondCreated(['status' => true, 'message' => 'Pegawai berhasil ditambahkan']);
    }

    public function updatePegawai($id)
    {
        $data = $this->request->getJSON(true);
        $updateData = [
            'nama_lengkap' => $data['nama_lengkap'],
            'nik'          => $data['nik'] ?? null,
            'sipa_stra'    => $data['sipa_stra'] ?? null,
            'no_hp'        => $data['no_hp'] ?? null,
            'email'        => $data['email'] ?? null,
            'alamat'       => $data['alamat'] ?? null,
            'jabatan_id'   => $data['jabatan_id'] ?? null,
            'user_id'      => $data['user_id'] ?? null,
            'status_pegawai' => $data['status_pegawai'] ?? 'Aktif',
            'tanggal_gabung' => $data['tanggal_gabung'] ?? null,
            'updated_at'   => date('Y-m-d H:i:s')
        ];
        
        $this->db->table('m_pegawai')->where('id', $id)->update($updateData);

        $this->logActivity('Manajemen SDM', 'Update data pegawai: ' . $data['nama_lengkap'], $id);

        return $this->respond(['status' => true, 'message' => 'Pegawai berhasil diperbarui']);
    }

    public function deletePegawai($id)
    {
        $pegawai = $this->db->table('m_pegawai')->where('id', $id)->get()->getRowArray();
        $this->db->table('m_pegawai')->where('id', $id)->delete();
        $this->logActivity('Manajemen SDM', 'Hapus pegawai: ' . ($pegawai['nama_lengkap'] ?? $id), $id);
        
        return $this->respondDeleted(['status' => true, 'message' => 'Pegawai berhasil dihapus']);
    }

    // ==========================================
    // JADWAL SHIFT
    // ==========================================
    public function getJadwal()
    {
        $bulan = $this->request->getVar('bulan') ?? date('Y-m'); // format YYYY-MM
        
        $data = $this->db->table('m_jadwal_shift')
                         ->select('m_jadwal_shift.*, m_pegawai.nama_lengkap, m_shift.nama_shift, m_shift.jam_masuk, m_shift.jam_keluar')
                         ->join('m_pegawai', 'm_pegawai.id = m_jadwal_shift.pegawai_id')
                         ->join('m_shift', 'm_shift.id = m_jadwal_shift.shift_id', 'left')
                         ->like('tanggal', $bulan, 'after')
                         ->orderBy('tanggal', 'ASC')
                         ->get()->getResultArray();
                         
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function saveJadwal()
    {
        $data = $this->request->getJSON(true);
        // Expecting multiple records at once
        $inserts = [];
        foreach ($data['jadwal'] as $row) {
            $inserts[] = [
                'pegawai_id' => $row['pegawai_id'],
                'shift_id'   => $row['shift_id'] ?? null,
                'tanggal'    => $row['tanggal'],
                'created_at' => date('Y-m-d H:i:s')
            ];
        }

        if (!empty($inserts)) {
            $this->db->table('m_jadwal_shift')->insertBatch($inserts);
            $this->logActivity('Manajemen SDM', 'Generate jadwal shift massal (' . count($inserts) . ' entri)', null);
        }

        return $this->respond(['status' => true, 'message' => count($inserts) . ' jadwal berhasil disimpan']);
    }
}
