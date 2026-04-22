import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiSearch, FiFileText, FiClock, FiUser, FiActivity, FiTag, FiEye } from 'react-icons/fi';
import { BiFile } from 'react-icons/bi';
import ModalDialog from '../../components/ui/ModalDialog';

export default function ManajemenLogAktivitas() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/logs');
      const result = await response.json();
      if (result.status) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns = [
    { label: 'Timestamp', key: 'created_at', render: (val) => (
      <div className="flex items-center gap-2">
        <FiClock className="text-gray-400" size={12} />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 font-mono italic">
          {new Date(val).toLocaleString('id-ID')}
        </span>
      </div>
    )},
    { label: 'Module', key: 'module', render: (val) => (
      <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-tight border border-gray-200 dark:border-gray-700">
        {val}
      </span>
    )},
    { label: 'Action / Description', key: 'activity', render: (val) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-wide">SYSTEM EVENT RECORD</span>
      </div>
    )},
    { label: 'Performed By', key: 'username', render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <FiUser size={12} className="text-primary-600" />
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{val || 'System'}</span>
      </div>
    )},
    { label: '', key: 'aksi', align: 'right', width: '80px', render: (_, item) => (
      <button 
        onClick={() => handleOpenDetail(item)}
        className="p-2 text-gray-400 hover:text-primary-600 transition-all rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
      >
        <FiEye size={16} />
      </button>
    ) }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Activity Logs" 
        subtitle="Chronological audit trail of all system interactions and data modifications."
        icon={<FiActivity size={24} className="text-gray-500" />}
        rightContent={
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition-all border border-gray-200 dark:border-gray-700">
            <BiFile size={16} /> Export Audit
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search audit trail..."
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Activity Specifications"
        subtitle="Detailed payload and metadata for the selected system event."
        icon={<FiFileText />}
        maxWidth="max-w-2xl"
      >
        {selectedLog && (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <FiClock className="text-primary-600" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Event Metadata</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Timestamp</label>
                    <p className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">{new Date(selectedLog.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Actor</label>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedLog.username || 'System'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">IP Address</label>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{selectedLog.ip_address || '0.0.0.0'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <FiTag className="text-primary-600" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Classification</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Module</label>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">{selectedLog.module}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Data Reference ID</label>
                    <p className="text-sm font-mono text-gray-900 dark:text-gray-100">#{selectedLog.data_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                <FiFileText className="text-primary-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Activity Detail</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{selectedLog.activity}</p>
                {selectedLog.payload && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">JSON Payload</label>
                    <pre className="text-[10px] font-mono p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-900 overflow-auto max-h-40 text-gray-600 dark:text-gray-400">
                      {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
