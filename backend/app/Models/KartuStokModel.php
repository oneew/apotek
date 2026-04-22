<?php

namespace App\Models;

use CodeIgniter\Model;

class KartuStokModel extends Model
{
    protected $table            = 't_kartu_stok';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'produk_id', 'tanggal', 'jenis_mutasi', 'jumlah', 'sisa_stok', 'referensi', 'keterangan'
    ];

    protected $useTimestamps = false;
}
