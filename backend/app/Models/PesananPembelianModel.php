<?php

namespace App\Models;

use CodeIgniter\Model;

class PesananPembelianModel extends Model
{
    protected $table            = 't_pesanan_pembelian';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['no_po', 'rencana_id', 'supplier_id', 'tanggal_po', 'total_estimate', 'status', 'keterangan', 'created_by', 'created_at', 'updated_at'];

    protected $useTimestamps = true;
}
