<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run()
    {
        $tables = [
            'm_kategori', 'm_satuan', 'm_rak', 'm_gudang', 'm_pajak', 
            'm_kategori_pelanggan', 'm_jenis_pelayanan', 'm_jenis_antrian', 
            'm_produk_lab', 'm_item_pemeriksaan', 'm_shift'
        ];

        // Disable foreign key checks to allow truncation
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');

        foreach ($tables as $table) {
            $this->db->table($table)->truncate();
        }

        // 1. m_kategori (Comprehensive)
        $this->db->table('m_kategori')->insertBatch([
            ['kode_kategori' => 'KAT-OB-KRS', 'nama_kategori' => 'Obat Keras', 'keterangan' => 'Obat dengan tanda lingkaran merah (G)'],
            ['kode_kategori' => 'KAT-OB-BBS', 'nama_kategori' => 'Obat Bebas', 'keterangan' => 'Obat dengan tanda lingkaran hijau'],
            ['kode_kategori' => 'KAT-OB-TBT', 'nama_kategori' => 'Obat Bebas Terbatas', 'keterangan' => 'Obat dengan tanda lingkaran biru'],
            ['kode_kategori' => 'KAT-OB-PSK', 'nama_kategori' => 'Psikotropika', 'keterangan' => 'Obat golongan psikotropika'],
            ['kode_kategori' => 'KAT-OB-NRK', 'nama_kategori' => 'Narkotika', 'keterangan' => 'Obat golongan narkotika'],
            ['kode_kategori' => 'KAT-OB-HRB', 'nama_kategori' => 'Herbal / Jamu', 'keterangan' => 'Obat bahan alam'],
            ['kode_kategori' => 'KAT-AL-KES', 'nama_kategori' => 'Alat Kesehatan', 'keterangan' => 'Peralatan medis dan penunjang'],
            ['kode_kategori' => 'KAT-KS-MTK', 'nama_kategori' => 'Kosmetik', 'keterangan' => 'Produk kecantikan dan perawatan kulit'],
            ['kode_kategori' => 'KAT-VT-SUP', 'nama_kategori' => 'Vitamin & Suplemen', 'keterangan' => 'Multivitamin dan penambah nutrisi'],
            ['kode_kategori' => 'KAT-SS-NUT', 'nama_kategori' => 'Susu & Nutrisi', 'keterangan' => 'Susu bayi, lansia, dan nutrisi khusus'],
            ['kode_kategori' => 'KAT-BY-ANK', 'nama_kategori' => 'Keperluan Bayi', 'keterangan' => 'Popok, sabun bayi, dll'],
            ['kode_kategori' => 'KAT-PR-CAR', 'nama_kategori' => 'Personal Care', 'keterangan' => 'Sabun, sampo, pasta gigi umum'],
            ['kode_kategori' => 'KAT-LA-INN', 'nama_kategori' => 'Lain-lain', 'keterangan' => 'Kategori produk lainnya'],
        ]);

        // 2. m_satuan (Comprehensive)
        $this->db->table('m_satuan')->insertBatch([
            ['kode_satuan' => 'SAT-BOX', 'nama_satuan' => 'Box', 'keterangan' => 'Kotak / Dus Besar'],
            ['kode_satuan' => 'SAT-STR', 'nama_satuan' => 'Strip', 'keterangan' => 'Lembaran isi beberapa tablet/kapsul'],
            ['kode_satuan' => 'SAT-PCS', 'nama_satuan' => 'Pcs', 'keterangan' => 'Satuan bijian / eceran'],
            ['kode_satuan' => 'SAT-BTL', 'nama_satuan' => 'Botol', 'keterangan' => 'Kemasan botol cair/sirup'],
            ['kode_satuan' => 'SAT-TBE', 'nama_satuan' => 'Tube', 'keterangan' => 'Kemasan salep / krim'],
            ['kode_satuan' => 'SAT-SCT', 'nama_satuan' => 'Sachet', 'keterangan' => 'Kemasan plastik kecil porsi tunggal'],
            ['kode_satuan' => 'SAT-AMP', 'nama_satuan' => 'Ampul', 'keterangan' => 'Satuan cairan injeksi kecil'],
            ['kode_satuan' => 'SAT-VIA', 'nama_satuan' => 'Vial', 'keterangan' => 'Satuan cairan injeksi sedang'],
            ['kode_satuan' => 'SAT-SUP', 'nama_satuan' => 'Supp', 'keterangan' => 'Satuan Suppositoria'],
            ['kode_satuan' => 'SAT-OVU', 'nama_satuan' => 'Ovula', 'keterangan' => 'Satuan Ovula'],
            ['kode_satuan' => 'SAT-GLN', 'nama_satuan' => 'Galon', 'keterangan' => 'Kemasan curah / galon besar'],
            ['kode_satuan' => 'SAT-TBL', 'nama_satuan' => 'Tablet', 'keterangan' => 'Satuan butir tablet'],
            ['kode_satuan' => 'SAT-KPS', 'nama_satuan' => 'Kapsul', 'keterangan' => 'Satuan butir kapsul'],
            ['kode_satuan' => 'SAT-BLT', 'nama_satuan' => 'Blister', 'keterangan' => 'Kemasan blister'],
            ['kode_satuan' => 'SAT-ROL', 'nama_satuan' => 'Roll', 'keterangan' => 'Satuan gulungan (perban, dll)'],
        ]);

        // 3. m_rak (Lengkap)
        $this->db->table('m_rak')->insertBatch([
            ['kode_rak' => 'RAK-A1', 'nama_rak' => 'Rak Etalase Depan A1', 'keterangan' => 'Display depan kiri'],
            ['kode_rak' => 'RAK-B1', 'nama_rak' => 'Rak Obat Generik B1', 'keterangan' => 'Penyimpanan dalam'],
            ['kode_rak' => 'RAK-C1', 'nama_rak' => 'Rak Narkotika (Kunci)', 'keterangan' => 'Rak khusus terkunci'],
            ['kode_rak' => 'RAK-CHL', 'nama_rak' => 'Chiller / Lemari Es', 'keterangan' => 'Suhu 2-8 Derajat'],
            ['kode_rak' => 'RAK-SK1', 'nama_rak' => 'Sekat Kasir 1', 'keterangan' => 'Barang promosi kasir'],
        ]);

        // 4. m_gudang (Lengkap)
        $this->db->table('m_gudang')->insertBatch([
            ['kode_gudang' => 'GDG-UTAMA', 'nama_gudang' => 'Gudang Pusat', 'alamat' => 'Jl. Industri No. 45', 'status' => 'Aktif'],
            ['kode_gudang' => 'GDG-APOTEK', 'nama_gudang' => 'Apotek Depan', 'alamat' => 'Lokasi Penjualan Utama', 'status' => 'Aktif'],
            ['kode_gudang' => 'GDG-TRANS', 'nama_gudang' => 'Transit / Karantina', 'alamat' => 'Area Barang Masuk/Rusak', 'status' => 'Aktif'],
        ]);

        // ... Sisa master data tetap seperti sebelumnya atau sedikit disesuaikan jika perlu
        // (Saya akan masukkan kembali sisanya agar tidak hilang saat seeder dijalankan)

        $this->db->table('m_pajak')->insertBatch([
            ['nama_pajak' => 'PPN 11%', 'persentase' => 11.00, 'status' => 'Aktif'],
            ['nama_pajak' => 'Pajak Daerah 10%', 'persentase' => 10.00, 'status' => 'Aktif'],
            ['nama_pajak' => 'Non-Pajak', 'persentase' => 0.00, 'status' => 'Aktif'],
        ]);

        $this->db->table('m_kategori_pelanggan')->insertBatch([
            ['nama_kategori' => 'Umum / Retail', 'potongan_persen' => 0.00],
            ['nama_kategori' => 'Member Silver', 'potongan_persen' => 2.50],
            ['nama_kategori' => 'Member Gold', 'potongan_persen' => 5.00],
            ['nama_kategori' => 'Member Platinum', 'potongan_persen' => 7.50],
            ['nama_kategori' => 'Karyawan / Internal', 'potongan_persen' => 10.00],
        ]);

        $this->db->table('m_jenis_pelayanan')->insertBatch([
            ['nama_pelayanan' => 'Apotek Mandiri', 'status' => 'Aktif'],
            ['nama_pelayanan' => 'Praktek Dokter', 'status' => 'Aktif'],
            ['nama_pelayanan' => 'Laboratorium Klinik', 'status' => 'Aktif'],
            ['nama_pelayanan' => 'Layanan Resep Dokter', 'status' => 'Aktif'],
        ]);

        $this->db->table('m_jenis_antrian')->insertBatch([
            ['nama_antrian' => 'Poli Umum', 'kode_prefix' => 'A', 'status' => 'Aktif'],
            ['nama_antrian' => 'Farmasi / Obat', 'kode_prefix' => 'F', 'status' => 'Aktif'],
            ['nama_antrian' => 'Kasir Pembayaran', 'kode_prefix' => 'K', 'status' => 'Aktif'],
            ['nama_antrian' => 'Customer Service', 'kode_prefix' => 'S', 'status' => 'Aktif'],
        ]);

        $this->db->table('m_produk_lab')->insertBatch([
            ['kode_produk' => 'LAB-GU-DR', 'nama_produk' => 'Cek Gula Darah', 'harga' => 25000.00, 'status' => 'Aktif'],
            ['kode_produk' => 'LAB-AS-UR', 'nama_produk' => 'Cek Asam Urat', 'harga' => 30000.00, 'status' => 'Aktif'],
            ['kode_produk' => 'LAB-KO-LS', 'nama_produk' => 'Cek Kolesterol', 'harga' => 50000.00, 'status' => 'Aktif'],
            ['kode_produk' => 'LAB-HB-A1C', 'nama_produk' => 'Cek HbA1C', 'harga' => 150000.00, 'status' => 'Aktif'],
        ]);

        $this->db->table('m_item_pemeriksaan')->insertBatch([
            ['nama_item' => 'Suhu Tubuh', 'satuan' => 'Celcius', 'nilai_normal' => '36.5 - 37.5', 'status' => 'Aktif'],
            ['nama_item' => 'Tekanan Darah', 'satuan' => 'mmHg', 'nilai_normal' => '120/80', 'status' => 'Aktif'],
            ['nama_item' => 'Gula Darah Puasa', 'satuan' => 'mg/dL', 'nilai_normal' => '70 - 100', 'status' => 'Aktif'],
            ['nama_item' => 'Detak Jantung', 'satuan' => 'bpm', 'nilai_normal' => '60 - 100', 'status' => 'Aktif'],
        ]);

        $this->db->table('m_shift')->insertBatch([
            ['nama_shift' => 'Shift Pagi', 'jam_mulai' => '07:30:00', 'jam_selesai' => '14:30:00', 'status' => 'Aktif'],
            ['nama_shift' => 'Shift Siang', 'jam_mulai' => '14:00:00', 'jam_selesai' => '21:00:00', 'status' => 'Aktif'],
            ['nama_shift' => 'Shift Malam', 'jam_mulai' => '21:00:00', 'jam_selesai' => '07:30:00', 'status' => 'Aktif'],
            ['nama_shift' => 'Full Day (Admin)', 'jam_mulai' => '08:00:00', 'jam_selesai' => '17:00:00', 'status' => 'Aktif'],
        ]);

        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');
    }
}
