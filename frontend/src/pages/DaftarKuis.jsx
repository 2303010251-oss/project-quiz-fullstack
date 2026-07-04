import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trash2, Play, ChevronLeft } from 'lucide-react';
import API from '../services/api';

export default function DaftarKuis() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      alert('Gagal mengambil data kuis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kuis ini?')) {
      try {
        await API.delete(`/quizzes/${id}`);
        fetchQuizzes();
      } catch (err) {
        alert('Gagal menghapus kuis.');
      }
    }
  };

  const handleStartQuiz = (quiz) => {
    const activeRoom = {
      pin: quiz.pin_quiz,
      status: 'waiting',
      current_question_index: 0,
      participants: [
        { id_peserta: 101, nama_peserta: 'Iqbal', avatar: '1', skor: 0 },
        { id_peserta: 102, nama_peserta: 'Anna', avatar: '2', skor: 0 },
        { id_peserta: 103, nama_peserta: 'Perdi', avatar: '3', skor: 0 }
      ],
      answers: []
    };
    localStorage.setItem('db_active_room', JSON.stringify(activeRoom));
    localStorage.setItem('current_active_quiz_id', quiz.id_quis);
    window.dispatchEvent(new Event('storage'));
    navigate('/pin-kuis');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      <div className="w-full max-w-md bg-[#0B1B3D] flex flex-col justify-between min-h-[640px] text-white shadow-2xl rounded-3xl overflow-hidden border border-white/5">
        
        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-3 opacity-80 bg-[#07132B]">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#07132B] border-b border-white/5">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-1 text-slate-300 hover:text-white transition text-xs font-semibold"
          >
            <ChevronLeft size={16} /> Kembali
          </button>
          <h2 className="text-sm font-bold">Daftar Kuis</h2>
          <span className="w-12"></span>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
          <h3 className="text-base font-bold text-slate-100">Kuis yang Tersedia</h3>
          
          {loading ? (
            <div className="text-center text-xs text-slate-400 py-10">Memuat data kuis...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-10">
              Belum ada kuis yang dibuat. Silakan kembali ke Dashboard untuk membuat kuis.
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id_quis} 
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center transition hover:bg-white/10"
                >
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-slate-100 truncate">{quiz.judul}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-sm">
                        PIN: {quiz.pin_quiz}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {quiz.questions?.length || 0} Soal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-md shadow-green-500/10"
                      title="Mulai Sesi Live"
                    >
                      <Play size={12} fill="white" />
                      <span>Buka</span>
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id_quis)}
                      className="p-2 bg-red-950/55 text-red-400 hover:bg-red-900/60 rounded-xl transition"
                      title="Hapus Kuis"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
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