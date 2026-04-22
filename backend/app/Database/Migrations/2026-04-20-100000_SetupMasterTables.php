<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SetupMasterTables extends Migration
{
    public function up()
    {
        // 1. m_kategori: Add columns if not exist
        if ($this->db->tableExists('m_kategori')) {
            $fields = [
                'kode_kategori' => ['type' => 'VARCHAR', 'constraint' => 50, 'after' => 'id', 'null' => true],
                'keterangan'    => ['type' => 'TEXT', 'after' => 'nama_kategori', 'null' => true],
                'updated_at'    => ['type' => 'DATETIME', 'null' => true],
            ];
            $this->forge->addColumn('m_kategori', $fields);
        }

        // 2. m_satuan: Add columns
        if ($this->db->tableExists('m_satuan')) {
            $fields = [
                'kode_satuan' => ['type' => 'VARCHAR', 'constraint' => 50, 'after' => 'id', 'null' => true],
                'keterangan'  => ['type' => 'TEXT', 'after' => 'nama_satuan', 'null' => true],
                'updated_at'  => ['type' => 'DATETIME', 'null' => true],
            ];
            $this->forge->addColumn('m_satuan', $fields);
        }

        // 3. m_rak: Add columns
        if ($this->db->tableExists('m_rak')) {
            $fields = [
                'kode_rak'   => ['type' => 'VARCHAR', 'constraint' => 50, 'after' => 'id', 'null' => true],
                'keterangan' => ['type' => 'TEXT', 'after' => 'nama_rak', 'null' => true],
                'updated_at' => ['type' => 'DATETIME', 'null' => true],
            ];
            $this->forge->addColumn('m_rak', $fields);
        }

        // 4. m_gudang
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'kode_gudang' => ['type' => 'VARCHAR', 'constraint' => 50],
            'nama_gudang' => ['type' => 'VARCHAR', 'constraint' => 100],
            'alamat'      => ['type' => 'TEXT', 'null' => true],
            'status'      => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_gudang', true);

        // 5. m_pajak
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_pajak' => ['type' => 'VARCHAR', 'constraint' => 50],
            'persentase' => ['type' => 'DECIMAL', 'constraint' => '5,2'],
            'status'     => ['type' => 'ENUM', 'constraint' => ['Aktif', 'Non-Aktif'], 'default' => 'Aktif'],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_pajak', true);

        // 6. m_kategori_pelanggan
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_kategori' => ['type' => 'VARCHAR', 'constraint' => 100],
            'potongan_persen' => ['type' => 'DECIMAL', 'constraint' => '5,2', 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_kategori_pelanggan', true);
    }

    public function down()
    {
        $this->forge->dropTable('m_gudang', true);
        $this->forge->dropTable('m_pajak', true);
        $this->forge->dropTable('m_kategori_pelanggan', true);
    }
}
