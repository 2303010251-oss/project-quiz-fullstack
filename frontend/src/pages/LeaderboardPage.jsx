import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Award, Home } from 'lucide-react';
import API from '../services/api';

export default function LeaderboardPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/leaderboard?quiz_id=${quizId}`);
        // Atur urutan peringkat tertinggi ke terendah
        const sortedData = res.data.sort((a, b) => b.skor - a.skor);
        setBoardData(sortedData);
      } catch (err) {
        console.error('Gagal mengambil peringkat kuis.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) return <div className="text-center mt-20 text-indigo-600 font-semibold">Mengkalkulasi Klasemen Nilai Akhir...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Trophy size={48} className="text-yellow-500 mx-auto mb-2 animate-pulse" />
        <h2 className="text-2xl font-black text-slate-800">LEADERBOARD KUIS</h2>
        <p className="text-xs text-slate-400">Hasil nilai kompetisi live peserta Universitas Perjuangan</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 bg-slate-900 text-white font-bold flex justify-between text-sm tracking-wide">
          <span>POSISI & NAMA PESERTA</span>
          <span>TOTAL SKOR</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {boardData.length > 0 ? boardData.map((item, index) => (
            <div key={item.id_leaderboard} className="p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-400 text-white' : 
                  index === 1 ? 'bg-slate-300 text-white' : 
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {index + 1}
                </span>
                <span className="font-bold text-slate-700">{item.peserta?.nama_peserta || `Peserta ID-${item.id_peserta}`}</span>
              </div>
              <div className="flex items-center gap-1 font-black text-indigo-600">
                <Award size={16} /> {item.skor}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada rekam data skor kuis.</div>
          )}
        </div>
      </div>

      <button 
        onClick={() => { localStorage.clear(); navigate('/'); }}
        className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-md"
      >
        <Home size={16} /> Keluar Ke Menu Utama
      </button>
    </div>
  );
}