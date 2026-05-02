import React from 'react';

export default function PickList({ data, category }) {
  const today = new Date().toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="p-8 bg-white text-gray-900 font-sans">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">FEFO PICK LIST</h1>
          <p className="text-xs font-bold text-gray-500 uppercase">Kategori: {category.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase">Tanggal Cetak</p>
          <p className="text-sm font-bold">{today}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-left text-[10px] font-black uppercase">No</th>
            <th className="py-2 text-left text-[10px] font-black uppercase">Nama Produk</th>
            <th className="py-2 text-left text-[10px] font-black uppercase">Batch Number</th>
            <th className="py-2 text-left text-[10px] font-black uppercase">ED</th>
            <th className="py-2 text-right text-[10px] font-black uppercase">Stok Sisa</th>
            <th className="py-2 text-center text-[10px] font-black uppercase w-20">Check</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="py-3 text-xs font-bold text-gray-400">{i + 1}</td>
              <td className="py-3">
                <p className="text-xs font-black">{item.nama_produk}</p>
                <p className="text-[10px] text-gray-500">{item.sku}</p>
              </td>
              <td className="py-3 text-xs font-medium">{item.batch_number || '-'}</td>
              <td className="py-3 text-xs font-bold text-red-600">
                {new Date(item.tanggal_kadaluarsa).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
              </td>
              <td className="py-3 text-xs font-black text-right tabular-nums">
                {item.stok_total}
              </td>
              <td className="py-3 px-2">
                <div className="w-5 h-5 border border-gray-400 rounded mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div className="border-t border-gray-200 pt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-12">Petugas Gudang</p>
          <p className="text-xs font-bold text-gray-900">( ____________________ )</p>
        </div>
        <div className="border-t border-gray-200 pt-4 text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-12">Apoteker Penanggung Jawab</p>
          <p className="text-xs font-bold text-gray-900">( ____________________ )</p>
        </div>
      </div>

      <div className="mt-8 text-center border-t border-dashed border-gray-200 pt-4">
        <p className="text-[9px] text-gray-400 font-medium italic">
          * Dokumen ini dihasilkan secara otomatis oleh Sistem Apotek Digital. Pastikan pengambilan obat sesuai urutan FEFO untuk meminimalisir expired loss.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { padding: 0; margin: 0; }
          .no-print { display: none; }
        }
      `}} />
    </div>
  );
}
