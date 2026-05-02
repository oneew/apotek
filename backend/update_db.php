<?php
require 'vendor/autoload.php';
// Define constants for CI4 environment if needed, but for simple DB query we can just use mysqli or CI4 bootstrap
// Let's use CI4 bootstrap if possible to stay consistent

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR);
$loader = require 'vendor/autoload.php';

// We need to bootstrap CI4 to use its DB class easily, but it's complex for a one-liner.
// Let's just use plain PHP and the .env file.

$env = parse_ini_file('.env');
$host = $env['database.default.hostname'] ?? '127.0.0.1';
$user = $env['database.default.username'] ?? 'root';
$pass = $env['database.default.password'] ?? '';
$db   = $env['database.default.database'] ?? 'apotek';

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Check if column exists
$result = $mysqli->query("SHOW COLUMNS FROM t_penjualan_tertolak LIKE 'nama_produk_manual'");
if ($result->num_rows == 0) {
    $mysqli->query("ALTER TABLE t_penjualan_tertolak ADD COLUMN nama_produk_manual VARCHAR(255) AFTER produk_id");
    echo "Column nama_produk_manual added successfully.\n";
} else {
    echo "Column nama_produk_manual already exists.\n";
}

// Also make produk_id nullable if it's not already
$mysqli->query("ALTER TABLE t_penjualan_tertolak MODIFY produk_id INTEGER NULL");
echo "Column produk_id modified to be nullable.\n";

$mysqli->close();
