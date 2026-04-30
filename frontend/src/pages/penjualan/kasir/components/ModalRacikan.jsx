import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiLayers, FiSearch, FiPlus, FiX, FiInfo } from 'react-icons/fi';

export default function ModalRacikan({ isOpen, onClose, onSelect }) {
  const [formulas, setFormulas] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchObat, setSearchObat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('template'); // 'template' | 'custom'
  
  // Custom mix state
  const [mixItems, setMixItems] = useState([]);
  const [mixName, setMixName] = useState('Racikan Custom');
  const [mixJasa, setMixJasa] = useState(5000);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        fetch('http://localhost:8080/api/master/formula').then(r => r.json()),
        fetch('http://localhost:8080/api/produk').then(r => r.json())
      ])
      .then(([resF, resP]) => {
        if (resF.status) setFormulas(resF.data || []);
        if (resP.status) setProducts(resP.data || []);
      })
      .finally(() => setIsLoading(false));
      
      // Reset State
      setMixItems([]);
      setMixName('Racikan Custom');
      setMixJasa(5000);
      setActiveTab('template');
    }
  }, [isOpen]);

  const filteredFormulas = formulas.filter(f => 
    f.nama_formula.toLowerCase().includes(search.toLowerCase()) || 
    f.hasil_produk.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.nama_produk.toLowerCase().includes(searchObat.toLowerCase())
  ).slice(0, 5);

  const handleSelectTemplate = (formula) => {
    onSelect({
      id: formula.produk_id || `TR-${formula.id}`,
      name: `[RACIKAN] ${formula.hasil_produk}`,
      sku: `FORMULA-${formula.id}`,
      price: formula.harga_beli_referensi ? Math.ceil((formula.harga_beli_referensi * 1.3)/100)*100 : 15000,
      unit: 'Bks',
      qty: 1
    });
    onClose();
  };

  const addToMix = (prod) => {
    setSearchObat('');
    if (mixItems.find(i => i.id === prod.id)) return;
    const price = Math.ceil((parseFloat(prod.harga_beli_referensi || 0) * 1.3)/100)*100;
    setMixItems([...mixItems, { ...prod, qty: 1, calculatedPrice: price }]);
  };

  const removeMixItem = (id) => setMixItems(mixItems.filter(i => i.id !== id));
  
  const updateMixQty = (id, newQty) => {
    if (newQty < 1) return;
    setMixItems(mixItems.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const submitCustomMix = () => {
    if (mixItems.length === 0) return;
    const subtotalObat = mixItems.reduce((acc, item) => acc + (item.calculatedPrice * item.qty), 0);
    const finalPrice = Math.ceil((subtotalObat + Number(mixJasa))/100)*100;

    let details = mixItems.map(i => `${i.nama_produk} (${i.qty})`).join(', ');

    onSelect({
      id: `RCK-${Date.now()}`,
      name: `[RACIKAN] ${mixName}`,
      sku: `MIX-${mixItems.length}ITEMS`,
      price: finalPrice,
      unit: 'Puyer/Kaps',
      qty: 1,
      notes: details
    });
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen} onClose={onClose}
      title="Racikan & Compounding"
      subtitle="Gunakan master formula atau buat racikan obat kustom khusus."
      icon={<FiLayers />}
      maxWidth="max-w-4xl"
    >
      <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0">
        <button onClick={() => setActiveTab('template')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'template' ? 'border-primary-500 text-primary-600 bg-primary-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Template Formula</button>
        <button onClick={() => setActiveTab('custom')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'custom' ? 'border-primary-500 text-primary-600 bg-primary-50/30' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Racikan Kustom</button>
      </div>

      {activeTab === 'template' && (
        <div className="p-6">
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" placeholder="Cari nama formula atau hasil puyer..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="col-span-3 py-20 text-center text-gray-400 text-xs">Memuat data formula...</div>
            ) : filteredFormulas.length === 0 ? (
              <div className="col-span-3 py-20 text-center text-gray-400 text-xs italic">Formula tidak ditemukan.</div>
            ) : filteredFormulas.map(formula => (
              <button 
                key={formula.id}
                onClick={() => handleSelectTemplate(formula)}
                className="flex flex-col p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-500 hover:shadow-md transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-2 w-full">
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md uppercase tracking-wider">{formula.nama_formula}</span>
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 text-gray-400 group-hover:text-primary-500 transition-colors"><FiPlus size={14}/></div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-primary-700">{formula.hasil_produk}</span>
                <div className="mt-3 text-[10px] text-gray-400/80 font-mono">Bahan: Paracetamol, Ambroxol, CTM ...</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="flex h-[450px]">
          {/* Left: Find Drugs */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 p-5 flex flex-col bg-gray-50/50 dark:bg-gray-900/20">
            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Pencarian Komposisi Obat</h4>
            <div className="relative mb-3 shrink-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" placeholder="Cari obat untuk ditambahkan ke campuran..." value={searchObat}
                onChange={(e) => setSearchObat(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-semibold outline-none focus:border-primary-500 shadow-sm"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {searchObat.trim().length > 0 && filteredProducts.map(p => (
                <button key={p.id} onClick={() => addToMix(p)} className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-lg hover:border-primary-400 text-left transition-all group">
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{p.nama_produk}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{p.sku} • {p.nama_satuan}</div>
                  </div>
                  <FiPlus className="text-gray-300 group-hover:text-primary-500" size={16}/>
                </button>
              ))}
              {searchObat.trim().length > 0 && filteredProducts.length === 0 && (
                <div className="text-center py-10 text-[11px] text-gray-400 italic">Tidak ada obat dengan kata kunci tersebut.</div>
              )}
            </div>
          </div>

          {/* Right: Compounding Cart */}
          <div className="w-1/2 p-5 flex flex-col bg-white dark:bg-gray-950">
            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Takaran & Kalkulasi</h4>
            
            <input 
              type="text" value={mixName} onChange={e => setMixName(e.target.value)} placeholder="Nama Racikan (Cth: Puyer Bapil Anak)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-sm font-bold text-gray-900 outline-none focus:border-primary-500 mb-4"
            />
            
            <div className="flex-1 overflow-y-auto border-t border-b border-gray-100 dark:border-gray-800 py-2 space-y-2 min-h-0 custom-scrollbar">
              {mixItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                  <FiLayers size={32} className="opacity-20"/>
                  <span className="text-[11px] font-medium text-gray-400">Pilih obat dari panel kiri untuk dicampur</span>
                </div>
              ) : mixItems.map(item => (
                <div key={item.id} className="flex flex-col gap-2 p-2.5 bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 w-2/3 truncate leading-tight">{item.nama_produk}</span>
                    <button onClick={() => removeMixItem(item.id)} className="text-gray-300 hover:text-red-500"><FiX size={14}/></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-mono">Rp {(item.calculatedPrice).toLocaleString('id-ID')}</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 overflow-hidden shrink-0">
                      <input type="number" min="1" value={item.qty} onChange={(e) => updateMixQty(item.id, parseInt(e.target.value)||1)} className="w-12 h-6 text-center text-xs font-bold text-primary-700 bg-transparent outline-none tabular-nums" />
                      <span className="bg-gray-100 dark:bg-gray-900 px-2 h-6 flex items-center text-[9px] font-bold text-gray-500 border-l border-gray-300 dark:border-gray-700 uppercase">{item.nama_satuan || 'Tab'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 shrink-0">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Jasa Embalase / Racik</span>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">Rp</span>
                  <input type="number" value={mixJasa} onChange={e => setMixJasa(e.target.value)} className="w-24 pl-6 pr-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-right text-xs font-bold text-gray-900 outline-none tabular-nums" />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
                <span className="text-gray-900 dark:text-white">Estimasi Harga Akhir</span>
                <span className="text-primary-600 tabular-nums pb-2">
                  Rp {(mixItems.reduce((a,b)=>a+(b.calculatedPrice*b.qty),0) + Number(mixJasa)).toLocaleString('id-ID')}
                </span>
              </div>
              <button 
                onClick={submitCustomMix} disabled={mixItems.length === 0}
                className="w-full bg-primary-600 disabled:bg-gray-300 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-primary-700 shadow-md transition-all uppercase tracking-wider"
              >
                Gunakan Campuran Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalDialog>
  );
}
