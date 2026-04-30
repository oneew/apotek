import React, { useState, useEffect } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import ModalRetur from './components/ModalRetur';
import { FiRepeat, FiPlus, FiFilter, FiSearch, FiTruck, FiBox, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PembelianRetur() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRetur = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/master/pembelian/retur`);
      if (resp.data.status) setData(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetur();
  }, []);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { 
      key: 'tanggal_retur', 
      label: 'Tanggal Retur',
      render: (val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    { key: 'no_retur', label: 'No. Retur', render: (val) => <span className="font-bold text-primary-600">{val}</span> },
    { key: 'nama_supplier', label: 'Supplier' },
    { key: 'nama_produk', label: 'Produk' },
    { key: 'jumlah', label: 'Qty', align: 'center' },
    { key: 'alasan', label: 'Alasan' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            val === 'Selesai' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4">
      <SectionHeader 
        title="Retur ke PBF (Supplier)" 
        subtitle="Pengembalian obat/alkes ke supplier karena rusak, kadaluarsa, atau sisa."
        icon={<FiRepeat size={24} className="text-amber-500" />}
      >
        <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
        >
          <FiPlus /> Buat Retur Baru
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <FiTruck size={24} />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Pengiriman</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{data.length}</p>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <FiAlertCircle size={24} />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Menunggu Pickup</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{data.filter(d => d.status === 'Pending').length}</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <DataTable columns={columns} data={data} isLoading={loading} />
      </div>
      
      <ModalRetur 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaveSuccess={fetchRetur} 
      />
    </div>
  );
}
