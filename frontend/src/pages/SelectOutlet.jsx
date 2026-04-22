import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiPlus, FiLogOut, FiArrowRight, FiHome, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';

const mockOutlets = [
  { id: 1, name: 'Nova Farma', outlet_code: 'nova08', logo: '🏥' },
];

export default function SelectOutlet() {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSelectOutlet = (outlet) => { 
    setSelectedOutlet(outlet); 
    setShowModal(true); 
  };
  
  const handleConfirm = () => { 
    localStorage.setItem('selected_outlet', JSON.stringify(selectedOutlet)); 
    navigate('/shift'); 
  };

  return (
    <div className="min-h-screen bg-gray-25 dark:bg-gray-950 flex flex-col items-center py-12 px-6 transition-colors duration-200 animate-unt-fade">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-extrabold text-sm mb-3 tracking-widest uppercase">
               <FiHome size={18} /> Apotek Digital Lilac
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Pilih Outlet</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-lg">Silahkan pilih outlet untuk mulai sesi kerja Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 shadow-sm"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <Button variant="secondary" iconLeft={FiLogOut} onClick={logout} className="font-bold">Logout</Button>
          </div>
        </div>

        {/* Lilac Info Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white mb-12 shadow-2xl shadow-primary-900/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           <div className="relative z-10">
             <h3 className="text-2xl font-extrabold mb-2 tracking-tight">Ingin Menambah Cabang?</h3>
             <p className="text-primary-100 text-base font-medium opacity-90">Anda dapat mengelola ribuan outlet dalam satu dashboard terpusat.</p>
           </div>
           <Button className="bg-white text-primary-700 hover:bg-primary-50 border-none relative z-10 font-bold px-10 py-3 shadow-lg">
             Tambah Outlet
           </Button>
        </div>

        {/* Outlet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center p-10 bg-white/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-900 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-2xl transition-all cursor-pointer group min-h-[260px]">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110">
               <FiPlus size={32} className="text-gray-400 group-hover:text-primary-600" />
             </div>
             <p className="text-xl font-extrabold text-gray-900 dark:text-white">Daftar Outlet</p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium text-center">Buka cabang baru sekarang</p>
          </div>

          {mockOutlets.map((outlet) => (
            <Card 
              key={outlet.id} 
              className="group hover:shadow-2xl transition-all scale-100 hover:scale-[1.02] duration-300"
              noPadding
            >
              <div className="p-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-950 dark:bg-primary-600 text-white rounded-[32px] flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:bg-primary-600 transition-colors transform group-hover:rotate-6">
                  {outlet.logo}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{outlet.name}</h3>
                <span className="text-xs font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-lg uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                  {outlet.outlet_code}
                </span>
                
                <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-8" />
                
                <Button 
                  className="w-full font-bold py-3.5 text-base" 
                  iconRight={FiArrowRight}
                  onClick={() => handleSelectOutlet(outlet)}
                >
                  Pilih Outlet
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        title="Konfirmasi Masuk"
        footer={
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="font-bold py-3">Batal</Button>
            <Button onClick={handleConfirm} className="font-bold py-3">Ya, Masuk Sekarang</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center py-8">
          <div className="w-24 h-24 bg-gray-950 text-white rounded-[32px] flex items-center justify-center text-5xl mb-6 shadow-2xl">
            {selectedOutlet?.logo}
          </div>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedOutlet?.name}</h4>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium mt-3 text-center leading-relaxed">
            Anda akan diarahkan ke dashboard <br/><span className="font-bold text-primary-600">Lilac Edition</span> untuk outlet ini.
          </p>
        </div>
      </Modal>
    </div>
  );
}
