<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class OcrController extends ResourceController
{
    public function scan()
    {
        $file = $this->request->getFile('invoice_image');
        
        if (!$file || !$file->isValid()) {
            return $this->respond(['status' => false, 'message' => 'Gambar faktur tidak valid/kosong.'], 400);
        }

        $uploadDir = WRITEPATH . 'uploads/ocr';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Save temporarily
        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);
        
        $imagePath = $uploadDir . '/' . $newName;
        $outputBase = $uploadDir . '/result_' . $newName; // Tesseract appends .txt automatically
        
        // Execute Tesseract CLI
        $tesseractPath = '"C:\Program Files\Tesseract-OCR\tesseract.exe"';
        $cmd = "$tesseractPath " . escapeshellarg($imagePath) . " " . escapeshellarg($outputBase) . " -l eng+ind";
        
        exec($cmd, $output, $returnVar);
        
        $txtFile = $outputBase . '.txt';
        if (!file_exists($txtFile)) {
            if (file_exists($imagePath)) unlink($imagePath);
            return $this->respond(['status' => false, 'message' => 'Mesin AI (OCR) gagal membaca gambar ini.'], 500);
        }
        
        $rawText = file_get_contents($txtFile);
        
        // Clean up temp files immediately to save storage
        @unlink($imagePath);
        @unlink($txtFile);

        // Core extraction variables
        $invoiceNo = null;
        $tanggal = null;
        $total = null;

        // 1. Invoice Number (No. Faktur / Invoice: XXXXX)
        if (preg_match('/(?:no\s*faktur|invoice\s*no|inv|no)(?:\s*[:.-]\s*|\s+)([a-z0-9\-\/]+)/i', $rawText, $matches)) {
            $val = trim($matches[1]);
            if(strlen($val) > 2) {
                $invoiceNo = strtoupper($val);
            }
        }

        // 2. Date Extractor
        if (preg_match('/(\d{1,2}[\/\-\s](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[a-zA-Z]{3,}|\d{1,2})[\/\-\s]\d{2,4})/i', $rawText, $matches)) {
            $tanggalString = trim($matches[1]);
            // Attempt conversion to YYYY-MM-DD
            $time = strtotime(str_replace('/', '-', $tanggalString));
            if ($time) {
                $tanggal = date('Y-m-d', $time);
            } else {
                $tanggal = $tanggalString; // Fallback
            }
        }

        // 3. Total Tagihan Extractor
        if (preg_match('/(?:total|jumlah)(?:\s*[:.-]\s*|\s+)(?:rp\.?\s*)?([\d\.,]+)/i', $rawText, $matches)) {
            // Strip out non-numeric
            $cleanTotal = preg_replace('/[^\d]/', '', $matches[1]);
            if ($cleanTotal > 0) {
                $total = (float) $cleanTotal;
            }
        }

        return $this->respond([
            'status' => true,
            'data_parsed' => [
                'raw_text' => $rawText,
                'invoice' => $invoiceNo,
                'tanggal' => $tanggal,
                'total' => $total,
                'supplier' => 'Terdeteksi Otomatis',
                'items' => []
            ],
            'ocr_id' => uniqid('OCR-'),
            'message' => 'Faktur berhasil dipindai dengan AI Scanner'
        ]);
    }
}
