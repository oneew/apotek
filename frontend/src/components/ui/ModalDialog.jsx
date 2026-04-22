import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * ModalDialog — Untitled UI Professional Standard
 * Minimalist design with high-density content support.
 */
export default function ModalDialog({ isOpen, onClose, title, subtitle, icon, children, maxWidth = 'max-w-2xl' }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 dark:bg-gray-950/80 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden w-full ${maxWidth} shadow-2xl flex flex-col my-auto animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800`}>
        {/* Header - Untitled UI Style */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary-600">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
              {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium italic">{subtitle}</p>}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Body Content */}
        <div className="overflow-y-auto bg-white dark:bg-gray-900 custom-scrollbar max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
