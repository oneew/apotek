<?php
$pdo = new PDO('mysql:host=localhost;dbname=apotek', 'root', '');
$pdo->exec("INSERT IGNORE INTO t_interaksi_obat (drug_class_a, drug_class_b, tingkat_bahaya, deskripsi_efek) VALUES 
('NSAID', 'Antikoagulan', 'Mayor', 'Meningkatkan risiko pendarahan gastrointestinal yang serius. Gunakan alternatif painkiller.'),
('ACE Inhibitor', 'Potassium-sparing Diuretics', 'Moderat', 'Risiko hiperkalemia (kadar kalium darah sangat tinggi) meningkat.'),
('Statin', 'Makrolida', 'Mayor', 'Risiko rhabdomyolysis meningkat. Hindari penggunaan bersama.'),
('Antasida', 'Tetrasiklin', 'Minor', 'Antasida dapat mengurangi absorpsi antibiotik. Beri jeda 2-4 jam.');");

$pdo->exec("UPDATE m_produk SET batch_number = 'BCH-001', tanggal_kadaluarsa = DATE_SUB(CURDATE(), INTERVAL 5 DAY) WHERE id = 1");
$pdo->exec("UPDATE m_produk SET batch_number = 'BCH-002', tanggal_kadaluarsa = DATE_ADD(CURDATE(), INTERVAL 25 DAY) WHERE id = 2");
$pdo->exec("UPDATE m_produk SET batch_number = 'BCH-003', tanggal_kadaluarsa = DATE_ADD(CURDATE(), INTERVAL 75 DAY) WHERE id = 3");
$pdo->exec("UPDATE m_produk SET batch_number = 'BCH-004', tanggal_kadaluarsa = DATE_ADD(CURDATE(), INTERVAL 120 DAY) WHERE id = 4");

$pdo->exec("UPDATE m_produk SET drug_class = 'NSAID' WHERE id=1");
$pdo->exec("UPDATE m_produk SET drug_class = 'Antikoagulan' WHERE id=2");
echo 'Seed OK';
