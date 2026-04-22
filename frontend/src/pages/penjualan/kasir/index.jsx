import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiTrash2, FiPlus, FiCreditCard, FiUser, FiActivity, FiX, FiCheckCircle, FiMinus, FiClock, FiPackage, FiList, FiArrowLeft, FiLayers } from 'react-icons/fi';
import ModalPilihPelanggan from './components/ModalPilihPelanggan';
import ModalPilihDokter from './components/ModalPilihDokter';
import ModalPembayaran from './components/ModalPembayaran';
import ModalRacikan from './components/ModalRacikan';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanKasir() {
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [cart, setCart] = useState([]);
  const [activeView, setActiveView] = useState('kasir');
  const [riwayatData, setRiwayatData] = useState([]);
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

  const [isModalPelangganOpen, setIsModalPelangganOpen] = useState(false);
  const [isModalDokterOpen, setIsModalDokterOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [selectedDokter, setSelectedDokter] = useState(null);
  const [isModalRacikanOpen, setIsModalRacikanOpen] = useState(false);

  const [discountPct, setDiscountPct] = useState(0);
  const [discountRp, setDiscountRp] = useState(0);
  const [fees, setFees] = useState({ service: 0, embalase: 0, other: 0 });

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/produk`);
      const result = await response.json();
      if (result.status) setProducts(result.data);
    } catch (err) { console.error('Gagal memuat produk:', err); }
  };

  const fetchRiwayat = async () => {
    setIsLoadingRiwayat(true);
    try {
      const response = await fetch(`${API_BASE}/master/penjualan`);
      const result = await response.json();
      if (result.status) setRiwayatData(result.data || []);
    } catch (err) { console.error('Gagal memuat riwayat:', err); }
    finally { setIsLoadingRiwayat(false); }
  };

  useEffect(() => { fetchProducts(); setTimeout(() => searchInputRef.current?.focus(), 100); }, []);

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const calcDiscount = discountPct > 0 ? (subTotal * discountPct / 100) : Number(discountRp);
  const totalFees = Object.values(fees).reduce((sum, val) => sum + Number(val), 0);
  const grandTotal = subTotal - calcDiscount + totalFees;

  const handlePaymentClick = () => { if (cart.length === 0) return; setIsPaymentModalOpen(true); };

  const onConfirmPayment = async ({ cashAmount: receivedAmount, paymentType }) => {
    const payload = {
      items: cart.map(item => ({ id: item.id, price: item.price, qty: item.qty })),
      subTotal, discountTotal: calcDiscount, grandTotal,
      cashAmount: receivedAmount || grandTotal, paymentType,
      pelanggan_id: selectedPelanggan?.id, dokter_id: selectedDokter?.id, notes: ''
    };
    try {
      const response = await fetch(`${API_BASE}/master/penjualan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (result.status) {
        Swal.fire({ title: 'Transaksi Berhasil!', text: `Invoice #${result.data.invoice} tersimpan.`, icon: 'success', confirmButtonText: 'Cetak Struk', confirmButtonColor: '#7c3aed', customClass: { popup: 'rounded-2xl' } });
        
        // Trigger SATUSEHAT Bridge
        fetch(`${API_BASE}/satusehat/send-dispense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                invoice: result.data.invoice, 
                patient_id: 'P000' + (selectedPelanggan?.id || '123') 
            })
        });

        resetState();
      } else { Swal.fire('Gagal!', result.message, 'error'); }
    } catch (err) { Swal.fire('Kesalahan Sistem', 'Gagal menyimpan transaksi', 'error'); }
  };

  const resetState = () => { setCart([]); setSelectedPelanggan(null); setSelectedDokter(null); setDiscountPct(0); setDiscountRp(0); setFees({ service: 0, embalase: 0, other: 0 }); setIsPaymentModalOpen(false); };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') { e.preventDefault(); handlePaymentClick(); }
      if (e.key === 'F4') { e.preventDefault(); Swal.fire('Segera Hadir', 'Fitur tahan transaksi sedang dalam pengembangan.', 'info'); }
      if (e.shiftKey && e.key === 'Enter') { e.preventDefault(); searchInputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grandTotal, cart]);

  const filteredProducts = searchQuery.trim().length >= 1
    ? products.filter(p => p.nama_produk?.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) || (p.barcode && p.barcode.includes(searchQuery))).slice(0, 8)
    : [];

  const getHargaJual = (product) => { const hargaBeli = parseFloat(product.harga_beli_referensi) || 0; return Math.ceil(hargaBeli * 1.3 / 100) * 100; };

  const selectProduct = (product) => {
    const stok = parseInt(product.stok_total) || 0;
    if (stok <= 0) { Swal.fire({ title: 'Stok Habis', text: `${product.nama_produk} tidak tersedia.`, icon: 'warning', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false }); return; }
    addToCart({ id: product.id, name: product.nama_produk, sku: product.sku || product.barcode, price: getHargaJual(product), unit: product.nama_satuan || 'Pcs' });
    setSearchQuery(''); setShowDropdown(false); setHighlightIndex(-1); searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(prev => Math.min(prev + 1, filteredProducts.length - 1)); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(prev => Math.max(prev - 1, 0)); return; }
    if (e.key === 'Escape') { setShowDropdown(false); setHighlightIndex(-1); return; }
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      e.preventDefault();
      if (highlightIndex >= 0 && filteredProducts[highlightIndex]) { selectProduct(filteredProducts[highlightIndex]); return; }
      if (filteredProducts.length > 0) { selectProduct(filteredProducts[0]); }
      else { Swal.fire({ title: 'Produk tidak ditemukan', text: 'Coba kata kunci lain.', icon: 'warning', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false }); }
    }
  };

  const handleSearchChange = (e) => { setSearchQuery(e.target.value); setShowDropdown(e.target.value.trim().length >= 1); setHighlightIndex(-1); };
  const addToCart = (product) => { setCart(prev => { const existing = prev.find(item => item.id === product.id); const cleanPrice = Number(product.price) || 0; if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item); return [...prev, { ...product, price: cleanPrice, qty: 1 }]; }); };
  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQty = (id, newQty) => { if (newQty < 1) return; setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item)); };
  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  // ===== RIWAYAT VIEW =====
  if (activeView === 'riwayat') {
    return (
      <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden bg-gray-50 dark:bg-gray-950 -m-6">
        <header className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('kasir')} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-primary-600 hover:border-primary-500 transition-all"><FiArrowLeft size={16} /></button>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h1>
              <p className="text-[10px] text-gray-400">{riwayatData.length} transaksi tercatat</p>
            </div>
          </div>
          <button onClick={fetchRiwayat} className="text-xs font-bold text-primary-600 hover:underline">Refresh</button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  {['No. Invoice', 'Tanggal', 'Pelanggan', 'Dokter', 'Total Bayar', 'Pembayaran', 'Status'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                {isLoadingRiwayat ? (
                  <tr><td colSpan="7" className="px-4 py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
                ) : riwayatData.length === 0 ? (
                  <tr><td colSpan="7" className="px-4 py-12 text-center text-gray-400 text-sm italic">Belum ada transaksi</td></tr>
                ) : riwayatData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/50 transition-all">
                    <td className="px-4 py-3"><span className="text-xs font-bold text-primary-600 font-mono">{trx.no_invoice}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDate(trx.tanggal_penjualan)}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 font-medium">{trx.nama_pelanggan || <span className="text-gray-400 italic">Umum</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{trx.nama_dokter || <span className="text-gray-400 italic">-</span>}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-900 tabular-nums">{formatCurrency(trx.total_bayar)}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-md ${trx.jenis_pembayaran === 'Tunai' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{trx.jenis_pembayaran}</span></td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-md ${trx.status_penjualan === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{trx.status_penjualan}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ===== KASIR MAIN VIEW =====
  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden bg-gray-50 dark:bg-gray-950 -m-6 relative">

      {/* === HEADER === */}
      <header className="px-5 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-4xl">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary-500/20"><FiCreditCard size={16} /></div>
            <div className="hidden lg:block">
              <h1 className="text-xs font-bold text-gray-900 dark:text-white leading-none">KASIR</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Nova Farma</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={15} />
            <input
              ref={searchInputRef} type="text" value={searchQuery}
              onChange={handleSearchChange} onKeyDown={handleSearchSubmit}
              onFocus={() => searchQuery.trim().length >= 1 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Cari nama obat, SKU, atau scan barcode..."
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
            />
            {/* Dropdown */}
            {showDropdown && filteredProducts.length > 0 && (
              <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[340px] overflow-y-auto">
                <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{filteredProducts.length} produk ditemukan</span>
                </div>
                {filteredProducts.map((product, idx) => {
                  const harga = getHargaJual(product); const stok = parseInt(product.stok_total) || 0; const stokHabis = stok <= 0;
                  return (
                    <button key={product.id} onMouseDown={(e) => { e.preventDefault(); selectProduct(product); }} disabled={stokHabis}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-all border-b border-gray-50 dark:border-gray-900 last:border-0 ${stokHabis ? 'opacity-40 cursor-not-allowed' : ''} ${idx === highlightIndex ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${stokHabis ? 'bg-red-50 text-red-400' : 'bg-primary-50 text-primary-500'}`}><FiPackage size={13} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{product.nama_produk}</div>
                        <div className="flex items-center gap-1.5"><span className="text-[10px] text-gray-400">{product.sku || '-'}</span><span className="text-[10px] text-gray-300">•</span><span className="text-[10px] text-gray-400">{product.nama_satuan || '-'}</span></div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-primary-600">Rp {harga.toLocaleString('id-ID')}</div>
                        <div className={`text-[10px] font-bold ${stokHabis ? 'text-red-500' : stok <= 5 ? 'text-amber-500' : 'text-green-500'}`}>Stok: {stok}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {showDropdown && searchQuery.trim().length >= 1 && filteredProducts.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 text-center">
                <FiSearch className="mx-auto text-gray-300 mb-1" size={18} /><p className="text-sm text-gray-400">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsModalRacikanOpen(true)} className="h-8 px-3 flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-primary-600 border border-gray-200 dark:border-gray-800 hover:border-primary-500 rounded-lg transition-all">
            <FiLayers size={13} /><span className="hidden xl:inline">Racikan</span>
          </button>
          <button onClick={() => { setActiveView('riwayat'); fetchRiwayat(); }} className="h-8 px-3 flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-primary-600 border border-gray-200 dark:border-gray-800 hover:border-primary-500 rounded-lg transition-all">
            <FiList size={13} /><span className="hidden xl:inline">Riwayat</span>
          </button>
          <button onClick={() => setCart([])} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-gray-200 dark:border-gray-800" title="Hapus Semua">
            <FiTrash2 size={14} />
          </button>
        </div>
      </header>

      {/* === CONTENT === */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Tabel Produk (full height) */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-900">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm z-10">
                <tr>
                  {['No', 'Produk', 'Jumlah', 'Satuan', 'Harga', 'Subtotal', ''].map((h, i) => (
                    <th key={i} className={`px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 ${i === 6 ? 'w-10' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                {cart.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center text-gray-300"><FiPackage size={40} className="mb-2 opacity-20" /><p className="font-semibold text-sm text-gray-400">Keranjang Kosong</p><p className="text-xs text-gray-300 mt-0.5">Cari dan tambahkan produk untuk memulai</p></div>
                  </td></tr>
                ) : cart.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-4 py-2 text-xs font-bold text-gray-400 tabular-nums">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-4 py-2">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.sku}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center bg-gray-100 rounded-md p-0.5 w-fit border border-gray-200">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded bg-white shadow-sm text-gray-500 hover:text-primary-600 flex items-center justify-center active:scale-90"><FiMinus size={11} /></button>
                        <input type="number" value={item.qty} onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)} className="w-8 text-center bg-transparent border-none outline-none font-bold text-gray-900 text-xs tabular-nums" />
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded bg-white shadow-sm text-gray-500 hover:text-primary-600 flex items-center justify-center active:scale-90"><FiPlus size={11} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">{item.unit}</td>
                    <td className="px-4 py-2 text-xs font-semibold text-gray-600 tabular-nums">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(item.price * item.qty)}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => removeItem(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"><FiX size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Status bar */}
          <div className="shrink-0 bg-gray-50 dark:bg-gray-900 py-1.5 px-4 flex items-center justify-between text-[10px] font-bold text-gray-400 border-t border-gray-100 dark:border-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-green-500"><FiCheckCircle size={10} /><span>ONLINE</span></div>
              <span className="text-gray-300">•</span>
              <span>{cart.length} item</span>
            </div>
            <span className="text-gray-300">F2: Bayar • F4: Tahan</span>
          </div>
        </main>

        {/* RIGHT PANEL: Semua info ringkasan, compact, no scroll */}
        <aside className="w-[300px] bg-white dark:bg-gray-900/50 shrink-0 flex flex-col h-full">

          {/* Pelanggan & Dokter */}
          <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <button onClick={() => setIsModalPelangganOpen(true)} className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-primary-500/30 transition-all group">
              <FiUser size={14} className="text-gray-400 group-hover:text-primary-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase">Pelanggan</span>
              <span className="text-[11px] font-semibold text-gray-700 truncate w-full text-center leading-tight">{selectedPelanggan ? selectedPelanggan.nama : 'Umum'}</span>
            </button>
            <button onClick={() => setIsModalDokterOpen(true)} className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-primary-500/30 transition-all group">
              <FiActivity size={14} className="text-gray-400 group-hover:text-primary-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase">Dokter</span>
              <span className="text-[11px] font-semibold text-gray-700 truncate w-full text-center leading-tight">{selectedDokter ? selectedDokter.nama : 'Tanpa Resep'}</span>
            </button>
          </div>

          {/* Rincian Harga: compact rows */}
          <div className="p-3 space-y-1.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-500">Subtotal</span>
              <span className="text-xs font-bold text-gray-900 tabular-nums">{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] text-gray-500">Diskon</span>
              <div className="relative">
                <input type="number" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="w-14 h-6 bg-gray-50 border border-gray-200 rounded text-right px-1 pr-4 text-[11px] font-bold text-gray-900 outline-none focus:border-primary-500" />
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400">%</span>
              </div>
            </div>
            {calcDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-red-400">Potongan</span>
                <span className="text-xs font-bold text-red-500 tabular-nums">-{formatCurrency(calcDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] text-gray-500">B. Layanan</span>
              <input type="number" value={fees.service || ''} onChange={(e) => setFees({ ...fees, service: e.target.value })} className="w-20 h-6 bg-gray-50 border border-gray-200 rounded text-right px-1.5 text-[11px] font-bold text-gray-900 outline-none focus:border-primary-500 tabular-nums" />
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] text-gray-500">Embalase</span>
              <input type="number" value={fees.embalase || ''} onChange={(e) => setFees({ ...fees, embalase: e.target.value })} className="w-20 h-6 bg-gray-50 border border-gray-200 rounded text-right px-1.5 text-[11px] font-bold text-gray-900 outline-none focus:border-primary-500 tabular-nums" />
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[11px] text-gray-500">Biaya Lain</span>
              <input type="number" value={fees.other || ''} onChange={(e) => setFees({ ...fees, other: e.target.value })} className="w-20 h-6 bg-gray-50 border border-gray-200 rounded text-right px-1.5 text-[11px] font-bold text-gray-900 outline-none focus:border-primary-500 tabular-nums" />
            </div>
          </div>

          {/* Spacer pushes total + buttons to bottom */}
          <div className="flex-1" />

          {/* Total Bayar */}
          <div className="p-3 shrink-0">
            <div className="bg-primary-600 px-4 py-4 rounded-xl text-center shadow-lg shadow-primary-500/15">
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-0.5">Total Bayar</div>
              <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">{formatCurrency(grandTotal)}</div>
              {cart.length > 0 && <div className="text-[10px] font-medium text-white/40 mt-1">{cart.length} produk • {cart.reduce((s, i) => s + i.qty, 0)} item</div>}
            </div>
          </div>

          {/* Tombol Aksi: Bayar + Tahan */}
          <div className="p-3 pt-0 flex gap-2 shrink-0">
            <button
              onClick={handlePaymentClick}
              disabled={cart.length === 0}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg py-2.5 flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/20 active:scale-[0.98] transition-all"
            >
              <FiCheckCircle size={14} />
              <span className="font-bold text-xs">Bayar (F2)</span>
            </button>
            <button className="w-12 bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-400 rounded-lg flex items-center justify-center transition-all active:scale-95 shrink-0" title="Tahan (F4)">
              <FiClock size={16} />
            </button>
          </div>
        </aside>
      </div>

      <ModalPilihPelanggan isOpen={isModalPelangganOpen} onClose={() => setIsModalPelangganOpen(false)} onSelect={(p) => setSelectedPelanggan(p)} />
      <ModalPilihDokter isOpen={isModalDokterOpen} onClose={() => setIsModalDokterOpen(false)} onSelect={(d) => setSelectedDokter(d)} />
      <ModalPembayaran isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} totalAmount={grandTotal} onConfirm={onConfirmPayment} />
      <ModalRacikan isOpen={isModalRacikanOpen} onClose={() => setIsModalRacikanOpen(false)} onSelect={(product) => selectProduct(product)} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}
