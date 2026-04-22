<?php

namespace App\Models;

use CodeIgniter\Model;

class RakModel extends Model
{
    protected $table            = 'm_rak';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['kode_rak', 'nama_rak', 'keterangan'];
    protected $useTimestamps    = false;
}
