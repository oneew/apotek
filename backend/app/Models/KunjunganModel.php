<?php

namespace App\Models;

use CodeIgniter\Model;

class KunjunganModel extends Model
{
    protected $table            = 't_kunjungan';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'nomor_antrian',
        'tanggal_kunjungan',
        'jenis_antrian_id',
        'jenis_pelayanan_id',
        'pelanggan_id',
        'dokter_id',
        'keluhan',
        'catatan',
        'status',
        'posisi'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getKunjunganWithDetails($search = null, $date = null)
    {
        $builder = $this->db->table($this->table . ' t')
            ->select('t.*, ja.nama_antrian, ja.kode_prefix, jp.nama_pelayanan, p.nama_pelanggan, d.nama_dokter')
            ->join('m_jenis_antrian ja', 'ja.id = t.jenis_antrian_id', 'left')
            ->join('m_jenis_pelayanan jp', 'jp.id = t.jenis_pelayanan_id', 'left')
            ->join('m_pelanggan p', 'p.id = t.pelanggan_id', 'left')
            ->join('m_dokter d', 'd.id = t.dokter_id', 'left');

        if ($search) {
            $builder->groupStart()
                ->like('t.nomor_antrian', $search)
                ->orLike('p.nama_pelanggan', $search)
                ->orLike('ja.nama_antrian', $search)
                ->orLike('jp.nama_pelayanan', $search)
                ->groupEnd();
        }

        if ($date) {
            $builder->where('DATE(t.tanggal_kunjungan)', $date);
        }

        return $builder->orderBy('t.created_at', 'DESC')->get()->getResultArray();
    }
}
