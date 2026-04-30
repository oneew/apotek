/**
 * SectionHeader — Untitled UI Standard
 * Supports title, subtitle, icon, and actions (children)
 */
export default function SectionHeader({ title, subtitle, icon, showPrint, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-8 first:mt-0">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm transition-all group-hover:scale-110">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             {!icon && <div className="w-1 h-5 bg-primary-500 rounded-full" />}
             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic tracking-tight">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showPrint && (
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition-all shadow-sm border border-gray-200 dark:border-gray-700">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Cetak Laporan
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

/**
 * DateFilter — Dropdown + date range display
 */
export function DateFilter({ value = 'Hari ini', dateRange = '' }) {
  return (
    <div className="flex items-center gap-2">
      <select className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 outline-none hover:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer shadow-sm">
        <option>{value}</option>
        <option>7 Hari Terakhir</option>
        <option>30 Hari Terakhir</option>
        <option>Bulan ini</option>
        <option>Tahun ini</option>
        <option>Custom</option>
      </select>
      {dateRange && (
        <span className="hidden sm:block text-[11px] text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-[#28282e] border border-gray-100 dark:border-[#2a2a30] rounded-lg px-3 py-2 whitespace-nowrap">
          {dateRange}
        </span>
      )}
    </div>
  );
}
