import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, ChevronRight } from 'lucide-react';

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-sm bg-[#0B1B3D] flex flex-col justify-between h-[640px] text-white">
        
        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-2 opacity-80">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 flex-1 flex flex-col justify-center mb-12">
          <h2 className="text-xl font-bold text-slate-100 mb-8 text-left">
            Pilih Peran sebagai:
          </h2>

          <div className="space-y-4">
            {/* Card Peserta Kuis */}
            <button
              onClick={() => navigate('/join')}
              className="w-full flex items-center p-4 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition duration-200 text-left shadow-lg group"
            >
              {/* Yellow Icon Container */}
              <div className="w-12 h-12 bg-amber-400 text-white rounded-full flex items-center justify-center mr-4 shrink-0 shadow-md">
                <User size={24} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-bold text-base leading-tight">Peserta Kuis</p>
                <p className="text-slate-400 text-xs mt-1 truncate">Masuk untuk menjawab kuis</p>
              </div>
              <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition duration-200 ml-2" size={20} />
            </button>

            {/* Card Pengajar */}
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center p-4 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition duration-200 text-left shadow-lg group"
            >
              {/* Blue Icon Container */}
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 shrink-0 shadow-md">
                <GraduationCap size={24} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-bold text-base leading-tight">Pengajar</p>
                <p className="text-slate-400 text-xs mt-1 truncate">Buat soal dan bagikan Kuis</p>
              </div>
              <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition duration-200 ml-2" size={20} />
            </button>
          </div>
        </div>

        {/* Footer simulation */}
        <div className="flex justify-around items-center py-4 border-t border-white/10 text-white/50 text-sm">
          <button className="hover:text-white transition">☰</button>
          <button className="hover:text-white transition">⌂</button>
          <button className="hover:text-white transition">⟨</button>
        </div>

      </div>
    </div>
  );
}