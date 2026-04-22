import React, { useState } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { FiPlus, FiList, FiAlertTriangle, FiTrendingUp, FiActivity, FiBriefcase } from 'react-icons/fi';
import ModalRencana from './components/ModalRencana';
import RiwayatTab from './components/RiwayatTab';
import DefectaTab from './components/DefectaTab';
import AnalisisTab from './components/AnalisisTab';

export default function PembelianRencana() {
  const [activeTab, setActiveTab] = useState('riwayat');
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const handleCreateFromReference = (items) => {
    setInitialData(items);
    setModalOpen(true);
  };

  const tabs = [
    { id: 'riwayat', label: 'Active Requisitions', icon: <FiList /> },
    { id: 'defecta', label: 'Defecta Priority', icon: <FiAlertTriangle /> },
    { id: 'analisis', label: 'AI Strategy', icon: <FiTrendingUp /> },
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Procurement Strategy" 
        subtitle="Manage and authorize procurement plans and supply chain logistics."
        icon={<FiBriefcase className="text-gray-500" size={24} />}
        rightContent={
          <button 
            onClick={() => { setInitialData(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 group"
          >
            <FiPlus className="group-hover:rotate-90 transition-all font-bold" /> Create Purchase Plan
          </button>
        }
      />

      <div className="space-y-6">
        {/* Navigation Tabs - Untitled UI Style */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-primary-600 text-primary-700 dark:text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {React.cloneElement(tab.icon, { size: 16 })}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Surface */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'riwayat' && <RiwayatTab />}
          {activeTab === 'defecta' && <DefectaTab onAdd={handleCreateFromReference} />}
          {activeTab === 'analisis' && <AnalisisTab onAdd={handleCreateFromReference} />}
        </div>
      </div>

      <ModalRencana 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initialData={initialData}
        onSaveSuccess={() => {
            window.dispatchEvent(new CustomEvent('refresh-plans'));
        }} 
      />
    </div>
  );
}
