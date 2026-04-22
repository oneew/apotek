<?php
require 'app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/bootstrap.php';
$db = \Config\Database::connect();
$query = $db->query("DESCRIBE t_pembelian_detail");
print_r($query->getResultArray());
