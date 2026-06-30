import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoomPeserta() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-extrabold text-emerald-900 mb-1">Masuk Kuis Live</h2>
        <p className="text-xs text-slate-400 mb-6 font-medium">Masukkan PIN Game dari Pengajar Anda</p>
        
        <form onSubmit={(e) => { e.preventDefault(); navigate('/input-nama'); }} className="space-y-4">
          <input 
            type="text" 
            placeholder="CONTOH: 123456" 
            className="w-full text-center text-xl font-bold tracking-widest px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-slate-50 uppercase" 
            maxLength={6} 
            required 
          />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition uppercase shadow-md">
            Validasi PIN
          </button>
        </form>
      </div>
    </div>
  );
}