<?php
namespace App\Database\Migrations;
use CodeIgniter\Database\Migration;

class AddExpiryToProduk extends Migration
{
    public function up()
    {
        $this->forge->addColumn('m_produk', [
            'batch_number' => ['type' => 'VARCHAR', 'constraint' => '50', 'null' => true],
            'tanggal_kadaluarsa' => ['type' => 'DATE', 'null' => true]
        ]);
    }
    public function down()
    {
        $this->forge->dropColumn('m_produk', 'batch_number');
        $this->forge->dropColumn('m_produk', 'tanggal_kadaluarsa');
    }
}
