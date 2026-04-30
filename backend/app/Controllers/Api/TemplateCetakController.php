<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class TemplateCetakController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $data = $db->table('m_template_cetak')->orderBy('updated_at', 'DESC')->get()->getResultArray();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'nama_template' => $input['nama_template'],
            'kode_template' => $input['kode_template'],
            'content_html'  => $input['content_html'],
            'is_default'    => $input['is_default'] ?? false,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ];
        
        // Handle is_default logic: only one default per kode_template category
        if ($data['is_default']) {
            $db->table('m_template_cetak')->where('kode_template', $data['kode_template'])->update(['is_default' => false]);
        }
        
        if ($db->table('m_template_cetak')->insert($data)) {
            return $this->respondCreated(['status' => true, 'message' => 'Template berhasil disimpan']);
        }
        
        return $this->respond(['status' => false, 'message' => 'Gagal menyimpan template'], 500);
    }

    public function update($id = null)
    {
        $input = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $data = [
            'nama_template' => $input['nama_template'],
            'content_html'  => $input['content_html'],
            'is_default'    => $input['is_default'] ?? false,
            'updated_at'    => date('Y-m-d H:i:s'),
        ];
        
        if ($data['is_default']) {
            $existing = $db->table('m_template_cetak')->where('id', $id)->get()->getRowArray();
            if ($existing) {
                $db->table('m_template_cetak')->where('kode_template', $existing['kode_template'])->update(['is_default' => false]);
            }
        }
        
        if ($db->table('m_template_cetak')->update($data, ['id' => $id])) {
            return $this->respond(['status' => true, 'message' => 'Template berhasil diperbarui']);
        }
        
        return $this->respond(['status' => false, 'message' => 'Gagal memperbarui template'], 500);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        if ($db->table('m_template_cetak')->delete(['id' => $id])) {
            return $this->respond(['status' => true, 'message' => 'Template berhasil dihapus']);
        }
        return $this->respond(['status' => false, 'message' => 'Gagal menghapus template'], 500);
    }
}
