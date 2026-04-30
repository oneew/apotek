<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdatePelayananTables extends Migration
{
    public function up()
    {
        // Add source and compounding flag to t_resep
        $this->forge->addColumn('t_resep', [
            'sumber' => [
                'type'       => 'ENUM',
                'constraint' => ['Kasir', 'Pelayanan'],
                'default'    => 'Pelayanan',
                'after'      => 'status'
            ],
            'is_racikan' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
                'after'      => 'sumber'
            ],
        ]);

        // Create t_konseling table
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'pelanggan_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'apoteker_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'tanggal_konseling' => [
                'type' => 'DATETIME',
            ],
            'keluhan' => [
                'type' => 'TEXT',
            ],
            'saran_tindakan' => [
                'type' => 'TEXT',
            ],
            'catatan' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_konseling');
    }

    public function down()
    {
        $this->forge->dropTable('t_konseling');
        $this->forge->dropColumn('t_resep', ['sumber', 'is_racikan']);
    }
}
