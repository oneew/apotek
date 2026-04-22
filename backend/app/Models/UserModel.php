<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'username', 'password', 'role', 'role_id', 'outlet_id'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'id'       => 'permit_empty', // Needed for placeholder substitution in is_unique
        'name'     => 'required|min_length[3]|max_length[100]',
        'username' => 'required|min_length[3]|max_length[50]|is_unique[users.username,id,{id}]',
        'password' => 'permit_empty|min_length[6]', // Made optional for updates
        'role_id'  => 'permit_empty',
    ];

    protected $validationMessages = [
        'username' => [
            'is_unique' => 'Username sudah digunakan',
        ],
    ];

    protected $skipValidation = false;

    /**
     * Hash password before insert
     */
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password']) && !empty($data['data']['password'])) {
            $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_BCRYPT);
        } else {
            // Remove password from data if it's empty to avoid overwriting with empty string
            if (isset($data['data']['password'])) {
                unset($data['data']['password']);
            }
        }
        return $data;
    }
}
