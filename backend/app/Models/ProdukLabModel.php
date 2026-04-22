<?php

namespace App\Models;

use CodeIgniter\Model;

class ProdukLabModel extends Model
{
    protected $table            = 'm_produk_lab';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['kode_produk', 'nama_produk', 'harga', 'status'];
    protected $useTimestamps    = true;
}
