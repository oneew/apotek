import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import Swal from 'sweetalert2';
import { FiSearch, FiPlus, FiShield, FiCheckSquare, FiSquare, FiSettings, FiTrash2, FiEdit3 } from 'react-icons/fi';

export default function ManajemenPeran() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAksesModalOpen, setIsAksesModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const [formData, setFormData] = useState({ id: null, nama_role: '', keterangan: '' });

  const menuList = [
    { key: 'dashboard', label: 'Dashboard Overview' },
    { key: 'master_data', label: 'Pengaturan Master Data' },
    { key: 'manajemen_stok', label: 'Manajemen Stok & Inventori' },
    { key: 'pembelian', label: 'Transaksi Pembelian (PO)' },
    { key: 'penjualan', label: 'Point of Sale (Kasir)' },
    { key: 'pelayanan', label: 'Pelayanan Klinik / Resep' },
    { key: 'laporan', label: 'Laporan & Analisis Data' },
    { key: 'manajemen_user', label: 'Manajemen User & Akses' }
  ];

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/roles');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setFormData({ id: item.id, nama_role: item.nama_role, keterangan: item.keterangan });
    } else {
      setIsEditing(false);
      setFormData({ id: null, nama_role: '', keterangan: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenAksesModal = async (role) => {
    setSelectedRole(role);
    try {
      const response = await fetch(`http://localhost:8080/api/master/roles/${role.id}`);
      const result = await response.json();
      if (result.status) {
        const existing = result.data.permissions || [];
        const merged = menuList.map(menu => {
          const match = existing.find(e => e.menu_key === menu.key);
          return match ? {
              ...match,
              can_view: parseInt(match.can_view),
              can_create: parseInt(match.can_create),
              can_edit: parseInt(match.can_edit),
              can_delete: parseInt(match.can_delete)
          } : { 
            menu_key: menu.key, 
            can_view: 0, can_create: 0, can_edit: 0, can_delete: 0 
          };
        });
        setPermissions(merged);
        setIsAksesModalOpen(true);
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat hak akses', 'error');
    }
  };

  const handleTogglePermission = (menuKey, action) => {
    setPermissions(prev => prev.map(p => {
      if (p.menu_key === menuKey) {
        return { ...p, [action]: p[action] ? 0 : 1 };
      }
      return p;
    }));
  };

  const handleSaveRole = async () => {
    if (!formData.nama_role) {
      Swal.fire('Oops!', 'Nama Peran wajib diisi', 'warning');
      return;
    }
    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/roles/${formData.id}` 
      : 'http://localhost:8080/api/master/roles';
    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire('Berhasil!', result.message, 'success');
        setIsModalOpen(false);
        fetchRoles();
      }
    } catch (err) {
        Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSavePermissions = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/master/roles/permissions/${selectedRole.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire('Berhasil!', 'Hak akses berhasil diperbarui', 'success');
        setIsAksesModalOpen(false);
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal menyimpan hak akses', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
      const confirm = await Swal.fire({
          title: 'Hapus Peran?',
          text: "Seluruh hak akses terkait juga akan dihapus.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Ya, Hapus!'
      });

      if (confirm.isConfirmed) {
          try {
              const response = await fetch(`http://localhost:8080/api/master/roles/${id}`, { method: 'DELETE' });
              const result = await response.json();
              if (result.status) {
                  Swal.fire('Terhapus!', result.message, 'success');
                  fetchRoles();
              }
          } catch (err) {
              Swal.fire('Error', 'Gagal menghapus peran', 'error');
          }
      }
  };

  const columns = [
    { label: 'Nama Peran', key: 'nama_role' },
    { label: 'Deskripsi', key: 'keterangan', render: (val) => val || '-' },
    { 
      label: 'Aksi', 
      key: 'aksi', 
      align: 'center', 
      render: (_, item) => (
        <div className="flex gap-2 justify-center">
            <button onClick={() => handleOpenAksesModal(item)} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5">
                <FiSettings /> Atur Akses
            </button>
            <button onClick={() => handleOpenModal(item)} className="p-2 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-gray-400 text-gray-600 dark:text-gray-400 rounded-xl transition-all">
                <FiEdit3 size={14} />
            </button>
            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-red-400 text-red-600 dark:text-red-400 rounded-xl transition-all">
                <FiTrash2 size={14} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Peran & Hak Akses" 
        subtitle="Kelola level kewenangan dan batasan menu masing-masing jabatan"
        icon={<FiShield className="w-6 h-6 text-primary-600" />}
      />

      <DataTable 
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari peran..."
        primaryAction={{ label: "Tambah Peran", onClick: () => handleOpenModal() }}
      />

      {/* Modal CRUD Role */}
      <ModalDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Peran' : 'Tambah Peran Baru'} icon={<FiShield className="text-primary-600" />}>
        <div className="p-6 space-y-4 bg-white dark:bg-[#1e1e24]">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Nama Peran *</label>
            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all focus:bg-white" value={formData.nama_role} onChange={e => setFormData({...formData, nama_role: e.target.value})} placeholder="Misal: Supervisor, Apoteker Jaga" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Keterangan / Deskripsi</label>
            <textarea className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all focus:bg-white" rows="3" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} placeholder="Deskripsi mengenai tugas atau wewenang peran ini..." />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-all" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30 transition-all" onClick={handleSaveRole} disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Peran'}</button>
          </div>
        </div>
      </ModalDialog>

      {/* Modal Atur Akses (Matrix) */}
      <ModalDialog isOpen={isAksesModalOpen} onClose={() => setIsAksesModalOpen(false)} title={`Konfigurasi Hak Akses: ${selectedRole?.nama_role}`} icon={<FiSettings className="text-primary-600" />} size="lg">
        <div className="p-0 bg-white dark:bg-[#1e1e24] flex flex-col max-h-[80vh]">
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Modul / Menu Aplikasi</th>
                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase text-center tracking-[0.1em]">Lihat</th>
                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase text-center tracking-[0.1em]">Tambah</th>
                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase text-center tracking-[0.1em]">Ubah</th>
                            <th className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase text-center tracking-[0.1em]">Hapus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {menuList.map(menu => {
                            const p = permissions.find(x => x.menu_key === menu.key) || {};
                            return (
                                <tr key={menu.key} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{menu.label}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">Internal Key: {menu.key}</span>
                                        </div>
                                    </td>
                                    {['can_view', 'can_create', 'can_edit', 'can_delete'].map(action => (
                                        <td key={action} className="px-4 py-4 text-center">
                                            <button 
                                                onClick={() => handleTogglePermission(menu.key, action)}
                                                className={`p-2 rounded-xl transition-all border ${p[action] ? 'text-primary-600 bg-primary-50 border-primary-200' : 'text-gray-300 bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800'}`}
                                            >
                                                {p[action] ? <FiCheckSquare size={22} className="stroke-[2.5]" /> : <FiSquare size={22} className="stroke-[1.5]" />}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all" onClick={() => setIsAksesModalOpen(false)}>Batal</button>
                <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-sm shadow-xl shadow-primary-500/40 transition-all flex items-center gap-2" onClick={handleSavePermissions} disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan Konfigurasi...' : 'Terapkan Hak Akses'}
                </button>
            </div>
        </div>
      </ModalDialog>
    </div>
  );
}
