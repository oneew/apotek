<?php
$dbPath = __DIR__ . '/backend/writable/database.sqlite';
if (!file_exists($dbPath)) {
    die("Database not found at $dbPath\n");
}
$db = new SQLite3($dbPath);
$results = $db->query("PRAGMA table_info(t_konsinyasi_detail)");
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    print_r($row);
}
