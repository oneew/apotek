import React, { useState, useRef } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiUpload, FiCamera, FiCheck, FiAlertTriangle, FiFileText, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API = 'http://localhost:8080/api/master';

export default function PembelianOcr() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrId, setOcrId] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOcrResult(null);
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    const form = new FormData();
    form.append('faktur', file);
    try {
      const res = await fetch(`${API}/ocr/scan`, { method: 'POST', body: form });
      const data = await res.json();
      if (data.status) {
        setOcrResult(data.data_parsed);
        setOcrId(data.ocr_id);
        Swal.fire({ icon: 'success', title: 'Faktur Terbaca!', text: data.message, timer: 3000, showConfirmButton: false });
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal menghubungi server OCR.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const items = [...ocrResult.items];
    items[index][field] = value;
    setOcrResult({ ...ocrResult, items });
  };

  const handleRemoveItem = (index) => {
    setOcrResult({ ...ocrResult, items: ocrResult.items.filter((_, i) => i !== index) });
  };

  const handleConfirm = async () => {
    const res = await fetch(`${API}/ocr/confirm/${ocrId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ocrResult)
    }).then(r => r.json());
    if (res.status) {
      Swal.fire({ icon: 'success', title: 'Data Dikonfirmasi!', text: 'Silahkan lanjutkan ke form pembelian dengan data yang sudah terisi.', confirmButtonColor: '#7F56D9' });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader
        title="OCR Pembaca Faktur Otomatis"
        subtitle="Foto atau upload faktur pembelian dari supplier, sistem akan membaca dan mengisi data secara otomatis."
        icon={<FiCamera size={24} className="text-gray-500" />}
        badges={[{ label: 'AI-Powered', color: 'bg-primary-50 text-primary-700 border border-primary-200' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            <FiUpload className="text-primary-600" /> Upload Foto Faktur
          </h3>

          <div
            onClick={() => inputRef.current.click()}
            className={`relative w-full aspect-[4/3] border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${preview ? 'border-primary-300 bg-primary-50/20' : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/10'}`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
            ) : (
              <div className="text-center space-y-3">
                <FiCamera size={48} className="text-gray-200 mx-auto" />
                <p className="text-sm font-semibold text-gray-400">Klik untuk upload foto faktur</p>
                <p className="text-xs text-gray-300">JPG, PNG, atau PDF</p>
              </div>
            )}
            <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
          </div>

          <button
            onClick={handleScan}
            disabled={!file || isScanning}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm uppercase rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <><span className="animate-pulse">🔍</span> Membaca faktur...</>
            ) : (
              <><FiCamera size={16} /> Scan & Baca Faktur</>
            )}
          </button>

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <FiAlertTriangle size={12} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
              Hasil OCR mungkin tidak 100% akurat. Selalu periksa dan koreksi data sebelum konfirmasi penyimpanan. Kualitas foto yang lebih baik menghasilkan pembacaan yang lebih akurat.
            </p>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            <FiFileText className="text-primary-600" /> Hasil Pembacaan
          </h3>

          {!ocrResult ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300 space-y-3">
              <FiFileText size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Hasil akan muncul setelah scan</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[['Supplier', ocrResult.supplier || '—'], ['Invoice', ocrResult.invoice || '—'], ['Tanggal', ocrResult.tanggal || '—']].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{label}</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Item yang Terdeteksi</label>
                {ocrResult.items?.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">Tidak ada item terdeteksi. Tambah manual.</p>
                ) : ocrResult.items?.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg items-center border border-gray-100 dark:border-gray-700">
                    <div className="col-span-5">
                      <input value={item.nama_produk} onChange={e => handleItemChange(i, 'nama_produk', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-[10px] font-medium outline-none" placeholder="Nama produk..." />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={item.jumlah} onChange={e => handleItemChange(i, 'jumlah', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-[10px] font-mono text-center outline-none" />
                    </div>
                    <div className="col-span-4">
                      <input type="number" value={item.harga_satuan} onChange={e => handleItemChange(i, 'harga_satuan', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-[10px] font-mono outline-none" />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => handleRemoveItem(i)} className="p-1 text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleConfirm} className="w-full py-3 bg-success-600 hover:bg-success-700 text-white font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-2">
                <FiCheck size={16} /> Konfirmasi & Simpan ke Pembelian
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }`}</style>
    </div>
  );
}
