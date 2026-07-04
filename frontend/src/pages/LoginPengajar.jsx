import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import API from '../services/api';

export default function LoginPengajar() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Kombinasi Username & Password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1B3D] px-4 py-8">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-sm bg-[#0B1B3D] flex flex-col justify-between h-[640px] text-white">
        
        {/* Status Bar simulation & Navigation */}
        <div>
          <div className="flex justify-between items-center text-xs px-6 pt-2 opacity-80 mb-4">
            <span>13:46</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white/20 rounded-full flex items-center justify-center text-[8px]">⚡</span>
              <span className="w-4.5 h-3 bg-white/20 rounded-xs"></span>
            </div>
          </div>
          
          <div className="px-4">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition text-sm font-semibold"
            >
              <ChevronLeft size={18} /> Kembali
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-100">Login Pengajar</h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Masuk ke akun pengajar Anda untuk membuat dan mengelola kuis
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs text-red-200 bg-red-900/40 border border-red-700/50 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email / Username*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </span>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 text-sm transition placeholder:text-slate-500 text-white"
                  placeholder="Masukkan email atau username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 text-sm transition placeholder:text-slate-500 text-white"
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forget Password */}
            <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="rounded-xs accent-blue-500 bg-white/10 border-white/20" />
                <span>Ingat saya</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Hubungi Administrator untuk menyetel ulang kata sandi.'); }} className="hover:text-blue-400 transition font-medium">Lupa password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-full text-sm transition duration-200 shadow-lg shadow-blue-500/20 disabled:bg-slate-600 disabled:shadow-none mt-2"
            >
              {loading ? 'Memproses Autentikasi...' : 'Login'}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center mt-6 text-xs text-slate-400">
            <span>Belum punya akun? </span>
            <a href="#register" onClick={(e) => { e.preventDefault(); alert('Registrasi mandiri dinonaktifkan. Hubungi Administrator.'); }} className="text-blue-400 hover:underline font-bold">Buat akun pengajar</a>
          </div>
        </div>

        {/* Footer simulation */}
        <div className="flex justify-around items-center py-4 border-t border-white/10 text-white/50 text-sm">
          <button className="hover:text-white transition">Ⲷ</button>
          <button className="hover:text-white transition">⌂</button>
          <button className="hover:text-white transition">⟨</button>
        </div>

      </div>
    </div>
  );
}