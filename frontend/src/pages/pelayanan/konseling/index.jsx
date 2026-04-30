import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import { FiActivity, FiUsers, FiPlus, FiMessageSquare, FiFileText, FiCalendar, FiUser } from 'react-icons/fi';
import ModalKonseling from './components/ModalKonseling';

export default function KonselingList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchKonseling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/master/konseling');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKonseling();
  }, []);

  const columns = [
    {
      key: 'tanggal_konseling',
      label: 'Tanggal & Waktu',
      render: (val) => {
        const d = new Date(val);
        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="text-[10px] text-gray-400 font-medium">{d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      }
    },
    {
      key: 'nama_pelanggan',
      label: 'Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary-700">{val || 'Umum'}</span>
          <span className="text-[10px] text-gray-400">{row.no_telepon || '-'}</span>
        </div>
      )
    },
    {
      key: 'nama_apoteker',
      label: 'Apoteker',
      render: (val) => <span className="font-semibold text-gray-700">{val || 'N/A'}</span>
    },
    {
      key: 'keluhan',
      label: 'Keluhan Utama',
      render: (val) => <div className="max-w-[200px] truncate italic text-gray-400 text-[11px] font-medium">{val || 'No notes...'}</div>
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { setSelectedId(row.id); setIsModalOpen(true); }}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Lihat Detail / Edit"
          >
            <FiFileText size={16} />
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.nama_pelanggan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_apoteker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keluhan?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4">
      <SectionHeader 
        title="Konseling Apoteker" 
        subtitle="Manajemen sesi konseling klinis antara apoteker dan pasien untuk optimasi terapi."
        icon={<FiMessageSquare size={24} className="text-primary-500" />}
      >
        <button 
          onClick={() => { setSelectedId(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <FiPlus /> Tambah Sesi Konseling
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5 border-none shadow-sm bg-white">
          <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Sesi</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{data.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 p-5 border-none shadow-sm bg-white">
          <div className="w-12 h-12 bg-success-50 text-success-500 rounded-xl flex items-center justify-center">
            <FiUsers size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pasien Dilayani</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {[...new Set(data.map(d => d.pelanggan_id))].length}
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari berdasarkan pasien, apoteker, atau keluhan..."
        />
      </div>

      <ModalKonseling 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        id={selectedId}
        onSaveSuccess={fetchKonseling}
      />
    </div>
  );
}
