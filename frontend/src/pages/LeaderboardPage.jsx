import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, Home, RefreshCw, Star } from 'lucide-react';
import API from '../services/api';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const quizId = localStorage.getItem('joined_quiz_id') || '1';
  const participantName = localStorage.getItem('nama_peserta') || '';
  const myParticipantId = localStorage.getItem('id_peserta') || '';

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/leaderboard?quiz_id=${quizId}`);
      // Sorted high to low is already handled by mock API, but let's double check
      const sortedData = res.data.sort((a, b) => b.skor - a.skor);
      setBoardData(sortedData);
    } catch (err) {
      console.error('Gagal mengambil peringkat kuis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [quizId]);

  // Find current participant's details
  const myInfo = boardData.find(
    (item) => item.id_peserta?.toString() === myParticipantId?.toString()
  ) || boardData.find(
    (item) => item.peserta?.nama_peserta === participantName
  );

  const myRank = myInfo 
    ? boardData.findIndex(item => item.id_peserta === myInfo.id_peserta) + 1 
    : 1;

  const myScore = myInfo ? myInfo.skor : 90; // Default demo score if not found
  const totalParticipants = boardData.length || 4;

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

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'bg-amber-400 text-[#0B1B3D]'; // Emas
    if (index === 1) return 'bg-slate-300 text-[#0B1B3D]';  // Perak
    if (index === 2) return 'bg-amber-600 text-white animate-pulse'; // Perunggu
    return 'bg-white/10 text-slate-300';
  };

  const getRankOutlineClass = (index) => {
    if (index === 0) return 'border-amber-400/50 bg-amber-400/5';
    if (index === 1) return 'border-slate-300/30 bg-slate-300/5';
    if (index === 2) return 'border-amber-600/30 bg-amber-600/5';
    return 'border-white/5 bg-[#07132B]';
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

        {/* Custom Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-[#07132B] border-b border-white/5">
          <span className="w-6"></span>
          <span className="text-xs font-bold text-slate-400">Hasil Kuis</span>
          <button onClick={fetchLeaderboard} className="p-1 text-slate-400 hover:text-white">
            <RefreshCw size={12} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
          
          {/* Congrats Area */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-100">Hasil Kuis</h2>
            <p className="text-blue-400 text-xs font-extrabold uppercase tracking-wider">Selamat, Kuis Telah Selesai</p>
          </div>

          {/* Stats Boxes (Page 18, item 9 right matches: Skor Kamu, Peringkat Kamu) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Skor Kamu */}
            <div className="bg-[#07132B] border border-white/5 rounded-2xl p-3 text-center space-y-1">
              <div className="w-7 h-7 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Skor Kamu</p>
              <p className="text-base font-black text-slate-100">{myScore}/100</p>
            </div>

            {/* Peringkat Kamu */}
            <div className="bg-[#07132B] border border-white/5 rounded-2xl p-3 text-center space-y-1">
              <div className="w-7 h-7 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Trophy size={14} fill="currentColor" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Peringkat Kamu</p>
              <p className="text-base font-black text-slate-100">{myRank} dari {totalParticipants}</p>
            </div>
          </div>

          {/* Leaderboard Stack */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Papan Peringkat</h4>
            
            {loading ? (
              <div className="text-center text-xs text-slate-500 py-8">Mengkalkulasi nilai...</div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {boardData.map((item, idx) => {
                  const isMe = item.id_peserta?.toString() === myParticipantId?.toString() || item.peserta?.nama_peserta === participantName;
                  return (
                    <div 
                      key={item.id_leaderboard}
                      className={`p-3 border rounded-2xl flex justify-between items-center transition ${getRankOutlineClass(idx)} ${
                        isMe ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0B1B3D]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${getRankBadgeClass(idx)}`}>
                          {idx + 1}
                        </span>
                        
                        {/* Avatar */}
                        <span className="text-xl shrink-0" title="Avatar">
                          {getAvatarEmoji(item.peserta?.avatar || '1')}
                        </span>

                        <span className={`text-xs font-bold ${isMe ? 'text-blue-400' : 'text-slate-200'}`}>
                          {item.peserta?.nama_peserta || `Peserta ID-${item.id_peserta}`}
                          {isMe && <span className="text-[9px] bg-blue-500/20 text-blue-400 ml-1.5 px-1 rounded-sm uppercase">Kamu</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black text-yellow-400 bg-yellow-400/5 px-2 py-1 rounded-lg border border-yellow-400/10">
                        <Award size={13} />
                        <span>Skor: {item.skor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/20 text-slate-100 font-bold rounded-full text-xs transition duration-200 mt-2 flex items-center justify-center gap-2 shadow-lg"
          >
            <Home size={14} />
            <span>Kembali ke Beranda</span>
          </button>

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