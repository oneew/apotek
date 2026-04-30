<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class FefoController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function dashboard()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('m_produk')->select('id, nama_produk, sku, batch_number, tanggal_kadaluarsa')->where('is_dijual', 'ya')->where('tanggal_kadaluarsa IS NOT NULL');
        
        $products = $builder->orderBy('tanggal_kadaluarsa', 'ASC')->get()->getResultArray();
        
        $today = new \DateTime();
        
        $summary = [
            'expired' => [],
            'critical' => [], // < 30 days
            'warning' => [],  // < 90 days
            'safe' => []
        ];
        
        foreach ($products as $p) {
            $expDate = new \DateTime($p['tanggal_kadaluarsa']);
            $interval = $today->diff($expDate);
            $daysLeft = (int)$interval->format('%R%a');
            
            $p['days_left'] = $daysLeft;
            
            if ($daysLeft < 0) {
                $summary['expired'][] = $p;
            } elseif ($daysLeft <= 30) {
                $summary['critical'][] = $p;
            } elseif ($daysLeft <= 90) {
                $summary['warning'][] = $p;
            } else {
                $summary['safe'][] = $p;
            }
        }
        
        // Cek perlu kirim alert WA atau tidak?
        // Simulasikan kalau critical ada yang baru saja masuk array (biasanya pakai cron job)

        return $this->respond([
            'status' => true,
            'data' => [
                'counts' => [
                    'expired' => count($summary['expired']),
                    'critical' => count($summary['critical']),
                    'warning' => count($summary['warning']),
                    'safe' => count($summary['safe']),
                ],
                'details' => $summary
            ]
        ]);
    }
    
    public function seedExpiry()
    {
        // Seeder dummy untuk simulasi presentasi
        $db = \Config\Database::connect();
        $db->table('m_produk')->where('id', 1)->update(['batch_number' => 'BCH-001', 'tanggal_kadaluarsa' => date('Y-m-d', strtotime('-5 days'))]);   // Expired
        $db->table('m_produk')->where('id', 2)->update(['batch_number' => 'BCH-002', 'tanggal_kadaluarsa' => date('Y-m-d', strtotime('+15 days'))]);  // Critical
        $db->table('m_produk')->where('id', 3)->update(['batch_number' => 'BCH-003', 'tanggal_kadaluarsa' => date('Y-m-d', strtotime('+45 days'))]);  // Warning
        $db->table('m_produk')->where('id', 4)->update(['batch_number' => 'BCH-004', 'tanggal_kadaluarsa' => date('Y-m-d', strtotime('+120 days'))]); // Safe
        
        return $this->respond(['status' => true, 'message' => 'FEFO data seeded.']);
    }
}
