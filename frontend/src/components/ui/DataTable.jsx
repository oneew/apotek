import React, { useState, useMemo, useEffect } from 'react';
import Button from './Button';
import { FiChevronLeft, FiChevronRight, FiSearch, FiPlus } from 'react-icons/fi';

/**
 * DataTable — Untitled UI Professional Standard
 * Optimized for density, clarity, and dark mode.
 */
export default function DataTable({ 
  columns = [], 
  data = [], 
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder,
  primaryAction,
  itemsPerPage = 10
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtering Logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(row => {
      return columns.some(col => {
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, columns]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="w-full">
      {/* Toolbar - Untitled UI Style */}
      {(onSearchChange || primaryAction) && (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            {onSearchChange && (
              <div className="relative w-full sm:w-80">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400">
                  <FiSearch size={18} />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || "Search..."}
                  className="pl-11 pr-4 py-2.5 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium shadow-sm"
                />
              </div>
            )}
          </div>
          {primaryAction && (
            <div className="flex items-center gap-2">
              <Button 
                onClick={primaryAction.onClick} 
                variant="primary" 
                iconLeft={FiPlus}
                className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-primary-600 hover:bg-primary-700 transition-all"
              >
                {primaryAction.label}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table Container - Untitled UI Style */}
      <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                {columns.map((col) => (
                  <th 
                    key={col.key} 
                    className={`px-6 py-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin"></div>
                      <span className="text-xs font-medium text-gray-400 animate-pulse uppercase tracking-[0.1em]">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center text-gray-400 dark:text-gray-500 font-medium text-sm italic">
                    No results found in current repository.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    {columns.map((col) => (
                      <td 
                        key={col.key} 
                        className={`px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium ${col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : ''}`}
                      >
                        {col.render ? col.render(row[col.key], row, i) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar - Untitled UI Style */}
        {!isLoading && filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
            <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">
              Page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 font-semibold shadow-sm"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 font-semibold shadow-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
