import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiUser, FiActivity, FiClock, FiCheckCircle } from 'react-icons/fi';
import SectionHeader from '../../../components/ui/SectionHeader';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function DetailResep() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resep, setResep] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/master/resep/${id}`);
      if (resp.data.status) setResep(resp.data.data);
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat detail resep', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const resp = await axios.put(`${API_BASE}/master/resep/${id}/status`, { status: newStatus });
      if (resp.data.status) {
        Swal.fire('Berhasil', `Status diperbarui menjadi ${newStatus}`, 'success');
        fetchDetail();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memperbarui status', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat...</div>;
  if (!resep) return <div className="p-8 text-center text-red-500">Resep tidak ditemukan</div>;

  return (
    <div className="animate-unt-fade space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary-600 transition-all shadow-sm"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{resep.no_resep}</h1>
            <p className="text-sm text-gray-500 font-medium">Detail informasi resep dan daftar obat.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" iconLeft={FiPrinter}>Cetak Etiket</Button>
          {resep.status === 'Baru' && (
            <Button variant="primary" onClick={() => handleUpdateStatus('Diproses')}>Mulai Proses Penyiapan</Button>
          )}
          {resep.status === 'Diproses' && (
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleUpdateStatus('Siap Diambil')}>Siap Diambil</Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Informasi Resep">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <FiClock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Waktu Input</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(resep.tanggal_resep).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FiUser size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pasien</p>
                  <p className="text-sm font-semibold text-gray-900">{resep.nama_pelanggan || 'Umum'}</p>
                  <p className="text-xs text-gray-500">{resep.no_telepon || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <FiActivity size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Dokter Peresep</p>
                  <p className="text-sm font-semibold text-gray-900">{resep.nama_dokter || '-'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Status Saat Ini</p>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  resep.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                  resep.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {resep.status}
                </span>
              </div>
            </div>
          </Card>

          <Card title="QR Code Resep">
            <div className="flex flex-col items-center justify-center p-4">
              <img src={resep.qr_code_path} alt="QR Code" className="w-48 h-48 border-4 border-gray-50 rounded-xl shadow-sm" />
              <p className="mt-3 text-[10px] font-bold text-gray-400 font-mono">{resep.no_resep}</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Items */}
        <div className="lg:col-span-2">
          <Card title="Daftar Obat / R/">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">No</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Obat</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jumlah</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signa / Aturan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resep.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                      <td className="py-4 px-4 text-sm font-bold text-gray-400">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-bold text-gray-900">{item.nama_produk}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{item.sku}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-black text-primary-600">{item.jumlah}</span>
                        <span className="text-xs text-gray-400 ml-1">Unit</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-gray-700">{item.dosis_aturan || '-'}</div>
                        <div className="text-[10px] italic text-gray-400">{item.keterangan || '-'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {resep.catatan && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Catatan Tambahan</p>
                <p className="text-sm text-gray-600 italic">"{resep.catatan}"</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
