import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import Swal from 'sweetalert2';
import { FiSearch, FiPlus, FiUser, FiMapPin, FiShield, FiLock } from 'react-icons/fi';

export default function ManajemenDaftarPengguna() {
  const [data, setData] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    username: '',
    password: '',
    role_id: '',
    role: '', // Keep for compatibility if needed
    outlet_id: ''
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/users');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOutlets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/outlets-list');
      const result = await response.json();
      if (result.status) setOutlets(result.data);
    } catch (err) {
      console.error('Error fetching outlets:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/roles');
      const result = await response.json();
      if (result.status) setRoles(result.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOutlets();
    fetchRoles();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setFormData({
        id: item.id,
        name: item.name,
        username: item.username,
        password: '', 
        role_id: item.role_id || '',
        role: item.role || '',
        outlet_id: item.outlet_id || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        name: '',
        username: '',
        password: '',
        role_id: roles[0]?.id || '',
        role: roles[0]?.nama_role || '',
        outlet_id: outlets[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.username || (!isEditing && !formData.password)) {
      Swal.fire('Oops!', 'Mohon lengkapi data wajib (*)', 'warning');
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/users/${formData.id}` 
      : 'http://localhost:8080/api/master/users';
    
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
        fetchUsers();
      } else {
        const errorMsg = result.errors ? Object.values(result.errors).join('<br>') : result.message;
        Swal.fire('Gagal!', errorMsg, 'error');
      }
    } catch (err) {
      Swal.fire('Error!', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus User?',
      text: "Aksi ini tidak dapat dibatalkan",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/users/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire('Terhapus!', result.message, 'success');
          fetchUsers();
        }
      } catch (err) {
        Swal.fire('Error!', 'Gagal menghapus user', 'error');
      }
    }
  };

  const handleResetPassword = async (user) => {
    const { value: password } = await Swal.fire({
      title: 'Reset Password',
      text: `Masukkan password baru untuk user: ${user.name}`,
      input: 'password',
      inputPlaceholder: 'Password baru (min. 6 karakter)',
      showCancelButton: true,
      confirmButtonText: 'Reset Sekarang',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value || value.length < 6) return 'Password minimal 6 karakter!';
      }
    });

    if (password) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, password: password })
        });
        const result = await response.json();
        if (result.status) {
          Swal.fire('Berhasil!', 'Password user berhasil direset', 'success');
        } else {
          Swal.fire('Gagal!', result.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error!', 'Terjadi kesalahan sistem', 'error');
      }
    }
  };

  const columns = [
    { label: 'Nama Lengkap', key: 'name' },
    { label: 'Username', key: 'username' },
    { 
      label: 'Peran', 
      key: 'role_name',
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          val === 'Administrator' ? 'bg-purple-100 text-purple-700' :
          val === 'Apoteker' ? 'bg-blue-100 text-blue-700' :
          val === 'Kasir' ? 'bg-teal-100 text-teal-700' : 
          'bg-orange-100 text-orange-700'
        }`}>
          {val || 'No Role'}
        </span>
      )
    },
    { label: 'Outlet Toko', key: 'outlet_name', render: (val) => val || 'Semua Outlet' },
    { 
        label: 'Aksi', 
        key: 'aksi', 
        align: 'center', 
        render: (_, item) => (
            <div className="flex gap-2 justify-center">
                <button onClick={() => handleResetPassword(item)} title="Reset Password" data-tip="Reset Password" className="p-2 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-orange-300 text-orange-600 dark:text-orange-400 rounded-lg transition-all">
                    <FiLock size={14} />
                </button>
                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-primary-300 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-red-300 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors">Hapus</button>
            </div>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Manajemen Pengguna" 
        subtitle="Kelola akses staf, apoteker, dan kasir aplikasi"
        icon={<FiUser className="w-6 h-6 text-primary-600" />}
      />

      <DataTable 
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama atau username..."
        primaryAction={{ label: "Tambah Pengguna", onClick: () => handleOpenModal() }}
      />

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Informasi Pengguna' : 'Tambah Pengguna Baru'}
        icon={<FiUser className="w-5 h-5 text-primary-600" />}
        size="md"
      >
        <div className="p-6 bg-white dark:bg-[#1e1e24] space-y-5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Nama Lengkap *</label>
                   <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Misal: Ahmad Fauzi" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Username *</label>
                   <input type="text" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="username123" />
                </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Peran (Role) *</label>
                   <div className="relative">
                        <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none" value={formData.role_id} onChange={(e) => setFormData({...formData, role_id: e.target.value})}>
                            <option value="">Pilih Peran</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.nama_role}</option>)}
                        </select>
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Outlet Penempatan</label>
                   <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium appearance-none" value={formData.outlet_id} onChange={(e) => setFormData({...formData, outlet_id: e.target.value})}>
                            <option value="">Pilih Outlet</option>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                   </div>
                </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                {isEditing ? 'Ganti Password (Kosongkan jika tidak diubah)' : 'Password *'}
              </label>
              <div className="relative">
                   <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="password" name="password" className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
              </div>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
               <button className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm shadow-sm transition-all" onClick={() => setIsModalOpen(false)}>Batal</button>
               <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2" onClick={handleSave} disabled={isSubmitting}>
                   {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
               </button>
           </div>
        </div>
      </ModalDialog>
    </div>
  );
}
