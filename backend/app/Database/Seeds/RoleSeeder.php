<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->db->table('m_role_akses')->truncate();
        $this->db->table('m_role')->truncate();
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Insert Roles
        $roles = [
            ['id' => 1, 'nama_role' => 'Administrator', 'keterangan' => 'Akses penuh ke seluruh sistem'],
            ['id' => 2, 'nama_role' => 'Apoteker', 'keterangan' => 'Kelola obat, stok, dan pelayanan farmasi'],
            ['id' => 3, 'nama_role' => 'Kasir', 'keterangan' => 'Transaksi penjualan dan pembayaran'],
            ['id' => 4, 'nama_role' => 'Owner', 'keterangan' => 'Laporan dan monitoring keuangan'],
        ];
        $this->db->table('m_role')->insertBatch($roles);

        // 2. Insert Access (Permissions)
        $menus = [
            'dashboard', 'master_data', 'manajemen_stok', 'pembelian', 
            'penjualan', 'pelayanan', 'laporan', 'manajemen_user'
        ];

        $akses = [];
        // Admin gets everything
        foreach ($menus as $menu) {
            $akses[] = [
                'role_id' => 1,
                'menu_key' => $menu,
                'can_view' => 1, 'can_create' => 1, 'can_edit' => 1, 'can_delete' => 1
            ];
        }

        // Apoteker
        foreach (['dashboard', 'master_data', 'manajemen_stok', 'pelayanan'] as $menu) {
            $akses[] = [
                'role_id' => 2,
                'menu_key' => $menu,
                'can_view' => 1, 'can_create' => 1, 'can_edit' => 1, 'can_delete' => 0
            ];
        }

        // Kasir
        foreach (['dashboard', 'penjualan'] as $menu) {
            $akses[] = [
                'role_id' => 3,
                'menu_key' => $menu,
                'can_view' => 1, 'can_create' => 1, 'can_edit' => 0, 'can_delete' => 0
            ];
        }

        // Owner (View only mostly)
        foreach ($menus as $menu) {
            $akses[] = [
                'role_id' => 4,
                'menu_key' => $menu,
                'can_view' => 1, 'can_create' => 0, 'can_edit' => 0, 'can_delete' => 0
            ];
        }

        $this->db->table('m_role_akses')->insertBatch($akses);

        // 3. Update existing users to role_id 1 (Admin) for testing
        $this->db->table('users')->update(['role_id' => 1]);
    }
}
