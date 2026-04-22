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
            'jenis_kelamin'  => $input['jenis_kelamin'] ?? 'L',
        ]);

        return $this->respondCreated([
            'status'  => true,
            'message' => 'Pelanggan berhasil ditambahkan',
            'data'    => ['id' => $db->insertID(), 'kode_pelanggan' => $kode]
        ]);
    }
}
