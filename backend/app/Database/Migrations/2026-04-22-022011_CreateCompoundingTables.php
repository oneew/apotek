<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCompoundingTables extends Migration
{
    public function up()
    {
        // 1. m_formula: The "recipe" header
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'produk_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true], // The resulting product (Tipe: Racika)
            'nama_formula' => ['type' => 'VARCHAR', 'constraint' => 255],
            'keterangan' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_formula');

        // 2. m_formula_detail: The ingredients
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'formula_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'produk_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true], // Ingredient
            'jumlah_formula' => ['type' => 'DECIMAL', 'constraint' => '10,2'],
            'satuan_id' => ['type' => 'INT', 'constraint' => 11],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_formula_detail');
    }

    public function down()
    {
        $this->forge->dropTable('m_formula_detail');
        $this->forge->dropTable('m_formula');
    }
}
