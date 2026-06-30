import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputNama() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          ?
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Siapa Nama Anda?</h2>
        <p className="text-xs text-slate-400 mb-6">Nama ini akan muncul pada tabel skor skor papan peringkat</p>
        
        <form onSubmit={(e) => { e.preventDefault(); navigate('/play'); }} className="space-y-4">
          <input type="text" placeholder="Ketik nama panggilan..." className="w-full px-4 py-2.5 border rounded-xl text-center font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500" required />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition">
            Saya Siap Mengerjakan Soal
          </button>
        </form>
      </div>
    </div>
  );
}