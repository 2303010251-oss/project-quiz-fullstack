import axios from 'axios';

const backendUrl = 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const API = {
  get: async (url) => {
    try {
      const cleanUrl = url.split('?')[0];
      const params = new URLSearchParams(url.split('?')[1] || '');

      if (cleanUrl === '/quizzes') {
        const response = await axiosInstance.get('/quizzes');
        const mappedData = response.data.map(q => ({
          id_quis: q.id,
          pin_quiz: q.pin,
          judul: q.title,
          status: q.status || 'aktif',
          questions: [] // Not used by list view
        }));
        return { data: mappedData };
      }

      if (cleanUrl === '/question') {
        const quizId = params.get('quiz_id');
        const response = await axiosInstance.get('/questions');
        const filtered = response.data.filter(q => q.quiz_id.toString() === quizId?.toString());
        const mappedData = filtered.map(q => ({
          id_soal: q.id,
          pertanyaan: q.question,
          opsi_a: q.option_a,
          opsi_b: q.option_b,
          opsi_c: q.option_c,
          opsi_d: q.option_d,
          jawaban_benar: q.correct_answer
        }));
        return { data: mappedData };
      }

      if (cleanUrl === '/leaderboard') {
        const quizId = params.get('quiz_id');
        if (quizId) {
          const response = await axiosInstance.get(`/leaderboard/${quizId}`);
          const mappedData = response.data.map(l => ({
            id_leaderboard: l.id,
            id_peserta: l.participant_id,
            skor: l.score,
            peserta: { nama_peserta: `Peserta ${l.participant_id}`, avatar: '1' } 
          }));
          // Sort by score
          mappedData.sort((a, b) => b.skor - a.skor);
          return { data: mappedData };
        }
      }

      const res = await axiosInstance.get(url);
      return res;
    } catch (err) {
      console.error('API GET Error:', err);
      throw err;
    }
  },

  post: async (url, body) => {
    try {
      if (url === '/login') {
        // Fallback for mock login if backend doesn't have auth setup yet
        // Uncomment if you want to use real backend auth
        /*
        const res = await axiosInstance.post('/login', body);
        return { data: { token: res.data.token, user: res.data.user } };
        */
        return {
          data: {
            token: 'mock-token-unper-123456',
            user: { id: 1, name: 'Admin Pengajar', email: body.username || 'admin@gmail.com' }
          }
        };
      }

      if (url === '/quizzes') {
        const payload = {
          title: body.judul || 'Kuis Baru',
        };
        const response = await axiosInstance.post('/quizzes', payload);
        return {
          data: {
            message: 'Quiz berhasil dibuat',
            quiz: {
              id_quis: response.data.data.id,
              pin_quiz: response.data.data.pin,
              judul: response.data.data.title,
              status: response.data.data.status
            }
          }
        };
      }

      if (url === '/question') {
        const payload = {
          quiz_id: body.id_quiz,
          question: body.pertanyaan,
          option_a: body.opsi_a,
          option_b: body.opsi_b,
          option_c: body.opsi_c,
          option_d: body.opsi_d,
          correct_answer: body.jawaban_benar
        };
        const response = await axiosInstance.post('/questions', payload);
        return {
          data: {
            message: 'Soal berhasil ditambahkan',
            question: {
              id_soal: response.data.data.id,
              pertanyaan: response.data.data.question,
              opsi_a: response.data.data.option_a,
              opsi_b: response.data.data.option_b,
              opsi_c: response.data.data.option_c,
              opsi_d: response.data.data.option_d,
              jawaban_benar: response.data.data.correct_answer
            }
          }
        };
      }

      if (url === '/participants') {
        const payload = {
          quiz_id: body.id_quiz,
          name: body.nama_peserta
        };
        const response = await axiosInstance.post('/participants', payload);
        return {
          data: {
            id_peserta: response.data.data.id,
            nama_peserta: response.data.data.name,
            avatar: body.avatar || '1',
            skor: 0
          }
        };
      }

      if (url === '/join') {
        // Frontend JoinQuiz only provides pin_quiz.
        // We find the quiz manually.
        const quizRes = await axiosInstance.get('/quizzes');
        const quiz = quizRes.data.find(q => q.pin == body.pin_quiz);
        if (!quiz) {
           throw new Error('PIN tidak ditemukan');
        }
        return {
          data: {
            message: 'PIN Valid',
            id_quis: quiz.id,
            quiz: {
              id_quis: quiz.id,
              pin_quiz: quiz.pin,
              judul: quiz.title,
              status: quiz.status
            }
          }
        };
      }

      if (url === '/answer') {
        const payload = {
          participant_id: body.id_peserta,
          question_id: body.id_soal,
          answer: body.jawaban_pilihan
        };
        await axiosInstance.post('/submit-answer', payload);

        // Fetch question to check if correct
        const qRes = await axiosInstance.get(`/questions/${body.id_soal}`);
        const isCorrect = qRes.data.correct_answer.toUpperCase() === body.jawaban_pilihan.toUpperCase();

        return {
          data: {
            message: 'Jawaban disimpan',
            isCorrect: isCorrect
          }
        };
      }

      if (url === '/results') {
        const payload = {
          quiz_id: body.id_quiz,
          participant_id: body.id_peserta,
          score: body.skor || 0,
          rank: 1
        };
        await axiosInstance.post('/leaderboards', payload);
        return { data: { score: payload.score } };
      }

      const res = await axiosInstance.post(url, body);
      return res;
    } catch (err) {
      console.error('API POST Error:', err);
      throw err;
    }
  },

  delete: async (url) => {
    try {
      if (url.startsWith('/quizzes/')) {
        const id = url.split('/').pop();
        await axiosInstance.delete(`/quizzes/${id}`);
        return { data: { message: 'Quiz berhasil dihapus' } };
      }
      const res = await axiosInstance.delete(url);
      return res;
    } catch (err) {
      console.error('API DELETE Error:', err);
      throw err;
    }
  },

  interceptors: axiosInstance.interceptors
};

export default API;