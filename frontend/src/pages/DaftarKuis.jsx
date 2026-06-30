import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DaftarKuis() {
  const navigate = useNavigate();
  // Data dummy simulasi database laporan
  const listKuis = [
    { id: 1, pin: 'QZ-9921', status: 'aktif', tanggal: '2026-06-29' },
    { id: 2, pin: 'QZ-1042', status: 'selesai', tanggal: '2026-06-25' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Kuis Anda</h2>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-600 text-white rounded-xl text-sm font-medium hover:bg-slate-700">
          Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm font-bold border-b">
              <th className="p-4">ID Kuis</th>
              <th className="p-4">PIN Kuis</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {listKuis.map((kuis) => (
              <tr key={kuis.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-500">#{kuis.id}</td>
                <td className="p-4 font-bold text-indigo-600 tracking-wider">{kuis.pin}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${kuis.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {kuis.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => navigate('/pin-kuis')} className="text-xs text-indigo-600 hover:underline font-semibold">
                    Buka Room Live
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}