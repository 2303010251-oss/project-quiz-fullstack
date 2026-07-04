import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, Trash2, Home, List, FilePlus, ChevronRight, Play, Eye } from 'lucide-react';
import API from '../services/api';

export default function DashboardPengajar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Kuis Baru
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [pinQuiz, setPinQuiz] = useState('');
  const [statusQuiz, setStatusQuiz] = useState('aktif');

  // Form Soal Baru
  const [showAddQuestion, setShowAddQuestion] = useState(false);
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
      setLoading(true);
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
      // Select the first quiz by default if none selected
      if (res.data.length > 0 && !selectedQuiz) {
        setSelectedQuiz(res.data[0]);
      }
    } catch (err) {
      alert('Gagal mengambil data kuis.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const generatedPin = pinQuiz.trim() || Math.floor(100000 + Math.random() * 900000).toString();
      await API.post('/quizzes', { 
        pin_quiz: generatedPin, 
        status: statusQuiz,
        judul: newQuizTitle.trim() || 'Kuis Baru'
      });
      setPinQuiz('');
      setNewQuizTitle('');
      setShowCreateModal(false);
      alert('Kuis baru berhasil dibuat!');
      fetchQuizzes();
    } catch (err) {
      alert('Gagal menambahkan kuis baru.');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kuis ini?')) {
      try {
        await API.delete(`/quizzes/${id}`);
        if (selectedQuiz?.id_quis === id) {
          setSelectedQuiz(null);
        }
        alert('Kuis berhasil dihapus.');
        fetchQuizzes();
      } catch (err) {
        alert('Gagal menghapus kuis.');
      }
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;
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
      setPertanyaan(''); 
      setOpsiA(''); 
      setOpsiB(''); 
      setOpsiC(''); 
      setOpsiD('');
      setShowAddQuestion(false);
      alert('Soal kuis berhasil ditambahkan!');
      // Refresh list to update selected quiz questions
      const res = await API.get('/quizzes');
      setQuizzes(res.data);
      const updated = res.data.find(q => q.id_quis === selectedQuiz.id_quis);
      if (updated) setSelectedQuiz(updated);
    } catch (err) {
      alert('Gagal menambahkan soal.');
    }
  };

  const handleStartQuiz = (quiz) => {
    // Set active room state in localStorage
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
    
    // Navigate to Pin Quiz lobby
    navigate('/pin-kuis');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-6">
      {/* Mobile-style viewport frame (highly interactive and fits the blue aesthetic) */}
      <div className="w-full max-w-lg bg-[#0B1B3D] flex flex-col justify-between min-h-[660px] text-white shadow-2xl rounded-3xl overflow-hidden border border-white/5">
        
        {/* Status Bar simulation */}
        <div className="flex justify-between items-center text-xs px-6 pt-3 opacity-80 bg-[#07132B]">
          <span>13:46</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
            <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
          </div>
        </div>

        {/* Custom Nav Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#07132B] border-b border-white/5">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-blue-400" />
            <h2 className="text-base font-bold tracking-tight">Beranda</h2>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* Quick Stats / Welcome */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-extrabold">Universitas Perjuangan</p>
            <h3 className="text-lg font-extrabold text-slate-100 mt-1">Halo, Pengajar!</h3>
            <p className="text-xs text-slate-300 mt-1">Kelola bank soal kuis pilihan ganda Anda dengan mudah.</p>
          </div>

          {/* Grid Quick Action Buttons (Exact visual matches to report Page 16) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Action 1: Daftar Soal / Kuis */}
            <button 
              onClick={() => navigate('/daftar-kuis')}
              className="flex items-center p-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition text-left shadow-lg group text-slate-800"
            >
              {/* Red Folder/List Icon container */}
              <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center mr-3 shrink-0 shadow-md">
                <List size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-800 leading-tight">Daftar Soal</p>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate">Lihat semua soal Kuis</p>
              </div>
            </button>

            {/* Action 2: Buat Soal */}
            <button 
              onClick={() => {
                if (selectedQuiz) {
                  setShowAddQuestion(true);
                } else {
                  alert('Silakan buat atau pilih kuis terlebih dahulu di daftar kuis bawah.');
                }
              }}
              className="flex items-center p-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition text-left shadow-lg group text-slate-800"
            >
              {/* Yellow/Amber Pencil Icon container */}
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mr-3 shrink-0 shadow-md">
                <FilePlus size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-800 leading-tight">Buat soal</p>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate">Tambah soal baru</p>
              </div>
            </button>

          </div>

          {/* Manage Quiz Lists Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daftar Kuis Anda</h4>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition"
              >
                <Plus size={14} /> Buat Kuis
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id_quis}
                  onClick={() => setSelectedQuiz(quiz)}
                  className={`p-3 rounded-2xl flex justify-between items-center cursor-pointer transition border ${
                    selectedQuiz?.id_quis === quiz.id_quis 
                      ? 'bg-blue-600/10 border-blue-500/50 text-white' 
                      : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{quiz.judul}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-sm">PIN: {quiz.pin_quiz}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{quiz.questions?.length || 0} Soal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartQuiz(quiz); }}
                      className="p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                      title="Mulai Sesi Live"
                    >
                      <Play size={12} fill="white" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id_quis); }}
                      className="p-1.5 bg-red-950 text-red-400 hover:bg-red-900 rounded-lg transition"
                      title="Hapus Kuis"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {quizzes.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 bg-white/5 rounded-2xl">
                  Belum ada kuis. Klik "Buat Kuis" di atas.
                </div>
              )}
            </div>
          </div>

          {/* Selected Quiz Detail & Question List */}
          {selectedQuiz && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-blue-400 uppercase truncate">Detail Bank Soal</h4>
                  <p className="text-sm font-bold truncate mt-0.5 text-white">{selectedQuiz.judul}</p>
                </div>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition"
                >
                  + Tambah Soal
                </button>
              </div>

              {/* Questions Stack */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedQuiz.questions && selectedQuiz.questions.map((q, idx) => (
                  <div key={q.id_soal} className="p-3 bg-[#07132B] rounded-xl border border-white/5 flex items-start justify-between gap-2">
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-slate-300">Soal {idx + 1}:</p>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{q.pertanyaan}</p>
                      <div className="grid grid-cols-2 gap-1 mt-2 text-[9px] text-slate-500">
                        <span className={q.jawaban_benar === 'A' ? 'text-green-400 font-bold' : ''}>A: {q.opsi_a}</span>
                        <span className={q.jawaban_benar === 'B' ? 'text-green-400 font-bold' : ''}>B: {q.opsi_b}</span>
                        <span className={q.jawaban_benar === 'C' ? 'text-green-400 font-bold' : ''}>C: {q.opsi_c}</span>
                        <span className={q.jawaban_benar === 'D' ? 'text-green-400 font-bold' : ''}>D: {q.opsi_d}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!selectedQuiz.questions || selectedQuiz.questions.length === 0) && (
                  <p className="text-center text-xs text-slate-500 py-4">Kuis ini belum memiliki soal. Klik "+ Tambah Soal".</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal: Buat Kuis Baru */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-[#0B1B3D] border border-white/10 rounded-3xl p-6 text-white space-y-4">
              <h3 className="text-base font-bold">Buat Kuis Baru</h3>
              <form onSubmit={handleCreateQuiz} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Kuis*</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Kuis Layanan Web" 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                    value={newQuizTitle} onChange={(e) => setNewQuizTitle(e.target.value)} required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Kuis (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 771023 (Kosongkan untuk acak)" 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white uppercase"
                    maxLength={10}
                    value={pinQuiz} onChange={(e) => setPinQuiz(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select 
                    className="w-full px-3 py-2 bg-[#07132B] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                    value={statusQuiz} onChange={(e) => setStatusQuiz(e.target.value)}
                  >
                    <option value="aktif">Aktif (Live)</option>
                    <option value="draft">Draft (Tunda)</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-slate-300"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-xs font-bold text-white shadow-lg"
                  >
                    Simpan Kuis
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Tambah Soal Baru */}
        {showAddQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-[#0B1B3D] border border-white/10 rounded-3xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold">Tambah Soal ke {selectedQuiz?.judul}</h3>
              <form onSubmit={handleAddQuestion} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Isi Pertanyaan*</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white" 
                    rows={2} placeholder="Masukkan teks pertanyaan..."
                    value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Pilihan Jawaban (A, B, C, D)*</label>
                  <input type="text" placeholder="Jawaban Opsi A" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs" value={opsiA} onChange={(e) => setOpsiA(e.target.value)} required />
                  <input type="text" placeholder="Jawaban Opsi B" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs" value={opsiB} onChange={(e) => setOpsiB(e.target.value)} required />
                  <input type="text" placeholder="Jawaban Opsi C" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs" value={opsiC} onChange={(e) => setOpsiC(e.target.value)} required />
                  <input type="text" placeholder="Jawaban Opsi D" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs" value={opsiD} onChange={(e) => setOpsiD(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kunci Jawaban Benar*</label>
                  <select 
                    className="w-full px-3 py-2 bg-[#07132B] border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                    value={jawabanBenar} onChange={(e) => setJawabanBenar(e.target.value)}
                  >
                    <option value="A">Opsi A</option> 
                    <option value="B">Opsi B</option> 
                    <option value="C">Opsi C</option> 
                    <option value="D">Opsi D</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddQuestion(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-slate-300"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-xs font-bold text-white shadow-lg"
                  >
                    Simpan Soal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer simulation */}
        <div className="flex justify-around items-center py-3 border-t border-white/5 text-white/50 text-sm bg-[#07132B]">
          <button className="hover:text-white transition">☰</button>
          <button className="hover:text-white transition">⌂</button>
          <button className="hover:text-white transition">⟨</button>
        </div>

      </div>
    </div>
  );
}