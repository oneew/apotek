<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateHrTables extends Migration
{
    public function up()
    {
        // 1. m_jabatan
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'nama_jabatan' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'deskripsi' => [
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
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_jabatan');

        // Insert default jabatan
        $db = \Config\Database::connect();
        $db->table('m_jabatan')->insertBatch([
            ['nama_jabatan' => 'Apoteker Pengelola Apotek (APA)', 'deskripsi' => 'Penanggung jawab utama apotek'],
            ['nama_jabatan' => 'Apoteker Pendamping (Aping)', 'deskripsi' => 'Apoteker yang mendampingi APA'],
            ['nama_jabatan' => 'Tenaga Teknis Kefarmasian (TTK)', 'deskripsi' => 'Asisten Apoteker'],
            ['nama_jabatan' => 'Kasir / Frontliner', 'deskripsi' => 'Petugas pelayan pelanggan'],
            ['nama_jabatan' => 'Admin Keuangan', 'deskripsi' => 'Mengurus laporan keuangan'],
        ]);

        // 2. m_pegawai
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'jabatan_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'nama_lengkap' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'nik' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
            ],
            'sipa_stra' => [
                'type'       => 'VARCHAR', // Kalo apoteker/TTK
                'constraint' => '100',
                'null'       => true,
            ],
            'no_hp' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ],
            'alamat' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'tanggal_gabung' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'status_pegawai' => [
                'type'       => 'ENUM',
                'constraint' => ['Aktif', 'Cuti', 'Resign'],
                'default'    => 'Aktif',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('jabatan_id', 'm_jabatan', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('m_pegawai');

        // 3. m_jadwal_shift
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'pegawai_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'shift_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'tanggal' => [
                'type' => 'DATE',
            ],
            'status_kehadiran' => [
                'type'       => 'ENUM',
                'constraint' => ['Hadir', 'Alpa', 'Izin', 'Sakit', 'Cuti'],
                'default'    => 'Hadir',
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
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('pegawai_id', 'm_pegawai', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('m_jadwal_shift');
    }

    public function down()
    {
        $this->forge->dropTable('m_jadwal_shift');
        $this->forge->dropTable('m_pegawai');
        $this->forge->dropTable('m_jabatan');
    }
}
