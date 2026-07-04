import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronLeft, PlusCircle } from 'lucide-react';
import API from '../services/api';

export default function BuatSoal() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [pertanyaan, setPertanyaan] = useState('');
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState('A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await API.get('/quizzes');
        setQuizzes(res.data);
        if (res.data.length > 0) {
          setSelectedQuizId(res.data[0].id_quis.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuizId) {
      alert('Silakan buat kuis terlebih dahulu di Dashboard.');
      return;
    }
    try {
      await API.post('/question', {
        id_quiz: parseInt(selectedQuizId),
        pertanyaan,
        opsi_a: opsiA,
        opsi_b: opsiB,
        opsi_c: opsiC,
        opsi_d: opsiD,
        jawaban_benar: jawabanBenar
      });
      alert('Soal berhasil ditambahkan!');
      setPertanyaan('');
      setOpsiA('');
      setOpsiB('');
      setOpsiC('');
      setOpsiD('');
      navigate('/dashboard');
    } catch (err) {
      alert('Gagal menambahkan soal.');
    }
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
          <h2 className="text-sm font-bold">Buat Soal</h2>
          <span className="w-12"></span>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle size={20} className="text-yellow-400" />
            <h3 className="text-base font-bold text-slate-100">Tambah Item Soal</h3>
          </div>

          {loading ? (
            <div className="text-center text-xs text-slate-400 py-10">Memuat data kuis...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-10">
              Belum ada kuis yang tersedia. Anda harus membuat kuis terlebih dahulu untuk menambahkan soal.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quiz Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Kuis*</label>
                <select 
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  required
                >
                  {quizzes.map((q) => (
                    <option key={q.id_quis} value={q.id_quis} className="bg-[#0B1B3D] text-white">
                      {q.judul} ({q.pin_quiz})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pertanyaan*</label>
                <textarea 
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white" 
                  rows={2}
                  placeholder="Ketik pertanyaan kuis..."
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Pilihan Ganda*</label>
                <input type="text" placeholder="Pilihan Jawaban A" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={opsiA} onChange={(e) => setOpsiA(e.target.value)} required />
                <input type="text" placeholder="Pilihan Jawaban B" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={opsiB} onChange={(e) => setOpsiB(e.target.value)} required />
                <input type="text" placeholder="Pilihan Jawaban C" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={opsiC} onChange={(e) => setOpsiC(e.target.value)} required />
                <input type="text" placeholder="Pilihan Jawaban D" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={opsiD} onChange={(e) => setOpsiD(e.target.value)} required />
              </div>

              {/* Correct Option */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kunci Jawaban Benar*</label>
                <select 
                  className="w-full px-3 py-2 bg-[#07132B] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                  value={jawabanBenar}
                  onChange={(e) => setJawabanBenar(e.target.value)}
                >
                  <option value="A">Opsi A</option>
                  <option value="B">Opsi B</option>
                  <option value="C">Opsi C</option>
                  <option value="D">Opsi D</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-full text-xs transition duration-200 mt-2 shadow-lg shadow-blue-500/10"
              >
                Simpan ke Basis Data
              </button>
            </form>
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