import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, PlusCircle, Trash2 } from 'lucide-react';
import API from '../services/api';

export default function DashboardPengajar() {
  const { logout } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Kuis Baru
  const [pinQuiz, setPinQuiz] = useState('');
  const [statusQuiz, setStatusQuiz] = useState('aktif');

  // Form Soal Baru
  const [pertanyaan, setPertanyaan] = useState('');
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState('A');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      alert('Gagal mengambil data kuis.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await API.post('/quizzes', { pin_quiz: pinQuiz, status: statusQuiz });
      setPinQuiz('');
      fetchQuizzes();
    } catch (err) {
      alert('Gagal menambahkan kuis baru.');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Hapus kuis ini?')) {
      try {
        await API.delete(`/quizzes/${id}`);
        if (selectedQuiz?.id_quis === id) setSelectedQuiz(null);
        fetchQuizzes();
      } catch (err) {
        alert('Gagal menghapus kuis.');
      }
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await API.post('/question', {
        id_quiz: selectedQuiz.id_quis,
        pertanyaan,
        opsi_a: opsiA,
        opsi_b: opsiB,
        opsi_c: opsiC,
        opsi_d: opsiD,
        jawaban_benar: jawabanBenar
      });
      setPertanyaan(''); setOpsiA(''); setOpsiB(''); setOpsiC(''); setOpsiD('');
      alert('Soal kuis berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal menambahkan soal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Dashboard Pengajar <span className="text-indigo-600">UNPER</span></h1>
        <button onClick={logout} className="flex items-center text-sm font-semibold text-red-600 gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
          <LogOut size={16} /> Keluar
        </button>
      </nav>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1: Buat Kuis & Daftar Kuis */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1"><Plus size={18}/> Buat Kuis Baru</h3>
            <form onSubmit={handleCreateQuiz} className="space-y-3">
              <input 
                type="text" placeholder="Masukkan PIN Kuis (ex: QZ101)" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase"
                value={pinQuiz} onChange={(e) => setPinQuiz(e.target.value)} required
              />
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                value={statusQuiz} onChange={(e) => setStatusQuiz(e.target.value)}
              >
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
              </select>
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition">
                Simpan Kuis
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Daftar Kuis Aktif</h3>
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id_quis} 
                  className={`py-3 flex justify-between items-center cursor-pointer px-2 rounded-lg ${selectedQuiz?.id_quis === quiz.id_quis ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <div>
                    <p className="font-bold text-sm tracking-wide text-slate-800">PIN: {quiz.pin_quiz}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium uppercase">{quiz.status}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id_quis); }} className="text-slate-400 hover:text-red-600 transition p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom 2: Form Input Soal */}
        <div className="lg:col-span-2">
          {selectedQuiz ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1">
                <PlusCircle size={18} className="text-indigo-600"/> Kelola Soal Pilihan Ganda (PIN Kuis: {selectedQuiz.pin_quiz})
              </h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Isi Pertanyaan Kuis</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" rows={3}
                    value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Isi Pilihan Jawaban A" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={opsiA} onChange={(e) => setOpsiA(e.target.value)} required />
                  <input type="text" placeholder="Isi Pilihan Jawaban B" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={opsiB} onChange={(e) => setOpsiB(e.target.value)} required />
                  <input type="text" placeholder="Isi Pilihan Jawaban C" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={opsiC} onChange={(e) => setOpsiC(e.target.value)} required />
                  <input type="text" placeholder="Isi Pilihan Jawaban D" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" value={opsiD} onChange={(e) => setOpsiD(e.target.value)} required />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kunci Jawaban Benar</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" value={jawabanBenar} onChange={(e) => setJawabanBenar(e.target.value)}>
                    <option value="A">Opsi A</option> <option value="B">Opsi B</option> <option value="C">Opsi C</option> <option value="D">Opsi D</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition">
                  Tambahkan Soal ke Basis Data
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-slate-200 text-center text-slate-400">
              Pilih kuis di sebelah kiri untuk mulai menambahkan item soal pilihan ganda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}