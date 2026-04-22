<?php

namespace App\Models;

use CodeIgniter\Model;

class RoleAksesModel extends Model
{
    protected $table            = 'm_role_akses';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['role_id', 'menu_key', 'can_view', 'can_create', 'can_edit', 'can_delete'];

    protected $useTimestamps = false;
}
