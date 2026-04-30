<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class InteraksiController extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    public function seedInteraksi()
    {
        $db = \Config\Database::connect();
        $count = $db->table('t_interaksi_obat')->countAllResults();
        
        if ($count == 0) {
            $data = [
                ['drug_class_a' => 'NSAID', 'drug_class_b' => 'Antikoagulan', 'tingkat_bahaya' => 'Mayor', 'deskripsi_efek' => 'Meningkatkan risiko pendarahan gastrointestinal yang serius. Gunakan alternatif painkiller.'],
                ['drug_class_a' => 'ACE Inhibitor', 'drug_class_b' => 'Potassium-sparing Diuretics', 'tingkat_bahaya' => 'Moderat', 'deskripsi_efek' => 'Risiko hiperkalemia (kadar kalium darah sangat tinggi) meningkat.'],
                ['drug_class_a' => 'Beta Blocker', 'drug_class_b' => 'Calcium Channel Blocker', 'tingkat_bahaya' => 'Moderat', 'deskripsi_efek' => 'Dapat menyebabkan depresi miokard dan bradikardia parah.'],
                ['drug_class_a' => 'Statin', 'drug_class_b' => 'Makrolida', 'tingkat_bahaya' => 'Mayor', 'deskripsi_efek' => 'Risiko rhabdomyolysis meningkat. Hindari penggunaan bersama.'],
                ['drug_class_a' => 'Antasida', 'drug_class_b' => 'Tetrasiklin', 'tingkat_bahaya' => 'Minor', 'deskripsi_efek' => 'Antasida dapat mengurangi absorpsi antibiotik. Beri jeda 2-4 jam.'],
            ];
            $db->table('t_interaksi_obat')->insertBatch($data);
        }
        return $this->respond(['status' => true, 'message' => 'Seeding done or already populated']);
    }

    public function checkInteraction()
    {
        $input = $this->request->getJSON(true);
        if (empty($input['produk_ids']) || !is_array($input['produk_ids']) || count($input['produk_ids']) < 2) {
            return $this->respond(['status' => true, 'interactions' => []]);
        }

        $db = \Config\Database::connect();
        
        // Ambil drug_class dari produk yang dikirim
        $products = $db->table('m_produk')
                       ->select('id, nama_produk, drug_class')
                       ->whereIn('id', $input['produk_ids'])
                       ->get()->getResultArray();
                       
        $drugClassesWithProducts = [];
        foreach ($products as $p) {
            if (!empty($p['drug_class']) && $p['drug_class'] !== '-') {
                $drugClassesWithProducts[$p['drug_class']][] = $p;
            }
        }
        
        $classes = array_keys($drugClassesWithProducts);
        
        if (count($classes) < 2) {
            return $this->respond(['status' => true, 'interactions' => []]);
        }

        $interactionsFound = [];
        
        // Cek kombinasi kelas di t_interaksi_obat
        $allInteractions = $db->table('t_interaksi_obat')->get()->getResultArray();
        
        for ($i = 0; $i < count($classes); $i++) {
            for ($j = $i + 1; $j < count($classes); $j++) {
                $classA = $classes[$i];
                $classB = $classes[$j];
                
                foreach ($allInteractions as $interact) {
                    if (
                        (strcasecmp($interact['drug_class_a'], $classA) == 0 && strcasecmp($interact['drug_class_b'], $classB) == 0) ||
                        (strcasecmp($interact['drug_class_a'], $classB) == 0 && strcasecmp($interact['drug_class_b'], $classA) == 0)
                    ) {
                        $interactionsFound[] = [
                            'drug_class_a'     => $classA,
                            'drug_class_b'     => $classB,
                            'produk_a'         => array_column($drugClassesWithProducts[$classA], 'nama_produk'),
                            'produk_b'         => array_column($drugClassesWithProducts[$classB], 'nama_produk'),
                            'tingkat_bahaya'   => $interact['tingkat_bahaya'],
                            'deskripsi_efek'   => $interact['deskripsi_efek']
                        ];
                    }
                }
            }
        }

        return $this->respond([
            'status'       => true,
            'interactions' => $interactionsFound
        ]);
    }
}
