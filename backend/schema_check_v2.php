<?php
// bootstrap CI4
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
chdir(__DIR__);
require 'app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/bootstrap.php';

$db = \Config\Database::connect();
$tables = ['t_pembelian', 't_pembelian_detail', 't_stok_batch', 't_kartu_stok'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    $query = $db->query("DESCRIBE $table");
    foreach ($query->getResultArray() as $row) {
        echo "{$row['Field']} - {$row['Type']} - {$row['Null']}\n";
    }
}
