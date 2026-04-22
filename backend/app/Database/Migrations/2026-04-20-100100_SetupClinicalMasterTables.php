<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SetupClinicalMasterTables extends Migration
{
    public function up()
    {
        // 1. m_jenis_pelayanan
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_pelayanan' => ['type' => 'VARCHAR', 'constraint' => 100],
            'status' => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_jenis_pelayanan', true);

        // 2. m_jenis_antrian
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_antrian' => ['type' => 'VARCHAR', 'constraint' => 100],
            'kode_prefix'  => ['type' => 'VARCHAR', 'constraint' => 5],
            'status'       => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
            'updated_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_jenis_antrian', true);

        // 3. m_produk_lab
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kode_produk' => ['type' => 'VARCHAR', 'constraint' => 50],
            'nama_produk' => ['type' => 'VARCHAR', 'constraint' => 255],
            'harga'       => ['type' => 'DECIMAL', 'constraint' => '15,2', 'default' => 0],
            'status'      => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_produk_lab', true);

        // 4. m_item_pemeriksaan
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_item'    => ['type' => 'VARCHAR', 'constraint' => 255],
            'satuan'       => ['type' => 'VARCHAR', 'constraint' => 50],
            'nilai_normal' => ['type' => 'TEXT', 'null' => true],
            'status'       => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
            'updated_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_item_pemeriksaan', true);

        // 5. m_shift (assuming we need a master table if 'shifts' is transactional or incomplete)
        // If 'shifts' table already exists, we might just update it.
        if (!$this->db->tableExists('m_shift')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
                'nama_shift' => ['type' => 'VARCHAR', 'constraint' => 100],
                'jam_mulai'  => ['type' => 'TIME'],
                'jam_selesai' => ['type' => 'TIME'],
                'status'     => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
                'created_at' => ['type' => 'DATETIME', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('m_shift', true);
        }
    }

    public function down()
    {
        $this->forge->dropTable('m_jenis_pelayanan', true);
        $this->forge->dropTable('m_jenis_antrian', true);
        $this->forge->dropTable('m_produk_lab', true);
        $this->forge->dropTable('m_item_pemeriksaan', true);
        $this->forge->dropTable('m_shift', true);
    }
}
