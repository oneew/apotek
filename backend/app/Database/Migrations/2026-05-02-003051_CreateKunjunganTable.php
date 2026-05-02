<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateKunjunganTable extends Migration
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
            'nomor_antrian' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'tanggal_kunjungan' => [
                'type' => 'DATETIME',
            ],
            'jenis_antrian_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'jenis_pelayanan_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'pelanggan_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'dokter_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['Waiting', 'In Progress', 'Skipped', 'Finished', 'Cancelled'],
                'default'    => 'Waiting',
            ],
            'posisi' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'default'    => 'Pendaftaran',
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
        $this->forge->addForeignKey('jenis_antrian_id', 'm_jenis_antrian', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('jenis_pelayanan_id', 'm_jenis_pelayanan', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('t_kunjungan');
    }

    public function down()
    {
        $this->forge->dropTable('t_kunjungan');
    }
}
