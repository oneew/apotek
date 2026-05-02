<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class TemplateRacikanController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('m_template_racikan as t')
            ->select('t.*, u.username as pembuat')
            ->join('users as u', 'u.id = t.created_by', 'left')
            ->orderBy('t.nama_template', 'ASC');

        $search = $this->request->getGet('search');
        if ($search) {
            $builder->like('t.nama_template', $search);
        }

        $templates = $builder->get()->getResultArray();
        
        // Count items
        foreach ($templates as &$t) {
            $t['jumlah_item'] = $db->table('m_template_racikan_detail')->where('template_id', $t['id'])->countAllResults();
        }

        return $this->respond(['status' => true, 'data' => $templates]);
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $template = $db->table('m_template_racikan')->where('id', $id)->get()->getRowArray();
        
        if (!$template) return $this->respond(['status' => false, 'message' => 'Template tidak ditemukan'], 404);

        $items = $db->table('m_template_racikan_detail as d')
            ->select('d.*, p.nama_produk, p.sku')
            ->join('m_produk as p', 'p.id = d.produk_id', 'left')
            ->where('d.template_id', $id)
            ->get()->getResultArray();
            
        $template['items'] = $items;

        return $this->respond(['status' => true, 'data' => $template]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $db->transStart();
        
        $templateData = [
            'nama_template' => $data['nama_template'],
            'keterangan'    => $data['keterangan'] ?? '',
            'created_by'    => 1, // Default user id
            'created_at'    => date('Y-m-d H:i:s'),
        ];
        
        $db->table('m_template_racikan')->insert($templateData);
        $templateId = $db->insertID();
        
        if (!empty($data['items']) && is_array($data['items'])) {
            $details = [];
            foreach ($data['items'] as $item) {
                $details[] = [
                    'template_id' => $templateId,
                    'produk_id'   => $item['produk_id'],
                    'jumlah'      => $item['jumlah'] ?? 1,
                    'keterangan'  => $item['keterangan'] ?? ''
                ];
            }
            $db->table('m_template_racikan_detail')->insertBatch($details);
        }
        
        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal membuat template'], 500);
        }

        return $this->respondCreated(['status' => true, 'message' => 'Template berhasil dibuat', 'data' => ['id' => $templateId]]);
    }

    public function delete($id = null)
    {
        $db = \Config\Database::connect();
        
        $db->transStart();
        $db->table('m_template_racikan_detail')->where('template_id', $id)->delete();
        $db->table('m_template_racikan')->where('id', $id)->delete();
        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menghapus template'], 500);
        }

        return $this->respondDeleted(['status' => true, 'message' => 'Template dihapus']);
    }
}
