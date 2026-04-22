<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddForecastingFieldsToProduk extends Migration
{
    public function up()
    {
        $fields = [
            'reorder_point' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'after' => 'stok_maksimal'
            ],
        ];
        $this->forge->addColumn('m_produk', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('m_produk', ['stok_min', 'stok_max', 'reorder_point']);
    }
}
