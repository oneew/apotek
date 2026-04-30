<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Services\WhatsappService;

class WhatsappController extends BaseController
{
    use ResponseTrait;

    private WhatsappService $wa;

    public function __construct()
    {
        $this->wa = new WhatsappService();
    }

    /**
     * GET /api/master/whatsapp/settings
     */
    public function settings()
    {
        $db = \Config\Database::connect();
        $rows = $db->table('t_wa_settings')->get()->getResultArray();
        $config = array_column($rows, 'config_val', 'config_key');

        return $this->respond(['status' => true, 'data' => $config]);
    }

    /**
     * POST /api/master/whatsapp/settings
     */
    public function saveSettings()
    {
        $data = $this->request->getJSON(true);
        $db   = \Config\Database::connect();

        foreach ($data as $key => $val) {
            $db->table('t_wa_settings')
               ->where('config_key', $key)
               ->update(['config_val' => $val, 'updated_at' => date('Y-m-d H:i:s')]);
        }

        $this->logActivity('WhatsApp Gateway', 'Update konfigurasi WA Gateway');

        return $this->respond(['status' => true, 'message' => 'Konfigurasi berhasil disimpan.']);
    }

    /**
     * POST /api/master/whatsapp/test
     */
    public function testSend()
    {
        $data   = $this->request->getJSON(true);
        $nomor  = $data['nomor'] ?? null;

        if (!$nomor) {
            return $this->respond(['status' => false, 'message' => 'Nomor tujuan tidak boleh kosong.'], 400);
        }

        $result = $this->wa->send($nomor, "✅ Ini adalah pesan uji dari Sistem Apotek. WhatsApp Gateway berfungsi dengan baik!");

        $this->logActivity('WhatsApp Gateway', 'Test kirim pesan WA ke: ' . $nomor);

        return $this->respond($result);
    }

    /**
     * GET /api/master/whatsapp/log
     */
    public function log()
    {
        $db   = \Config\Database::connect();
        $data = $db->table('t_wa_queue')
                   ->orderBy('created_at', 'DESC')
                   ->limit(100)
                   ->get()->getResultArray();

        return $this->respond(['status' => true, 'data' => $data]);
    }

    /**
     * GET /api/logs/verify-integrity
     */
    public function verifyIntegrity()
    {
        $result = $this->verifyChainIntegrity();
        return $this->respond(['status' => true, 'data' => $result]);
    }
}
