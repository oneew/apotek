<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'kode_supplier'  => 'SUP-001',
                'nama_supplier'  => 'PT. Kimia Farma Trading',
                'alamat'         => 'Jl. Budi Utomo No. 1, Jakarta',
                'no_telepon'     => '021-123456',
                'status'         => 'aktif'
            ],
            [
                'kode_supplier'  => 'SUP-002',
                'nama_supplier'  => 'PT. Enseval Putera Megatrading',
                'alamat'         => 'Kawasan Industri Pulo Gadung, Jakarta',
                'no_telepon'     => '021-654321',
                'status'         => 'aktif'
            ],
            [
                'kode_supplier'  => 'SUP-003',
                'nama_supplier'  => 'PBF Anugrah Argon Medica',
                'alamat'         => 'Kebayoran Lama, Jakarta',
                'no_telepon'     => '021-111222',
                'status'         => 'aktif'
            ]
        ];

        $this->db->table('m_supplier')->insertBatch($data);
    }
}
