<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class AuditTrailController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $logs = $db->table('activity_logs as a')
                   ->select('a.*, u.username, u.nama_lengkap')
                   ->join('m_users as u', 'u.id = a.user_id', 'left')
                   ->orderBy('a.id', 'DESC')
                   ->limit(500)
                   ->get()->getResultArray();

        return $this->respond([
            'status' => true,
            'data' => $logs
        ]);
    }

    public function verify()
    {
        $result = $this->verifyChainIntegrity();

        if ($result['valid']) {
            return $this->respond([
                'status' => true,
                'message' => 'System integrity valid. ' . $result['total'] . ' data blocks passed cryptographic checks.',
                'broken_at_id' => null
            ]);
        } else {
            return $this->respond([
                'status' => false,
                'message' => 'INTEGRITY COMPROMISED. Hash chain broke at Block ID: ' . $result['broken_at_id'],
                'broken_at_id' => $result['broken_at_id']
            ]);
        }
    }
}
