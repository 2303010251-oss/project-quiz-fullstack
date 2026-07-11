import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, ArrowLeft, RefreshCw } from 'lucide-react';
import API from '../services/api';

export default function PinQuiz() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState({
    pin: '771023',
    status: 'waiting',
    current_question_index: 0,
    participants: []
  });

  // Load and subscribe to localStorage active room
  const loadActiveRoom = () => {
    const roomStr = localStorage.getItem('db_active_room');
    if (roomStr) {
      setActiveRoom(JSON.parse(roomStr));
    }
  };

  useEffect(() => {
    loadActiveRoom();

    // Listen to changes in other tabs
    window.addEventListener('storage', loadActiveRoom);
    // Listen to changes in the same tab (dispatched by API mock)
    window.addEventListener('storage_update', loadActiveRoom);

    return () => {
      window.removeEventListener('storage', loadActiveRoom);
      window.removeEventListener('storage_update', loadActiveRoom);
    };
  }, []);

  useEffect(() => {
    if (activeRoom.status === 'finished') {
      navigate('/leaderboard');
    }
  }, [activeRoom.status, navigate]);

  const handleStartQuiz = () => {
    const updatedRoom = {
      ...activeRoom,
      status: 'playing',
      current_question_index: 0
    };
    localStorage.setItem('db_active_room', JSON.stringify(updatedRoom));
    // Dispatch event so same tab knows it
    window.dispatchEvent(new Event('storage_update'));
  };

  const handleStopQuiz = () => {
    const updatedRoom = {
      ...activeRoom,
      status: 'finished'
    };
    localStorage.setItem('db_active_room', JSON.stringify(updatedRoom));
    window.dispatchEvent(new Event('storage_update'));
    navigate('/leaderboard');
  };

  const formatPin = (pinStr) => {
    if (!pinStr) return '000 000';
    const cleaned = pinStr.replace(/\s+/g, '');
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  };

  // Avatar helper
  const getAvatarEmoji = (avatarId) => {
    const emojis = {
      '1': '🦊',
      '2': '🐯',
      '3': '🐼',
      '4': '🐨',
      '5': '🦁'
    };
    return emojis[avatarId] || '🐱';
  };

  const getAvatarBg = (avatarId) => {
    const bgs = {
      '1': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      '2': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      '3': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      '4': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      '5': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return bgs[avatarId] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      {/* Mobile-style Viewport Frame */}
      <div className="w-full max-w-sm bg-[#0B1B3D] flex flex-col justify-between h-[640px] text-white shadow-2xl rounded-3xl overflow-hidden border border-white/5">
        
        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-3 opacity-80 bg-[#07132B]">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Custom Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-[#07132B] border-b border-white/5">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-1 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span className="text-xs font-bold text-slate-400">Room Pengajar</span>
          <button onClick={loadActiveRoom} className="p-1 text-slate-400 hover:text-white">
            <RefreshCw size={12} className="animate-spin-hover" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between overflow-y-auto">
          
          {/* PIN Card */}
          <div className="text-center space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {activeRoom.status === 'playing' ? 'Kuis Sedang Berlangsung' : 'Bagikan PIN kuis ini ke peserta:'}
            </p>
            <h1 className="text-5xl font-black tracking-wider text-yellow-400 bg-white/5 border border-white/10 py-5 rounded-3xl shadow-inner font-mono">
              {activeRoom.status === 'playing' ? 'LIVE' : formatPin(activeRoom.pin)}
            </h1>
          </div>

          {/* Joined Participants monitor (Matches Page 17, item 6 right) */}
          <div className="flex-1 flex flex-col justify-center my-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-white/5 pb-2">
              <span>{activeRoom.status === 'playing' ? 'Peserta Sedang Mengerjakan' : 'Menunggu peserta Bergabung'}</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full flex items-center gap-1">
                <Users size={10} /> {activeRoom.participants.length} anggota bergabung
              </span>
            </div>

            {/* List of avatars */}
            <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pt-1 pr-1">
              {activeRoom.participants.map((p) => (
                <div 
                  key={p.id_peserta} 
                  className="flex flex-col items-center p-2.5 bg-white/5 border border-white/5 rounded-2xl animate-fade-in text-center"
                >
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl shadow-md ${getAvatarBg(p.avatar)}`}>
                    {getAvatarEmoji(p.avatar)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 mt-2 truncate w-full">
                    {p.nama_peserta}
                  </span>
                </div>
              ))}
              {activeRoom.participants.length === 0 && (
                <div className="col-span-3 text-center py-10 text-xs text-slate-500">
                  Belum ada peserta yang masuk room...
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {activeRoom.status !== 'playing' ? (
            <button
              onClick={handleStartQuiz}
              disabled={activeRoom.participants.length === 0}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-700 text-white font-bold rounded-full text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:shadow-none"
            >
              <Play size={16} fill="white" />
              <span>Mulai Kuis</span>
            </button>
          ) : (
            <button
              onClick={handleStopQuiz}
              className="w-full py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-full text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
            >
              <span>Akhiri Kuis Paksa</span>
            </button>
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