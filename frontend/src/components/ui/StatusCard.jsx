import { FiChevronRight } from 'react-icons/fi';

/**
 * StatusCard — Premium status card with bold number and colored accent header
 */
const colorMap = {
  red:    { header: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40', title: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-900/30', glow: 'hover:shadow-red-100/50 dark:hover:shadow-red-900/30' },
  orange: { header: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/40', title: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-900/30', glow: 'hover:shadow-orange-100/50 dark:hover:shadow-orange-900/30' },
  blue:   { header: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40', title: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30', glow: 'hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30' },
  purple: { header: 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800/40', title: 'text-primary-600 dark:text-primary-400', border: 'border-primary-100 dark:border-primary-800/30', glow: 'hover:shadow-primary-100/50 dark:hover:shadow-primary-900/30' },
  green:  { header: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/40', title: 'text-green-600 dark:text-green-400', border: 'border-green-100 dark:border-green-900/30', glow: 'hover:shadow-green-100/50 dark:hover:shadow-green-900/30' },
};

export default function StatusCard({ title, value = 0, unit = 'produk', color = 'red', onClick }) {
  const c = colorMap[color] || colorMap.red;

  return (
    <div
      className={`bg-white dark:bg-[#1e1e24] border ${c.border} rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 ${c.glow} transition-all duration-200 cursor-pointer group`}
      onClick={onClick}
    >
      {/* Color header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${c.header}`}>
        <h4 className={`text-sm font-bold ${c.title}`}>{title}</h4>
        <FiChevronRight className={`${c.title} group-hover:translate-x-1 transition-transform`} size={15} />
      </div>

      {/* Value */}
      <div className="px-4 py-5 text-center">
        <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-semibold mt-2 uppercase tracking-wider">{unit}</p>
      </div>
    </div>
  );
}
