import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const config = {
  info:    { icon: FiInfo,          bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   iconColor: 'text-blue-500' },
  success: { icon: FiCheckCircle,   bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  iconColor: 'text-green-500' },
  warning: { icon: FiAlertTriangle, bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  iconColor: 'text-amber-500' },
  danger:  { icon: FiXCircle,       bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    iconColor: 'text-red-500' },
};

export default function Alert({ variant = 'info', children, className = '' }) {
  const { icon: Icon, bg, border, text, iconColor } = config[variant] || config.info;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${bg} ${border} ${text} ${className}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
