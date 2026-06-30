import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function LoginPengajar() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/login', { username, password });
      login(response.data.token); // Menyimpan token Sanctum
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Kombinasi Username & Password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Login Pengajar</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Autentikasi khusus Admin & Host Kuis</p>
        
        {error && <div className="p-3 mb-4 text-xs text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition disabled:bg-slate-400"
          >
            {loading ? 'Memproses Autentikasi...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}