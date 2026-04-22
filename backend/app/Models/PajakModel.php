<?php

namespace App\Models;

use CodeIgniter\Model;

class PajakModel extends Model
{
    protected $table            = 'm_pajak';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_pajak', 'persentase', 'status'];
    protected $useTimestamps    = true;
}
