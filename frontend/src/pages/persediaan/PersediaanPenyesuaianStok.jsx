import React from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';

export default function PersediaanPenyesuaianStok() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tgl', label: 'Tanggal' },
    { key: 'noPenyesuaian', label: 'No. Penyesuaian' },
    { key: 'totalSelisih', label: 'Total Selisih' },
    { key: 'keterangan', label: 'Keterangan' }
  ];
  const dummyData = [];
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader title="Penyesuaian Stok" />
      <DataTable columns={columns} data={dummyData} />
    </div>
  );
}
