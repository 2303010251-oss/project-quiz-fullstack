import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PinQuiz() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-indigo-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <h3 className="text-xl font-medium text-indigo-200 mb-2">GABUNG DI SINI</h3>
      <h1 className="text-6xl font-black tracking-widest text-yellow-400 bg-indigo-950 px-8 py-4 rounded-3xl shadow-inner mb-6">
        771 023
      </h1>
      <p className="text-sm text-indigo-200 max-w-xs mb-8">
        Buka aplikasi kuis sebagai **Peserta**, lalu masukkan angka token di atas untuk memulai permainan.
      </p>
      <button onClick={() => navigate('/dashboard')} className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition">
        Tutup Room Kuis
      </button>
    </div>
  );
}