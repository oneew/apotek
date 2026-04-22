<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\PromoModel;
use App\Models\PromoProdukModel;

class PromoController extends BaseController
{
    use ResponseTrait;

    protected $format = 'json';

    public function index()
    {
        $model = new PromoModel();
        return $this->respond([
            'status' => true,
            'data'   => $model->orderBy('created_at', 'DESC')->findAll()
        ]);
    }

    public function show($id = null)
    {
        $model = new PromoModel();
        $promo = $model->find($id);

        if (!$promo) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $produkModel = new PromoProdukModel();
        $produk = $produkModel->getProdukByPromo($id);

        return $this->respond([
            'status' => true,
            'data'   => array_merge($promo, ['items' => $produk])
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $db->transStart();

        $model = new PromoModel();
        $produkModel = new PromoProdukModel();

        $promoData = [
            'nama_promo'      => $data['nama_promo'],
            'jenis_promo'     => $data['jenis_promo'],
            'tanggal_mulai'   => $data['tanggal_mulai'],
            'tanggal_selesai' => $data['tanggal_selesai'],
            'nilai_diskon'    => $data['nilai_diskon'] ?? 0,
            'tipe_nilai'      => $data['tipe_nilai'] ?? 'Persen',
            'status'          => $data['status'] ?? 'Aktif',
            'keterangan'      => $data['keterangan'] ?? '',
        ];

        if (!$model->save($promoData)) {
            return $this->fail($model->errors());
        }

        $promoId = $model->getInsertID();

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                $produkModel->insert([
                    'promo_id'  => $promoId,
                    'produk_id' => $item['produk_id'],
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menyimpan program promo'], 500);
        }

        $this->logActivity('Promo', 'Tambah promo baru: ' . $promoData['nama_promo'], $promoId, $promoData);

        return $this->respondCreated(['status' => true, 'message' => 'Program promo berhasil disimpan', 'id' => $promoId]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $model = new PromoModel();

        if (!$model->find($id)) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($model->update($id, $data)) {
            $this->logActivity('Promo', 'Update promo: ' . ($data['nama_promo'] ?? $id), $id, $data);
            return $this->respond(['status' => true, 'message' => 'Program promo berhasil diupdate']);
        }

        return $this->fail($model->errors());
    }

    public function delete($id = null)
    {
        $model = new PromoModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($model->delete($id)) {
            $this->logActivity('Promo', 'Hapus promo: ' . $data['nama_promo'], $id);
            return $this->respondDeleted(['status' => true, 'message' => 'Program promo berhasil dihapus']);
        }

        return $this->fail($model->errors());
    }
}
