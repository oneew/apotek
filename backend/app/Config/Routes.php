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
    $routes->get('inventory/forecasting', 'ProdukController::forecasting');
    $routes->post('inventory/forecasting/sync', 'ProdukController::syncForecasting');
    
    // Dashboard API
    $routes->get('dashboard/summary', 'DashboardController::summary');

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
        $routes->get('pelanggan', 'PelangganController::index');
        $routes->post('pelanggan', 'PelangganController::create');
        $routes->get('dokter', 'DokterController::index');
        $routes->post('dokter', 'DokterController::create');
        $routes->resource('pembelian', ['controller' => 'PembelianController']);
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
        $routes->resource('arus-kas', ['controller' => 'ArusKasController']);
        $routes->get('konsinyasi/stok', 'KonsinyasiController::stok');
        $routes->resource('konsinyasi', ['controller' => 'KonsinyasiController']);
        $routes->resource('promo', ['controller' => 'PromoController']);
        $routes->resource('formula', ['controller' => 'FormulaController']);
        
        // SATUSEHAT Integration
        $routes->get('satusehat/config', 'SatusehatController::index');
        $routes->post('satusehat/token', 'SatusehatController::token');
        $routes->post('satusehat/test', 'SatusehatController::test');
        $routes->post('satusehat/send-dispense', 'SatusehatController::sendDispense');

        $routes->get('logs', 'LogController::index');
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
