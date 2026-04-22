import React from 'react';

/**
 * Card — Untitled UI Minimalist (Dark Mode Ready)
 */
export default function Card({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '', 
  noPadding = false 
}) {
  return (
    <div className={`bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm overflow-hidden transition-colors duration-200 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2a2a30] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            {title && <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}
