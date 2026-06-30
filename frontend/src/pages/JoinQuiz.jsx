import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function JoinQuiz() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/join', { pin_quiz: pin });
      navigate(`/room/${response.data.id_quis}`);
    } catch (err) {
      setError(err.message || 'PIN Kuis tidak ditemukan atau tidak aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-1">Masuk Room Kuis</h2>
        <p className="text-xs text-center text-slate-400 mb-6">Masukkan kode akses unik dari pengajar Anda</p>
        
        {error && <div className="p-3 mb-4 text-xs text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text" placeholder="CONTOH: QZ-101" value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 text-center text-xl font-black tracking-widest border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 uppercase"
            required
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition disabled:bg-slate-400"
          >
            {loading ? 'Mencari Kuis...' : 'Validasi PIN'}
          </button>
        </form>
      </div>
    </div>
  );
}