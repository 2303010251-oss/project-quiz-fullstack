import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ChevronLeft } from 'lucide-react';
import API from '../services/api';

export default function RoomPeserta() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/join', { pin_quiz: pin });
      // Save joined quiz details in localStorage
      localStorage.setItem('joined_quiz_id', response.data.quiz.id_quis);
      localStorage.setItem('joined_quiz_pin', response.data.quiz.pin_quiz);
      localStorage.setItem('joined_quiz_title', response.data.quiz.judul);
      
      navigate('/input-nama');
    } catch (err) {
      setError(err.message || 'PIN Kuis tidak valid atau tidak aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      {/* Mobile-style viewport frame */}
      <div className="w-full max-w-sm bg-[#0B1B3D] flex flex-col justify-between h-[640px] text-white shadow-2xl rounded-3xl overflow-hidden border border-white/5">
        
        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-3 opacity-80 bg-[#07132B]">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Custom Nav Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-[#07132B] border-b border-white/5">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <ChevronLeft size={16} /> Peserta
          </button>
          <span className="text-xs font-bold text-slate-400">Gabung Kuis</span>
          <span className="w-12"></span>
        </div>

        {/* Content */}
        <div className="px-6 flex-1 flex flex-col justify-center">
          
          <div className="text-center mb-6 space-y-2">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
              <KeyRound size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">Masuk Kuis Live</h2>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">
              Masukkan PIN Game dari Pengajar Anda untuk bergabung ke dalam room kuis.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs text-red-200 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="CONTOH: 771023" 
                className="w-full text-center text-2xl font-bold tracking-widest px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition uppercase text-yellow-400 placeholder:text-slate-600 font-mono" 
                maxLength={10} 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-full text-sm transition duration-200 shadow-lg shadow-blue-500/10 uppercase"
            >
              {loading ? 'Memvalidasi PIN...' : 'Gabung'}
            </button>
          </form>
        </div>

        {/* Footer simulation */}
        <div className="flex justify-around items-center py-4 border-t border-white/5 text-white/50 text-sm bg-[#07132B]">
          <button className="hover:text-white transition">☰</button>
          <button className="hover:text-white transition">⌂</button>
          <button className="hover:text-white transition">⟨</button>
        </div>

      </div>
    </div>
  );
}