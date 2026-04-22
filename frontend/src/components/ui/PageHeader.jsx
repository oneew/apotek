import React from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * PageHeader — Untitled UI Standard (Lilac & Dark Edition)
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions,
  className = ''
}) {
  return (
    <div className={`mb-10 animate-unt-fade ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 ml-0.5">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <FiHome size={16} />
          </Link>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <FiChevronRight size={14} className="text-gray-300 dark:text-gray-700" />
              {item.path ? (
                <Link to={item.path} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary-600 dark:text-primary-400 font-bold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-0.5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Decorative Divider (Optional thin line) */}
      <div className="h-px bg-gray-200 dark:bg-gray-800 mt-8" />
    </div>
  );
}
