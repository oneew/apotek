<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInteraksiObatTable extends Migration
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
            'drug_class_a' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'drug_class_b' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'tingkat_bahaya' => [
                'type'       => 'ENUM',
                'constraint' => ['Mayor', 'Moderat', 'Minor'],
            ],
            'deskripsi_efek' => [
                'type' => 'TEXT',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_interaksi_obat');
    }

    public function down()
    {
        $this->forge->dropTable('t_interaksi_obat');
    }
}
