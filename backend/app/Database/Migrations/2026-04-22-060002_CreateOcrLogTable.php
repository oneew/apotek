<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOcrLogTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'              => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'user_id'         => ['type' => 'INT', 'constraint' => 11, 'null' => true],
            'nama_file'       => ['type' => 'VARCHAR', 'constraint' => 255],
            'path_file'       => ['type' => 'VARCHAR', 'constraint' => 500],
            'teks_hasil'      => ['type' => 'LONGTEXT', 'null' => true],
            'data_parsed'     => ['type' => 'LONGTEXT', 'null' => true],  // JSON: [{nama_prod, qty, harga}]
            'status'          => ['type' => 'ENUM', 'constraint' => ['pending', 'success', 'failed', 'confirmed'], 'default' => 'pending'],
            'pembelian_id'    => ['type' => 'INT', 'constraint' => 11, 'null' => true],  // link ke transaksi
            'created_at'      => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_ocr_log');
    }

    public function down()
    {
        $this->forge->dropTable('t_ocr_log');
    }
}
