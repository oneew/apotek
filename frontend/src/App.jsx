import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import SelectOutlet from './pages/SelectOutlet';
import ShiftManagement from './pages/ShiftManagement';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PenjualanKasir from './pages/penjualan/kasir';
import PenjualanPesanan from './pages/penjualan/pesanan';
import PenjualanDaftar from './pages/penjualan/daftar';
import PenjualanRetur from './pages/penjualan/retur';
import PenjualanTertolak from './pages/penjualan/tertolak';
import PenjualanQRIS from './pages/penjualan/qris';

import PelayananKunjungan from './pages/pelayanan/kunjungan';
import PelayananRekamMedis from './pages/pelayanan/rekam-medis';
import PelayananPemeriksaanAwal from './pages/pelayanan/pemeriksaan-awal';
import PelayananPenerimaanResep from './pages/pelayanan/penerimaan-resep';
import PelayananPenebusanResep from './pages/pelayanan/penebusan-resep';
import PelayananSwamedikasi from './pages/pelayanan/swamedikasi';
import PelayananTemplateRacikan from './pages/pelayanan/template-racikan';

import FormPemeriksaanAwal from './pages/pelayanan/pemeriksaan-awal/baru';
import FormPenerimaanResep from './pages/pelayanan/penerimaan-resep/baru';
import FormSwamedikasi from './pages/pelayanan/swamedikasi/baru';
import FormPenebusanResep from './pages/pelayanan/penebusan-resep/baru';
import FormTemplateRacikan from './pages/pelayanan/template-racikan/baru';

import PersediaanDaftarProduk from './pages/persediaan/PersediaanDaftarProduk';
import PersediaanDefecta from './pages/persediaan/PersediaanDefecta';
import PersediaanForecasting from './pages/persediaan/PersediaanForecasting';
import PersediaanStokKadaluarsa from './pages/persediaan/PersediaanStokKadaluarsa';
import PersediaanStokOpname from './pages/persediaan/PersediaanStokOpname';
import PersediaanPenyesuaianStok from './pages/persediaan/PersediaanPenyesuaianStok';
import PersediaanPerpindahanStok from './pages/persediaan/PersediaanPerpindahanStok';

import PembelianRencana from './pages/pembelian/rencana';
import PembelianPesanan from './pages/pembelian/pesanan';
import PembelianFaktur from './pages/pembelian/faktur';
import PembelianRetur from './pages/pembelian/retur';

import PromoBundel from './pages/promo/PromoBundel';
import PromoDiskon from './pages/promo/PromoDiskon';
import PromoVoucher from './pages/promo/PromoVoucher';

import KeuanganDaftarAkun from './pages/keuangan/KeuanganDaftarAkun';
import KeuanganBukuKas from './pages/keuangan/KeuanganBukuKas';
import KeuanganUtangUsaha from './pages/keuangan/KeuanganUtangUsaha';
import KeuanganPiutangUsaha from './pages/keuangan/KeuanganPiutangUsaha';

import KonsinyasiMasuk from './pages/konsinyasi/KonsinyasiMasuk';
import KonsinyasiStatus from './pages/konsinyasi/KonsinyasiStatus';
import KonsinyasiRetur from './pages/konsinyasi/KonsinyasiRetur';
import KonsinyasiStok from './pages/konsinyasi/KonsinyasiStok';

import AkuntansiDaftarAkun from './pages/akuntansi/AkuntansiDaftarAkun';
import AkuntansiBukuBesar from './pages/akuntansi/AkuntansiBukuBesar';
import AkuntansiAktivaTetap from './pages/akuntansi/AkuntansiAktivaTetap';

import KontakPelanggan from './pages/kontak/KontakPelanggan';
import KontakSales from './pages/kontak/KontakSales';
import KontakDokter from './pages/kontak/KontakDokter';
import KontakSupplier from './pages/kontak/KontakSupplier';

import LaporanPenjualan from './pages/laporan/LaporanPenjualan';
import LaporanPembelian from './pages/laporan/LaporanPembelian';
import LaporanPersediaan from './pages/laporan/LaporanPersediaan';
import LaporanKeuangan from './pages/laporan/LaporanKeuangan';
import LaporanPresensi from './pages/laporan/LaporanPresensi';

