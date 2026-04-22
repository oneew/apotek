<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePromoTables extends Migration
{
    public function up()
    {
        // 1. m_promo (Header)
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'nama_promo' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'jenis_promo' => [
                'type'       => 'ENUM',
                'constraint' => ['Diskon', 'Bundel', 'Voucher'],
            ],
            'tanggal_mulai' => [
                'type' => 'DATETIME',
            ],
            'tanggal_selesai' => [
                'type' => 'DATETIME',
            ],
            'nilai_diskon' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0.00,
            ],
            'tipe_nilai' => [
                'type'       => 'ENUM',
                'constraint' => ['Persen', 'Nominal'],
                'default'    => 'Persen',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['Aktif', 'Non-aktif'],
                'default'    => 'Aktif',
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
        $this->forge->createTable('m_promo');

        // 2. t_promo_produk
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'promo_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
            ],
            'produk_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('promo_id', 'm_promo', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('produk_id', 'm_produk', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('t_promo_produk');
    }

    public function down()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->forge->dropTable('t_promo_produk');
        $this->forge->dropTable('m_promo');
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');
    }
}
