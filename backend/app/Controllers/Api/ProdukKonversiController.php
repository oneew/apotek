<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

/**
 * ProdukKonversiController
 * 
 * Mengelola konversi satuan produk (satuan beli → satuan terkecil).
 * Contoh: 1 Strip = 10 Tablet, 1 Box = 100 Tablet
 */
class ProdukKonversiController extends BaseController
{
    use ResponseTrait;
    protected $format = 'json';

    /**
     * GET /api/produk/konversi/{produk_id}
     * Ambil semua konversi satuan untuk 1 produk
     */
    public function getByProduk($produk_id = null)
    {
        $db = \Config\Database::connect();

        // Cek produk ada
        $produk = $db->table('m_produk')
            ->select('id, nama_produk, satuan_utama_id')
            ->join('m_satuan', 'm_satuan.id = m_produk.satuan_utama_id', 'left')
            ->select('m_satuan.nama_satuan as satuan_terkecil')
            ->where('m_produk.id', $produk_id)
            ->get()->getRowArray();

        if (!$produk) {
            return $this->respond(['status' => false, 'message' => 'Produk tidak ditemukan'], 404);
        }

        $konversi = $db->table('m_produk_konversi')
            ->where('produk_id', $produk_id)
            ->orderBy('is_default_beli', 'DESC')
            ->orderBy('isi', 'ASC')
            ->get()->getResultArray();

        return $this->respond([
            'status'         => true,
            'produk_id'      => (int) $produk_id,
            'satuan_terkecil'=> $produk['satuan_terkecil'],
            'data'           => $konversi
        ]);
    }

    /**
     * POST /api/produk/konversi/{produk_id}
     * Tambah konversi satuan baru
     * Body: { nama_satuan_beli: "Strip", isi: 10, is_default_beli: true }
     */
    public function create($produk_id = null)
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);

        if (empty($data['nama_satuan_beli']) || empty($data['isi'])) {
            return $this->respond([
                'status'  => false,
                'message' => 'nama_satuan_beli dan isi wajib diisi'
            ], 400);
        }

        // Jika set sebagai default, reset default lain
        if (!empty($data['is_default_beli'])) {
            $db->table('m_produk_konversi')
               ->where('produk_id', $produk_id)
               ->update(['is_default_beli' => 0]);
        }

        $insertId = $db->table('m_produk_konversi')->insert([
            'produk_id'        => (int) $produk_id,
            'nama_satuan_beli' => trim($data['nama_satuan_beli']),
            'isi'              => (int) $data['isi'],
            'is_default_beli'  => !empty($data['is_default_beli']) ? 1 : 0,
        ]);

        $this->logActivity(
            'Konversi Satuan',
            "Tambah konversi: 1 {$data['nama_satuan_beli']} = {$data['isi']} satuan terkecil (Produk ID: {$produk_id})",
            $insertId
        );

        return $this->respondCreated([
            'status'  => true,
            'message' => 'Konversi satuan berhasil ditambahkan',
            'id'      => $db->insertID()
        ]);
    }

    /**
     * PUT /api/produk/konversi/{id}
     * Update konversi satuan
     */
    public function update($id = null)
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);

        $existing = $db->table('m_produk_konversi')->where('id', $id)->get()->getRowArray();
        if (!$existing) {
            return $this->respond(['status' => false, 'message' => 'Konversi tidak ditemukan'], 404);
        }

        // Jika set sebagai default, reset default lain
        if (!empty($data['is_default_beli'])) {
            $db->table('m_produk_konversi')
               ->where('produk_id', $existing['produk_id'])
               ->where('id !=', $id)
               ->update(['is_default_beli' => 0]);
        }

        $db->table('m_produk_konversi')->where('id', $id)->update([
            'nama_satuan_beli' => $data['nama_satuan_beli'] ?? $existing['nama_satuan_beli'],
            'isi'              => isset($data['isi']) ? (int) $data['isi'] : $existing['isi'],
            'is_default_beli'  => !empty($data['is_default_beli']) ? 1 : 0,
        ]);

        return $this->respond(['status' => true, 'message' => 'Konversi satuan berhasil diperbarui']);
    }

    /**
     * DELETE /api/produk/konversi/{id}
     * Hapus konversi satuan
     */
    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        $existing = $db->table('m_produk_konversi')->where('id', $id)->get()->getRowArray();
        if (!$existing) {
            return $this->respond(['status' => false, 'message' => 'Konversi tidak ditemukan'], 404);
        }

        $db->table('m_produk_konversi')->where('id', $id)->delete();
        $this->logActivity('Konversi Satuan', "Hapus konversi ID: {$id}", $id);

        return $this->respond(['status' => true, 'message' => 'Konversi satuan berhasil dihapus']);
    }

    /**
     * POST /api/produk/konversi/batch/{produk_id}
     * Replace semua konversi untuk 1 produk sekaligus (dari form produk)
     * Body: { konversi: [ { nama_satuan_beli, isi, is_default_beli } ] }
     */
    public function saveBatch($produk_id = null)
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON(true);

        if (!isset($data['konversi']) || !is_array($data['konversi'])) {
            return $this->respond(['status' => false, 'message' => 'Data konversi tidak valid'], 400);
        }

        // Hapus semua konversi lama
        $db->table('m_produk_konversi')->where('produk_id', $produk_id)->delete();

        // Insert baru
        foreach ($data['konversi'] as $k) {
            if (empty($k['nama_satuan_beli']) || empty($k['isi'])) continue;
            $db->table('m_produk_konversi')->insert([
                'produk_id'        => (int) $produk_id,
                'nama_satuan_beli' => trim($k['nama_satuan_beli']),
                'isi'              => (int) $k['isi'],
                'is_default_beli'  => !empty($k['is_default_beli']) ? 1 : 0,
            ]);
        }

        $this->logActivity('Konversi Satuan', "Batch update konversi untuk Produk ID: {$produk_id}", $produk_id, $data);

        return $this->respond([
            'status'  => true,
            'message' => 'Konversi satuan berhasil disimpan',
            'count'   => count($data['konversi'])
        ]);
    }
}
