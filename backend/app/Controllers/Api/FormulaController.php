<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\FormulaModel;
use App\Models\FormulaDetailModel;

class FormulaController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('m_formula as f')
            ->select('f.*, p.nama_produk as hasil_produk, p.harga_beli_referensi')
            ->join('m_produk as p', 'p.id = f.produk_id', 'left');
        
        $data = $builder->get()->getResultArray();
        
        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function show($id = null)
    {
        $model = new FormulaModel();
        $data = $model->find($id);
        
        if (!$data) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $db = \Config\Database::connect();
        $items = $db->table('m_formula_detail as d')
            ->select('d.*, p.nama_produk, s.nama_satuan')
            ->join('m_produk as p', 'p.id = d.produk_id', 'left')
            ->join('m_satuan as s', 's.id = d.satuan_id', 'left')
            ->where('d.formula_id', $id)
            ->get()->getResultArray();

        $data['items'] = $items;

        return $this->respond([
            'status' => true,
            'data'   => $data
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();
        
        $db->transStart();
        
        $formulaModel = new FormulaModel();
        $formulaId = $formulaModel->insert((object)[
            'produk_id' => $data['produk_id'],
            'nama_formula' => $data['nama_formula'],
            'keterangan' => $data['keterangan'] ?? ''
        ]);

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                $db->table('m_formula_detail')->insert([
                    'formula_id' => $formulaId,
                    'produk_id' => $item['produk_id'],
                    'jumlah_formula' => $item['jumlah_formula'],
                    'satuan_id' => $item['satuan_id']
                ]);
            }
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Gagal menyimpan formula'], 500);
        }

        $this->logActivity('Master Formula', 'Tambah formula racikan: ' . $data['nama_formula'], $formulaId, $data);

        return $this->respond([
            'status' => true,
            'message' => 'Formula berhasil disimpan',
            'data' => ['id' => $formulaId]
        ]);
    }

    public function delete($id = null)
    {
        $model = new FormulaModel();
        $data = $model->find($id);
        
        if (!$data) {
            return $this->respond(['status' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $db = \Config\Database::connect();
        $db->transStart();
        $db->table('m_formula_detail')->where('formula_id', $id)->delete();
        $model->delete($id);
        $db->transComplete();

        $this->logActivity('Master Formula', 'Hapus formula racikan: ' . $data['nama_formula'], $id);

        return $this->respond([
            'status' => true,
            'message' => 'Formula berhasil dihapus'
        ]);
    }
}
