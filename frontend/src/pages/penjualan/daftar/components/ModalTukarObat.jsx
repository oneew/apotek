import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiRefreshCcw, FiSearch, FiCheckCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalTukarObat({ isOpen, onClose, saleData, onComplete }) {
  const [selectedReturnedItem, setSelectedReturnedItem] = useState(null);
  const [searchObat, setSearchObat] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedReplacementItem, setSelectedReplacementItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/produk')
        .then(r => r.json())
        .then(res => { if (res.status) setProducts(res.data); });
        
      setSelectedReturnedItem(null);
      setSelectedReplacementItem(null);
      setSearchObat('');
    }
  }, [isOpen, saleData]);

  const filteredProducts = products.filter(p => 
    p.nama_produk.toLowerCase().includes(searchObat.toLowerCase())
  ).slice(0, 10);

  const getHargaJual = (product) => {
    return Math.ceil((parseFloat(product.harga_beli_referensi || 0) * 1.3) / 100) * 100;
  };

  const handleSelectReplacement = (prod) => {
    const replacementPrice = getHargaJual(prod);
    const returnPrice = parseFloat(selectedReturnedItem.harga_jual_per_satuan);

    if (replacementPrice < returnPrice) {
      Swal.fire({
        title: 'Retur Ditolak',
        text: `Harga obat pengganti (Rp ${replacementPrice.toLocaleString('id-ID')}) lebih kecil dari obat yang diretur (Rp ${returnPrice.toLocaleString('id-ID')}). Obat pengganti harus memiliki harga yang sama atau lebih besar.`,
        icon: 'error',
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    setSelectedReplacementItem({ ...prod, calculatedPrice: replacementPrice });
  };

  const submitRetur = () => {
    if (!selectedReturnedItem || !selectedReplacementItem) return;

    Swal.fire({
      title: 'Proses Tukar Barang',
      text: `Menukar ${selectedReturnedItem.nama_produk} dengan ${selectedReplacementItem.nama_produk}. Proses ini akan memperbarui stok gudang dan mencatat riwayat retur.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Proses Sekarang',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#7c3aed'
    }).then((res) => {
      if (res.isConfirmed) {
    fetch('/api/master/penjualan/retur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        penjualan_id: saleData.id,
        detail_id: selectedReturnedItem.id,
        replacement_product_id: selectedReplacementItem.id
      })
    })
    .then(r => r.json())
    .then(res => {
      if (res.status) {
        Swal.fire({
          title: 'Berhasil', 
          text: 'Tukar barang berhasil diproses dan stok telah diperbarui.', 
          icon: 'success',
          confirmButtonColor: '#7c3aed'
        });
        onComplete();
        onClose();
      } else {
        Swal.fire('Gagal', res.message || 'Gagal memproses retur', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire('Error', 'Kesalahan koneksi ke server.', 'error');
    });
      }
    });
  };

  if (!saleData) return null;

  return (
    <ModalDialog
      isOpen={isOpen} onClose={onClose}
      title={`Retur & Tukar Barang - ${saleData.no_invoice}`}
      subtitle="Fasilitas penukaran obat jika rusak atau terdapat kekeliruan, diwajibkan menukar dengan item seharga atau lebih."
      icon={<FiRefreshCcw />}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col md:flex-row h-[500px] border-t border-gray-100 dark:border-gray-800">
        
        {/* Step 1: Barang yang Diretur */}
        <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-gray-900/20 p-5 border-r border-gray-100 dark:border-gray-800 flex flex-col">
          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px]">1</span>
            Barang Retur
          </h4>
          <p className="text-[10px] text-gray-500 mb-3">Pilih item dari invoice {saleData.no_invoice} yang akan dikembalikan pelanggan:</p>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {saleData.items.map(item => (
              <button 
                key={item.id} 
                onClick={() => { setSelectedReturnedItem(item); setSelectedReplacementItem(null); }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedReturnedItem?.id === item.id ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary-300'}`}
              >
                <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">{item.nama_produk}</div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500">{item.jumlah_jual} {item.nama_satuan} dibeli</span>
                  <span className="font-bold text-primary-600">Rp {parseFloat(item.harga_jual_per_satuan).toLocaleString('id-ID')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Barang Pengganti */}
        <div className="w-full md:w-2/3 p-5 flex flex-col relative">
          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px]">2</span>
            Barang Pengganti
          </h4>
          
          {!selectedReturnedItem ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-300">
              <FiRefreshCcw size={32} className="mb-2 opacity-20" />
              <p className="text-xs font-semibold text-gray-400">Pilih barang retur dari panel sebelah kiri terlebih dahulu.</p>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" placeholder="Cari obat pengganti..." value={searchObat} onChange={e => setSearchObat(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-semibold outline-none focus:border-primary-500 transition-all focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto content-start custom-scrollbar pr-2 pb-20">
                {searchObat.length > 0 && filteredProducts.map(p => {
                  const pPrice = getHargaJual(p);
                  const isMatch = pPrice >= parseFloat(selectedReturnedItem.harga_jual_per_satuan);
                  return (
                    <button 
                      key={p.id} onClick={() => handleSelectReplacement(p)}
                      className={`flex flex-col p-3 rounded-lg border transition-all text-left group ${selectedReplacementItem?.id === p.id ? 'border-green-500 bg-green-50/30' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary-400'}`}
                    >
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate w-full group-hover:text-primary-600">{p.nama_produk}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-500">Stok: {p.stok_total || 0}</span>
                        <span className={`text-[10px] font-bold ${isMatch ? 'text-green-600' : 'text-red-500'}`}>Rp {pPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step 3: Floating Action Bar */}
              {selectedReplacementItem && (
                <div className="absolute bottom-5 left-5 right-5 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 shadow-xl shadow-green-900/5 rounded-xl p-4 flex items-center justify-between z-10 animate-unt-fade">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                       <FiCheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Validasi Berhasil</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                         <span className="truncate max-w-[120px]" title={selectedReturnedItem.nama_produk}>{selectedReturnedItem.nama_produk}</span>
                         <FiArrowRight className="text-green-500" />
                         <span className="truncate max-w-[120px] text-green-600" title={selectedReplacementItem.nama_produk}>{selectedReplacementItem.nama_produk}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={submitRetur} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase rounded-lg transition-all shadow-md active:scale-95">
                    Proses Retur
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
