<?php

namespace App\Models;

use CodeIgniter\Model;

class ItemPemeriksaanModel extends Model
{
    protected $table            = 'm_item_pemeriksaan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_item', 'satuan', 'nilai_normal', 'status'];
    protected $useTimestamps    = true;
}
