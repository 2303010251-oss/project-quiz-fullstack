import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Ambil data soal berdasarkan kuis (/api/question) sesuai laporan
        const response = await API.get(`/question?quiz_id=${quizId}`);
        setQuestions(response.data);
      } catch (err) {
        setError('Gagal memuat soal kuis. Coba muat ulang halaman.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const handleAnswerSubmit = async (selectedOption) => {
    try {
      const currentQuestion = questions[currentIndex];
      
      // Kirim jawaban peserta ke endpoint /api/answer (POST) sesuai laporan
      await API.post('/answer', {
        id_peserta: localStorage.getItem('id_peserta'), // Diambil saat di room nama
        id_soal: currentQuestion.id_soal,
        jawaban_pilihan: selectedOption
      });

      // Lanjut ke soal berikutnya jika masih ada
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Jika soal habis, hitung hasil kuis (/api/results POST) dan lempar ke leaderboard
        await API.post('/results', { id_quiz: quizId, id_peserta: localStorage.getItem('id_peserta') });
        navigate(`/leaderboard/${quizId}`);
      }
    } catch (err) {
      alert('Gagal mengirim jawaban, periksa jaringan Anda.');
    }
  };

  if (loading) return <div className="text-center mt-20 text-indigo-600 font-semibold">Memuat Soal Kuis Live...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-semibold">{error}</div>;
  if (questions.length === 0) return <div className="text-center mt-20">Kuis ini belum memiliki soal.</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Progress Bar Soal */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-slate-500">Soal {currentIndex + 1} dari {questions.length}</span>
        <div className="w-1/2 bg-slate-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Box Pertanyaan - Mengikuti Kamus Data Lap. (Pertanyaan, Opsi A-D) */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-6 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
          {currentQuestion.pertanyaan}
        </h3>
      </div>

      {/* Grid Pilihan Jawaban Ganda (Opsi A, B, C, D) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d'].map((key, index) => {
          const labelOption = ['A', 'B', 'C', 'D'];
          return (
            <button
              key={key}
              onClick={() => handleAnswerSubmit(labelOption[index])}
              className="flex items-center p-5 bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition duration-200 text-left shadow-sm"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-indigo-600 font-bold rounded-lg mr-4 group-hover:bg-indigo-600">
                {labelOption[index]}
              </span>
              <span className="text-slate-700 font-medium">{currentQuestion[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}