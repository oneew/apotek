<?php

namespace App\Models;

use CodeIgniter\Model;

class JenisAntrianModel extends Model
{
    protected $table            = 'm_jenis_antrian';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_antrian', 'kode_prefix', 'status'];
    protected $useTimestamps    = true;
}
