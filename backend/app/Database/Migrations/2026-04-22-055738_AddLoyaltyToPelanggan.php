<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddLoyaltyToPelanggan extends Migration
{
    public function up()
    {
        $fields = [
            'loyalty_points' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'default'    => 0,
                'after'      => 'alamat'
            ],
            'total_belanja' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,0',
                'default'    => 0,
                'after'      => 'loyalty_points'
            ]
        ];
        
        $this->forge->addColumn('m_pelanggan', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('m_pelanggan', ['loyalty_points', 'total_belanja']);
    }
}
