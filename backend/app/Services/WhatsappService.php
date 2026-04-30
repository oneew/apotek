<?php

namespace App\Services;

/**
 * WhatsApp Gateway Service (Fonnte API)
 * Doc: https://fonnte.com/api
 */
class WhatsappService
{
    private string $token;
    private string $apiUrl = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $db = \Config\Database::connect();
        $setting = $db->table('t_wa_settings')->where('config_key', 'fonnte_token')->get()->getRowArray();
        $this->token = $setting['config_val'] ?? '';
    }

    /**
     * Send a WhatsApp message immediately
     */
    public function send(string $nomor, string $pesan): array
    {
        if (empty($this->token)) {
            return ['status' => false, 'message' => 'WA Gateway token belum dikonfigurasi.'];
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $this->apiUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => ['target' => $nomor, 'message' => $pesan, 'countryCode' => '62'],
            CURLOPT_HTTPHEADER     => ['Authorization: ' . $this->token],
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        $this->saveLog($nomor, $pesan, $httpCode === 200 && ($result['status'] ?? false), $result['reason'] ?? '');

        return [
            'status'  => $httpCode === 200 && ($result['status'] ?? false),
            'message' => $result['reason'] ?? ($httpCode === 200 ? 'Terkirim' : 'HTTP Error ' . $httpCode)
        ];
    }

    /**
     * Queue a WA message for later processing
     */
    public function queue(string $nomor, string $pesan, string $tipe = 'struk', int $referensiId = null, string $scheduledAt = null): void
    {
        $db = \Config\Database::connect();
        $db->table('t_wa_queue')->insert([
            'nomor_tujuan' => $nomor,
            'pesan'        => $pesan,
            'tipe'         => $tipe,
            'referensi_id' => $referensiId,
            'status'       => 'pending',
            'scheduled_at' => $scheduledAt ?? date('Y-m-d H:i:s'),
            'created_at'   => date('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Build struk pesan for a sale transaction
     */
    public function buildStrukMessage(array $sale): string
    {
        $items = $sale['items'] ?? [];
        $itemLines = implode("\n", array_map(function ($item) {
            return "  • {$item['nama_produk']} x{$item['jumlah_jual']} = Rp " . number_format($item['subtotal'], 0, ',', '.');
        }, $items));

        return "🧾 *STRUK PEMBELIAN APOTEK*\n" .
               "━━━━━━━━━━━━━━━━━━━━━━\n" .
               "No. Invoice : #{$sale['invoice']}\n" .
               "Tanggal     : " . date('d/m/Y H:i') . "\n\n" .
               "*Detail Pembelian:*\n{$itemLines}\n\n" .
               "━━━━━━━━━━━━━━━━━━━━━━\n" .
               "*Total: Rp " . number_format($sale['total'], 0, ',', '.') . "*\n\n" .
               "_Terima kasih telah berbelanja di apotek kami!_ 🌿";
    }

    private function saveLog(string $nomor, string $pesan, bool $success, string $error = ''): void
    {
        $db = \Config\Database::connect();
        $db->table('t_wa_queue')->insert([
            'nomor_tujuan' => $nomor,
            'pesan'        => $pesan,
            'tipe'         => 'struk',
            'status'       => $success ? 'sent' : 'failed',
            'error_msg'    => $error ?: null,
            'sent_at'      => date('Y-m-d H:i:s'),
            'created_at'   => date('Y-m-d H:i:s'),
        ]);
    }
}
