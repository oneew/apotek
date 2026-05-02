import React, { useState, useEffect } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import { FiPlus, FiFilter, FiSearch, FiPrinter, FiUser, FiLayers, FiShoppingCart, FiSettings, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormResepModal from './FormResepModal';
import DetailResepModal from './DetailResepModal';
import ModalDialog from '../../../components/ui/ModalDialog';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananPenerimaanResep() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState('Hari ini');
  const [filterSumber, setFilterSumber] = useState('');
  const [search, setSearch] = useState('');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedResepId, setSelectedResepId] = useState(null);
  const [templates, setTemplates] = useState([]);

  const fetchResep = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/master/resep?sumber=${filterSumber}`;
      if (filterTanggal !== 'Semua') {
          url += `&filter_tanggal=${filterTanggal}`;
      }
      const resp = await axios.get(url);
      if (resp.data.status) setData(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const resp = await axios.put(`${API_BASE}/master/resep/${id}/status`, { status: newStatus });
      if (resp.data.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: `Status resep diperbarui menjadi ${newStatus}.`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
        fetchResep();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memperbarui status resep', 'error');
    }
  };

  useEffect(() => {
    fetchResep();
  }, [filterSumber, filterTanggal]);

  const handleOpenTemplateModal = () => {
    const saved = JSON.parse(localStorage.getItem('resep_templates') || '[]');
    setTemplates(saved);
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (id) => {
    const updated = templates.filter(t => t.id !== id);
    localStorage.setItem('resep_templates', JSON.stringify(updated));
    setTemplates(updated);
    Swal.fire('Terhapus', 'Template berhasil dihapus', 'success');
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { 
      key: 'tanggal', 
      label: 'Tanggal Input',
      render: (val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    { key: 'no_resep', label: 'Kode Resep', render: (val) => <span className="font-bold text-primary-600 font-mono tracking-tight">{val}</span> },
    { 
      key: 'sumber', 
      label: 'Sumber',
      render: (val) => (
        <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${val === 'Kasir' ? 'text-amber-600' : 'text-blue-600'}`}>
          {val === 'Kasir' ? <FiShoppingCart size={12} /> : <FiUser size={12} />}
          {val}
        </span>
      )
    },
    { 
      key: 'is_racikan', 
      label: 'Jenis',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${val ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
          {val ? 'RACIKAN' : 'NON-RACIKAN'}
        </span>
      )
    },
    { key: 'nama_pelanggan', label: 'Pasien', render: (val) => <span className={val ? "font-semibold text-gray-900 dark:text-gray-100" : "italic text-gray-500"}>{val || 'Umum'}</span> },
    { key: 'nama_dokter', label: 'Dokter', render: (val) => val || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => {
        let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
        if (val === 'Selesai') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (val === 'Siap Diambil') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (val === 'Diproses') colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
        if (val === 'Baru') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${colorClass}`}>
            {val}
          </span>
        )
      }
    },
    { 
      key: 'actions', 
      label: 'Aksi', 
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedResepId(row.id); setIsDetailModalOpen(true); }}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            Detail
          </button>
          {row.status === 'Baru' && (
            <button 
              onClick={() => handleUpdateStatus(row.id, 'Diproses')}
              className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Proses
            </button>
          )}
          {row.status === 'Diproses' && (
            <button 
              onClick={() => handleUpdateStatus(row.id, 'Siap Diambil')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Siap Diambil
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Penerimaan Resep" 
        subtitle="Manajemen antrian dan digitalisasi resep dari internal maupun eksternal."
      >
        <div className="flex items-center gap-3">
           <Button variant="secondary" iconLeft={FiSettings} onClick={handleOpenTemplateModal}>
              Template Resep
           </Button>
           <Button variant="primary" iconLeft={FiPlus} onClick={() => setIsFormModalOpen(true)}>
              Catat Resep Baru
           </Button>
        </div>
      </SectionHeader>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Sumber:</label>
          <select 
            value={filterSumber} 
            onChange={e => setFilterSumber(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="">Semua Sumber</option>
            <option value="Pelayanan">Apoteker (Internal)</option>
            <option value="Kasir">Kasir (Eksternal)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <select 
            value={filterTanggal} 
            onChange={e => setFilterTanggal(e.target.value)}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
          >
            <option value="Semua">Semua Waktu</option>
            <option value="Hari ini">Hari ini</option>
            <option value="Bulan ini">Bulan ini</option>
            <option value="Tahun ini">Tahun ini</option>
          </select>
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap shadow-sm">
            <FiFilter size={16} /> Filter Lanjutan
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{(filterSumber ? 1 : 0) + (filterTanggal !== 'Semua' ? 1 : 0)}</span>
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading} 
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari resep atau nama pasien..."
      />
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div className="flex-1">
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi Resep Digital</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Total data hari ini dan status terkini.</p>
           </div>
           
           <div className="flex gap-8 px-6">
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Resep</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{data.length}</h3>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dari Kasir</p>
                <h3 className="text-xl font-black text-amber-600">{data.filter(d => d.sumber === 'Kasir').length}</h3>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Proses/Baru</p>
                <h3 className="text-xl font-black text-primary-600">{data.filter(d => d.status !== 'Selesai').length}</h3>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Selesai/Siap</p>
                <h3 className="text-xl font-black text-emerald-600">{data.filter(d => d.status === 'Selesai' || d.status === 'Siap Diambil').length}</h3>
             </div>
           </div>
        </div>
      </div>

      <FormResepModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={fetchResep}
      />

      {/* Template Manager Modal */}
      <ModalDialog
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Manajemen Template Resep"
        subtitle="Kelola daftar obat yang sering diresepkan."
        icon={<FiSettings />}
      >
        <div className="p-6">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada template tersimpan.</p>
              <p className="text-sm mt-2">Buat template baru dari formulir "Catat Resep Baru".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map(t => (
                <div key={t.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{t.items.length} macam obat • {t.is_racikan ? 'Racikan' : 'Non-Racikan'}</p>
                    <div className="flex gap-2 flex-wrap mt-2">
                       {t.items.map((item, idx) => (
                         <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1 rounded">
                           {item.nama_produk || 'Obat'} ({item.jumlah})
                         </span>
                       ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteTemplate(t.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Hapus Template"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
           <Button variant="secondary" onClick={() => setIsTemplateModalOpen(false)}>Tutup</Button>
        </div>
      </ModalDialog>

      <DetailResepModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        resepId={selectedResepId}
        onStatusUpdated={fetchResep}
      />
    </div>
  );
}

