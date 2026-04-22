<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddKfaFieldsToProduk extends Migration
{
    public function up()
    {
        $fields = [
            'kfa_code' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
                'after'      => 'reorder_point'
            ],
            'kfa_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'kfa_code'
            ],
        ];
        $this->forge->addColumn('m_produk', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('m_produk', 'kfa_code');
        $this->forge->dropColumn('m_produk', 'kfa_name');
    }
}
