import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import ModalDialog from '../../../components/ui/ModalDialog';
import Button from '../../../components/ui/Button';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiFileText, 
  FiUser, 
  FiCalendar, 
  FiPhone, 
  FiMapPin,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananRekamMedis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRiwayatOpen, setModalRiwayatOpen] = useState(false);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/pelanggan?search=${search}`);
      const res = await response.json();
      if (res.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchRiwayat = async (pelangganId) => {
    setLoadingRiwayat(true);
    try {
      const response = await fetch(`${API_BASE}/master/kunjungan?pelanggan_id=${pelangganId}`);
      const res = await response.json();
      if (res.status) {
        setRiwayat(res.data);
      }
    } catch (error) {
      console.error("Riwayat fetch error:", error);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  const handleOpenRiwayat = (row) => {
    setSelectedPelanggan(row);
    setRiwayat([]);
    setModalRiwayatOpen(true);
    fetchRiwayat(row.id);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Data Pasien?',
      text: "Data rekam medis pasien akan dihapus secara permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7F56D9',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE}/master/pelanggan/${id}`, { method: 'DELETE' });
          const res = await response.json();
          if (res.status) {
            Swal.fire('Terhapus!', 'Data pasien telah dihapus.', 'success');
            fetchData();
          }
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus data.', 'error');
        }
      }
    });
  };

  const handleOpenAdd = () => {
    setSelectedPelanggan({
      nama_pelanggan: '',
      no_telepon: '',
      alamat: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L'
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    setSelectedPelanggan({
      ...row,
      tanggal_lahir: row.tanggal_lahir || ''
    });
    setIsEdit(true);
    setModalOpen(true);
  };

  const columns = [
    { 
      key: 'kode_pelanggan', 
      label: 'No. RM',
      render: (val) => <span className="font-bold text-primary-600 font-mono tracking-tight">{val}</span>
    },
    { 
      key: 'nama_pelanggan', 
      label: 'Nama Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold">{val}</span>
          <span className="text-gray-400 text-[10px] uppercase tracking-widest">{row.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
        </div>
      )
    },
    { 
      key: 'no_telepon', 
      label: 'Kontak',
      render: (val) => val || <span className="text-gray-300">-</span>
    },
    { 
      key: 'tanggal_lahir', 
      label: 'Tgl. Lahir',
      render: (val) => val ? new Date(val).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : <span className="text-gray-300">-</span>
    },
    { 
      key: 'alamat', 
      label: 'Alamat',
      render: (val) => <span className="truncate max-w-[200px] block">{val || "-"}</span>
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1">
          <button 
            onClick={() => handleOpenRiwayat(row)}
            className="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            title="Riwayat Medis"
          >
            <FiFileText size={14} /> Riwayat
          </button>
          <button 
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit"
          >
            <FiEdit3 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Hapus"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Daftar Rekam Medis" 
        subtitle="Database pasien dan riwayat kunjungan medis terintegrasi."
      />

      <div className="mt-8">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={loading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama pasien atau nomor rekam medis..."
          primaryAction={{
            label: "Pasien Baru",
            onClick: handleOpenAdd
          }}
        />
      </div>

      {/* Modal Form Pasien */}
      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? "Edit Data Pasien" : "Registrasi Pasien Baru"}
        subtitle={isEdit ? `ID: ${selectedPelanggan?.kode_pelanggan}` : "Masukkan informasi identitas pasien dengan lengkap."}
        icon={<FiUser />}
        maxWidth="max-w-xl"
      >
        <PelangganForm 
          initialData={selectedPelanggan}
          isEdit={isEdit}
          onSuccess={() => {
            setModalOpen(false);
            fetchData();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </ModalDialog>

      {/* Modal Riwayat Kunjungan */}
      <ModalDialog
        isOpen={modalRiwayatOpen}
        onClose={() => setModalRiwayatOpen(false)}
        title="Riwayat Rekam Medis"
        subtitle={`Pasien: ${selectedPelanggan?.nama_pelanggan}`}
        icon={<FiFileText />}
        maxWidth="max-w-4xl"
      >
        <RiwayatView 
          data={riwayat} 
          loading={loadingRiwayat} 
          onClose={() => setModalRiwayatOpen(false)} 
        />
      </ModalDialog>
    </div>
  );
}

function PelangganForm({ initialData, isEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = isEdit ? `${API_BASE}/master/pelanggan/${formData.id}` : `${API_BASE}/master/pelanggan`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const res = await response.json();
      
      if (res.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          confirmButtonColor: '#7F56D9',
        });
        onSuccess();
      } else {
        Swal.fire('Gagal', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="col-span-full">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap Pasien</label>
          <input 
            type="text" 
            className="unt-input"
            value={formData.nama_pelanggan}
            onChange={(e) => setFormData({...formData, nama_pelanggan: e.target.value})}
            required
            placeholder="Contoh: Budi Santoso"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nomor Handphone</label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              className="unt-input pl-10"
              value={formData.no_telepon}
              onChange={(e) => setFormData({...formData, no_telepon: e.target.value})}
              placeholder="0812..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Lahir</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date" 
              className="unt-input pl-10"
              value={formData.tanggal_lahir}
              onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Jenis Kelamin</label>
          <select 
            className="unt-input"
            value={formData.jenis_kelamin}
            onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Alamat Lengkap</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <textarea 
              className="unt-input pl-10 min-h-[80px]"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              placeholder="Jalan, No Rumah, Kelurahan, Kecamatan..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button variant="secondary" onClick={onCancel} type="button">Batal</Button>
        <Button variant="primary" type="submit" loading={submitting}>
          {isEdit ? "Simpan Perubahan" : "Simpan Pasien"}
        </Button>
      </div>
    </form>
  );
}

function RiwayatView({ data, loading, onClose }) {
  if (loading) return <div className="p-20 text-center text-gray-400 font-bold">Memuat riwayat...</div>;
  
  if (data.length === 0) return (
    <div className="p-20 text-center space-y-4">
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
        <FiFileText size={32} />
      </div>
      <p className="text-gray-500 font-bold">Belum ada riwayat kunjungan untuk pasien ini.</p>
      <Button variant="secondary" onClick={onClose}>Tutup</Button>
    </div>
  );

  const statusIcons = {
    'Waiting': FiClock,
    'In Progress': FiActivity,
    'Finished': FiCheckCircle,
    'Cancelled': FiXCircle,
    'Skipped': FiXCircle
  };

  const statusColors = {
    'Waiting': 'text-gray-500',
    'In Progress': 'text-primary-600',
    'Finished': 'text-emerald-600',
    'Cancelled': 'text-red-600',
    'Skipped': 'text-amber-600'
  };

  return (
    <div className="p-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((item, idx) => {
          const Icon = statusIcons[item.status] || FiClock;
          return (
            <div key={idx} className="group relative pl-8 pb-8 last:pb-0">
              {/* Timeline Line */}
              {idx !== data.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
              )}
              
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border-2 transition-all group-hover:scale-110 
                ${item.status === 'Finished' ? 'border-emerald-500' : 'border-primary-500'}`}>
                <Icon size={12} className={statusColors[item.status]} />
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {item.nama_pelayanan}
                      <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">{item.nomor_antrian}</span>
                    </h5>
                    <p className="text-xs text-gray-400 font-medium">{new Date(item.tanggal_kunjungan).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${statusColors[item.status]} bg-opacity-10`}>
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Dokter</label>
                    <p className="font-bold text-gray-700 dark:text-gray-300">{item.nama_dokter || "Tanpa Dokter"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Posisi</label>
                    <p className="font-bold text-gray-700 dark:text-gray-300">{item.posisi}</p>
                  </div>
                </div>

                {item.keluhan && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs italic text-gray-600 dark:text-gray-400 border-l-2 border-primary-500">
                    "{item.keluhan}"
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button variant="secondary" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
}

