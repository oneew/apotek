<?php
require 'backend/vendor/autoload.php';
require 'backend/app/Config/Constants.php';
require 'backend/system/bootstrap.php';

$db = \Config\Database::connect();
$tables = ['m_supplier', 'm_produk', 'm_satuan'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    if ($db->tableExists($table)) {
        $query = $db->query("SHOW COLUMNS FROM $table");
        print_r($query->getResultArray());
    } else {
        echo "Table $table does not exist\n";
    }
}
