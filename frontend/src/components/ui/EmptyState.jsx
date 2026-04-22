import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon: Icon = FiInbox, title = 'Belum ada data', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fade-in-up">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-h3 text-gray-500">{title}</h3>
      {message && <p className="text-small max-w-sm text-center">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
