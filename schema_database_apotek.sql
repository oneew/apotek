-- ====================================================================================
-- TABEL MASTER YANG DIBERIKAN USER
-- ====================================================================================

-- Tabel Master Satuan
CREATE TABLE IF NOT EXISTS m_satuan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_satuan VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Master Kategori
CREATE TABLE IF NOT EXISTS m_kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Master Rak / Lokasi Penyimpanan
CREATE TABLE IF NOT EXISTS m_rak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_rak VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Master Membership
CREATE TABLE IF NOT EXISTS m_membership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_membership VARCHAR(20) NOT NULL UNIQUE,
    nama_membership VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Master Produk Utama
CREATE TABLE IF NOT EXISTS m_produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipe_produk ENUM('obat', 'alkes', 'umum', 'jasa') NOT NULL,
    nama_produk VARCHAR(255) NOT NULL,
    pabrik_prinsipal VARCHAR(255),
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    
    -- Relasi Kategori (Mendukung hingga 3 level kategori sesuai CSV)
    kategori_1_id INT,
    kategori_2_id INT,
    kategori_3_id INT,
    
    -- Satuan Utama (Base Unit)
    satuan_utama_id INT NOT NULL,
    
    -- Harga Beli & Stok
    harga_beli_referensi DECIMAL(15, 2) DEFAULT 0,
    stok_minimal INT DEFAULT 0,
    stok_maksimal INT DEFAULT 0,
    target_periode_pembelian INT COMMENT 'Dalam hari',
    
    -- Lokasi & Status
    lokasi_rak_id INT,
    is_dijual ENUM('ya', 'tidak') DEFAULT 'ya',
    is_tampil_katalog ENUM('ya', 'tidak') DEFAULT 'ya',
    is_wajib_resep ENUM('ya', 'tidak') DEFAULT 'tidak',
    
    -- Informasi Klinis & Komisi
    zat_aktif TEXT,
    bentuk_sediaan VARCHAR(100),
    komisi_jenis ENUM('flatMoney', 'percentFromSales', 'none') DEFAULT 'none',
    komisi_nilai DECIMAL(15, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (kategori_1_id) REFERENCES m_kategori(id),
    FOREIGN KEY (kategori_2_id) REFERENCES m_kategori(id),
    FOREIGN KEY (kategori_3_id) REFERENCES m_kategori(id),
    FOREIGN KEY (satuan_utama_id) REFERENCES m_satuan(id),
    FOREIGN KEY (lokasi_rak_id) REFERENCES m_rak(id)
);

-- Tabel Harga Multi-Level / Multi-Satuan
CREATE TABLE IF NOT EXISTS m_produk_harga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT NOT NULL,
    satuan_id INT NOT NULL,
    faktor_pengali DECIMAL(10, 4) NOT NULL DEFAULT 1.0000, -- Contoh: Box ke Tablet (isi 100)
    
    -- Harga Jual
    harga_jual DECIMAL(15, 2) NOT NULL,
    label_harga VARCHAR(50) DEFAULT 'Umum', -- Contoh: Grosir, Retail
    
    -- Relasi Membership (Jika harga berbeda per level member)
    membership_id INT NULL,
    kuantitas_minimal INT DEFAULT 1,
    catatan_harga TEXT,
    
    FOREIGN KEY (produk_id) REFERENCES m_produk(id) ON DELETE CASCADE,
    FOREIGN KEY (satuan_id) REFERENCES m_satuan(id),
    FOREIGN KEY (membership_id) REFERENCES m_membership(id)
);

-- ====================================================================================
-- TABEL TAMBAHAN YANG BERHUBUNGAN DENGAN SISTEM APOTEK
-- ====================================================================================

-- 1. Tabel Master Supplier (PBF/Pedagang Besar Farmasi)
CREATE TABLE IF NOT EXISTS m_supplier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_supplier VARCHAR(50) UNIQUE NOT NULL,
    nama_supplier VARCHAR(150) NOT NULL,
    alamat TEXT,
    no_telepon VARCHAR(50),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Master Pelanggan (Pasien / Customer)
CREATE TABLE IF NOT EXISTS m_pelanggan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pelanggan VARCHAR(50) UNIQUE NOT NULL,
    nama_pelanggan VARCHAR(150) NOT NULL,
    no_telepon VARCHAR(50),
    alamat TEXT,
    tanggal_lahir DATE,
    jenis_kelamin ENUM('L', 'P'),
    membership_id INT,
    poin_reward INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES m_membership(id) ON DELETE SET NULL
);

-- 3. Tabel Master Dokter (Untuk Peresepan Obat / Wajib Resep)
CREATE TABLE IF NOT EXISTS m_dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_dokter VARCHAR(150) NOT NULL,
    spesialisasi VARCHAR(100),
    no_izin_praktek VARCHAR(100),
    no_telepon VARCHAR(50),
    alamat_praktek TEXT,
    komisi_persen DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Manajemen Stok Spesifik (Batch & Tanggal Kadaluarsa / Expired Date)
