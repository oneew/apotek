<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\KonsinyasiModel;
use App\Models\KonsinyasiDetailModel;

class KonsinyasiController extends BaseController
{
    use ResponseTrait;

    protected $format = 'json';

    public function stok()
    {
        $db = \Config\Database::connect();
        $data = $db->table('t_konsinyasi_detail det')
            ->select('det.produk_id, p.nama_produk, p.sku, s.nama_satuan, SUM(det.qty) as total_masuk, sup.nama_supplier')
            ->join('t_konsinyasi k', 'k.id = det.konsinyasi_id')
            ->join('m_produk p', 'p.id = det.produk_id')
            ->join('m_satuan s', 's.id = det.satuan_id')
            ->join('m_supplier sup', 'sup.id = k.supplier_id')
            ->groupBy('det.produk_id, det.satuan_id, k.supplier_id')
            ->get()->getResultArray();

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function index()
    {
        $model = new KonsinyasiModel();
        $data = $model->getConsignmentsWithSupplier();

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function show($id = null)
    {
        $model = new KonsinyasiModel();
        $konsinyasi = $model->select('t_konsinyasi.*, m_supplier.nama_supplier')
                            ->join('m_supplier', 'm_supplier.id = t_konsinyasi.supplier_id', 'left')
                            ->find($id);

        if (!$konsinyasi) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $detailModel = new KonsinyasiDetailModel();
        $details = $detailModel->getDetailsByKonsinyasiId($id);

        return $this->respond([
            'status' => true,
            'data'   => array_merge($konsinyasi, ['items' => $details])
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $db->transStart();

        $model = new KonsinyasiModel();
        $detailModel = new KonsinyasiDetailModel();

        $konsinyasiData = [
            'no_faktur'   => $data['no_faktur'],
            'tanggal'     => $data['tanggal'] ?? date('Y-m-d H:i:s'),
            'supplier_id' => $data['supplier_id'],
            'total_nilai' => $data['total_nilai'] ?? 0,
            'status'      => $data['status'] ?? 'Pending',
            'keterangan'  => $data['keterangan'] ?? '',
        ];

        if (!$model->save($konsinyasiData)) {
            return $this->fail($model->errors());
        }

        $konsinyasiId = $model->getInsertID();

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                $detailModel->insert([
                    'konsinyasi_id' => $konsinyasiId,
                    'produk_id'     => $item['produk_id'],
                    'satuan_id'     => $item['satuan_id'],
                    'qty'           => $item['qty'],
                    'harga_beli'    => $item['harga_beli'],
                    'subtotal'      => $item['qty'] * $item['harga_beli'],
                    'no_batch'      => $item['no_batch'] ?? '',
                    'tgl_expired'   => $item['tgl_expired'] ?? null,
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menyimpan konsinyasi'], 500);
        }

        $this->logActivity('Konsinyasi', 'Tambah konsinyasi baru: ' . $konsinyasiData['no_faktur'], $konsinyasiId, $konsinyasiData);

        return $this->respondCreated(['status' => true, 'message' => 'Konsinyasi berhasil disimpan', 'id' => $konsinyasiId]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $model = new KonsinyasiModel();

        if (!$model->find($id)) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($model->update($id, $data)) {
            $this->logActivity('Konsinyasi', 'Update konsinyasi: ' . ($data['no_faktur'] ?? $id), $id, $data);
            return $this->respond(['status' => true, 'message' => 'Konsinyasi berhasil diupdate']);
        }

        return $this->fail($model->errors());
    }

    public function delete($id = null)
    {
        $model = new KonsinyasiModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($model->delete($id)) {
            $this->logActivity('Konsinyasi', 'Hapus konsinyasi: ' . $data['no_faktur'], $id);
            return $this->respondDeleted(['status' => true, 'message' => 'Konsinyasi berhasil dihapus']);
        }

        return $this->fail($model->errors());
    }
}
