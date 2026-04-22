/**
 * StatusBadge — status: 'active' | 'closed' | 'pending' | 'expired' | 'draft'
 */
const config = {
  active:  { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50',  label: 'Aktif' },
  closed:  { dot: 'bg-gray-400',  text: 'text-gray-600',  bg: 'bg-gray-100',  label: 'Tutup' },
  pending: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50',  label: 'Pending' },
  expired: { dot: 'bg-red-500',   text: 'text-red-700',   bg: 'bg-red-50',    label: 'Kadaluarsa' },
  draft:   { dot: 'bg-blue-400',  text: 'text-blue-700',  bg: 'bg-blue-50',   label: 'Draft' },
};

export default function StatusBadge({ status = 'active', label }) {
  const s = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 text-tiny font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label || s.label}
    </span>
  );
}
