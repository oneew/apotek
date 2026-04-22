import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiLayers, FiSearch } from 'react-icons/fi';

export default function ModalRacikan({ isOpen, onClose, onSelect }) {
  const [formulas, setFormulas] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('http://localhost:8080/api/master/formula')
        .then(res => res.json())
        .then(res => {
          if (res.status) setFormulas(res.data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const filtered = formulas.filter(f => 
    f.nama_formula.toLowerCase().includes(search.toLowerCase()) || 
    f.hasil_produk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Formula Racikan"
      subtitle="Gunakan master formula untuk mempercepat transaksi obat racikan."
      icon={<FiLayers />}
      maxWidth="max-w-2xl"
    >
      <div className="p-6">
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama formula atau produk..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="col-span-2 py-20 text-center text-gray-400 text-xs">Memuat data formula...</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-2 py-20 text-center text-gray-400 text-xs italic">Formula tidak ditemukan.</div>
          ) : filtered.map(formula => (
            <button 
              key={formula.id}
              onClick={() => {
                onSelect({
                  id: formula.produk_id,
                  nama_produk: `[RACIKAN] ${formula.hasil_produk}`,
                  sku: `FORMULA-${formula.id}`,
                  harga_beli_referensi: formula.harga_beli_referensi || 0,
                  stok_total: 999, // Formula is usually made to order
                  nama_satuan: 'Racikan'
                });
                onClose();
              }}
              className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-500 hover:shadow-md transition-all text-left group"
            >
              <span className="text-[10px] font-bold text-primary-600 uppercase mb-1 tracking-wider">{formula.nama_formula}</span>
              <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-700">{formula.hasil_produk}</span>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                 <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Items</span>
                    <span className="text-[11px] font-bold text-gray-600">{formula.total_item || 0} Prod</span>
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ModalDialog>
  );
}
