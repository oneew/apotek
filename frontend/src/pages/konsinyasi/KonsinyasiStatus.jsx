import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiActivity } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function KonsinyasiStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { key: 'no_faktur', label: 'No. Faktur', render: (val) => <span className="font-bold text-gray-700">{val}</span> },
    { key: 'nama_supplier', label: 'Supplier' },
    { 
        key: 'tanggal', 
        label: 'Tanggal',
        render: (val) => new Date(val).toLocaleDateString('id-ID')
    },
    { 
        key: 'total_nilai', 
        label: 'Total Nilai',
        render: (val) => <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(val)}</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val === 'Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
          val === 'Pending' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
          val === 'Returned' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/master/konsinyasi');
      setData(res.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data status konsinyasi', confirmButtonColor: '#7F56D9' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
      { label: 'Pending', value: data.filter(d => d.status === 'Pending').length, icon: <FiClock />, color: 'blue' },
      { label: 'Received', value: data.filter(d => d.status === 'Received').length, icon: <FiCheckCircle />, color: 'emerald' },
      { label: 'Returned', value: data.filter(d => d.status === 'Returned').length, icon: <FiAlertCircle />, color: 'primary' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Status Konsinyasi" 
        subtitle="Tracking status faktur dan pengiriman barang konsinyasi"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                      {stat.icon}
                  </div>
                  <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                      <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  </div>
              </div>
          ))}
      </div>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-[#2a2a30] mb-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari faktur..."
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
