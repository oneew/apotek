import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiBell, FiHelpCircle, FiSearch, FiUser, FiLogOut, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';
import Button from './ui/Button';

/**
 * TopBar — Untitled UI slim top navigation with Theme Toggle
 */
export default function TopBar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const sessionCode = `B${new Date().toISOString().slice(2, 10).replace(/-/g, '')}`;

  return (
    <header className="h-16 bg-white dark:bg-[#1e1e24] border-b border-gray-200 dark:border-[#2a2a30] flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-200">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <FiMenu size={20} />
        </button>
        
        {/* Search bar */}
        <div className="hidden lg:flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 w-[300px] gap-2">
          <FiSearch className="text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari fitur (cmd + k)" 
            className="bg-transparent border-none text-sm outline-none text-gray-700 dark:text-gray-300 w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-500 dark:text-gray-400 mr-1"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="text-right">
            <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-tight">Nova Farma</p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{sessionCode}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
        </div>

        <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-500 dark:text-gray-400 relative">
          <FiBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white dark:ring-gray-950" />
        </button>

        <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-gray-500 dark:text-gray-400">
          <FiSettings size={20} />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
          >
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-900 shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-2 w-56 z-50 animate-unt-slide-up">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium truncate">{user?.username}</p>
                  <div className="mt-2.5">
                    <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] font-bold rounded-full border border-primary-100 dark:border-primary-800 uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>
                
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
                  <FiUser className="text-gray-400" /> Profil Pengguna
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-left">
                  <FiHelpCircle className="text-gray-400" /> Bantuan
                </button>
                
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1.5" />
                
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-semibold"
                >
                  <FiLogOut className="text-error" /> Keluar Aplikasi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
