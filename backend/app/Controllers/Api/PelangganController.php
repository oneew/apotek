<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class PelangganController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('m_pelanggan')->orderBy('nama_pelanggan', 'ASC')->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $kode = 'PEL-' . str_pad($db->table('m_pelanggan')->countAllResults() + 1, 4, '0', STR_PAD_LEFT);

        $db->table('m_pelanggan')->insert([
            'kode_pelanggan' => $kode,
            'nama_pelanggan' => $input['nama_pelanggan'] ?? '',
            'no_telepon'     => $input['no_telepon'] ?? '',
            'alamat'         => $input['alamat'] ?? '',
            'tanggal_lahir'  => $input['tanggal_lahir'] ?? null,
            'jenis_kelamin'  => $input['jenis_kelamin'] ?? 'L',
        ]);

        return $this->respondCreated([
            'status'  => true,
            'message' => 'Pelanggan berhasil ditambahkan',
            'data'    => ['id' => $db->insertID(), 'kode_pelanggan' => $kode]
        ]);
    }

    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $db->table('m_pelanggan')->where('id', $id)->update([
            'nama_pelanggan' => $input['nama_pelanggan'] ?? '',
            'no_telepon'     => $input['no_telepon'] ?? '',
            'alamat'         => $input['alamat'] ?? '',
            'tanggal_lahir'  => $input['tanggal_lahir'] ?? null,
            'jenis_kelamin'  => $input['jenis_kelamin'] ?? 'L',
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Data pelanggan berhasil diperbarui'
        ]);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $db->table('m_pelanggan')->where('id', $id)->delete();

        return $this->respond([
            'status'  => true,
            'message' => 'Pelanggan berhasil dihapus'
        ]);
    }
}
