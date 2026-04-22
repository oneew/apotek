import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiLock, FiUnlock, FiLogOut, FiChevronRight, FiAlertCircle, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function ShiftManagement() {
  const [tab, setTab] = useState('new');
  const [cashAmount, setCashAmount] = useState('0');
  const [shiftType, setShiftType] = useState('Sore');
  const [isLocked, setIsLocked] = useState(true);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleStartShift = () => {
    localStorage.setItem('active_shift', JSON.stringify({ cashAmount, shiftType, startedAt: new Date().toISOString() }));
    navigate('/home');
  };
  
  const handleSkipShift = () => {
    localStorage.setItem('active_shift', JSON.stringify({ skipped: true }));
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center p-6 transition-colors duration-200 animate-unt-fade">
      {/* Header Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center py-6 border-b border-gray-100 dark:border-gray-800 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
            <span className="text-lg">🏥</span>
          </div>
          <span className="text-gray-900 dark:text-white font-black text-xl tracking-tight">APOTEK DIGITAL</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <Button variant="secondary" size="sm" iconLeft={FiLogOut} onClick={logout} className="font-bold">Sign out</Button>
        </div>
      </div>

      {/* Hero Welcome */}
      <div className="text-center mb-16 max-w-2xl px-4 animate-unt-slide-up">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
          Selamat Pagi, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Anda akan bertugas di <span className="text-primary-600 dark:text-primary-400 font-bold">Nova Farma</span>. <br/>Pastikan data kas sesuai sebelum memulai transaksi.
        </p>
      </div>

      {/* Setup Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[40px] p-8 md:p-14 shadow-2xl shadow-gray-200 dark:shadow-none animate-unt-fade flex flex-col md:flex-row gap-16 items-start">
        {/* Left Pane */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="border border-gray-100 dark:border-gray-800 rounded-3xl p-8 bg-gray-50 dark:bg-gray-950/50 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-[32px] flex items-center justify-center mb-8 shadow-sm border border-gray-50 dark:border-gray-800">
               <FiAlertCircle size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Persiapan Shift</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Input saldo modal awal untuk akurasi laporan kasir di akhir sesi Anda.
            </p>
            
            <div className="w-full mt-10 space-y-4">
               <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                 <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Server Online</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Pane */}
        <div className="flex-1 w-full space-y-8">
          {/* Theme-Aware Tabs */}
          <div className="inline-flex p-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 w-full rounded-2xl">
            <button 
              onClick={() => setTab('new')} 
              className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl ${tab === 'new' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Start New Shift
            </button>
            <button 
              onClick={() => setTab('join')} 
              className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl ${tab === 'join' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Join Active Shift
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5 ml-1">Modal Awal Kas (IDR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                <input 
                  type="number" 
                  value={cashAmount} 
                  onChange={(e) => setCashAmount(e.target.value)} 
                  className="unt-input pl-11 font-black text-xl py-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5 ml-1">Pilih Sesi Shift</label>
              <select 
                value={shiftType} 
                onChange={(e) => setShiftType(e.target.value)} 
                className="unt-input font-bold py-4 appearance-none"
              >
                <option>Sesi Pagi (08:00 - 15:00)</option>
                <option>Sesi Sore (15:00 - 22:00)</option>
                <option>Sesi Malam (22:00 - 08:00)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-5 py-4 border-t border-gray-100 dark:border-gray-800 pt-8">
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all ${isLocked ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-900/30' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600'}`}
            >
              {isLocked ? <FiLock size={24} /> : <FiUnlock size={24} />}
            </button>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900 dark:text-white">Konfigurasi {isLocked ? 'Terkunci' : 'Terbuka'}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                {isLocked ? 'Data siap dikirim ke server.' : 'Silakan sesuaikan saldo modal Anda.'}
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-6">
            <Button size="xl" className="w-full font-black py-4 text-lg shadow-xl shadow-primary-900/20" onClick={handleStartShift}>
              Buka Sesi Kasir Sekarang
            </Button>
            <button 
              onClick={handleSkipShift}
              className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2"
            >
              Masuk tanpa membuka shift (Mode View Only) <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
