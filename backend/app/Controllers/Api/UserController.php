<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\OutletModel;

class UserController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $userModel = new UserModel();
        // Join with outlets and roles
        $users = $userModel->select('users.*, outlets.name as outlet_name, m_role.nama_role as role_name')
                           ->join('outlets', 'outlets.id = users.outlet_id', 'left')
                           ->join('m_role', 'm_role.id = users.role_id', 'left')
                           ->findAll();

        // Remove passwords from response
        foreach ($users as &$user) {
            unset($user['password']);
        }

        return $this->respond([
            'status' => true,
            'data'   => $users
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $userModel = new UserModel();

        if ($userModel->insert($data)) {
            return $this->respond([
                'status'  => true,
                'message' => 'User berhasil ditambahkan'
            ]);
        }

        return $this->respond([
            'status'  => false,
            'message' => 'Gagal menambahkan user',
            'errors'  => $userModel->errors()
        ], 400);
    }

    public function update($id = null)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->respond([
                'status'  => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $data = $this->request->getJSON(true);
        
        // Handle empty password (don't update if blank)
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        }

        $data['id'] = $id; // Add ID for validation placeholder substitution

        if ($userModel->update($id, $data)) {
            return $this->respond([
                'status'  => true,
                'message' => 'User berhasil diperbarui'
            ]);
        }

        return $this->respond([
            'status'  => false,
            'message' => 'Gagal memperbarui user',
            'errors'  => $userModel->errors()
        ], 400);
    }

    public function delete($id = null)
    {
        $userModel = new UserModel();
        if ($userModel->delete($id)) {
            return $this->respond([
                'status'  => true,
                'message' => 'User berhasil dihapus'
            ]);
        }

        return $this->respond([
            'status'  => false,
            'message' => 'Gagal menghapus user'
        ], 500);
    }

    public function outlets()
    {
        $outletModel = new OutletModel();
        return $this->respond([
            'status' => true,
            'data'   => $outletModel->findAll()
        ]);
    }
}
