<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddStatusToPembelian extends Migration
{
    public function up()
    {
        $this->forge->addColumn('t_pembelian', [
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['Draft', 'Posted'],
                'default'    => 'Posted',
                'after'      => 'status_pembayaran'
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('t_pembelian', 'status');
    }
}
