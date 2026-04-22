<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateArusKasTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'tanggal' => [
                'type' => 'DATETIME',
            ],
            'jenis' => [
                'type'       => 'ENUM',
                'constraint' => ['Masuk', 'Keluar'],
            ],
            'kategori' => [
                'type'       => 'VARCHAR',
                'constraint' => 100, // e.g. Operasional, Listrik, Gaji
            ],
            'keterangan' => [
                'type' => 'TEXT',
            ],
            'jumlah' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0,
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
        $this->forge->createTable('t_arus_kas', true);
    }

    public function down()
    {
        $this->forge->dropTable('t_arus_kas', true);
    }
}
