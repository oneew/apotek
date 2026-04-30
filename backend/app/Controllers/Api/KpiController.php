<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class KpiController extends BaseController
{
    use ResponseTrait;

    /**
     * GET /api/kpi/dashboard?periode=YYYY-MM
     */
    public function dashboard()
    {
        $db = \Config\Database::connect();
        $periode = $this->request->getVar('periode') ?? date('Y-m');

        // Leaderboard Kasir dari t_penjualan
        $kasirKpi = $db->table('t_penjualan p')
            ->select('MAX(u.username) as username, MAX(COALESCE(mp.nama_lengkap, u.username)) as nama_lengkap, 
                      COUNT(p.id) as total_transaksi, 
                      SUM(p.total_bayar) as total_pendapatan,
                      AVG(p.total_bayar) as rata_rata_transaksi')
            ->join('users u', 'u.id = p.kasir_id', 'left')
            ->join('m_pegawai mp', 'mp.user_id = u.id', 'left')
            ->like('p.tanggal_penjualan', $periode, 'after')
            ->where('p.status_penjualan', 'Selesai')
            ->groupBy('p.kasir_id')
            ->orderBy('total_pendapatan', 'DESC')
            ->get()->getResultArray();

        // Kepatuhan Resep: persentase transaksi yg memiliki nama_dokter diisi
        $resepStats = $db->query("
            SELECT 
                COUNT(*) as total_transaksi,
                SUM(CASE WHEN dokter_id IS NOT NULL THEN 1 ELSE 0 END) as transaksi_dengan_resep
            FROM t_penjualan
            WHERE tanggal_penjualan LIKE '$periode%' AND status_penjualan = 'Selesai'
        ")->getRowArray();
        
        $kepatuhan = 0;
        if ((int)$resepStats['total_transaksi'] > 0) {
            $kepatuhan = round(($resepStats['transaksi_dengan_resep'] / $resepStats['total_transaksi']) * 100, 2);
        }

        // Return Data
        return $this->respond([
            'status' => true,
            'data' => [
                'leaderboard_kasir' => $kasirKpi,
                'kepatuhan_resep'   => $kepatuhan,
                'periode'           => $periode,
                'total_transaksi_all' => $resepStats['total_transaksi'] ?? 0
            ]
        ]);
    }
}
