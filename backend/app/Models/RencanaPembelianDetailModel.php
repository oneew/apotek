<?php

namespace App\Models;

use CodeIgniter\Model;

class RencanaPembelianDetailModel extends Model
{
    protected $table            = 't_rencana_pembelian_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['rencana_id', 'produk_id', 'jumlah', 'satuan_id', 'supplier_id'];

    protected $useTimestamps = false;
}
