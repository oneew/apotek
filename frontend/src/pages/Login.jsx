import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiEye, FiEyeOff, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/select-outlet');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-6 transition-colors duration-200 animate-unt-fade">
      <div className="absolute top-8 right-8">
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-bold flex items-center gap-2 text-sm shadow-sm"
        >
          {isDark ? <><FiSun /> Light Mode</> : <><FiMoon /> Dark Mode</>}
        </button>
      </div>

      <div className="w-full max-w-[400px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary-900/20 transform hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-[32px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Log in to your account
          </h1>
          <p className="text-[16px] text-gray-500 dark:text-gray-400 mt-2.5 font-medium">
            Selamat datang kembali! Silakan masukkan data Anda.
          </p>
        </div>

        {/* Tab Selection (Lilac Style) */}
        <div className="flex p-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl mb-8">
           <button className="flex-1 py-2 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-default">Sign up</button>
           <button className="flex-1 py-2 text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm">Log in</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium animate-unt-slide-up">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="unt-input font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="unt-input font-medium pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer bg-transparent" 
              />
              <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">Ingat selama 30 hari</span>
            </label>
            <button type="button" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Lupa password?
            </button>
          </div>

          <Button type="submit" loading={isLoading} size="xl" className="w-full text-base font-bold shadow-lg shadow-primary-900/10">
            Sign in
          </Button>
        </form>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
           Butuh bantuan? <button className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700">Hubungi IT Support</button>
        </div>
        
        <p className="text-center mt-20 text-gray-400 dark:text-gray-600 text-xs font-medium tracking-wide uppercase">
          © 2026 APOTEK DIGITAL SYSTEM — LILAC EDITION
        </p>
      </div>
    </div>
  );
}
