/**
 * DashboardCard — Premium metric card for dashboard pages
 * Features a colored icon with soft background, bold value, label, and subtle shadow.
 */
export default function DashboardCard({ label, value = '0', icon: Icon, iconBg, iconColor }) {
  return (
    <div className="group relative bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer">
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {/* Icon */}
      {Icon && (
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor} shadow-sm`}>
          <Icon size={22} strokeWidth={2} />
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 truncate leading-tight">{label}</p>
        <h3 className="text-[26px] font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mt-1">
          {value}
        </h3>
      </div>
    </div>
  );
}
