import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiSearch, FiBox, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function KonsinyasiStok() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { 
      key: 'nama_produk', 
      label: 'Produk',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
            <FiBox size={16} />
          </div>
          <div>
            <div className="font-bold text-gray-900">{val}</div>
            <div className="text-[10px] text-gray-400 font-mono tracking-wider">{row.sku}</div>
          </div>
        </div>
      )
    },
    { key: 'nama_supplier', label: 'Supplier' },
    { 
        key: 'total_masuk', 
        label: 'Stok Konsinyasi',
        align: 'center',
        render: (val, row) => (
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-black text-primary-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">
                    {val}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{row.nama_satuan}</span>
            </div>
        )
    },
    { 
        key: 'actions', 
        label: 'Actions', 
        align: 'right',
        render: () => (
            <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors">
                Detail Transaksi <FiArrowRight />
            </button>
        )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/master/konsinyasi/stok');
      setData(res.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data stok konsinyasi', confirmButtonColor: '#7F56D9' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Stok Konsinyasi" 
        subtitle="Monitoring ketersediaan barang konsinyasi aktif"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-[#1e1e24] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <FiBox size={24} />
              </div>
              <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Item</div>
                  <div className="text-2xl font-black text-gray-900">{data.length}</div>
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-[#2a2a30] mb-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari produk konsinyasi..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading}
        />
      </div>
    </div>
  );
}
