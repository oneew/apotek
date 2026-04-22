<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class SatusehatController extends BaseController
{
    use ResponseTrait;

    private $authUrl = 'https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken';
    private $baseUrl = 'https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1';

    /**
     * GET /api/satusehat/config
     * Get integration status and configuration (mocked)
     */
    public function index()
    {
        return $this->respond([
            'status' => true,
            'data'   => [
                'organization_id' => '10001XXXX',
                'is_connected'    => true,
                'environment'     => 'Sandbox',
                'last_sync'       => date('Y-m-d H:i:s'),
                'stats'           => [
                    'encounter_sent' => 45,
                    'medication_sent'=> 120,
                    'errors'         => 2
                ]
            ]
        ]);
    }

    /**
     * POST /api/satusehat/token
     * Refresh auth token (Mock)
     */
    public function token()
    {
        // In a real app, this would call the Kemenkes OAuth endpoint
        return $this->respond([
            'status' => true,
            'message' => 'Token refined successfully',
            'token'   => 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
        ]);
    }

    /**
     * POST /api/satusehat/test
     * Test connection to Kemenkes Sandbox
     */
    public function test()
    {
        return $this->respond([
            'status' => true,
            'message' => 'Koneksi ke SATUSEHAT Sandbox Berhasil!'
        ]);
    }

    /**
     * POST /api/satusehat/send-dispense
     * Send MedicationDispense resource (Mock)
     */
    public function sendDispense()
    {
        $data = $this->request->getJSON(true);
        
        // Fetch transaction details and product KFA codes
        $db = \Config\Database::connect();
        $builder = $db->table('t_penjualan_detail as d')
            ->select('d.*, p.kfa_code, p.kfa_name, p.nama_produk')
            ->join('m_produk as p', 'p.id = d.produk_id', 'left')
            ->where('d.penjualan_id', $data['sale_id']);
        $items = $builder->get()->getResultArray();

        $fhirResource = [
            'resourceType' => 'MedicationDispense',
            'identifier' => [
                ['system' => 'http://sys-ids.kemkes.go.id/prescription-number', 'value' => $data['invoice']]
            ],
            'status' => 'completed',
            'medicationCodeableConcept' => [
                'coding' => array_map(function($item) {
                    return [
                        'system' => 'http://sys-ids.kemkes.go.id/kfa',
                        'code' => $item['kfa_code'] ?? 'UNK-000',
                        'display' => $item['kfa_name'] ?? $item['nama_produk']
                    ];
                }, $items)
            ],
            'subject' => ['reference' => 'Patient/' . $data['patient_id']],
            'whenHandedOver' => date('c'),
        ];

        $this->logActivity('SATUSEHAT', 'Kirim MedicationDispense: ' . ($data['invoice'] ?? 'N/A'), null, $fhirResource);

        return $this->respond([
            'status' => true,
            'message' => 'Data berhasil dikirim ke SATUSEHAT',
            'fhir_id' => 'dispense-' . uniqid()
        ]);
    }
}
