<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateWhatsappTables extends Migration
{
    public function up()
    {
        // WA Queue: pesan yang akan dikirim
        $this->forge->addField([
            'id'           => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nomor_tujuan' => ['type' => 'VARCHAR', 'constraint' => 20],
            'pesan'        => ['type' => 'TEXT'],
            'tipe'         => ['type' => 'ENUM', 'constraint' => ['struk', 'alert_stok', 'promo', 'reminder'], 'default' => 'struk'],
            'referensi_id' => ['type' => 'INT', 'constraint' => 11, 'null' => true],
            'status'       => ['type' => 'ENUM', 'constraint' => ['pending', 'sent', 'failed'], 'default' => 'pending'],
            'error_msg'    => ['type' => 'TEXT', 'null' => true],
            'scheduled_at' => ['type' => 'DATETIME', 'null' => true],
            'sent_at'      => ['type' => 'DATETIME', 'null' => true],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_wa_queue');

        // WA Settings: konfigurasi API key
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'config_key' => ['type' => 'VARCHAR', 'constraint' => 100],
            'config_val' => ['type' => 'TEXT', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('t_wa_settings');

        // Default settings
        $db = \Config\Database::connect();
        $db->table('t_wa_settings')->insertBatch([
            ['config_key' => 'fonnte_token',         'config_val' => '', 'updated_at' => date('Y-m-d H:i:s')],
            ['config_key' => 'pengirim_default',     'config_val' => '', 'updated_at' => date('Y-m-d H:i:s')],
            ['config_key' => 'notif_stok_aktif',     'config_val' => '1', 'updated_at' => date('Y-m-d H:i:s')],
            ['config_key' => 'notif_struk_aktif',    'config_val' => '1', 'updated_at' => date('Y-m-d H:i:s')],
            ['config_key' => 'nomor_manajer',        'config_val' => '', 'updated_at' => date('Y-m-d H:i:s')],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('t_wa_queue');
        $this->forge->dropTable('t_wa_settings');
    }
}
