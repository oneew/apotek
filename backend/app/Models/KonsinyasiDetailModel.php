<?php

namespace App\Models;

use CodeIgniter\Model;

class KonsinyasiDetailModel extends Model
{
    protected $table            = 't_konsinyasi_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['konsinyasi_id', 'produk_id', 'satuan_id', 'qty', 'harga_beli', 'subtotal', 'no_batch', 'tgl_expired'];

    public function getDetailsByKonsinyasiId($id)
    {
        return $this->select('t_konsinyasi_detail.*, m_produk.nama_produk, m_satuan.nama_satuan')
                    ->join('m_produk', 'm_produk.id = t_konsinyasi_detail.produk_id', 'left')
                    ->join('m_satuan', 'm_satuan.id = t_konsinyasi_detail.satuan_id', 'left')
                    ->where('konsinyasi_id', $id)
                    ->findAll();
    }
}
