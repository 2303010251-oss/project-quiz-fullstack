// Mock API Client to simulate Laravel Backend in localStorage
// This allows the frontend to run fully stand-alone and in real-time across tabs!

const initDb = () => {
  if (!localStorage.getItem('db_quizzes')) {
    const defaultQuizzes = [
      {
        id_quis: 1,
        pin_quiz: '771023',
        judul: 'Kuis Pengantar Teknologi Informasi',
        status: 'aktif',
        questions: [
          { id_soal: 1, pertanyaan: 'Contoh Layanan Web adalah..', opsi_a: 'Microsoft Word', opsi_b: 'Google Chrome', opsi_c: 'Gmail', opsi_d: 'Calculator', jawaban_benar: 'C' },
          { id_soal: 2, pertanyaan: 'Protokol standar untuk transfer halaman web adalah...', opsi_a: 'FTP', opsi_b: 'HTTP', opsi_c: 'SMTP', opsi_d: 'SSH', jawaban_benar: 'B' },
          { id_soal: 3, pertanyaan: 'Bahasa pemformatan standar untuk halaman web adalah...', opsi_a: 'PHP', opsi_b: 'CSS', opsi_c: 'HTML', opsi_d: 'XML', jawaban_benar: 'C' },
          { id_soal: 4, pertanyaan: 'Framework CSS modern yang menggunakan utility-first adalah...', opsi_a: 'Bootstrap', opsi_b: 'Tailwind CSS', opsi_c: 'Bulma', opsi_d: 'Foundation', jawaban_benar: 'B' },
          { id_soal: 5, pertanyaan: 'Sistem manajemen basis data relasional yang populer adalah...', opsi_a: 'MongoDB', opsi_b: 'Redis', opsi_c: 'MySQL', opsi_d: 'Neo4j', jawaban_benar: 'C' }
        ]
      }
    ];
    localStorage.setItem('db_quizzes', JSON.stringify(defaultQuizzes));
  }

  if (!localStorage.getItem('db_active_room')) {
    const defaultRoom = {
      pin: '771023',
      status: 'waiting',
      current_question_index: 0,
      participants: [
        { id_peserta: 101, nama_peserta: 'Iqbal', avatar: '1', skor: 85 },
        { id_peserta: 102, nama_peserta: 'Anna', avatar: '2', skor: 90 },
        { id_peserta: 103, nama_peserta: 'Perdi', avatar: '3', skor: 70 }
      ],
      answers: []
    };
    localStorage.setItem('db_active_room', JSON.stringify(defaultRoom));
  }
};

// Run initialization
initDb();

const getQuizzes = () => JSON.parse(localStorage.getItem('db_quizzes') || '[]');
const saveQuizzes = (q) => localStorage.setItem('db_quizzes', JSON.stringify(q));

