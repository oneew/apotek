<?php

namespace App\Models;

use CodeIgniter\Model;

class KategoriPelangganModel extends Model
{
    protected $table            = 'm_kategori_pelanggan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_kategori', 'potongan_persen'];
    protected $useTimestamps    = true;
}
