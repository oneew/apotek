import React from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';

export default function PersediaanPerpindahanStok() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tgl', label: 'Tanggal' },
    { key: 'asal', label: 'Gudang/Rak Asal' },
    { key: 'tujuan', label: 'Gudang/Rak Tujuan' },
    { key: 'status', label: 'Status' }
  ];
  const dummyData = [];
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader title="Perpindahan Stok" />
      <DataTable columns={columns} data={dummyData} />
    </div>
  );
}
