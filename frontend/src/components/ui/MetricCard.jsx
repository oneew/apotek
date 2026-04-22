import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

/**
 * MetricCard — Untitled UI Style (Dark Mode Ready)
 */
export default function MetricCard({ 
  label, 
  value, 
  change, 
  positive, 
  icon: Icon, 
  iconBg = 'bg-primary-50', 
  iconColor = 'text-primary-600',
  className = ''
}) {
  return (
    <div className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 unt-shadow-sm transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-800 group ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {value}
          </h3>
          
          <div className="flex items-center gap-2 mt-4">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
              positive 
                ? 'bg-success/10 text-success border-success/20' 
                : 'bg-error/10 text-error border-error/20'
            }`}>
              {positive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              {change}
            </span>
            <span className="text-xs text-gray-400 font-medium">vs bulan lalu</span>
          </div>
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg} ${iconColor} dark:bg-gray-900 dark:text-primary-400`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
