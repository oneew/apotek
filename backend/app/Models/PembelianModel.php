<?php

namespace App\Models;

use CodeIgniter\Model;

class PembelianModel extends Model
{
    protected $table            = 't_pembelian';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'no_faktur', 'tanggal_pembelian', 'tanggal_jatuh_tempo', 'supplier_id', 
        'total_tagihan', 'diskon_total', 'pajak', 'grand_total', 
        'status_pembayaran', 'keterangan', 'status', 'po_id'
    ];

    protected $useTimestamps = false;

    public function getAllPembelian($status = null)
    {
        $builder = $this->db->table($this->table . ' t_p')
            ->select('t_p.*, m_s.nama_supplier')
            ->join('m_supplier m_s', 'm_s.id = t_p.supplier_id', 'left')
            ->orderBy('t_p.tanggal_pembelian', 'DESC');

        if ($status === 'Draft') {
            $builder->where('t_p.status', 'Draft');
        }

        return $builder->get()->getResultArray();
    }

    public function getPembelianWithDetail($id)
    {
        $pembelian = $this->db->table($this->table . ' t_p')
            ->select('t_p.*, m_s.nama_supplier')
            ->join('m_supplier m_s', 'm_s.id = t_p.supplier_id', 'left')
            ->where('t_p.id', $id)
            ->get()->getRowArray();

        if ($pembelian) {
            $pembelian['items'] = $this->db->table('t_pembelian_detail d')
                ->select('d.*, m_p.nama_produk')
                ->join('m_produk m_p', 'm_p.id = d.produk_id', 'left')
                ->where('d.pembelian_id', $id)
                ->get()->getResultArray();
        }

        return $pembelian;
    }
}
