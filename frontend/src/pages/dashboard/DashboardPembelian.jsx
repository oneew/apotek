import { FiFileText, FiShoppingBag, FiCreditCard, FiRotateCcw, FiClipboard } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import LinkCard from '../../components/ui/LinkCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [{ name: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }), faktur: 0, retur: 0 }];

function EmptyTable({ columns }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-[#2a2a30]">
            {columns.map((c, i) => (
              <th key={i} className="py-2 px-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="py-8 text-center text-sm text-gray-400 dark:text-gray-500 font-medium">
              Data tidak tersedia
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPembelian() {
  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Dashboard Pembelian"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Dashboard Pembelian' }]}
      />

      {/* ─── Status Pembelian ────────────────────────────────── */}
      <SectionHeader title="Status Pembelian" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Rencana Pembelian" value="Rp 0"
          icon={FiClipboard} iconBg="bg-teal-100 dark:bg-teal-900/30" iconColor="text-teal-600 dark:text-teal-400" />
        <DashboardCard label="Pesanan Aktif" value="Rp 0"
          icon={FiShoppingBag} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
        <DashboardCard label="Hutang Pembelian" value="Rp 0"
          icon={FiCreditCard} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-500 dark:text-red-400" />
      </div>

      {/* ─── Tables ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <LinkCard title="Jatuh Tempo Terdekat" color="orange">
          <EmptyTable columns={['No.', 'Nama Supplier', 'Jatuh Tempo', 'Nominal']} />
        </LinkCard>
        <LinkCard title="Pesanan Aktif" color="blue">
          <EmptyTable columns={['No.', 'Nama Supplier', 'Tgl. Dibuat', 'Nominal']} />
        </LinkCard>
      </div>

      {/* ─── Riwayat Pembelian ───────────────────────────────── */}
      <SectionHeader title="Riwayat Pembelian">
        <DateFilter value="7 Hari Terakhir" dateRange="12 Apr 2026 s.d. 19 Apr 2026" />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Pesanan Pembelian" value="Rp 0"
          icon={FiFileText} iconBg="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
        <DashboardCard label="Faktur Pembelian" value="Rp 0"
          icon={FiFileText} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
        <DashboardCard label="Retur Pembelian" value="Rp 0"
          icon={FiRotateCcw} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-500 dark:text-red-400" />
      </div>

      {/* ─── Chart ───────────────────────────────────────────── */}
      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary-400 inline-block" />Faktur Pembelian</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />Retur Pembelian</span>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
              <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => `Rp ${v}`} />
              <Tooltip />
              <Bar dataKey="faktur" fill="#B19CD9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="retur" fill="#fca5a5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
