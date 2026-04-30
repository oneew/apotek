import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiCalendar, FiSave, FiAlertCircle, FiClock } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_HR = 'http://localhost:8080/api/master/hr';
const API_MASTER = 'http://localhost:8080/api/master';

export default function ManajemenJadwal() {
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [pegawai, setPegawai] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [jadwal, setJadwal] = useState([]); // Array of existing schedule
  // Form input matrix: inputs[pegawai_id][tanggal] = shift_id
  const [inputs, setInputs] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Generate array of days for current month
  const getDaysInMonth = () => {
    const [year, month] = bulan.split('-');
    const days = new Date(year, month, 0).getDate();
    return Array.from({length: days}, (_, i) => String(i + 1).padStart(2, '0'));
  };
  const days = getDaysInMonth();

  const loadData = async () => {
    const [pRes, sRes, jRes] = await Promise.all([
      fetch(`${API_HR}/pegawai`).then(r => r.json()),
      fetch(`${API_MASTER}/shift`).then(r => r.json()),
      fetch(`${API_HR}/jadwal?bulan=${bulan}`).then(r => r.json())
    ]);
    
    if(pRes.status) setPegawai(pRes.data);
    if(sRes.status) setShifts(sRes.data);
    
    if(jRes.status) {
      setJadwal(jRes.data);
      // Map existing to inputs
      const newInputs = {};
      jRes.data.forEach(j => {
        if (!newInputs[j.pegawai_id]) newInputs[j.pegawai_id] = {};
        const d = j.tanggal.split('-')[2];
        newInputs[j.pegawai_id][d] = j.shift_id;
      });
      setInputs(newInputs);
    }
  };

  useEffect(() => { loadData(); }, [bulan]);

  const handleChange = (pegawaiId, tgl, shiftId) => {
    setInputs(prev => ({
      ...prev,
      [pegawaiId]: { ...(prev[pegawaiId] || {}), [tgl]: shiftId }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dataToSave = [];
    Object.keys(inputs).forEach(pId => {
      Object.keys(inputs[pId]).forEach(tgl => {
        const fullDate = `${bulan}-${tgl}`;
        dataToSave.push({ pegawai_id: pId, shift_id: inputs[pId][tgl], tanggal: fullDate });
      });
    });

    const res = await fetch(`${API_HR}/jadwal`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jadwal: dataToSave })
    }).then(r => r.json());

    setIsSaving(false);
    if(res.status) {
      Swal.fire({ icon: 'success', title: 'Tersimpan', text: res.message, timer: 1500, showConfirmButton: false });
      loadData();
    } else {
      Swal.fire('Gagal', res.message, 'error');
    }
  };

  // Utility to find shift acronym or color
  const getShiftBadge = (shiftId) => {
    const s = shifts.find(x => String(x.id) === String(shiftId));
    if (!s) return <span className="text-gray-300">-</span>;
    const initial = s.nama_shift.charAt(0).toUpperCase();
    const isMorning = s.nama_shift.toLowerCase().includes('pagi');
    const isNight = s.nama_shift.toLowerCase().includes('malam');
    const color = isMorning ? 'bg-amber-100 text-amber-700' : isNight ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700';
    return <span className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold ${color}`} title={s.nama_shift}>{initial}</span>;
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader title="Jadwal Shift Pegawai" subtitle="Atur penempatan jadwal shift bulanan pegawai apotek." icon={<FiCalendar size={24} className="text-gray-500" />} />

      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-700">Periode Bulan:</label>
          <input type="month" value={bulan} onChange={e => setBulan(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold outline-none" />
        </div>
        
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60">
          {isSaving ? <span className="animate-pulse">Menyimpan...</span> : <><FiSave size={16} /> Simpan Perubahan</>}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4 custom-scrollbar">
          <div className="min-w-fit flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-100 rounded"></div> Shift Pagi</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary-100 rounded"></div> Shift Siang</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-100 rounded"></div> Shift Malam</span>
            <span className="flex items-center gap-1"><FiAlertCircle className="text-red-400" /> Wajib diisi</span>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase">
              <tr>
                <th className="p-3 border border-gray-200 dark:border-gray-700 sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 min-w-[200px]">Pegawai</th>
                {days.map(d => (
                  <th key={d} className="p-2 text-center border border-gray-200 dark:border-gray-700 min-w-[40px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pegawai.filter(p => !p.nama_jabatan?.toLowerCase().includes('admin')).map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2 pr-4 border border-gray-200 dark:border-gray-700 sticky left-0 z-10 bg-white dark:bg-gray-900 whitespace-nowrap">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{p.nama_lengkap}</p>
                    <p className="text-[10px] text-gray-500">{p.nama_jabatan}</p>
                  </td>
                  {days.map(d => (
                    <td key={d} className="p-1 text-center border border-gray-200 dark:border-gray-700">
                      <select 
                        value={(inputs[p.id] && inputs[p.id][d]) || ''}
                        onChange={(e) => handleChange(p.id, d, e.target.value)}
                        className="w-full h-8 text-[10px] font-bold text-center appearance-none bg-transparent outline-none cursor-pointer hover:bg-gray-100 rounded"
                        title={shifts.find(s => String(s.id) === (inputs[p.id]?.[d] || ''))?.nama_shift || 'Belum di set'}
                      >
                        <option value="">-</option>
                        {shifts.map(s => <option key={s.id} value={s.id}>{s.nama_shift.charAt(0).toUpperCase()}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { height: 8px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }`}</style>
    </div>
  );
}
