<?php

namespace App\Models;

use CodeIgniter\Model;

class ArusKasModel extends Model
{
    protected $table            = 't_arus_kas';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['tanggal', 'jenis', 'kategori', 'keterangan', 'jumlah', 'created_at', 'updated_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
