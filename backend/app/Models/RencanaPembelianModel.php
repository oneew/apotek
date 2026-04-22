<?php

namespace App\Models;

use CodeIgniter\Model;

class RencanaPembelianModel extends Model
{
    protected $table            = 't_rencana_pembelian';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['no_rencana', 'tanggal', 'keterangan', 'status', 'created_by', 'created_at', 'updated_at'];

    protected $useTimestamps = true;
}
