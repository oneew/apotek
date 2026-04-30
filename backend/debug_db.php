<?php
define('FCPATH', __DIR__ . '/public/');
require 'vendor/autoload.php';
$app = require_once 'vendor/codeigniter4/framework/system/bootstrap.php';
$db = \Config\Database::connect();
echo "Driver: " . $db->getPlatform() . "\n";
echo "Database: " . $db->getDatabase() . "\n";
