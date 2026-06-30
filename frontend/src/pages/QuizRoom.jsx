import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function QuizRoom() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleRegisterParticipant = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/participants', {
        id_quiz: quizId,
        nama_peserta: nama
      });
      // Simpan session ID peserta ke LocalStorage untuk pelacakan skor
      localStorage.setItem('id_peserta', res.data.id_peserta);
      localStorage.setItem('nama_peserta', res.data.nama_peserta);
      setIsReady(true);
    } catch (err) {
      alert('Gagal mendaftarkan nama ke room kuis.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8 text-center">
        {!isReady ? (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Isi Identitas Anda</h2>
            <p className="text-xs text-slate-400 mb-6">Gunakan nama panggilan asli Anda agar tercatat di peringkat</p>
            <form onSubmit={handleRegisterParticipant} className="space-y-4">
              <input 
                type="text" placeholder="Masukkan Nama Nickname"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-center font-bold"
                value={nama} onChange={(e) => setNama(e.target.value)} required
              />
              <button type="submit" className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-sm transition">
                Gabung Room Siaga
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto animate-bounce">
              {nama.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Halo, {nama}!</h3>
              <p className="text-sm text-slate-400 mt-1">Anda telah terdaftar di room kuis ini. Mohon bersiap, pengajar akan segera memulai sesi.</p>
            </div>
            <button 
              onClick={() => navigate(`/play/${quizId}`)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition animate-pulse"
            >
              Mulai Kerjakan Soal Live
            </button>
          </div>
        )}
      </div>
    </div>
  );
}