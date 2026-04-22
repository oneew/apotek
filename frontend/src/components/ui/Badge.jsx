import React from 'react';

/**
 * Badge — Untitled UI Standard (Lilac Edition)
 */
export default function Badge({ 
  children, 
  variant = 'gray', 
  dot = false, 
  className = '' 
}) {
  const variants = {
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-100 dark:border-primary-800',
    success: 'bg-success/10 dark:bg-success/20 text-success dark:text-success border-success/20 dark:border-success/30',
    error: 'bg-error/10 dark:bg-error/20 text-error dark:text-[#f04438] border-error/20 dark:border-error/30',
    warning: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning border-warning/20 dark:border-warning/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors duration-200 ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
}
