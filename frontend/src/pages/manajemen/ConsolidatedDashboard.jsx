import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import { FiTrendingUp, FiMap, FiActivity, FiAlertCircle, FiArrowUpRight, FiDollarSign } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function ConsolidatedDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConsolidatedData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/dashboard/consolidated`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching consolidated data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsolidatedData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20 animate-unt-fade">
      <SectionHeader 
        title="Consolidated Owner Dashboard" 
        subtitle="Analisis performa seluruh cabang apotek dalam satu tampilan terpusat."
        icon={<FiMap size={24} className="text-primary-500" />}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard 
          label="Total Revenue (All Outlets)" 
          value={formatIDR(data.totals.revenue)}
          icon={FiDollarSign}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        
        <DashboardCard 
          label="Revenue Bulan Ini" 
          value={formatIDR(data.totals.month_revenue)}
          icon={FiActivity}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />

        <DashboardCard 
          label="Critical Stock (All Outlets)" 
          value={`${data.inventory_health.critical} SKU`}
          icon={FiAlertCircle}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />

        <DashboardCard 
          label="Est. Gross Profit" 
          value={formatIDR(data.totals.profit_est)}
          icon={FiTrendingUp}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outlet Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiMap className="text-primary-500" /> Performa per Cabang
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Outlet</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Revenue</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Trans.</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {data.outlets.map((outlet, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                          {outlet.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{outlet.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right tabular-nums">
                      {formatIDR(outlet.sales)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500 text-center">
                      {outlet.transactions}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[11px] font-bold flex items-center justify-end gap-1 ${outlet.growth.startsWith('+') ? 'text-success-600' : 'text-red-500'}`}>
                        {outlet.growth.startsWith('+') && <FiArrowUpRight />}
                        {outlet.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FiActivity className="text-primary-500" /> Kesehatan Inventori
          </h3>
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <span>Stok Kadaluarsa (&lt;30 Hari)</span>
                <span className="text-red-500">{data.inventory_health.critical} SKU</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <span>Stok Rendah (&lt;5 Unit)</span>
                <span className="text-amber-500">{data.inventory_health.low_stock} SKU</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                * Data dikonsolidasikan secara real-time dari seluruh endpoint outlet yang aktif.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
