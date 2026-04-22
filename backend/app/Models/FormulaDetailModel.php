<?php

namespace App\Models;

use CodeIgniter\Model;

class FormulaDetailModel extends Model
{
    protected $table            = 'm_formula_detail';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $protectFields    = true;
    protected $allowedFields    = [
        'formula_id', 'produk_id', 'jumlah_formula', 'satuan_id'
    ];

    protected $useTimestamps = false;
}
