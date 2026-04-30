<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 *
 * Extend this class in any new controllers:
 * ```
 *     class Home extends BaseController
 * ```
 *
 * For security, be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */

    // protected $session;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Load here all helpers you want to be available in your controllers that extend BaseController.
        // Caution: Do not put the this below the parent::initController() call below.
        // $this->helpers = ['form', 'url'];

        // Caution: Do not edit this line.
        parent::initController($request, $response, $logger);

        // Preload any models, libraries, etc, here.
        // $this->session = service('session');
    }

    /**
     * Helper to log user activity
     * 
     * @param string $module
     * @param string $activity
     * @param int|null $data_id
     * @param mixed|null $payload
     */
    protected function logActivity($module, $activity, $data_id = null, $payload = null)
    {
        $db = \Config\Database::connect();

        // Get the hash of the most recent log entry for chain linking
        $lastEntry = $db->table('activity_logs')
                        ->select('current_hash')
                        ->orderBy('id', 'DESC')
                        ->limit(1)
                        ->get()->getRowArray();

        $prevHash    = $lastEntry['current_hash'] ?? 'GENESIS';
        $userId      = $this->request->userData->uid ?? null;
        $ipAddress   = $this->request->getIPAddress();
        $timestamp   = date('Y-m-d H:i:s');
        $payloadJson = $payload ? json_encode($payload) : null;

        // Build hash from all key fields + previous hash (immutable chain)
        $hashInput   = implode('|', [$timestamp, $userId ?? '', $module, $activity, $data_id ?? '', $ipAddress, $prevHash]);
        $currentHash = hash('sha256', $hashInput);

        $db->table('activity_logs')->insert([
            'user_id'      => $userId,
            'module'       => $module,
            'activity'     => $activity,
            'data_id'      => $data_id,
            'payload'      => $payloadJson,
            'ip_address'   => $ipAddress,
            'prev_hash'    => $prevHash,
            'current_hash' => $currentHash,
        ]);
    }

    /**
     * Verifies the integrity of the audit log chain.
     * Returns: ['valid' => bool, 'broken_at_id' => int|null, 'total' => int]
     */
    protected function verifyChainIntegrity(): array
    {
        $db   = \Config\Database::connect();
        $logs = $db->table('activity_logs')
                   ->select('id, user_id, module, activity, data_id, ip_address, created_at, prev_hash, current_hash')
                   ->orderBy('id', 'ASC')
                   ->get()->getResultArray();

        $prevHash = 'GENESIS';
        foreach ($logs as $log) {
            $hashInput   = implode('|', [$log['created_at'] ?? '', $log['user_id'] ?? '', $log['module'], $log['activity'], $log['data_id'] ?? '', $log['ip_address'], $prevHash]);
            $expected    = hash('sha256', $hashInput);

            if ($expected !== $log['current_hash']) {
                return ['valid' => false, 'broken_at_id' => (int)$log['id'], 'total' => count($logs)];
            }

            $prevHash = $log['current_hash'];
        }

        return ['valid' => true, 'broken_at_id' => null, 'total' => count($logs)];
    }
}
