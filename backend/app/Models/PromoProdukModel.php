<?php

namespace App\Models;

use CodeIgniter\Model;

class PromoProdukModel extends Model
{
    protected $table            = 't_promo_produk';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['promo_id', 'produk_id'];

    public function getProdukByPromo($promoId)
    {
        return $this->select('t_promo_produk.*, m_produk.nama_produk, m_produk.kode_produk')
                    ->join('m_produk', 'm_produk.id = t_promo_produk.produk_id', 'left')
                    ->where('promo_id', $promoId)
                    ->findAll();
    }
}
