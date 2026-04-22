<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class DokterController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('m_dokter')->orderBy('nama_dokter', 'ASC')->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $db->table('m_dokter')->insert([
            'nama_dokter'      => $input['nama_dokter'] ?? '',
            'spesialisasi'     => $input['spesialisasi'] ?? 'Umum',
            'no_izin_praktek'  => $input['no_izin_praktek'] ?? '',
            'no_telepon'       => $input['no_telepon'] ?? '',
        ]);

        return $this->respondCreated([
            'status'  => true,
            'message' => 'Dokter berhasil ditambahkan',
            'data'    => ['id' => $db->insertID()]
        ]);
    }
}
