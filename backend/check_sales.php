<?php
require 'vendor/autoload.php';
$db = \Config\Database::connect();
$res = $db->table('t_penjualan')->get()->getResultArray();
echo "Count: " . count($res) . "\n";
print_r($res);
