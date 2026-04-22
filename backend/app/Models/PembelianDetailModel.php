<?php

namespace App\Models;

use CodeIgniter\Model;

class PembelianDetailModel extends Model
{
    protected $table            = 't_pembelian_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'pembelian_id', 'produk_id', 'satuan_id', 'jumlah_beli', 
        'harga_beli_per_satuan', 'diskon', 'subtotal', 'no_batch', 'tanggal_expired'
    ];

    protected $useTimestamps = false;
}
