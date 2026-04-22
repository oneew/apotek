import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiLink, FiShield, FiRefreshCw, FiCheckCircle, FiActivity, FiSettings, FiExternalLink, FiKey } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function SatusehatSettings() {
  const [config, setConfig] = useState({
    organization_id: '',
    is_connected: false,
    environment: 'Sandbox',
    last_sync: '-',
    stats: { encounter_sent: 0, medication_sent: 0, errors: 0 }
  });
  const [isTesting, setIsTesting] = useState(false);

  const fetchConfig = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/satusehat/config');
      const result = await response.json();
      if (result.status) setConfig(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('http://localhost:8080/api/satusehat/test', { method: 'POST' });
      const result = await response.json();
      if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Connection Success',
          text: result.message,
          confirmButtonColor: '#7F56D9'
        });
        fetchConfig();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to connect to Kemenkes environment', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="SATUSEHAT Integration Bridge" 
        subtitle="Manage Kemenkes RME (Rekam Medis Elektronik) connectivity and data synchronization."
        icon={<FiLink size={24} className="text-gray-500" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <FiSettings size={22} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Platform Configuration</h3>
                <p className="text-sm text-gray-500 font-medium">Define your Kemenkes DTO credentials.</p>
              </div>
              <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.is_connected ? 'bg-success-50 text-success-700 border-success-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {config.is_connected ? 'Active Bridge' : 'Offline'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Organization ID</label>
                <div className="relative">
                  <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" readOnly value={config.organization_id} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-primary-500 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Environment</label>
                <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary-500 shadow-sm transition-all focus:ring-4 focus:ring-primary-50 cursor-pointer">
                  <option>Development (Staging)</option>
                  <option>Production (Beta)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-8">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Auth Credentials</label>
               <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" value="********" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium" />
                  </div>
                  <button className="bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase py-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-black/10">Update Keys</button>
               </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button 
                onClick={handleTestConnection}
                disabled={isTesting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                {isTesting ? <FiRefreshCw className="animate-spin" /> : <FiActivity />} Test Handshake
              </button>
              <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95 shadow-primary-600/20">Sync All RME Data</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-500/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col h-full">
              <h4 className="text-white font-bold text-sm mb-1">Bridge Health Score</h4>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-primary-400 leading-none">98.4<span className="text-xl">%</span></span>
                <span className="text-[10px] text-primary-200 font-bold uppercase tracking-widest bg-primary-500/20 px-2 py-0.5 rounded">Optimal</span>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary-200 font-medium opacity-70">Encounters Sent</span>
                  <span className="text-xs text-white font-bold">{config.stats.encounter_sent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary-200 font-medium opacity-70">Medications Sync</span>
                  <span className="text-xs text-white font-bold uppercase">{config.stats.medication_sent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary-200 font-medium opacity-70">Handshake Latency</span>
                  <span className="text-xs text-success-400 font-bold">120ms</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-[10px] font-bold text-primary-100 uppercase tracking-widest">Real-time Sync Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <FiExternalLink size={32} className="text-gray-300 mb-4" />
            <h5 className="text-sm font-bold text-gray-900 mb-1 leading-tight uppercase tracking-tight">Kemenkes Dashboard</h5>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">View official reports and compliance scores in the Kemenkes DTO Portal.</p>
            <a href="https://satusehat.kemkes.go.id/dashboard" target="_blank" rel="noreferrer" className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded-lg border border-gray-200 transition-all">Launch Portal</a>
          </div>
        </div>
      </div>
    </div>
  );
}
