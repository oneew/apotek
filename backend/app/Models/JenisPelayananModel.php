<?php

namespace App\Models;

use CodeIgniter\Model;

class JenisPelayananModel extends Model
{
    protected $table            = 'm_jenis_pelayanan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_pelayanan', 'status'];
    protected $useTimestamps    = true;
}
