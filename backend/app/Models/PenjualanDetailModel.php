<?php

namespace App\Models;

use CodeIgniter\Model;

class PenjualanDetailModel extends Model
{
    protected $table            = 't_penjualan_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'penjualan_id', 'produk_id', 'harga_jual', 'qty', 'subtotal', 'diskon_item'
    ];

    protected $useTimestamps = false;
}
