import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';

// Tambahkan kata "default" setelah export
export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 px-4">
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">SISTEM APLIKASI KUIS</h1>
        <p className="text-yellow-400 font-medium tracking-wide mt-1">UNIVERSITAS PERJUANGAN TASIKMALAYA</p>
      </div>
      
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button 
          onClick={() => navigate('/login')}
          className="flex flex-col items-center p-8 bg-white hover:bg-slate-50 rounded-2xl shadow-xl border-2 border-transparent hover:border-yellow-400 transition transform hover:-translate-y-1 text-slate-800 group"
        >
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <GraduationCap size={40} />
          </div>
          <span className="text-xl font-bold">Masuk Pengajar</span>
          <p className="text-xs text-slate-400 text-center mt-2">Kelola kuis, bank soal, dan monitoring skor live.</p>
        </button>

        <button 
          onClick={() => navigate('/join')}
          className="flex flex-col items-center p-8 bg-white hover:bg-slate-50 rounded-2xl shadow-xl border-2 border-transparent hover:border-yellow-400 transition transform hover:-translate-y-1 text-slate-800 group"
        >
          <div className="p-4 bg-purple-100 rounded-full text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
            <Users size={40} />
          </div>
          <span className="text-xl font-bold">Masuk Peserta</span>
          <p className="text-xs text-slate-400 text-center mt-2">Gabung instan menggunakan PIN kuis tanpa login.</p>
        </button>
      </div>
    </div>
  );
}