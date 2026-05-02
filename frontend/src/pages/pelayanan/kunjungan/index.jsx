import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import ModalDialog from '../../../components/ui/ModalDialog';
import Button from '../../../components/ui/Button';
import { 
  FiPlus, 
  FiFilter, 
  FiRefreshCw, 
  FiEdit3, 
  FiTrash2, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiUser,
  FiActivity,
  FiEye,
  FiArrowRightCircle
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananKunjungan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKunjungan, setSelectedKunjungan] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);

  // Form dependencies
  const [jenisAntrian, setJenisAntrian] = useState([]);
  const [jenisPelayanan, setJenisPelayanan] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [dokter, setDokter] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/kunjungan?search=${search}&date=${date}`);
      const res = await response.json();
      if (res.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [search, date]);

  const fetchDependencies = async () => {
    try {
      const [antrianRes, pelayananRes, pelangganRes, dokterRes] = await Promise.all([
        fetch(`${API_BASE}/master/jenis-antrian`).then(r => r.json()),
        fetch(`${API_BASE}/master/jenis-pelayanan`).then(r => r.json()),
        fetch(`${API_BASE}/master/pelanggan`).then(r => r.json()),
        fetch(`${API_BASE}/master/dokter`).then(r => r.json()),
      ]);

      if (antrianRes.status) setJenisAntrian(antrianRes.data);
      if (pelayananRes.status) setJenisPelayanan(pelayananRes.data);
      if (pelangganRes.status) setPelanggan(pelangganRes.data);
      if (dokterRes.status) setDokter(dokterRes.data);
    } catch (error) {
      console.error("Dependency fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDependencies();
  }, [fetchData]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Kunjungan?',
      text: "Data kunjungan akan dihapus permanen dari sistem.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7F56D9',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE}/master/kunjungan/${id}`, { method: 'DELETE' });
          const res = await response.json();
          if (res.status) {
            Swal.fire('Terhapus!', 'Data kunjungan telah dihapus.', 'success');
            fetchData();
          }
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus data.', 'error');
        }
      }
    });
  };

  const handleOpenDetail = (row) => {
    setSelectedKunjungan(row);
    setIsEdit(false);
    setIsDetailView(true);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedKunjungan({
      tanggal_kunjungan: new Date().toISOString().slice(0, 16),
      jenis_antrian_id: '',
      jenis_pelayanan_id: '',
      pelanggan_id: '',
      dokter_id: '',
      keluhan: '',
      catatan: '',
      status: 'Waiting',
      posisi: 'Pendaftaran'
    });
    setIsEdit(false);
    setIsDetailView(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    setSelectedKunjungan({
      ...row,
      tanggal_kunjungan: new Date(row.tanggal_kunjungan).toISOString().slice(0, 16),
      keluhan: row.keluhan || '',
      catatan: row.catatan || ''
    });
    setIsEdit(true);
    setIsDetailView(false);
    setModalOpen(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/master/kunjungan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const res = await response.json();
      if (res.status) {
        Swal.fire({
          title: 'Status Diperbarui!',
          text: `Kunjungan kini berstatus ${newStatus}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
        setModalOpen(false);
        fetchData();
      }
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui status.', 'error');
    }
  };

  const columns = [
    { 
      key: 'nomor_antrian', 
      label: 'Antrian',
      render: (val) => <span className="font-bold text-primary-600 font-mono tracking-tight">{val}</span>
    },
    { 
      key: 'tanggal_kunjungan', 
      label: 'Waktu',
      render: (val) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold">{new Date(val).toLocaleDateString('id-ID')}</span>
          <span className="text-gray-400 text-xs">{new Date(val).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    },
    { key: 'nama_pelayanan', label: 'Pelayanan' },
    { 
      key: 'nama_pelanggan', 
      label: 'Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className={val ? "text-gray-900 font-semibold" : "text-gray-400 italic font-medium"}>
            {val || "Umum"}
          </span>
          {row.keluhan && <span className="text-[10px] text-primary-500 font-medium truncate max-w-[150px]">{row.keluhan}</span>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Waiting': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
          'In Progress': 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
          'Finished': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
          'Cancelled': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
          'Skipped': 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
        };
        const icons = {
          'Waiting': FiClock,
          'In Progress': FiActivity,
          'Finished': FiCheckCircle,
          'Cancelled': FiXCircle,
          'Skipped': FiXCircle
        };
        const Icon = icons[val] || FiClock;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colors[val]}`}>
            <Icon size={12} />
            {val}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-1">
          <button 
            onClick={() => handleOpenDetail(row)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
            title="Lihat Detail"
          >
            <FiEye size={16} />
          </button>
          <button 
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
            title="Edit"
          >
            <FiEdit3 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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
        title="Kunjungan Pasien" 
        subtitle="Kelola antrian dan registrasi kunjungan pasien secara real-time."
      />

      <div className="mt-8">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={loading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nomor antrian atau nama pasien..."
          primaryAction={{
            label: "Antrian Baru",
            onClick: handleOpenAdd
          }}
        />
      </div>

      {/* Modal Form Kunjungan */}
      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isDetailView ? "Informasi Kunjungan" : isEdit ? "Edit Detail Kunjungan" : "Tambah Kunjungan"}
        subtitle={isDetailView || isEdit ? `Nomor Antrian: ${selectedKunjungan?.nomor_antrian}` : "Daftarkan pasien ke dalam antrian pelayanan."}
        icon={isDetailView ? <FiEye /> : isEdit ? <FiActivity /> : <FiPlus />}
        maxWidth="max-w-2xl"
      >
        {isDetailView ? (
          <KunjunganDetailView 
            data={selectedKunjungan} 
            onStatusChange={(newStatus) => {
              handleUpdateStatus(selectedKunjungan.id, newStatus);
            }}
            onClose={() => setModalOpen(false)}
          />
        ) : (
          <KunjunganForm 
            initialData={selectedKunjungan}
            dependencies={{ jenisAntrian, jenisPelayanan, pelanggan, dokter }}
            isEdit={isEdit}
            onSuccess={() => {
              setModalOpen(false);
              fetchData();
            }}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </ModalDialog>
    </div>
  );
}

function KunjunganDetailView({ data, onStatusChange, onClose }) {
  const statusColors = {
    'Waiting': 'bg-gray-100 text-gray-600',
    'In Progress': 'bg-primary-50 text-primary-600',
    'Finished': 'bg-emerald-50 text-emerald-600',
    'Cancelled': 'bg-red-50 text-red-600',
    'Skipped': 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Info */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status Saat Ini</label>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${statusColors[data.status]}`}>
              <div className={`w-2 h-2 rounded-full ${data.status === 'In Progress' ? 'bg-primary-500 animate-pulse' : 'bg-current'}`} />
              {data.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pasien</label>
              <p className="text-sm font-bold text-gray-900">{data.nama_pelanggan || "Umum"}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Waktu</label>
              <p className="text-sm font-bold text-gray-900">{new Date(data.tanggal_kunjungan).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pelayanan</label>
              <p className="text-sm font-bold text-gray-700">{data.nama_pelayanan}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Dokter</label>
              <p className="text-sm font-bold text-gray-700">{data.nama_dokter || "-"}</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Keluhan</label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-600 italic">
              {data.keluhan || "Tidak ada keluhan tertulis."}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Status Update */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <FiArrowRightCircle className="text-primary-600" /> Perbarui Status
          </h4>
          <div className="flex flex-col gap-2">
            {['In Progress', 'Finished', 'Skipped', 'Cancelled'].map((status) => (
              <button
                key={status}
                disabled={data.status === status}
                onClick={() => onStatusChange(status)}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group
                  ${data.status === status 
                    ? 'bg-white dark:bg-gray-900 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-800' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 border border-transparent shadow-sm'
                  }`}
              >
                {status}
                {data.status !== status && <FiArrowRightCircle className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button variant="secondary" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
}

function KunjunganForm({ initialData, dependencies, isEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = isEdit ? `${API_BASE}/master/kunjungan/${formData.id}` : `${API_BASE}/master/kunjungan`;
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
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Waktu Kunjungan</label>
          <input 
            type="datetime-local" 
            className="unt-input"
            value={formData.tanggal_kunjungan}
            onChange={(e) => setFormData({...formData, tanggal_kunjungan: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis Antrian</label>
          <select 
            className="unt-input"
            value={formData.jenis_antrian_id}
            onChange={(e) => setFormData({...formData, jenis_antrian_id: e.target.value})}
            required
            disabled={isEdit}
          >
            <option value="">Pilih Antrian</option>
            {dependencies.jenisAntrian.map(a => <option key={a.id} value={a.id}>{a.nama_antrian} ({a.kode_prefix})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis Pelayanan</label>
          <select 
            className="unt-input"
            value={formData.jenis_pelayanan_id}
            onChange={(e) => setFormData({...formData, jenis_pelayanan_id: e.target.value})}
            required
          >
            <option value="">Pilih Pelayanan</option>
            {dependencies.jenisPelayanan.map(p => <option key={p.id} value={p.id}>{p.nama_pelayanan}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pasien/Pelanggan</label>
          <div className="flex gap-2">
            <select 
              className="unt-input"
              value={formData.pelanggan_id}
              onChange={(e) => setFormData({...formData, pelanggan_id: e.target.value})}
            >
              <option value="">Umum</option>
              {dependencies.pelanggan.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan}</option>)}
            </select>
            <button type="button" className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
              <FiPlus size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dokter Tujuan</label>
          <div className="flex gap-2">
            <select 
              className="unt-input"
              value={formData.dokter_id}
              onChange={(e) => setFormData({...formData, dokter_id: e.target.value})}
            >
              <option value="">Tanpa Dokter</option>
              {dependencies.dokter.map(d => <option key={d.id} value={d.id}>{d.nama_dokter}</option>)}
            </select>
            <button type="button" className="p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
              <FiPlus size={18} />
            </button>
          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Keluhan Pasien</label>
          <textarea 
            className="unt-input min-h-[80px]"
            value={formData.keluhan}
            onChange={(e) => setFormData({...formData, keluhan: e.target.value})}
            placeholder="Tuliskan keluhan utama pasien..."
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catatan Tambahan</label>
          <textarea 
            className="unt-input min-h-[60px]"
            value={formData.catatan}
            onChange={(e) => setFormData({...formData, catatan: e.target.value})}
            placeholder="Catatan tambahan (misal: alergi obat, riwayat penyakit)..."
          />
        </div>

        {isEdit && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select 
                className="unt-input"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Waiting">Waiting</option>
                <option value="In Progress">In Progress</option>
                <option value="Skipped">Skipped</option>
                <option value="Finished">Finished</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Posisi Saat Ini</label>
              <input 
                type="text"
                className="unt-input"
                value={formData.posisi}
                onChange={(e) => setFormData({...formData, posisi: e.target.value})}
                placeholder="Misal: Pemeriksaan"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 mt-4">
        <Button variant="secondary" onClick={onCancel} type="button">Batal</Button>
        <Button variant="primary" type="submit" loading={submitting}>
          {isEdit ? "Simpan Perubahan" : "Daftarkan Pasien"}
        </Button>
      </div>
    </form>
  );
}
