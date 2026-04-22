<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    protected $format = 'json';

    /**
     * GET /api/dashboard/summary
     * Returns all summary counts and totals for the dashboard
     */
    public function summary()
    {
        try {
            $db = \Config\Database::connect();

            // === COUNTS (safe — countAllResults never fails) ===
            $totalProduk    = $db->table('m_produk')->countAllResults();
            $totalPelanggan = $db->table('m_pelanggan')->countAllResults();
            $totalDokter    = $db->table('m_dokter')->countAllResults();
            $totalSupplier  = $db->table('m_supplier')->countAllResults();
            $totalKategori  = $db->table('m_kategori')->countAllResults();

            // === SALES TODAY ===
            $today = date('Y-m-d');
            $salesTodayRow = $db->table('t_penjualan')
                ->selectSum('total_bayar')
                ->where('DATE(tanggal_penjualan)', $today)
                ->where('status_penjualan', 'Selesai')
                ->get()->getRow();
            $salesTodayTotal = $salesTodayRow ? (float)($salesTodayRow->total_bayar ?? 0) : 0;

            $salesCountToday = $db->table('t_penjualan')
                ->where('DATE(tanggal_penjualan)', $today)
                ->where('status_penjualan', 'Selesai')
                ->countAllResults();

            // === SALES THIS MONTH ===
            $monthStart = date('Y-m-01');
            $salesMonthRow = $db->table('t_penjualan')
                ->selectSum('total_bayar')
                ->where('tanggal_penjualan >=', $monthStart)
                ->where('status_penjualan', 'Selesai')
                ->get()->getRow();
            $salesMonthTotal = $salesMonthRow ? (float)($salesMonthRow->total_bayar ?? 0) : 0;

            $salesCountMonth = $db->table('t_penjualan')
                ->where('tanggal_penjualan >=', $monthStart)
                ->where('status_penjualan', 'Selesai')
                ->countAllResults();

            // === STOCK ALERTS ===
            $totalStokRow = $db->table('t_stok_batch')
                ->selectSum('stok_tersedia')
                ->get()->getRow();
            $totalStokVal = $totalStokRow ? (int)($totalStokRow->stok_tersedia ?? 0) : 0;

            // Stok rendah
            $stokRendahVal = 0;
            try {
                $stokRendahRow = $db->query("
                    SELECT COUNT(*) as total FROM (
                        SELECT produk_id, SUM(stok_tersedia) as total_stok
                        FROM t_stok_batch
                        GROUP BY produk_id
                        HAVING total_stok > 0 AND total_stok <= 5
                    ) sub
                ")->getRow();
                $stokRendahVal = $stokRendahRow ? (int)($stokRendahRow->total ?? 0) : 0;
            } catch (\Exception $e) {
                $stokRendahVal = 0;
            }

            // Stok habis
            $stokHabisVal = 0;
            try {
                $stokHabisRow = $db->query("
                    SELECT COUNT(*) as total FROM m_produk p
                    WHERE p.id NOT IN (
                        SELECT DISTINCT produk_id FROM t_stok_batch WHERE stok_tersedia > 0
                    )
                ")->getRow();
                $stokHabisVal = $stokHabisRow ? (int)($stokHabisRow->total ?? 0) : 0;
            } catch (\Exception $e) {
                $stokHabisVal = 0;
            }

            // Expired
            $expiredSoon = 0;
            $alreadyExpired = 0;
            try {
                $expiredSoon = $db->table('t_stok_batch')
                    ->where('tanggal_expired <=', date('Y-m-d', strtotime('+90 days')))
                    ->where('tanggal_expired >', date('Y-m-d'))
                    ->where('stok_tersedia >', 0)
                    ->countAllResults();
            } catch (\Exception $e) {}

            try {
                $alreadyExpired = $db->table('t_stok_batch')
                    ->where('tanggal_expired <=', date('Y-m-d'))
                    ->where('stok_tersedia >', 0)
                    ->countAllResults();
            } catch (\Exception $e) {}

            // === PURCHASES ===
            $purchasesMonthTotal = 0;
            try {
                $purchasesMonthRow = $db->table('t_pembelian')
                    ->selectSum('total')
                    ->where('created_at >=', $monthStart)
                    ->get()->getRow();
                $purchasesMonthTotal = $purchasesMonthRow ? (float)($purchasesMonthRow->total ?? 0) : 0;
            } catch (\Exception $e) {}

            // === RECENT SALES (last 5) ===
            $recentSales = [];
            try {
                $recentSales = $db->table('t_penjualan')
                    ->orderBy('created_at', 'DESC')
                    ->limit(5)
                    ->get()->getResultArray();
            } catch (\Exception $e) {}

            // === SALES LAST 7 DAYS for chart ===
            $salesChart = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = date('Y-m-d', strtotime("-{$i} days"));
                $dayLabel = date('d/m', strtotime($date));
                $dayTotalVal = 0;
                $dayCount = 0;
                try {
                    $dayTotalRow = $db->table('t_penjualan')
                        ->selectSum('total_bayar')
                        ->where('DATE(tanggal_penjualan)', $date)
                        ->where('status_penjualan', 'Selesai')
                        ->get()->getRow();
                    $dayTotalVal = $dayTotalRow ? (float)($dayTotalRow->total_bayar ?? 0) : 0;
                    $dayCount = $db->table('t_penjualan')
                        ->where('DATE(tanggal_penjualan)', $date)
                        ->where('status_penjualan', 'Selesai')
                        ->countAllResults();
                } catch (\Exception $e) {}
                $salesChart[] = [
                    'name' => $dayLabel,
                    'total' => $dayTotalVal,
                    'frekuensi' => $dayCount,
                ];
            }

            return $this->respond([
                'status' => true,
                'data' => [
                    'counts' => [
                        'produk'     => $totalProduk,
                        'pelanggan'  => $totalPelanggan,
                        'dokter'     => $totalDokter,
                        'supplier'   => $totalSupplier,
                        'kategori'   => $totalKategori,
                    ],
                    'sales' => [
                        'today_total'   => $salesTodayTotal,
                        'today_count'   => $salesCountToday,
                        'month_total'   => $salesMonthTotal,
                        'month_count'   => $salesCountMonth,
                    ],
                    'stock' => [
                        'total'         => $totalStokVal,
                        'rendah'        => $stokRendahVal,
                        'habis'         => $stokHabisVal,
                        'dekat_expired' => $expiredSoon,
                        'sudah_expired' => $alreadyExpired,
                    ],
                    'purchases' => [
                        'month_total' => $purchasesMonthTotal,
                    ],
                    'recent_sales'  => $recentSales,
                    'sales_chart'   => $salesChart,
                ]
            ]);

        } catch (\Exception $e) {
            return $this->respond([
                'status' => false,
                'message' => 'Gagal memuat data dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
}
