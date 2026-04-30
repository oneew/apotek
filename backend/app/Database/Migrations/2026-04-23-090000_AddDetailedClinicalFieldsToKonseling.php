<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDetailedClinicalFieldsToKonseling extends Migration
{
    public function up()
    {
        $this->forge->addColumn('t_konseling', [
            'diagnosa_awal' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'keluhan'
            ],
            'saran_rekomendasi' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'diagnosa_awal'
            ],
            'tindakan_diambil' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'saran_rekomendasi'
            ],
        ]);

        $this->forge->dropColumn('t_konseling', 'saran_tindakan');
    }

    public function down()
    {
        $this->forge->addColumn('t_konseling', [
            'saran_tindakan' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'keluhan'
            ],
        ]);
        $this->forge->dropColumn('t_konseling', ['diagnosa_awal', 'saran_rekomendasi', 'tindakan_diambil']);
    }
}
