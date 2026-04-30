<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDrugClassToProduk extends Migration
{
    public function up()
    {
        $this->forge->addColumn('m_produk', [
            'drug_class' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('m_produk', 'drug_class');
    }
}
