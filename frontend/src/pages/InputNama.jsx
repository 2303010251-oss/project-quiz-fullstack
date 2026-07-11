import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronLeft, Loader2 } from 'lucide-react';
import API from '../services/api';

export default function InputNama() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // List avatar options
  const avatars = [
    { id: '1', emoji: '🦊', label: 'Fox' },
    { id: '2', emoji: '🐯', label: 'Tiger' },
    { id: '3', emoji: '🐼', label: 'Panda' },
    { id: '4', emoji: '🐨', label: 'Koala' },
    { id: '5', emoji: '🦁', label: 'Lion' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/participants', {
        quiz_id: quizId,
        name: name.trim(),
        avatar: selectedAvatar
      });

      // Save participant session
      localStorage.setItem('id_peserta', response.data.data.id);
      localStorage.setItem('nama_peserta', response.data.data.name);
      localStorage.setItem('avatar_peserta', selectedAvatar);
      
      setIsWaiting(true);
    } catch (err) {
      setError('Gagal mendaftarkan nama Anda.');
    } finally {
      setLoading(false);
    }
  };

  // Monitor room status for transition to play
  useEffect(() => {
    if (!isWaiting) return;

    const checkRoomStatus = () => {
      const roomStr = localStorage.getItem('db_active_room');
      if (roomStr) {
        const room = JSON.parse(roomStr);
        if (room.status === 'playing') {
          navigate('/play');
        }
      }
    };

    // Run check immediately
    checkRoomStatus();

    // Listen to changes in other tabs
    window.addEventListener('storage', checkRoomStatus);
    window.addEventListener('storage_update', checkRoomStatus);

    return () => {
      window.removeEventListener('storage', checkRoomStatus);
      window.removeEventListener('storage_update', checkRoomStatus);
    };
  }, [isWaiting, navigate]);

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

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-[#07132B] border-b border-white/5">
          {!isWaiting ? (
            <button 
              onClick={() => navigate('/join')} 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Kembali
            </button>
          ) : (
            <span className="w-12"></span>
          )}
          <span className="text-xs font-bold text-slate-400">
            {!isWaiting ? 'Identitas Peserta' : 'Ruang Tunggu'}
          </span>
          <span className="w-12"></span>
        </div>

        {/* Content Area */}
        <div className="px-6 flex-1 flex flex-col justify-center">
          
          {!isWaiting ? (
            /* Registration State (Page 17, item 6 left) */
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-slate-100">Nama & Avatar Peserta</h2>
                <p className="text-slate-400 text-[11px]">Pilih avatar dan isi nama untuk papan peringkat kuis.</p>
              </div>

              {error && (
                <div className="p-3 text-xs text-red-200 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Peserta</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User size={16} />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama panggilan..." 
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition text-sm text-white placeholder:text-slate-500" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={15}
                      required 
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Pilih Avatar</label>
                  <div className="flex justify-between gap-2 py-1">
                    {avatars.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all border ${
                          selectedAvatar === av.id 
                            ? 'bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading || !name.trim()}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-full text-sm transition duration-200 shadow-lg shadow-blue-500/10 uppercase"
                >
                  {loading ? 'Menghubungkan...' : 'Masuk Room'}
                </button>
              </form>
            </div>
          ) : (
            /* Waiting State (Page 17, item 7 right) */
            <div className="text-center space-y-6 py-8 animate-pulse flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-400 w-12 h-12 stroke-[2.5]" />
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-100">Loading...</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  Soal sedang dipersiapkan... Mohon tunggu pengajar memulai sesi kuis.
                </p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs text-blue-300 max-w-[200px] font-medium mt-4">
                🎮 PIN Kuis: {localStorage.getItem('joined_quiz_pin')}
              </div>
            </div>
          )}

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