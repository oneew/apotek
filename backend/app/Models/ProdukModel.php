<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Traits\Loggable;

class ProdukModel extends Model
{
    use Loggable;

    protected $table            = 'm_produk';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'tipe_produk', 'nama_produk', 'pabrik_prinsipal', 'sku', 'barcode',
        'kategori_1_id', 'kategori_2_id', 'kategori_3_id', 'satuan_utama_id',
        'harga_beli_referensi', 'reorder_point', 'kfa_code', 'kfa_name',
        'stok_minimal', 'stok_maksimal', 'target_periode_pembelian',
        'lokasi_rak_id', 'is_dijual', 'is_tampil_katalog', 'is_wajib_resep',
        'zat_aktif', 'bentuk_sediaan', 'komisi_jenis', 'komisi_nilai'
    ];

    protected $useTimestamps = false; 

    public function __construct()
    {
        parent::__construct();
        $this->initializeLoggable();
    }
}
