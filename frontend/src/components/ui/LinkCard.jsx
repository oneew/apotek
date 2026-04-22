import { FiChevronRight } from 'react-icons/fi';

/**
 * LinkCard — Premium navigation/section card
 * Has a color-coded header band and optional white body for tables/content.
 */
const colorMap = {
  green:  { header: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-800/40', text: 'text-green-700 dark:text-green-400', arrow: 'text-green-500', body: 'border-green-100 dark:border-green-900/30' },
  blue:   { header: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40',   text: 'text-blue-700 dark:text-blue-400',   arrow: 'text-blue-500',   body: 'border-blue-100 dark:border-blue-900/30' },
  orange: { header: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-800/40', text: 'text-orange-700 dark:text-orange-400', arrow: 'text-orange-500', body: 'border-orange-100 dark:border-orange-900/30' },
  purple: { header: 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/40', text: 'text-primary-700 dark:text-primary-400', arrow: 'text-primary-500', body: 'border-primary-100 dark:border-primary-800/30' },
  red:    { header: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-800/40',       text: 'text-red-700 dark:text-red-400',     arrow: 'text-red-500',     body: 'border-red-100 dark:border-red-900/30' },
};

export default function LinkCard({ title, color = 'green', onClick, children }) {
  const c = colorMap[color] || colorMap.green;

  return (
    <div className={`bg-white dark:bg-[#1e1e24] border ${c.body} rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      {/* Color header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${c.header} cursor-pointer group`}
        onClick={onClick}
      >
        <h4 className={`text-sm font-bold ${c.text}`}>{title}</h4>
        <FiChevronRight className={`${c.arrow} group-hover:translate-x-1 transition-transform`} size={15} />
      </div>

      {/* Body */}
      {children && (
        <div className="px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
