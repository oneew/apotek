<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddKasirIdToPenjualan extends Migration
{
    public function up()
    {
        $this->forge->addColumn('t_penjualan', [
            'kasir_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'dokter_id'
            ]
        ]);
        
        $db = \Config\Database::connect();
        // Set existing sales to an admin user (ID 1)
        $db->query("UPDATE t_penjualan SET kasir_id = 1 WHERE kasir_id IS NULL");
    }

    public function down()
    {
        $this->forge->dropColumn('t_penjualan', 'kasir_id');
    }
}
