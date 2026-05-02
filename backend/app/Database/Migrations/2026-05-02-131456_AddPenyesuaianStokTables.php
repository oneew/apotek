<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPenyesuaianStokTables extends Migration
{
    public function up()
    {
        // t_penyesuaian_stok
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'no_penyesuaian' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'tanggal' => [
                'type' => 'DATETIME',
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
            ],
            'keterangan' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'total_item' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
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
        $this->forge->createTable('t_penyesuaian_stok');

        // t_penyesuaian_stok_detail
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'penyesuaian_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'produk_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'stok_sistem' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'default' => 0,
            ],
            'stok_fisik' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'default' => 0,
            ],
            'selisih' => [
                'type' => 'DECIMAL',
                'constraint' => '15,2',
                'default' => 0,
            ],
            'keterangan' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('penyesuaian_id', 't_penyesuaian_stok', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('t_penyesuaian_stok_detail');
    }

    public function down()
    {
        $this->forge->dropTable('t_penyesuaian_stok_detail');
        $this->forge->dropTable('t_penyesuaian_stok');
    }
}
