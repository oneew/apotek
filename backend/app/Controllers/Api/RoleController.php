<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RoleModel;
use App\Models\RoleAksesModel;

class RoleController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $roleModel = new RoleModel();
        return $this->respond([
            'status' => true,
            'data'   => $roleModel->findAll()
        ]);
    }

    public function show($id = null)
    {
        $roleModel = new RoleModel();
        $role = $roleModel->find($id);

        if (!$role) {
            return $this->respond(['status' => false, 'message' => 'Role tidak ditemukan'], 404);
        }

        $aksesModel = new RoleAksesModel();
        $role['permissions'] = $aksesModel->where('role_id', $id)->findAll();

        return $this->respond([
            'status' => true,
            'data'   => $role
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $roleModel = new RoleModel();

        if ($roleId = $roleModel->insert($data)) {
            // Optional: Insert default empty permissions for new role
            return $this->respond([
                'status'  => true,
                'message' => 'Role berhasil ditambahkan',
                'id'      => $roleId
            ]);
        }

        return $this->respond(['status' => false, 'message' => 'Gagal menambahkan role'], 400);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $roleModel = new RoleModel();

        if ($roleModel->update($id, $data)) {
            return $this->respond(['status' => true, 'message' => 'Role berhasil diperbarui']);
        }

        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui role'], 400);
    }

    public function delete($id = null)
    {
        $roleModel = new RoleModel();
        if ($roleModel->delete($id)) {
            return $this->respond(['status' => true, 'message' => 'Role berhasil dihapus']);
        }

        return $this->respond(['status' => false, 'message' => 'Gagal menghapus role'], 400);
    }

    /**
     * Update permissions for a role
     * POST /api/master/roles/permissions/:id
     */
    public function update_permissions($id = null)
    {
        $data = $this->request->getJSON(true); // Expects array of permission objects
        $aksesModel = new RoleAksesModel();

        // 1. Delete existing for this role
        $aksesModel->where('role_id', $id)->delete();

        // 2. Insert new
        $toInsert = [];
        foreach ($data['permissions'] as $p) {
            $toInsert[] = [
                'role_id'    => $id,
                'menu_key'   => $p['menu_key'],
                'can_view'   => $p['can_view'] ? 1 : 0,
                'can_create' => $p['can_create'] ? 1 : 0,
                'can_edit'   => $p['can_edit'] ? 1 : 0,
                'can_delete' => $p['can_delete'] ? 1 : 0,
            ];
        }

        if ($aksesModel->insertBatch($toInsert)) {
            return $this->respond(['status' => true, 'message' => 'Hak akses berhasil diperbarui']);
        }

        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui hak akses'], 400);
    }
}