import AnalisisPareto from './pages/analisis/AnalisisPareto';
import AnalisisPembelian from './pages/analisis/AnalisisPembelian';
import AnalisisHarga from './pages/analisis/AnalisisHarga';

import ManajemenDaftarPengguna from './pages/manajemen/ManajemenDaftarPengguna';
import ManajemenPeran from './pages/manajemen/ManajemenPeran';
import ManajemenJadwal from './pages/manajemen/ManajemenJadwal';
import ManajemenPresensi from './pages/manajemen/ManajemenPresensi';
import ManajemenShift from './pages/manajemen/ManajemenShift';
import ManajemenLogAktivitas from './pages/manajemen/ManajemenLogAktivitas';
import SatusehatSettings from './pages/manajemen/SatusehatSettings';

import MasterProduk from './pages/master/MasterProduk';
import MasterFormula from './pages/master/MasterFormula';
import MasterKategori from './pages/master/MasterKategori';
import MasterSatuan from './pages/master/MasterSatuan';
import MasterRak from './pages/master/MasterRak';
import MasterGudang from './pages/master/MasterGudang';
import MasterKategoriPelanggan from './pages/master/MasterKategoriPelanggan';
import JenisPelayanan from './pages/master/JenisPelayanan';
import JenisAntrian from './pages/master/JenisAntrian';
import ProdukLab from './pages/master/ProdukLab';
import MasterItemPemeriksaan from './pages/master/MasterItemPemeriksaan';
import MasterPajak from './pages/master/MasterPajak';
import MasterShift from './pages/master/MasterShift';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-app)]">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/select-outlet" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/select-outlet" element={<ProtectedRoute><SelectOutlet /></ProtectedRoute>} />
      <Route path="/shift" element={<ProtectedRoute><ShiftManagement /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/:sub" element={<Dashboard />} />
        <Route path="penjualan">
          <Route index element={<Navigate to="kasir" />} />
          <Route path="kasir" element={<PenjualanKasir />} />
          <Route path="pesanan" element={<PenjualanPesanan />} />
          <Route path="daftar" element={<PenjualanDaftar />} />
          <Route path="retur" element={<PenjualanRetur />} />
          <Route path="tertolak" element={<PenjualanTertolak />} />
          <Route path="qris" element={<PenjualanQRIS />} />
        </Route>
        <Route path="pelayanan">
          <Route path="kunjungan" element={<PelayananKunjungan />} />
          <Route path="rekam-medis" element={<PelayananRekamMedis />} />
          <Route path="pemeriksaan-awal" element={<PelayananPemeriksaanAwal />} />
          <Route path="pemeriksaan-awal/baru" element={<FormPemeriksaanAwal />} />
          <Route path="pemeriksaan-dokter" element={<ComingSoon title="Pemeriksaan Dokter" />} />
          <Route path="pemeriksaan-lab" element={<ComingSoon title="Pemeriksaan Lab" />} />
          <Route path="penerimaan-resep" element={<PelayananPenerimaanResep />} />
          <Route path="penerimaan-resep/baru" element={<FormPenerimaanResep />} />
          <Route path="penebusan-resep" element={<PelayananPenebusanResep />} />
          <Route path="penebusan-resep/baru" element={<FormPenebusanResep />} />
          <Route path="template-racikan" element={<PelayananTemplateRacikan />} />
          <Route path="template-racikan/baru" element={<FormTemplateRacikan />} />
          <Route path="swamedikasi" element={<PelayananSwamedikasi />} />
          <Route path="swamedikasi/baru" element={<FormSwamedikasi />} />
        </Route>
        <Route path="persediaan">
          <Route index element={<Navigate to="daftar-produk" />} />
          <Route path="daftar-produk" element={<PersediaanDaftarProduk />} />
          <Route path="defecta" element={<PersediaanDefecta />} />
          <Route path="forecasting" element={<PersediaanForecasting />} />
          <Route path="stok-kadaluarsa" element={<PersediaanStokKadaluarsa />} />
          <Route path="stok-opname" element={<PersediaanStokOpname />} />
          <Route path="penyesuaian-stok" element={<PersediaanPenyesuaianStok />} />
          <Route path="perpindahan-stok" element={<PersediaanPerpindahanStok />} />
        </Route>
        <Route path="pembelian">
          <Route index element={<Navigate to="rencana" />} />
          <Route path="rencana" element={<PembelianRencana />} />
          <Route path="pesanan" element={<PembelianPesanan />} />
          <Route path="faktur" element={<PembelianFaktur />} />
          <Route path="retur" element={<PembelianRetur />} />
        </Route>
        <Route path="konsinyasi">
          <Route index element={<Navigate to="masuk" />} />
          <Route path="masuk" element={<KonsinyasiMasuk />} />
          <Route path="status" element={<KonsinyasiStatus />} />
          <Route path="retur" element={<KonsinyasiRetur />} />
          <Route path="stok" element={<KonsinyasiStok />} />
        </Route>
        <Route path="program-promo">
          <Route index element={<Navigate to="bundel" />} />
          <Route path="bundel" element={<PromoBundel />} />
          <Route path="diskon" element={<PromoDiskon />} />
          <Route path="voucher" element={<PromoVoucher />} />
          <Route path="member" element={<ComingSoon title="Program Member" />} />
        </Route>
        <Route path="keuangan">
          <Route index element={<Navigate to="akun-kas" />} />
          <Route path="akun-kas" element={<KeuanganDaftarAkun />} />
          <Route path="buku-kas" element={<KeuanganBukuKas />} />
          <Route path="utang" element={<KeuanganUtangUsaha />} />
          <Route path="piutang" element={<KeuanganPiutangUsaha />} />
        </Route>
        <Route path="akuntansi">
          <Route index element={<Navigate to="daftar-akun" />} />
          <Route path="daftar-akun" element={<AkuntansiDaftarAkun />} />
          <Route path="buku-besar" element={<AkuntansiBukuBesar />} />
          <Route path="aktiva-tetap" element={<AkuntansiAktivaTetap />} />
        </Route>
        <Route path="kontak">
          <Route index element={<Navigate to="pelanggan" />} />
          <Route path="pelanggan" element={<KontakPelanggan />} />
          <Route path="sales" element={<KontakSales />} />
          <Route path="dokter" element={<KontakDokter />} />
          <Route path="supplier" element={<KontakSupplier />} />
        </Route>
        <Route path="laporan">
          <Route index element={<Navigate to="penjualan" />} />
          <Route path="penjualan" element={<LaporanPenjualan />} />
          <Route path="pembelian" element={<LaporanPembelian />} />
          <Route path="persediaan" element={<LaporanPersediaan />} />
          <Route path="keuangan" element={<LaporanKeuangan />} />
          <Route path="presensi" element={<LaporanPresensi />} />
        </Route>
        <Route path="analisis">
          <Route index element={<Navigate to="pareto" />} />
          <Route path="pareto" element={<AnalisisPareto />} />
          <Route path="pembelian" element={<AnalisisPembelian />} />
          <Route path="harga" element={<AnalisisHarga />} />
        </Route>
        <Route path="master">
          <Route index element={<Navigate to="produk" />} />
          <Route path="produk" element={<MasterProduk />} />
          <Route path="formula" element={<MasterFormula />} />
          <Route path="kategori" element={<MasterKategori />} />
          <Route path="satuan" element={<MasterSatuan />} />
          <Route path="rak" element={<MasterRak />} />
          <Route path="gudang" element={<MasterGudang />} />
          <Route path="kategori-pelanggan" element={<MasterKategoriPelanggan />} />
          <Route path="jenis-pelayanan" element={<JenisPelayanan />} />
          <Route path="jenis-antrian" element={<JenisAntrian />} />
          <Route path="produk-lab" element={<ProdukLab />} />
          <Route path="item-pemeriksaan" element={<MasterItemPemeriksaan />} />
          <Route path="pajak" element={<MasterPajak />} />
          <Route path="shift" element={<MasterShift />} />
        </Route>
        <Route path="manajemen-pengguna">
          <Route index element={<Navigate to="daftar" />} />
          <Route path="daftar" element={<ManajemenDaftarPengguna />} />
          <Route path="peran" element={<ManajemenPeran />} />
          <Route path="jadwal" element={<ManajemenJadwal />} />
          <Route path="presensi" element={<ManajemenPresensi />} />
          <Route path="shift" element={<ManajemenShift />} />
          <Route path="log" element={<ManajemenLogAktivitas />} />
          <Route path="satusehat" element={<SatusehatSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-unt-fade">
      <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium">Modul ini akan segera hadir</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
