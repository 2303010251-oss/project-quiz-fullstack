import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import semua halaman frontend kuis
import ChooseRole from './pages/chooseRole';
import LoginPengajar from './pages/LoginPengajar';
import DashboardPengajar from './pages/DashboardPengajar';
import DaftarKuis from './pages/DaftarKuis';
import BuatSoal from './pages/BuatSoal';
import PinQuiz from './pages/PinQuiz';
import RoomPeserta from './pages/RoomPeserta';
import InputNama from './pages/InputNama';
import QuizPlay from './pages/QuizPlay';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
        <Routes>
          {/* Alur Utama & Jalur Pengajar */}
          <Route path="/" element={<ChooseRole />} />
          <Route path="/login" element={<LoginPengajar />} />
          <Route path="/dashboard" element={<DashboardPengajar />} />
          <Route path="/daftar-kuis" element={<DaftarKuis />} />
          <Route path="/buat-soal" element={<BuatSoal />} />
          <Route path="/pin-kuis" element={<PinQuiz />} />

          {/* Jalur Peserta / Siswa */}
          <Route path="/join" element={<RoomPeserta />} />
          <Route path="/input-nama" element={<InputNama />} />
          <Route path="/play" element={<QuizPlay />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;