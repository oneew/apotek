<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProdukKonversiTable extends Migration
{
    public function up()
    {
        // Tabel konversi satuan produk
        // Menyimpan hubungan satuan beli -> satuan terkecil
        // Contoh: 1 Strip (satuan_beli) = 10 Tablet (satuan_utama/terkecil)
        $this->db->query("CREATE TABLE IF NOT EXISTS `m_produk_konversi` (
            `id` INT PRIMARY KEY AUTO_INCREMENT,
            `produk_id` INT NOT NULL,
            `nama_satuan_beli` VARCHAR(50) NOT NULL COMMENT 'Nama satuan beli, misal Strip, Box, Dus',
            `isi` INT NOT NULL DEFAULT 1 COMMENT 'Jumlah satuan terkecil dalam 1 satuan beli',
            `is_default_beli` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Apakah ini satuan beli default?',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_produk_id (`produk_id`),
            FOREIGN KEY (`produk_id`) REFERENCES `m_produk`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Tambah kolom harga_jual ke m_produk jika belum ada
        $fields = $this->db->query("SHOW COLUMNS FROM `m_produk` LIKE 'harga_jual_utama'")->getResultArray();
        if (empty($fields)) {
            $this->db->query("ALTER TABLE `m_produk` ADD COLUMN `harga_jual_utama` DECIMAL(15,2) DEFAULT 0 AFTER `harga_beli_referensi`");
        }
    }

    public function down()
    {
        $this->db->query("DROP TABLE IF EXISTS `m_produk_konversi`");
    }
}
