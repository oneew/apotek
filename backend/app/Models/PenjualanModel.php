<?php

namespace App\Models;

use CodeIgniter\Model;

class PenjualanModel extends Model
{
    protected $table            = 't_penjualan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'no_invoice', 'tanggal_penjualan', 'pelanggan_id', 'dokter_id', 
        'total_belanja', 'diskon_nota', 'total_bayar', 'uang_diterima', 
        'uang_kembali', 'jenis_pembayaran', 'status_penjualan', 'keterangan'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    /**
     * Generate Invoice Number
     */
    public function generateInvoiceNumber()
    {
        $date = date('Ymd');
        $lastRow = $this->like('no_invoice', "INV-$date", 'after')->orderBy('id', 'DESC')->first();
        
        if ($lastRow) {
            $lastNo = (int) substr($lastRow['no_invoice'], -4);
            $newNo = str_pad($lastNo + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNo = '0001';
        }

        return "INV-$date-$newNo";
    }
}
