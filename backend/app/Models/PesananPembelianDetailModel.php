<?php

namespace App\Models;

use CodeIgniter\Model;

class PesananPembelianDetailModel extends Model
{
    protected $table            = 't_pesanan_pembelian_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['po_id', 'produk_id', 'jumlah', 'satuan_id', 'harga_estimate', 'subtotal'];

    protected $useTimestamps = false;
}
