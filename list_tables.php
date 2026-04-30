<?php
$dbPath = __DIR__ . '/backend/writable/database.sqlite';
$db = new SQLite3($dbPath);
$results = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    echo $row['name'] . "\n";
}
