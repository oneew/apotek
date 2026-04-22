<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create default outlet
        $this->db->table('outlets')->insert([
            'name'        => 'Nova Farma',
            'outlet_code' => 'nova08',
            'address'     => 'Jl. Apotek Digital No. 1',
            'phone'       => '08123456789',
            'created_at'  => date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s'),
        ]);

        // Create default admin user
        $this->db->table('users')->insert([
            'name'       => 'Andi',
            'username'   => 'admin',
            'password'   => password_hash('password123', PASSWORD_BCRYPT),
            'role'       => 'admin',
            'outlet_id'  => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        // Create default apoteker user
        $this->db->table('users')->insert([
            'name'       => 'Siti Apoteker',
            'username'   => 'apoteker',
            'password'   => password_hash('password123', PASSWORD_BCRYPT),
            'role'       => 'apoteker',
            'outlet_id'  => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        // Create default kasir user
        $this->db->table('users')->insert([
            'name'       => 'Budi Kasir',
            'username'   => 'kasir',
            'password'   => password_hash('password123', PASSWORD_BCRYPT),
            'role'       => 'kasir',
            'outlet_id'  => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