--    *(Sangat krusial untuk apotek agar obat tidak terjual jika expired)*
CREATE TABLE IF NOT EXISTS t_stok_batch (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT NOT NULL,
    no_batch VARCHAR(100) NOT NULL,
    tanggal_expired DATE NOT NULL,
    stok_tersedia INT NOT NULL DEFAULT 0,  -- Disimpan dalam satuan utama / terkecil
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produk_id) REFERENCES m_produk(id) ON DELETE CASCADE
);

-- 5. Tabel Transaksi Pembelian (Penerimaan Barang dari Supplier)
CREATE TABLE IF NOT EXISTS t_pembelian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_faktur VARCHAR(100) UNIQUE NOT NULL,
    tanggal_pembelian DATE NOT NULL,
    tanggal_jatuh_tempo DATE,
    supplier_id INT NOT NULL,
    total_tagihan DECIMAL(15, 2) NOT NULL DEFAULT 0,
    diskon_total DECIMAL(15, 2) DEFAULT 0,
    pajak DECIMAL(15, 2) DEFAULT 0,
    grand_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status_pembayaran ENUM('Lunas', 'Hutang') DEFAULT 'Lunas',
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- asumsikan ada relasi ke tabel m_pengguna/user jika diperlukan: "created_by"
    FOREIGN KEY (supplier_id) REFERENCES m_supplier(id)
);

-- 6. Detail Transaksi Pembelian (Item yang dibeli)
CREATE TABLE IF NOT EXISTS t_pembelian_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pembelian_id INT NOT NULL,
    produk_id INT NOT NULL,
    satuan_id INT NOT NULL,
    jumlah_beli INT NOT NULL,  -- Dalam satuan_id yang dipilih
    harga_beli_per_satuan DECIMAL(15, 2) NOT NULL,
    diskon DECIMAL(15, 2) DEFAULT 0,
    subtotal DECIMAL(15, 2) NOT NULL,
    no_batch VARCHAR(100),
    tanggal_expired DATE,
    FOREIGN KEY (pembelian_id) REFERENCES t_pembelian(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES m_produk(id),
    FOREIGN KEY (satuan_id) REFERENCES m_satuan(id)
);

-- 7. Tabel Transaksi Penjualan (Kasir / Point of Sale)
CREATE TABLE IF NOT EXISTS t_penjualan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_invoice VARCHAR(100) UNIQUE NOT NULL,
    tanggal_penjualan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pelanggan_id INT, -- NULL jika pelanggan umum
    dokter_id INT,    -- NULL jika tanpa resep
    total_belanja DECIMAL(15, 2) NOT NULL DEFAULT 0,
    diskon_nota DECIMAL(15, 2) DEFAULT 0,
    total_bayar DECIMAL(15, 2) NOT NULL DEFAULT 0,
    uang_diterima DECIMAL(15, 2) NOT NULL DEFAULT 0,
    uang_kembali DECIMAL(15, 2) NOT NULL DEFAULT 0,
    jenis_pembayaran ENUM('Tunai', 'Debit', 'Kredit', 'Qris/E-Wallet') DEFAULT 'Tunai',
    status_penjualan ENUM('Selesai', 'Batal', 'Retur') DEFAULT 'Selesai',
    keterangan TEXT,
    -- asumsikan ada relasi ke tabel kasir/user login (kasir_id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pelanggan_id) REFERENCES m_pelanggan(id) ON DELETE SET NULL,
    FOREIGN KEY (dokter_id) REFERENCES m_dokter(id) ON DELETE SET NULL
);

-- 8. Detail Transaksi Penjualan
CREATE TABLE IF NOT EXISTS t_penjualan_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    penjualan_id INT NOT NULL,
    produk_id INT NOT NULL,
    satuan_id INT NOT NULL,
    jumlah_jual INT NOT NULL,
    harga_jual_per_satuan DECIMAL(15, 2) NOT NULL,
    diskon DECIMAL(15, 2) DEFAULT 0,
    subtotal DECIMAL(15, 2) NOT NULL,
    stok_batch_id INT, -- Referensi batch yang diambil untuk terjual
    FOREIGN KEY (penjualan_id) REFERENCES t_penjualan(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES m_produk(id),
    FOREIGN KEY (satuan_id) REFERENCES m_satuan(id),
    FOREIGN KEY (stok_batch_id) REFERENCES t_stok_batch(id) ON DELETE SET NULL
);

-- 9. (Opsional) Tabel Riwayat / Kartu Stok
CREATE TABLE IF NOT EXISTS t_kartu_stok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT NOT NULL,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    jenis_mutasi ENUM('Masuk', 'Keluar', 'Penyesuaian/Opname') NOT NULL,
    jumlah INT NOT NULL,
    sisa_stok INT NOT NULL,
    referensi VARCHAR(255) COMMENT 'No Faktur, No Penjualan, atau ID Opname',
    keterangan TEXT,
    FOREIGN KEY (produk_id) REFERENCES m_produk(id) ON DELETE CASCADE
);
