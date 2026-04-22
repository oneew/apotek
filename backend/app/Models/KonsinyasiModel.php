<?php

namespace App\Models;

use CodeIgniter\Model;

class KonsinyasiModel extends Model
{
    protected $table            = 't_konsinyasi';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['no_faktur', 'tanggal', 'supplier_id', 'total_nilai', 'status', 'keterangan', 'created_at', 'updated_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getConsignmentsWithSupplier()
    {
        return $this->select('t_konsinyasi.*, m_supplier.nama_supplier')
                    ->join('m_supplier', 'm_supplier.id = t_konsinyasi.supplier_id', 'left')
                    ->orderBy('t_konsinyasi.created_at', 'DESC')
                    ->findAll();
    }
}
