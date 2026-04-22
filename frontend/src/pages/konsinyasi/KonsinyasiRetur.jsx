import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiSearch, FiRotateCcw, FiTruck, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function KonsinyasiRetur() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { 
      key: 'no_faktur', 
      label: 'No. Faktur',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <FiRotateCcw size={16} />
          </div>
          <span className="font-medium text-gray-900">{val}</span>
        </div>
      )
    },
    { key: 'nama_supplier', label: 'Supplier' },
    { 
        key: 'tanggal', 
        label: 'Tanggal',
        render: (val) => new Date(val).toLocaleDateString('id-ID')
    },
    { 
        key: 'status', 
        label: 'Status',
        render: (val) => (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              val === 'Returned' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {val}
            </span>
        )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'right',
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
            {row.status === 'Received' && (
                <button 
                    onClick={() => handleReturn(row.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-red-600/20"
                >
                    Proses Retur
                </button>
            )}
            {row.status === 'Returned' && (
                <span className="text-xs text-gray-400 italic">Telah diretur</span>
            )}
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/master/konsinyasi');
      const filtered = res.data.data.filter(d => d.status === 'Received' || d.status === 'Returned');
      setData(filtered);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data retur konsinyasi', confirmButtonColor: '#7F56D9' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (id) => {
    const result = await Swal.fire({
        title: 'Yakin retur faktur?',
        text: "Pastikan stok fisik telah disesuaikan.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Retur!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:8080/api/master/konsinyasi/${id}`, { status: 'Returned' });
            Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Faktur berhasil diretur', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memproses retur', confirmButtonColor: '#7F56D9' });
        }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Retur Konsinyasi" 
        subtitle="Pengembalian barang konsinyasi ke supplier"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 text-amber-800">
          <FiAlertCircle className="mt-1 flex-shrink-0" size={20} />
          <div>
              <div className="font-bold">Info Retur</div>
              <div className="text-sm opacity-90">Hanya barang dengan status 'Received' yang dapat diajukan pengembalian. Pastikan stok fisik telah disesuaikan sebelum memproses retur.</div>
          </div>
      </div>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-[#2a2a30] mb-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari faktur diterima..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm outline-none transition-all"
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
