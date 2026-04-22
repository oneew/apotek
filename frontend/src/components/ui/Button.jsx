import React from 'react';

/**
 * Button — Untitled UI Standard (Lilac & Dark Mode Edition)
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  iconLeft: IconLeft, 
  iconRight: IconRight, 
  loading,
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white border border-primary-600 dark:border-primary-500 shadow-sm',
    secondary: 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-xs',
    tertiary: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-50 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900',
    link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 shadow-none border-none',
    error: 'bg-error hover:bg-red-600 text-white border border-error shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
    xl: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {IconLeft && <IconLeft className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
          {children}
          {IconRight && <IconRight className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
        </>
      )}
    </button>
  );
};

export default Button;
