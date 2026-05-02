<?php

namespace App\Traits;

trait Loggable
{
    /**
     * Store current user ID globally for the request lifecycle
     */
    protected static $currentUserId = null;

    public static function setCurrentUser($userId)
    {
        self::$currentUserId = $userId;
    }

    protected function logChange(string $event, array $data)
    {
        $db = \Config\Database::connect();
        
        $module = str_replace(['App\\Models\\', 'Model'], '', get_class($this));
        $dataId = $data['id'] ?? ($data['data']['id'] ?? ($this->insertID ?? null));
        
        $activity = "Database " . strtoupper($event) . " on " . $module;
        
        // Get previous hash for chain integrity
        $lastEntry = $db->table('activity_logs')
                        ->select('current_hash')
                        ->orderBy('id', 'DESC')
                        ->limit(1)
                        ->get()->getRowArray();

        $prevHash    = $lastEntry['current_hash'] ?? 'GENESIS';
        $userId      = self::$currentUserId ?? 1; // Default to admin if null
        $ipAddress   = service('request')->getIPAddress();
        $timestamp   = date('Y-m-d H:i:s');
        $payload     = json_encode($data['data'] ?? $data);

        // Build immutable hash
        $hashInput   = implode('|', [$timestamp, $userId, $module, $activity, $dataId ?? '', $ipAddress, $prevHash]);
        $currentHash = hash('sha256', $hashInput);

        $db->table('activity_logs')->insert([
            'user_id'      => $userId,
            'module'       => $module,
            'activity'     => $activity,
            'data_id'      => $dataId,
            'payload'      => $payload,
            'ip_address'   => $ipAddress,
            'prev_hash'    => $prevHash,
            'current_hash' => $currentHash,
            'created_at'   => $timestamp
        ]);
    }

    /**
     * Hook into CI4 Model events
     */
    protected function initializeLoggable()
    {
        $this->afterInsert[] = 'afterInsertLog';
        $this->afterUpdate[] = 'afterUpdateLog';
        $this->afterDelete[] = 'afterDeleteLog';
    }

    protected function afterInsertLog(array $data)
    {
        $this->logChange('insert', $data);
        return $data;
    }

    protected function afterUpdateLog(array $data)
    {
        $this->logChange('update', $data);
        return $data;
    }

    protected function afterDeleteLog(array $data)
    {
        $this->logChange('delete', $data);
        return $data;
    }
}
