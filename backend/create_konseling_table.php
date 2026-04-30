<?php
require 'vendor/autoload.php';
// Mock CI environment minimum
define('FCPATH', __DIR__ . '/public/');
require 'app/Config/Paths.php';
$paths = new \Config\Paths();
require 'system/bootstrap.php';

$db = \Config\Database::connect();
$sql = "CREATE TABLE IF NOT EXISTS t_konseling (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal_konseling DATETIME DEFAULT CURRENT_TIMESTAMP,
    pelanggan_id INT NOT NULL,
    apoteker_id INT NOT NULL,
    keluhan TEXT,
    diagnosa_awal TEXT,
    saran_rekomendasi TEXT,
    tindakan_diambil TEXT,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pelanggan_id) REFERENCES m_pelanggan(id),
    FOREIGN KEY (apoteker_id) REFERENCES m_pegawai(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $db->query($sql);
    echo "Table t_konseling created successfully or already exists.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
