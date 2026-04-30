<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSatusehatLogTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true
            ],
            'endpoint' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'payload' => ['type' => 'LONGTEXT'],
            'response' => ['type' => 'LONGTEXT'],
            'status_code' => ['type' => 'INT', 'constraint' => 5],
            'created_at' => ['type' => 'DATETIME', 'null' => true]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_satusehat_log');
    }

    public function down()
    {
        $this->forge->dropTable('t_satusehat_log');
    }
}
