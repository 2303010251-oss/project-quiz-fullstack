import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function QuizPlay() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  // Load quiz id from localStorage
  const quizId = localStorage.getItem('joined_quiz_id') || '1';
  const participantId = localStorage.getItem('id_peserta') || '101';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
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

  // Handle countdown timer
  useEffect(() => {
    if (loading || questions.length === 0 || currentIndex >= questions.length) return;

    // Reset timer for the new question
    setTimeLeft(15);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, loading, questions]);

  const handleTimeOut = () => {
    // Act as if answered wrong/empty and proceed
    handleAnswerSubmit('-');
  };

  const moveToNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Jika soal habis, hitung hasil kuis dan lempar ke leaderboard
      await API.post('/results', { id_quiz: quizId, id_peserta: participantId });
      
      // Also update the active room status to finished if needed
      const roomStr = localStorage.getItem('db_active_room');
      if (roomStr) {
        const room = JSON.parse(roomStr);
        // If we are simulating, we can set it to finished
        room.status = 'finished';
        localStorage.setItem('db_active_room', JSON.stringify(room));
        window.dispatchEvent(new Event('storage_update'));
      }

      navigate('/leaderboard');
    }
  };

  const handleAnswerSubmit = async (selectedOption) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (feedback) return; // Prevent multiple submissions

    try {
      const currentQuestion = questions[currentIndex];
      
      // Submit answer to the mock API
      await API.post('/answer', {
        id_peserta: participantId,
        id_soal: currentQuestion.id_soal,
        jawaban_pilihan: selectedOption
      });

      const isCorrect = selectedOption === currentQuestion.jawaban_benar;

      if (!isCorrect) {
        const correctOptKey = 'opsi_' + currentQuestion.jawaban_benar.toLowerCase();
        const correctAnswerText = currentQuestion[correctOptKey] || currentQuestion.jawaban_benar;
        
        setFeedback({
          type: selectedOption === '-' ? 'timeout' : 'wrong',
          correctAnswerText: `${currentQuestion.jawaban_benar}. ${correctAnswerText}`
        });
        
        setTimeout(() => {
          setFeedback(null);
          moveToNextQuestion();
        }, 3000);
      } else {
        setFeedback({ type: 'correct' });
        setTimeout(() => {
          setFeedback(null);
          moveToNextQuestion();
        }, 1500);
      }
    } catch (err) {
      alert('Gagal mengirim jawaban.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D]">
        <div className="text-center text-blue-400 font-bold text-sm">Memuat Soal Kuis Live...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D]">
        <div className="text-center text-red-400 font-bold text-sm">{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D]">
        <div className="text-center text-slate-400 text-sm">Kuis ini belum memiliki soal.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Colors mapping for option circle outlines/borders (Page 18 screenshot matches)
  const optionColors = [
    { border: 'border-red-500 hover:bg-red-500/5', circle: 'border-red-500 text-red-500 bg-red-500/10' },     // A (Red)
    { border: 'border-blue-500 hover:bg-blue-500/5', circle: 'border-blue-500 text-blue-500 bg-blue-500/10' },   // B (Blue)
    { border: 'border-green-500 hover:bg-green-500/5', circle: 'border-green-500 text-green-500 bg-green-500/10' }, // C (Green)
    { border: 'border-orange-500 hover:bg-orange-500/5', circle: 'border-orange-500 text-orange-500 bg-orange-500/10' } // D (Orange)
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      {/* Mobile-style Viewport Frame */}
      <div className="w-full max-w-sm bg-[#0B1B3D] flex flex-col justify-between h-[640px] text-white shadow-2xl rounded-3xl overflow-hidden border border-white/5 relative">
        
        {feedback && (
          <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 ${feedback.type === 'correct' ? 'bg-green-900/95' : 'bg-red-900/95'}`}>
             {feedback.type === 'correct' ? (
                <>
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold text-white">Jawaban Benar!</h2>
                </>
             ) : (
                <>
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg">
                    {feedback.type === 'timeout' ? '⏰' : '❌'}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {feedback.type === 'timeout' ? 'Waktu Habis!' : 'Jawaban Salah!'}
                  </h2>
                  <p className="text-white/80 text-sm mb-4">Jawaban yang benar adalah:</p>
                  <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-white font-bold text-lg w-full">
                    {feedback.correctAnswerText}
                  </div>
                </>
             )}
          </div>
        )}

        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-3 opacity-80 bg-[#07132B]">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Question Header & Timer (Matches Page 18, item 8 right) */}
        <div className="px-6 pt-4 flex flex-col items-center gap-2">
          {/* Timer Circle */}
          <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center text-red-500 font-extrabold text-xl animate-pulse">
            {timeLeft}
          </div>
          
          {/* Progress index */}
          <span className="text-slate-400 text-xs font-bold mt-1">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question Card */}
        <div className="px-6 flex-1 flex flex-col justify-center my-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-inner min-h-[110px] flex items-center justify-center text-center">
            <h3 className="text-sm font-bold text-slate-100 leading-relaxed">
              {currentQuestion.pertanyaan}
            </h3>
          </div>
        </div>

        {/* Colored Options Grid (Page 18, item 8 right matches) */}
        <div className="px-6 pb-6 space-y-2.5">
          {['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d'].map((key, index) => {
            const labelOption = ['A', 'B', 'C', 'D'];
            const style = optionColors[index];
            return (
              <button
                key={key}
                onClick={() => handleAnswerSubmit(labelOption[index])}
                className={`w-full flex items-center p-3 bg-[#07132B] hover:bg-white/5 active:bg-white/10 border-2 rounded-2xl transition duration-150 text-left shadow-sm ${style.border}`}
              >
                <span className={`w-8 h-8 flex items-center justify-center border-2 font-bold rounded-full mr-3 shrink-0 text-sm ${style.circle}`}>
                  {labelOption[index]}
                </span>
                <span className="text-slate-200 font-bold text-xs">
                  {currentQuestion[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer simulation */}
        <div className="flex justify-around items-center py-3 border-t border-white/5 text-white/50 text-xs bg-[#07132B]">
          <button className="hover:text-white transition">☰</button>
          <button className="hover:text-white transition">⌂</button>
          <button className="hover:text-white transition">⟨</button>
        </div>

      </div>
    </div>
  );
}