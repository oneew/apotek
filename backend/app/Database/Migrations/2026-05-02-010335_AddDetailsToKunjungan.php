<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDetailsToKunjungan extends Migration
{
    public function up()
    {
        $this->forge->addColumn('t_kunjungan', [
            'keluhan' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'dokter_id'
            ],
            'catatan' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'keluhan'
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('t_kunjungan', ['keluhan', 'catatan']);
    }
}
