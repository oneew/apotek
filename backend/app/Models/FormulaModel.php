<?php

namespace App\Models;

use CodeIgniter\Model;

class FormulaModel extends Model
{
    protected $table            = 'm_formula';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $protectFields    = true;
    protected $allowedFields    = [
        'produk_id', 'nama_formula', 'keterangan'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