const getActiveRoom = () => JSON.parse(localStorage.getItem('db_active_room') || '{}');
const saveActiveRoom = (r) => {
  localStorage.setItem('db_active_room', JSON.stringify(r));
  // Dispatch custom storage event for same-tab updates
  window.dispatchEvent(new Event('storage_update'));
};

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const API = {
  get: async (url) => {
    await delay();
    const cleanUrl = url.split('?')[0];
    const params = new URLSearchParams(url.split('?')[1] || '');

    if (cleanUrl === '/quizzes') {
      return { data: getQuizzes() };
    }

    if (cleanUrl === '/question') {
      const quizId = params.get('quiz_id');
      const quizzes = getQuizzes();
      const quiz = quizzes.find(q => q.id_quis.toString() === quizId?.toString());
      return { data: quiz ? quiz.questions : [] };
    }

    if (cleanUrl === '/leaderboard') {
      const activeRoom = getActiveRoom();
      const leaderboardData = activeRoom.participants.map(p => ({
        id_leaderboard: p.id_peserta,
        id_peserta: p.id_peserta,
        skor: p.skor,
        peserta: { nama_peserta: p.nama_peserta, avatar: p.avatar }
      })).sort((a, b) => b.skor - a.skor);
      return { data: leaderboardData };
    }

    throw new Error(`Endpoint GET ${url} tidak ditemukan.`);
  },

  post: async (url, body) => {
    await delay();

    if (url === '/login') {
      return {
        data: {
          token: 'mock-token-unper-123456',
          user: { id: 1, name: 'Admin Pengajar', email: body.username || 'admin@gmail.com' }
        }
      };
    }

    if (url === '/quizzes') {
      const quizzes = getQuizzes();
      const newQuiz = {
        id_quis: quizzes.length + 1,
        pin_quiz: body.pin_quiz || Math.floor(100000 + Math.random() * 900000).toString(),
        judul: body.judul || 'Kuis Baru ' + (quizzes.length + 1),
        status: body.status || 'aktif',
        questions: []
      };
      quizzes.push(newQuiz);
      saveQuizzes(quizzes);

      // Set as active room too
      const activeRoom = {
        pin: newQuiz.pin_quiz,
        status: 'waiting',
        current_question_index: 0,
        participants: [
          { id_peserta: 101, nama_peserta: 'Iqbal', avatar: '1', skor: 0 },
          { id_peserta: 102, nama_peserta: 'Anna', avatar: '2', skor: 0 },
          { id_peserta: 103, nama_peserta: 'Perdi', avatar: '3', skor: 0 }
        ],
        answers: []
      };
      saveActiveRoom(activeRoom);

      return { data: { message: 'Quiz berhasil dibuat', quiz: newQuiz } };
    }

    if (url === '/question') {
      const quizzes = getQuizzes();
      const quiz = quizzes.find(q => q.id_quis.toString() === body.id_quiz?.toString());
      if (quiz) {
        const newQuestion = {
          id_soal: quiz.questions.length + 1,
          pertanyaan: body.pertanyaan,
          opsi_a: body.opsi_a,
          opsi_b: body.opsi_b,
          opsi_c: body.opsi_c,
          opsi_d: body.opsi_d,
          jawaban_benar: body.jawaban_benar
        };
        quiz.questions.push(newQuestion);
        saveQuizzes(quizzes);
        return { data: { message: 'Soal berhasil ditambahkan', question: newQuestion } };
      }
      throw new Error('Kuis tidak ditemukan.');
    }

    if (url === '/participants') {
      // Body: { id_quiz, nama_peserta }
      const activeRoom = getActiveRoom();
      const newParticipant = {
        id_peserta: Math.floor(1000 + Math.random() * 9000),
        nama_peserta: body.nama_peserta,
        avatar: body.avatar || '1',
        skor: 0
      };
      // Keep demo ones but filter duplicate name if user re-joins
      activeRoom.participants = activeRoom.participants.filter(p => p.nama_peserta !== body.nama_peserta);
      activeRoom.participants.push(newParticipant);
      saveActiveRoom(activeRoom);
      return { data: newParticipant };
    }

    if (url === '/join') {
      // Body: { pin_quiz }
      const quizzes = getQuizzes();
      const quiz = quizzes.find(q => q.pin_quiz.replace(/\s+/g, '') === body.pin_quiz?.replace(/\s+/g, ''));
      if (quiz) {
        // Make sure it's the active room PIN
        const activeRoom = getActiveRoom();
        if (activeRoom.pin !== quiz.pin_quiz) {
          activeRoom.pin = quiz.pin_quiz;
          activeRoom.status = 'waiting';
          activeRoom.current_question_index = 0;
          activeRoom.participants = [
            { id_peserta: 101, nama_peserta: 'Iqbal', avatar: '1', skor: 0 },
            { id_peserta: 102, nama_peserta: 'Anna', avatar: '2', skor: 0 },
            { id_peserta: 103, nama_peserta: 'Perdi', avatar: '3', skor: 0 }
          ];
          activeRoom.answers = [];
          saveActiveRoom(activeRoom);
        }
        return { data: { message: 'PIN Valid', quiz } };
      }
      throw new Error('PIN Kuis tidak ditemukan atau tidak aktif.');
    }

    if (url === '/answer') {
      // Body: { id_peserta, id_soal, jawaban_pilihan }
      const activeRoom = getActiveRoom();
      const quizzes = getQuizzes();
      const activeQuiz = quizzes.find(q => q.pin_quiz === activeRoom.pin);
      if (!activeQuiz) throw new Error('Kuis aktif tidak ditemukan.');

      const question = activeQuiz.questions.find(q => q.id_soal.toString() === body.id_soal?.toString());
      if (!question) throw new Error('Soal tidak ditemukan.');

      const isCorrect = question.jawaban_benar.toUpperCase() === body.jawaban_pilihan?.toUpperCase();
      const scoreAdded = isCorrect ? 20 : 0;

      // Update participant's score
      activeRoom.participants = activeRoom.participants.map(p => {
        if (p.id_peserta.toString() === body.id_peserta?.toString()) {
          return { ...p, skor: p.skor + scoreAdded };
        }
        return p;
      });

      activeRoom.answers.push({
        id_peserta: body.id_peserta,
        id_soal: body.id_soal,
        jawaban_pilihan: body.jawaban_pilihan,
        isCorrect
      });

      saveActiveRoom(activeRoom);
      return { data: { message: 'Jawaban disimpan', isCorrect } };
    }

    if (url === '/results') {
      // Body: { id_quiz, id_peserta }
      const activeRoom = getActiveRoom();
      const participant = activeRoom.participants.find(p => p.id_peserta.toString() === body.id_peserta?.toString());
      return { data: { score: participant ? participant.skor : 0 } };
    }

    throw new Error(`Endpoint POST ${url} tidak ditemukan.`);
  },

  delete: async (url) => {
    await delay();
    if (url.startsWith('/quizzes/')) {
      const id = url.split('/').pop();
      let quizzes = getQuizzes();
      quizzes = quizzes.filter(q => q.id_quis.toString() !== id?.toString());
      saveQuizzes(quizzes);
      return { data: { message: 'Quiz berhasil dihapus' } };
    }
    throw new Error(`Endpoint DELETE ${url} tidak ditemukan.`);
  },

  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  }
};

export default API;