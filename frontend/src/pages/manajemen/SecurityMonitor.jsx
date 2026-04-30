import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiShield, FiAlertTriangle, FiRefreshCw, FiCheckCircle, FiLock, FiCpu } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function SecurityMonitor() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [systemStatus, setSystemStatus] = useState('UNKNOWN'); 

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/master/audit/logs').then(r => r.json());
      if (res.status) setLogs(res.data);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleVerify = async () => {
      setIsVerifying(true);
      Swal.fire({
          title: 'Verifying Cryptographic Chain',
          text: 'Pengecekan SHA-256 hash pada seluruh log...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
      });

      try {
          const res = await fetch('http://localhost:8080/api/master/audit/verify').then(r => r.json());
          if (res.status) {
              setSystemStatus('SECURE');
              Swal.fire({ icon: 'success', title: 'Data Integrity OK', text: res.message, confirmButtonColor: '#10B981' });
          } else {
              setSystemStatus('COMPROMISED');
              Swal.fire({ icon: 'error', title: 'INTEGRITY COMPROMISED!', text: res.message, confirmButtonColor: '#EF4444' });
          }
      } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Koneksi ke backend gagal.'});
      } finally {
          setIsVerifying(false);
      }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'created_at', label: 'Timestamp', render: (val) => <span className="text-xs whitespace-nowrap text-gray-500">{new Date(val).toLocaleString('id-ID')}</span> },
    { key: 'nama_lengkap', label: 'User / Actor', render: (val, item) => <div className="flex flex-col"><strong className="text-xs">{val || 'SYSTEM'}</strong><span className="text-[10px] text-gray-400">{item.ip_address}</span></div> },
    { key: 'module', label: 'Module / Action', render: (val, item) => <div className="flex flex-col"><span className="text-xs font-bold uppercase tracking-wider text-primary-600">{val}</span><span className="text-[10px] uppercase text-gray-500">{item.activity}</span></div> },
    { key: 'current_hash', label: 'Block Hash', render: (val, item) => {
        const isBroken = systemStatus === 'COMPROMISED' && item.id >= item.broken_at_id; // Just UI mockup styling rules
        return (
            <div className="flex items-center gap-1.5 p-1 px-2 rounded font-mono text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
               {isBroken ? <FiAlertTriangle className="text-red-500" /> : <FiLock className="text-green-500" />}
               <span className="truncate w-32" title={val}>{val ? val.substring(0, 12) + '...' : 'GENESIS'}</span>
            </div>
        )
    }}
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Audit &amp; Security Monitor" 
        subtitle="Sistem pemantauan ketahanan integritas data menggunakan SHA-256 Hash Chaining. Setiap mutasi basis transaksi dicatat dengan jejak blok terenkripsi."
        icon={<FiShield size={24} className="text-gray-500" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Status Panel */}
         <div className="lg:col-span-1 space-y-4">
             <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${systemStatus === 'UNKNOWN' ? 'bg-gray-900 border-gray-800' : systemStatus === 'SECURE' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-600 border-red-500'}`}>
                 {systemStatus === 'UNKNOWN' ? <FiCpu size={48} className="text-gray-400 mb-4" /> : systemStatus === 'SECURE' ? <FiCheckCircle size={48} className="text-white mb-4" /> : <FiAlertTriangle size={48} className="text-white animate-pulse mb-4" />}
                 <h3 className="text-white text-lg font-black tracking-widest uppercase mb-1">
                     {systemStatus === 'UNKNOWN' ? 'SYSTEM STATE' : systemStatus === 'SECURE' ? 'SYSTEM SECURE' : 'COMPROMISED!'}
                 </h3>
                 <p className="text-white/80 text-[11px] font-medium max-w-[200px] leading-tight">
                     {systemStatus === 'UNKNOWN' ? 'Integritas data belum diverifikasi. Jalankan analisis rantai block.' : systemStatus === 'SECURE' ? 'Seluruh struktur Hash-Chaining di database terpaut sempurna. Data aman.' : 'PERINGATAN! Seseorang secara manual memodifikasi level basis data. Rantai terputus.'}
                 </p>
             </div>
             
             <button 
                 onClick={handleVerify} disabled={isVerifying}
                 className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-800 disabled:cursor-wait text-white rounded-xl font-black text-sm uppercase tracking-widest flex justify-center items-center gap-2 transition-all shadow-xl shadow-gray-900/20 active:scale-95"
             >
                 {isVerifying ? <FiRefreshCw className="animate-spin" size={18} /> : <FiShield size={18} />}
                 Analisis Keselamatan
             </button>
         </div>

         {/* Data Table Panel */}
         <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
             <div className="mb-4 pt-1 px-1 flex justify-between items-center">
                 <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Cryptographic Log Ledger</h4>
             </div>
             <DataTable 
                 data={logs} 
                 columns={columns} 
                 isLoading={loading} 
                 searchQuery={searchQuery} 
                 onSearchChange={setSearchQuery} 
                 searchPlaceholder="Filter berdasarkan ID/Module/User..." 
             />
         </div>
      </div>
    </div>
  );
}
