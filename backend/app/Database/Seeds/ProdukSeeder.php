<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ProdukSeeder extends Seeder
{
    public function run()
    {
        $this->db->query('SET FOREIGN_KEY_CHECKS=0;');
        $this->db->table('m_produk')->truncate();
        $this->db->query('SET FOREIGN_KEY_CHECKS=1;');

        $data = [
            // --- Tipe: Obat ---
            [
                'tipe_produk' => 'obat',
                'nama_produk' => 'Paracetamol 500mg',
                'pabrik_prinsipal' => 'Kimia Farma',
                'sku' => 'OBT-001',
                'barcode' => '8991234567891',
                'kategori_1_id' => 2, // Obat Bebas
                'satuan_utama_id' => 2, // Strip
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 5000,
                'stok_minimal' => 10,
                'stok_maksimal' => 100,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
            [
                'tipe_produk' => 'obat',
                'nama_produk' => 'Amoxicillin 500mg',
                'pabrik_prinsipal' => 'Kalbe Farma',
                'sku' => 'OBT-002',
                'barcode' => '8991234567892',
                'kategori_1_id' => 1, // Obat Keras
                'satuan_utama_id' => 2, // Strip
                'lokasi_rak_id' => 2,
                'harga_beli_referensi' => 12000,
                'stok_minimal' => 5,
                'stok_maksimal' => 50,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'ya',
            ],
            [
                'tipe_produk' => 'obat',
                'nama_produk' => 'OBH Combi 100ml',
                'pabrik_prinsipal' => 'Combiphar',
                'sku' => 'OBT-003',
                'barcode' => '8991234567893',
                'kategori_1_id' => 3, // Obat Bebas Terbatas
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 15000,
                'stok_minimal' => 10,
                'stok_maksimal' => 30,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],

            // --- Tipe: Alat Kesehatan (alkes) ---
            [
                'tipe_produk' => 'alkes',
                'nama_produk' => 'Masker Sensi 3-Ply',
                'pabrik_prinsipal' => 'Arista Latindo',
                'sku' => 'ALK-001',
                'barcode' => '8992234567891',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 1, // Box
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 25000,
                'stok_minimal' => 5,
                'stok_maksimal' => 20,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
            [
                'tipe_produk' => 'alkes',
                'nama_produk' => 'Hand Sanitizer 500ml',
                'pabrik_prinsipal' => 'Antis',
                'sku' => 'ALK-002',
                'barcode' => '8992234567892',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 35000,
                'stok_minimal' => 10,
                'stok_maksimal' => 50,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
            [
                'tipe_produk' => 'alkes',
                'nama_produk' => 'Termometer Digital',
                'pabrik_prinsipal' => 'Omron',
                'sku' => 'ALK-003',
                'barcode' => '8992234567893',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 2,
                'harga_beli_referensi' => 45000,
                'stok_minimal' => 2,
                'stok_maksimal' => 10,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],

            // --- Tipe: Umum ---
            [
                'tipe_produk' => 'umum',
                'nama_produk' => 'Susu Beruang (Bear Brand)',
                'pabrik_prinsipal' => 'Nestle',
                'sku' => 'LNN-001',
                'barcode' => '8993234567891',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 9500,
                'stok_minimal' => 24,
                'stok_maksimal' => 120,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
            [
                'tipe_produk' => 'umum',
                'nama_produk' => 'Madu TJ Kurma 250g',
                'pabrik_prinsipal' => 'Tresno Joyo',
                'sku' => 'LNN-002',
                'barcode' => '8993234567892',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 22000,
                'stok_minimal' => 6,
                'stok_maksimal' => 24,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
            [
                'tipe_produk' => 'umum',
                'nama_produk' => 'Pocari Sweat 500ml',
                'pabrik_prinsipal' => 'Otsuka',
                'sku' => 'LNN-003',
                'barcode' => '8993234567893',
                'kategori_1_id' => 2,
                'satuan_utama_id' => 3, // Pcs
                'lokasi_rak_id' => 1,
                'harga_beli_referensi' => 7000,
                'stok_minimal' => 12,
                'stok_maksimal' => 48,
                'is_dijual' => 'ya',
                'is_tampil_katalog' => 'ya',
                'is_wajib_resep' => 'tidak',
            ],
        ];

        $this->db->table('m_produk')->insertBatch($data);
    }
}
