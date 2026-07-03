import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    // Menggunakan gradasi diagonal yang kuat dari indigo ke purple (menjamin background berwarna)
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-indigo-900 via-indigo-700 to-purple-800 px-4">
      
      {/* Bagian Judul */}
      <div className="text-center text-white mb-12 animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
          APLIKASI KUIS
        </h1>
        <p className="text-amber-400 font-semibold tracking-widest text-xs uppercase mt-2">
          UNIVERSITAS PERJUANGAN 
        </p>
      </div>
      
      {/* Grid Pilihan Kartu */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Tombol Pengajar */}
        <button 
          onClick={() => navigate('/login')}
          className="flex flex-col items-center p-8 bg-white hover:bg-slate-50 rounded-3xl shadow-2xl border-2 border-transparent hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-2 text-slate-800 group"
        >
          <div className="p-5 bg-indigo-100 rounded-2xl text-indigo-600 mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300 shadow-md">
            <GraduationCap size={44} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Masuk Pengajar</span>
          <p className="text-xs text-slate-500 text-center mt-3 leading-relaxed">
            Kelola kuis, bank soal, dan monitoring skor live secara realtime.
          </p>
        </button>

        {/* Tombol Peserta */}
        <button 
          onClick={() => navigate('/join')}
          className="flex flex-col items-center p-8 bg-white hover:bg-slate-50 rounded-3xl shadow-2xl border-2 border-transparent hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-2 text-slate-800 group"
        >
          <div className="p-5 bg-purple-100 rounded-2xl text-purple-600 mb-5 group-hover:bg-purple-600 group-hover:text-white group-hover:-rotate-6 transition-all duration-300 shadow-md">
            <Users size={44} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Masuk Peserta</span>
          <p className="text-xs text-slate-500 text-center mt-3 leading-relaxed">
            Gabung instan menggunakan PIN kuis tanpa perlu ribet registrasi login.
          </p>
        </button>

      </div>
    </div>
  );
}