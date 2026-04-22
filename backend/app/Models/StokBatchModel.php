<?php

namespace App\Models;

use CodeIgniter\Model;

class StokBatchModel extends Model
{
    protected $table            = 't_stok_batch';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'produk_id', 'no_batch', 'tanggal_expired', 'stok_tersedia'
    ];

    protected $useTimestamps = false;
}
