<?php

namespace App\Models;

use CodeIgniter\Model;

class ActivityLogModel extends Model
{
    protected $table            = 'activity_logs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['user_id', 'activity', 'module', 'data_id', 'payload', 'ip_address', 'created_at'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdAtField  = 'created_at';
    protected $updatedAtField  = 'updated_at';
    protected $deletedAtField  = '';

    public function getLogsWithUser()
    {
        return $this->select('activity_logs.*, users.username')
                    ->join('users', 'users.id = activity_logs.user_id', 'left')
                    ->orderBy('activity_logs.created_at', 'DESC')
                    ->findAll();
    }
}
