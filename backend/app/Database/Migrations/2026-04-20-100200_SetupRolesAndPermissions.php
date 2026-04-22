<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SetupRolesAndPermissions extends Migration
{
    public function up()
    {
        // 1. Table m_role
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'nama_role' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'keterangan' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('m_role');

        // 2. Table m_role_akses (Mapping permissions to menus)
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'role_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'menu_key' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'can_view' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'can_create' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'can_edit' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
            'can_delete' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('role_id', 'm_role', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('m_role_akses');

        // 3. Update users table to use role_id (Optional but recommended)
        // For now, let's just create the tables. If the user wants to link them, we'll do an alter table later.
        // Actually, let's alter users table now to add role_id.
        $this->forge->addColumn('users', [
            'role_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'role'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropForeignKey('m_role_akses', 'm_role_akses_role_id_foreign');
        $this->forge->dropTable('m_role_akses');
        $this->forge->dropTable('m_role');
        $this->forge->dropColumn('users', 'role_id');
    }
}
