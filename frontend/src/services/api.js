import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Sesuaikan URL Backend Laravel Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menambahkan token otomatis jika pengajar sudah login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Menggunakan Laravel Sanctum
  }
  return config;
});

// Penanganan Kesalahan (Error Handling Global)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Kesalahan respon dari server backend (Status 4xx / 5xx)
      console.error(`API Error [${error.response.status}]:`, error.response.data.message);
      
      if (error.response.status === 401) {
        // Jika token tidak valid / kedaluwarsa, paksa logout
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Kesalahan jaringan (Server backend mati / tidak merespon)
      console.error('Network Error: Server tidak dapat dihubungi.');
      return Promise.reject({ message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.' });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

export default API;