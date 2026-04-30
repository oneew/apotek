<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\StokBatchModel;

class ReturPembelianController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('t_pembelian_retur as r')
            ->select('r.*, s.nama_supplier, p.nama_produk, d.jumlah')
            ->join('m_supplier as s', 's.id = r.supplier_id', 'left')
            ->join('t_pembelian_retur_detail as d', 'd.retur_id = r.id', 'left')
            ->join('m_produk as p', 'p.id = d.produk_id', 'left');
            
        $data = $builder->orderBy('r.tanggal_retur', 'DESC')->get()->getResultArray();
        
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        $stokBatchModel = new StokBatchModel();
        
        $db->transStart();
        
        // 1. Transaction Header
        $returData = [
            'no_retur'      => 'RET-' . date('YmdHis'),
            'supplier_id'   => $input['supplier_id'],
            'pembelian_id'  => $input['pembelian_id'] ?? null,
            'tanggal_retur' => $input['tanggal_retur'] ?? date('Y-m-d H:i:s'),
            'alasan'        => $input['alasan'] ?? 'Retur Ke Supplier',
            'status'        => 'Selesai',
            'created_at'    => date('Y-m-d H:i:s'),
        ];
        
        $returId = $db->table('t_pembelian_retur')->insert($returData);
        $returId = $db->insertID();

        // 2. Details and Stock Adjustment
        foreach ($input['items'] as $item) {
            $db->table('t_pembelian_retur_detail')->insert([
                'retur_id'      => $returId,
                'produk_id'     => $item['produk_id'],
                'stok_batch_id' => $item['stok_batch_id'] ?? null,
                'jumlah'        => $item['jumlah'],
            ]);
            
            // Deduct from stock
            if (!empty($item['stok_batch_id'])) {
                $db->table('t_stok_batch')
                   ->where('id', $item['stok_batch_id'])
                   ->decrement('stok_tersedia', $item['jumlah']);
            }
        }
        
        $db->transComplete();
        
        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menyimpan retur'], 500);
        }
        
        return $this->respondCreated(['status' => true, 'message' => 'Retur berhasil disimpan']);
    }
}
