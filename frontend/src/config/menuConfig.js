import {
  FiHome, FiBarChart2, FiShoppingCart, FiHeart, FiPackage,
  FiTruck, FiRepeat, FiPercent, FiDollarSign, FiBook,
  FiUsers, FiFileText, FiTrendingUp, FiSettings, FiDatabase
} from 'react-icons/fi';

/**
 * ================================================================
 * APOTEK DIGITAL — MENU TREE CONFIGURATION
 * Single source of truth for sidebar navigation & route structure
 * ================================================================
 *
 * type: 'single' | 'parent'
 * badge: 'PRO' | 'BETA' | 'NEW' | null
 */
export const menuTree = [
  {
    id: 'home',
    label: 'Home',
    icon: FiHome,
    path: '/home',
    type: 'single',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: FiBarChart2,
    type: 'parent',
    children: [
      { id: 'dash-umum',       label: 'Dashboard Umum',       path: '/dashboard' },
      { id: 'dash-penjualan',  label: 'Dashboard Penjualan',  path: '/dashboard/penjualan' },
      { id: 'dash-pembelian',  label: 'Dashboard Pembelian',  path: '/dashboard/pembelian' },
      { id: 'dash-persediaan', label: 'Dashboard Persediaan', path: '/dashboard/persediaan' },
      { id: 'dash-keuangan',   label: 'Dash. Keuangan',       path: '/dashboard/keuangan' },
    ],
  },
  {
    id: 'penjualan',
    label: 'Penjualan',
    icon: FiShoppingCart,
    type: 'parent',
    children: [
      { id: 'kasir',              label: 'Kasir',               path: '/penjualan/kasir' },
      { id: 'pesanan-penjualan',  label: 'Pesanan Penjualan',   path: '/penjualan/pesanan', badge: 'BETA' },
      { id: 'daftar-penjualan',   label: 'Daftar Penjualan',    path: '/penjualan/daftar' },
      { id: 'retur-penjualan',    label: 'Retur Penjualan',     path: '/penjualan/retur' },
      { id: 'penjualan-tertolak', label: 'Penjualan Tertolak',  path: '/penjualan/tertolak' },
      { id: 'qris',               label: 'QRIS',                path: '/penjualan/qris', badge: 'BETA' },
    ],
  },
  {
    id: 'pelayanan',
    label: 'Pelayanan',
    icon: FiHeart,
    type: 'parent',
    children: [
      { id: 'kunjungan',       label: 'Kunjungan Pasien',    path: '/pelayanan/kunjungan', badge: 'BETA' },
      { id: 'rekam-medis',     label: 'Daftar Rekam Medis',  path: '/pelayanan/rekam-medis' },
      { id: 'pemeriksaan',     label: 'Pemeriksaan Awal',    path: '/pelayanan/pemeriksaan-awal' },
      { id: 'terima-resep',    label: 'Penerimaan Resep',    path: '/pelayanan/penerimaan-resep' },
      { id: 'tebus-resep',     label: 'Penebusan Resep',     path: '/pelayanan/penebusan-resep' },
      { id: 'template-racik',  label: 'Template Racikan',    path: '/pelayanan/template-racikan' },
      { id: 'swamedikasi',     label: 'Swamedikasi',         path: '/pelayanan/swamedikasi' },
    ],
  },
  {
    id: 'persediaan',
    label: 'Persediaan',
    icon: FiPackage,
    type: 'parent',
    children: [
      { id: 'daftar-produk',    label: 'Daftar Produk',      path: '/persediaan/daftar-produk' },
      { id: 'defecta',          label: 'Defecta',            path: '/persediaan/defecta' },
      { id: 'forecasting',      label: 'AI Forecasting',      path: '/persediaan/forecasting', badge: 'NEW' },
      { id: 'stok-kadaluarsa',  label: 'Stok Kadaluarsa',    path: '/persediaan/stok-kadaluarsa' },
      { id: 'stok-opname',      label: 'Stok Opname',        path: '/persediaan/stok-opname' },
      { id: 'penyesuaian-stok', label: 'Penyesuaian Stok',   path: '/persediaan/penyesuaian-stok' },
      { id: 'perpindahan-stok', label: 'Perpindahan Stok',   path: '/persediaan/perpindahan-stok' },
    ],
  },
  {
    id: 'pembelian',
    label: 'Pembelian',
    icon: FiTruck,
    type: 'parent',
    children: [
      { id: 'rencana-beli',  label: 'Rencana Pembelian',  path: '/pembelian/rencana' },
      { id: 'pesanan-beli',  label: 'Pesanan Pembelian',  path: '/pembelian/pesanan' },
      { id: 'faktur-beli',   label: 'Faktur Pembelian',   path: '/pembelian/faktur' },
      { id: 'retur-beli',    label: 'Retur Pembelian',     path: '/pembelian/retur' },
    ],
  },
  {
    id: 'konsinyasi',
    label: 'Konsinyasi',
    icon: FiRepeat,
    type: 'parent',
    children: [
      { id: 'konsinyasi-masuk',  label: 'Konsinyasi Masuk',   path: '/konsinyasi/masuk' },
      { id: 'status-konsinyasi', label: 'Status Konsinyasi',  path: '/konsinyasi/status' },
      { id: 'retur-konsinyasi',  label: 'Retur Konsinyasi',   path: '/konsinyasi/retur' },
      { id: 'stok-konsinyasi',   label: 'Stok Konsinyasi',    path: '/konsinyasi/stok' },
    ],
  },
  {
    id: 'program-promo',
    label: 'Program Promo',
    icon: FiPercent,
    type: 'parent',
    children: [
      { id: 'bundel',         label: 'Bundel/Paket Produk', path: '/program-promo/bundel' },
      { id: 'diskon-produk',  label: 'Diskon Produk',       path: '/program-promo/diskon' },
      { id: 'voucher',        label: 'Voucher Diskon',      path: '/program-promo/voucher' },
      { id: 'member',         label: 'Program Member',      path: '/program-promo/member', badge: 'PRO' },
    ],
  },
  {
    id: 'keuangan',
    label: 'Keuangan',
    icon: FiDollarSign,
    type: 'parent',
    children: [
      { id: 'akun-kas',  label: 'Daftar Akun Kas', path: '/keuangan/akun-kas' },
      { id: 'buku-kas',  label: 'Buku Kas',        path: '/keuangan/buku-kas' },
      { id: 'utang',     label: 'Utang Usaha',     path: '/keuangan/utang' },
      { id: 'piutang',   label: 'Piutang Usaha',   path: '/keuangan/piutang' },
    ],
  },
  {
    id: 'akuntansi',
    label: 'Akuntansi',
    icon: FiBook,
    type: 'parent',
    badge: 'PRO',
    children: [
      { id: 'akun-akuntansi', label: 'Daftar Akun',  path: '/akuntansi/daftar-akun' },
      { id: 'buku-besar',     label: 'Buku Besar',   path: '/akuntansi/buku-besar' },
      { id: 'aktiva-tetap',   label: 'Aktiva Tetap', path: '/akuntansi/aktiva-tetap' },
    ],
  },
  {
    id: 'kontak',
    label: 'Kontak',
    icon: FiUsers,
    type: 'parent',
    children: [
      { id: 'pelanggan', label: 'Pelanggan',     path: '/kontak/pelanggan' },
      { id: 'sales',     label: 'Sales/Pelayan', path: '/kontak/sales' },
      { id: 'dokter',    label: 'Dokter',        path: '/kontak/dokter' },
      { id: 'supplier',  label: 'Supplier',      path: '/kontak/supplier' },
    ],
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: FiFileText,
    type: 'parent',
    children: [
      { id: 'lap-penjualan',  label: 'Laporan Penjualan',   path: '/laporan/penjualan' },
      { id: 'lap-pembelian',  label: 'Laporan Pembelian',   path: '/laporan/pembelian' },
      { id: 'lap-persediaan', label: 'Laporan Persediaan',  path: '/laporan/persediaan' },
      { id: 'lap-keuangan',   label: 'Laporan Keuangan',    path: '/laporan/keuangan' },
      { id: 'lap-presensi',   label: 'Laporan Presensi',    path: '/laporan/presensi', badge: 'PRO' },
    ],
  },
  {
    id: 'analisis',
    label: 'Analisis',
    icon: FiTrendingUp,
    type: 'parent',
    children: [
      { id: 'analisis-pareto',    label: 'Analisis Pareto',    path: '/analisis/pareto' },
      { id: 'analisis-pembelian', label: 'Analisis Pembelian', path: '/analisis/pembelian' },
      { id: 'analisis-harga',     label: 'Analisis Harga',     path: '/analisis/harga' },
    ],
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: FiDatabase,
    type: 'parent',
    children: [
      { id: 'master-produk', label: 'Master Produk', path: '/master/produk' },
      { id: 'master-formula', label: 'Master Formula', path: '/master/formula', badge: 'NEW' },
      { id: 'master-kategori', label: 'Master Kategori', path: '/master/kategori' },
      { id: 'master-satuan', label: 'Master Satuan', path: '/master/satuan' },
      { id: 'master-rak', label: 'Master Rak', path: '/master/rak' },
      { id: 'master-gudang', label: 'Master Gudang', path: '/master/gudang' },
      { id: 'master-kat-pelanggan', label: 'Master Kategori Pelanggan', path: '/master/kategori-pelanggan' },
      { id: 'jenis-pelayanan', label: 'Jenis Pelayanan', path: '/master/jenis-pelayanan' },
      { id: 'jenis-antrian', label: 'Jenis Antrian', path: '/master/jenis-antrian' },
      { id: 'produk-lab', label: 'Produk Lab', path: '/master/produk-lab' },
      { id: 'master-item-pemeriksaan', label: 'Master Item Pemeriksaan', path: '/master/item-pemeriksaan' },
      { id: 'master-pajak', label: 'Master Pajak', path: '/master/pajak' },
      { id: 'master-shift', label: 'Master Shift', path: '/master/shift', badge: 'PRO' },
    ],
  },
  {
    id: 'manajemen-pengguna',
    label: 'Manajemen Pengguna',
    icon: FiSettings,
    type: 'parent',
    children: [
      { id: 'daftar-pengguna',  label: 'Daftar Pengguna',       path: '/manajemen-pengguna/daftar' },
      { id: 'peran-hak',        label: 'Peran & Hak Akses',     path: '/manajemen-pengguna/peran' },
      { id: 'jadwal-kerja',     label: 'Jadwal Kerja',          path: '/manajemen-pengguna/jadwal', badge: 'PRO' },
      { id: 'riwayat-presensi', label: 'Riwayat Presensi',      path: '/manajemen-pengguna/presensi', badge: 'PRO' },
      { id: 'riwayat-shift',    label: 'Riwayat Shift/Sesi',    path: '/manajemen-pengguna/shift' },
      { id: 'log-aktivitas',    label: 'Log Aktivitas',         path: '/manajemen-pengguna/log', badge: 'BETA' },
      { id: 'satusehat',        label: 'Integrasi SATUSEHAT',    path: '/manajemen-pengguna/satusehat', badge: 'NEW' },
    ],
  },
];

/**
 * Flatten the menu tree to get all leaf‐level routes
 * Useful for generating <Route> elements in App.jsx
 */
export function getAllRoutes() {
  const routes = [];
  menuTree.forEach((item) => {
    if (item.type === 'single' && item.path) {
      routes.push({ path: item.path, id: item.id });
    }
    if (item.children) {
      item.children.forEach((child) => {
        routes.push({ path: child.path, id: child.id, parentId: item.id });
      });
    }
  });
  return routes;
}
