<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PesananPembelianModel;
use App\Models\PesananPembelianDetailModel;
use App\Models\RencanaPembelianModel;

class PesananPembelianController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new PesananPembelianModel();
        $data = $model->select('t_pesanan_pembelian.*, m_supplier.nama_supplier')
            ->join('m_supplier', 'm_supplier.id = t_pesanan_pembelian.supplier_id', 'left')
            ->orderBy('t_pesanan_pembelian.created_at', 'DESC')
            ->findAll();
        return $this->respond([
            'status' => true,
            'data' => $data
        ]);
    }

    public function create()
    {
        $payload = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        $db->transStart();

        $poModel = new PesananPembelianModel();
        $poDetailModel = new PesananPembelianDetailModel();

        // No PO Generator
        $date = date('Ymd');
        $count = $poModel->where('DATE(created_at)', date('Y-m-d'))->countAllResults() + 1;
        $noPO = "PO-{$date}-" . str_pad($count, 3, '0', STR_PAD_LEFT);

        $poId = $poModel->insert((object)[
            'no_po' => $noPO,
            'rencana_id' => $payload['rencana_id'] ?? null,
            'supplier_id' => $payload['supplier_id'],
            'tanggal_po' => $payload['tanggal_po'] ?? date('Y-m-d'),
            'total_estimate' => $payload['total_estimate'] ?? 0,
            'status' => 'Open',
            'keterangan' => $payload['keterangan'] ?? '',
            'created_by' => 1
        ]);

        foreach ($payload['items'] as $item) {
            $poDetailModel->insert((object)[
                'po_id' => $poId,
                'produk_id' => $item['produk_id'],
                'jumlah' => $item['qty'],
                'satuan_id' => $item['satuan_id'] ?? null,
                'harga_estimate' => $item['harga_estimate'] ?? 0,
                'subtotal' => $item['subtotal'] ?? 0
            ]);
        }

        // If from Rencana, update Rencana status
        if (!empty($payload['rencana_id'])) {
            $rencanaModel = new RencanaPembelianModel();
            $rencanaModel->update($payload['rencana_id'], (object)['status' => 'Ordered']);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menyimpan pesanan pembelian');
        }

        return $this->respondCreated(['status' => true, 'id' => $poId, 'message' => 'Pesanan pembelian berhasil dibuat']);
    }

    public function show($id = null)
    {
        $model = new PesananPembelianModel();
        $detailModel = new PesananPembelianDetailModel();

        $data = $model->select('t_pesanan_pembelian.*, m_supplier.nama_supplier')
            ->join('m_supplier', 'm_supplier.id = t_pesanan_pembelian.supplier_id', 'left')
            ->find($id);
            
        if (!$data) return $this->failNotFound('Data tidak ditemukan');

        $data['items'] = $detailModel->select('t_pesanan_pembelian_detail.*, m_produk.nama_produk')
            ->join('m_produk', 'm_produk.id = t_pesanan_pembelian_detail.produk_id', 'left')
            ->where('po_id', $id)
            ->findAll();

        return $this->respond(['status' => true, 'data' => $data]);
    }
}
