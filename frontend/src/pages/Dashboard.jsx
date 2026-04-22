import { useParams } from 'react-router-dom';
import DashboardUmum from './dashboard/DashboardUmum';
import DashboardPenjualan from './dashboard/DashboardPenjualan';
import DashboardPembelian from './dashboard/DashboardPembelian';
import DashboardPersediaan from './dashboard/DashboardPersediaan';
import DashboardKeuangan from './dashboard/DashboardKeuangan';

const subPages = {
  penjualan: DashboardPenjualan,
  pembelian: DashboardPembelian,
  persediaan: DashboardPersediaan,
  keuangan: DashboardKeuangan,
};

export default function Dashboard() {
  const { sub } = useParams();
  const SubPage = subPages[sub] || DashboardUmum;
  return <SubPage />;
}
