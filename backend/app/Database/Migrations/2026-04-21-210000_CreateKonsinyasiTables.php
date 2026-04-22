<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateKonsinyasiTables extends Migration
{
    public function up()
    {
        // 1. t_konsinyasi (Header)
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'no_faktur' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
            ],
            'tanggal' => [
                'type' => 'DATETIME',
            ],
            'supplier_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
            ],
            'total_nilai' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0.00,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['Pending', 'Received', 'Partial', 'Returned'],
                'default'    => 'Pending',
            ],
            'keterangan' => [
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
        $this->forge->addForeignKey('supplier_id', 'm_supplier', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('t_konsinyasi');

        // 2. t_konsinyasi_detail
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'konsinyasi_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
            ],
            'produk_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
            ],
            'satuan_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
            ],
            'qty' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],
            'harga_beli' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
            ],
            'subtotal' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
            ],
            'no_batch' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
            ],
            'tgl_expired' => [
                'type' => 'DATE',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('konsinyasi_id', 't_konsinyasi', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('produk_id', 'm_produk', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('t_konsinyasi_detail');
    }

    public function down()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->forge->dropTable('t_konsinyasi_detail');
        $this->forge->dropTable('t_konsinyasi');
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');
    }
}
