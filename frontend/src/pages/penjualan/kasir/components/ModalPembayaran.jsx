import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiCreditCard, FiCheck, FiDollarSign, FiSmartphone, FiActivity, FiArrowRight } from 'react-icons/fi';

export default function ModalPembayaran({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onConfirm 
}) {
  const [cashAmount, setCashAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('Tunai');

  useEffect(() => {
    if (isOpen) { setCashAmount(0); setPaymentType('Tunai'); }
  }, [isOpen]);

  const change = Math.max(0, cashAmount - totalAmount);
  
  const quickNominals = [
    { label: 'Uang Pas', value: totalAmount, color: 'bg-primary-50 text-primary-700' },
    { label: '50.000', value: 50000, color: 'bg-blue-50 text-blue-700' },
    { label: '100.000', value: 100000, color: 'bg-purple-50 text-purple-700' },
    { label: '200.000', value: 200000, color: 'bg-teal-50 text-teal-700' }
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran"
      subtitle="Selesaikan pembayaran untuk transaksi ini."
      icon={<FiCreditCard />}
      maxWidth="max-w-[480px]"
    >
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="p-6 space-y-5">
          {/* Total */}
          <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total yang Harus Dibayar</div>
             <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight tabular-nums">{formatCurrency(totalAmount)}</div>
          </div>

          {/* Metode Pembayaran */}
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500">Metode Pembayaran</label>
             <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'Tunai', icon: <FiDollarSign />, label: 'Tunai' },
                  { id: 'QRIS', icon: <FiSmartphone />, label: 'QRIS' },
                  { id: 'Transfer', icon: <FiActivity />, label: 'Transfer' },
                  { id: 'Debit', icon: <FiCreditCard />, label: 'Debit' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPaymentType(item.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all border ${paymentType === item.id ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-400 hover:border-primary-300'}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Input Uang */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Jumlah Uang Diterima</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xl">Rp</span>
              <input
                type="number"
                autoFocus
                placeholder={totalAmount.toString()}
                className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-3xl font-extrabold text-primary-600 dark:text-primary-400 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all tabular-nums"
                value={cashAmount || ''}
                onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cashAmount >= totalAmount) onConfirm({ cashAmount, paymentType });
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
               {quickNominals.map((nom) => (
                 <button
                   key={nom.label}
                   onClick={() => setCashAmount(nom.value)}
                   className={`py-2.5 px-3 rounded-xl text-xs font-bold border border-transparent hover:shadow-md transition-all flex items-center justify-between group ${nom.color}`}
                 >
                   <span>{nom.label}</span>
                   <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-all" size={12} />
                 </button>
               ))}
            </div>
          </div>

          {/* Kembalian */}
          {change > 0 && (
             <div className="flex justify-between items-center px-5 py-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
                <span className="text-xs font-bold text-green-600 uppercase">Kembalian</span>
                <span className="text-xl font-extrabold text-green-700 dark:text-green-400 tabular-nums">{formatCurrency(change)}</span>
             </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="px-6 py-5 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <button
              disabled={cashAmount < totalAmount && paymentType === 'Tunai'}
              onClick={() => onConfirm({ cashAmount, paymentType })}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-xl py-3.5 font-bold text-sm transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <FiCheck />
              <span>Konfirmasi Pembayaran</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Batal
            </button>
        </div>
      </div>
      
      <style>{`
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
    </ModalDialog>
  );
}
