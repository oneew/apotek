<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPoIdToPembelian extends Migration
{
    public function up()
    {
        $fields = [
            'po_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'status'
            ]
        ];
        $this->forge->addColumn('t_pembelian', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('t_pembelian', 'po_id');
    }
}
