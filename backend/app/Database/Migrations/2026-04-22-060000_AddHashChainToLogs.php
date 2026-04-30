<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddHashChainToLogs extends Migration
{
    public function up()
    {
        $fields = [
            'prev_hash' => [
                'type'       => 'VARCHAR',
                'constraint' => '64',
                'null'       => true,
                'after'      => 'ip_address'
            ],
            'current_hash' => [
                'type'       => 'VARCHAR',
                'constraint' => '64',
                'null'       => true,
                'after'      => 'prev_hash'
            ],
        ];
        $this->forge->addColumn('activity_logs', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('activity_logs', ['prev_hash', 'current_hash']);
    }
}
