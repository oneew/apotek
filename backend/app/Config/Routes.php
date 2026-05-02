<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    
    // Auth routes (no JWT required)
    $routes->post('auth/login', 'AuthController::login');
    
    // Public routes for data
    $routes->get('produk', 'ProdukController::index');
    $routes->post('produk', 'ProdukController::create');
    $routes->put('produk/(:num)', 'ProdukController::create/$1');
    $routes->delete('produk/(:num)', 'ProdukController::delete/$1');
    $routes->get('inventory/forecasting', 'ProdukController::forecasting');
    $routes->post('inventory/forecasting/sync', 'ProdukController::syncForecasting');

    // Konversi Satuan Routes
    $routes->get('produk/konversi/(:num)', 'ProdukKonversiController::getByProduk/$1');
    $routes->post('produk/konversi/(:num)', 'ProdukKonversiController::create/$1');
    $routes->post('produk/konversi/batch/(:num)', 'ProdukKonversiController::saveBatch/$1');
    $routes->put('produk/konversi/item/(:num)', 'ProdukKonversiController::update/$1');
    $routes->delete('produk/konversi/item/(:num)', 'ProdukKonversiController::delete/$1');

    
    // Dashboard API
    $routes->get('dashboard/summary', 'DashboardController::summary');
    $routes->get('dashboard/consolidated', 'DashboardController::consolidated');

    // Clinical Safety & Interaction
    $routes->post('interaksi/check', 'InteraksiController::checkInteraction');
    $routes->post('interaksi/seed', 'InteraksiController::seedInteraksi');

    // Audit & Cryptographic Trail
    $routes->get('audit/logs', 'AuditTrailController::index');
    $routes->get('audit/verify', 'AuditTrailController::verify');

    // Master Data Routes
    $routes->group('master', function($routes) {
        $routes->resource('kategori', ['controller' => 'KategoriController']);
        $routes->resource('satuan', ['controller' => 'SatuanController']);
        $routes->resource('rak', ['controller' => 'RakController']);
        $routes->resource('gudang', ['controller' => 'GudangController']);
        $routes->resource('pajak', ['controller' => 'PajakController']);
        $routes->resource('kategori-pelanggan', ['controller' => 'KategoriPelangganController']);
        $routes->resource('jenis-pelayanan', ['controller' => 'JenisPelayananController']);
        $routes->resource('jenis-antrian', ['controller' => 'JenisAntrianController']);
        $routes->resource('produk-lab', ['controller' => 'ProdukLabController']);
        $routes->resource('item-pemeriksaan', ['controller' => 'ItemPemeriksaanController']);
        $routes->resource('shift', ['controller' => 'ShiftController']);
        $routes->resource('users', ['controller' => 'UserController']);
        $routes->get('outlets-list', 'UserController::outlets');
        $routes->resource('roles', ['controller' => 'RoleController']);
        $routes->post('roles/permissions/(:num)', 'RoleController::update_permissions/$1');
        $routes->resource('penjualan', ['controller' => 'PenjualanController']);
        $routes->post('penjualan/log-tertolak', 'PenjualanController::log_tertolak');
        $routes->get('penjualan-tertolak', 'PenjualanController::get_tertolak');
        $routes->post('penjualan-tertolak', 'PenjualanController::log_tertolak');
        $routes->put('penjualan-tertolak/(:num)', 'PenjualanController::update_tertolak/$1');
        $routes->delete('penjualan-tertolak/(:num)', 'PenjualanController::delete_tertolak/$1');
        $routes->post('penjualan/retur', 'PenjualanController::retur');
        $routes->post('penjualan/restore/(:num)', 'PenjualanController::restore/$1');
        $routes->resource('pelanggan', ['controller' => 'PelangganController']);
        $routes->resource('dokter', ['controller' => 'DokterController']);
        $routes->resource('pembelian', ['controller' => 'PembelianController']);
        $routes->resource('apoteker', ['controller' => 'ApotekerController']);
        $routes->resource('pio', ['controller' => 'PioController']);
        $routes->get('rencana-pembelian/defecta', 'RencanaPembelianController::defecta');
        $routes->get('rencana-pembelian/analisis', 'RencanaPembelianController::analisis');
        $routes->resource('rencana-pembelian', ['controller' => 'RencanaPembelianController']);
        $routes->resource('pesanan-pembelian', ['controller' => 'PesananPembelianController']);
        $routes->get('stok', 'StokController::index');
        $routes->get('stok/detail/(:num)', 'StokController::detail/$1');
        $routes->get('stok/card/(:num)', 'StokController::card/$1');
        $routes->get('stok/expired', 'StokController::expired');
        $routes->post('stok/opname', 'StokController::opname');
        $routes->get('suppliers', 'PembelianController::suppliers');
        $routes->resource('pembelian-retur', ['controller' => 'ReturPembelianController']);
        $routes->resource('template-cetak', ['controller' => 'TemplateCetakController']);
        $routes->resource('arus-kas', ['controller' => 'ArusKasController']);
        $routes->get('konsinyasi/stok', 'KonsinyasiController::stok');
        $routes->resource('konsinyasi', ['controller' => 'KonsinyasiController']);
        $routes->resource('promo', ['controller' => 'PromoController']);
        $routes->resource('formula', ['controller' => 'FormulaController']);
        $routes->resource('konseling', ['controller' => 'KonselingController']);
        
        // HR & SDM
        $routes->get('hr/jabatan', 'HrController::getJabatan');
        $routes->get('hr/pegawai', 'HrController::getPegawai');
        $routes->post('hr/pegawai', 'HrController::createPegawai');
        $routes->put('hr/pegawai/(:num)', 'HrController::updatePegawai/$1');
        $routes->delete('hr/pegawai/(:num)', 'HrController::deletePegawai/$1');
        
        $routes->get('sipnap/laporan', 'SipnapController::generateLaporan');
        $routes->get('kpi/dashboard', 'KpiController::dashboard');
        
        $routes->get('hr/pegawai', 'HrController::getPegawai');
        $routes->post('hr/jadwal', 'HrController::saveJadwal');

        // KPI & Dashboard
        $routes->get('kpi/dashboard', 'KpiController::dashboard');
        
        // OCR / Pembaca Faktur
        $routes->post('ocr/scan', 'OcrController::scan');
        
        // WhatsApp Gateway
        $routes->get('whatsapp/settings', 'WhatsappController::settings');
        $routes->post('whatsapp/settings', 'WhatsappController::saveSettings');
        $routes->post('whatsapp/test', 'WhatsappController::testSend');
        $routes->get('whatsapp/log', 'WhatsappController::log');
        
        $routes->get('logs', 'LogController::index');
        $routes->get('logs/verify-integrity', 'WhatsappController::verifyIntegrity');

        // SATUSEHAT Integration
        $routes->get('satusehat/config', 'SatusehatController::index');
        $routes->post('satusehat/token', 'SatusehatController::token');
        $routes->post('satusehat/test', 'SatusehatController::test');
        $routes->post('satusehat/send-dispense', 'SatusehatController::sendDispense');

        // Resep Digital & Clinical Safety
        $routes->get('resep', 'ResepController::index');
        $routes->post('resep', 'ResepController::create');
        $routes->get('resep/(:segment)', 'ResepController::show/$1');
        $routes->put('resep/(:num)/status', 'ResepController::updateStatus/$1');
        $routes->get('resep/rekap/kasir', 'ResepController::index?sumber=Kasir'); // Alias for easier dev
        
        $routes->resource('kunjungan', ['controller' => 'KunjunganController']);
        $routes->get('fefo/dashboard', 'FefoController::dashboard');
        $routes->post('fefo/seed', 'FefoController::seedExpiry');

        $routes->resource('penyesuaian-stok', ['controller' => 'PenyesuaianStokController']);
        
        $routes->post('fefo/seed', 'FefoController::seedExpiry');
    });
    
    // Protected routes (JWT required)
    $routes->group('', ['filter' => 'jwt'], static function ($routes) {
        $routes->post('auth/logout', 'AuthController::logout');
        $routes->get('auth/profile', 'AuthController::profile');
    });

    // OPTIONS preflight for all API routes
    $routes->options('(:any)', static function () {
        return service('response')->setStatusCode(200);
    });
});
