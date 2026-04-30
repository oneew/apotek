<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePegawaiStackTable extends Migration
{
    public function up()
    {
        // 1. m_jabatan
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'nama_jabatan'   => ['type' => 'VARCHAR', 'constraint' => '100'],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
            'updated_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_jabatan', true);

        // Insert initial job titles securely
        $db = \Config\Database::connect();
        $db->table('m_jabatan')->insertBatch([
            ['nama_jabatan' => 'Apoteker Pengelola Apotek (APA)'],
            ['nama_jabatan' => 'Apoteker Pendamping (APING)'],
            ['nama_jabatan' => 'Tenaga Teknis Kefarmasian (TTK)'],
            ['nama_jabatan' => 'Kasir / Frontliner'],
            ['nama_jabatan' => 'Admin Gudang'],
        ]);

        // 2. m_pegawai
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'user_id'        => ['type' => 'INT', 'null' => true],
            'jabatan_id'     => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'nama_lengkap'   => ['type' => 'VARCHAR', 'constraint' => '150'],
            'nik'            => ['type' => 'VARCHAR', 'constraint' => '20', 'null' => true],
            'sipa_stra'      => ['type' => 'VARCHAR', 'constraint' => '100', 'null' => true],
            'no_hp'          => ['type' => 'VARCHAR', 'constraint' => '20', 'null' => true],
            'email'          => ['type' => 'VARCHAR', 'constraint' => '150', 'null' => true],
            'alamat'         => ['type' => 'TEXT', 'null' => true],
            'status_pegawai' => ['type' => 'VARCHAR', 'constraint' => '50', 'default' => 'Aktif'],
            'tanggal_gabung' => ['type' => 'DATE', 'null' => true],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
            'updated_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('jabatan_id', 'm_jabatan', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('m_pegawai', true);

        // 3. m_jadwal_shift
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'pegawai_id'     => ['type' => 'INT', 'unsigned' => true],
            'shift_id'       => ['type' => 'INT', 'null' => true],
            'tanggal'        => ['type' => 'DATE'],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('pegawai_id', 'm_pegawai', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('m_jadwal_shift', true);
    }

    public function down()
    {
        $this->forge->dropTable('m_jadwal_shift', true);
        $this->forge->dropTable('m_pegawai', true);
        $this->forge->dropTable('m_jabatan', true);
    }
}
