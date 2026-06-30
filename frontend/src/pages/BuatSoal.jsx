import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuatSoal() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Buat Soal Kuis Baru</h2>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-slate-500 hover:underline">
          Batal
        </button>
      </div>

      <form className="bg-white p-6 rounded-2xl shadow-sm border space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Soal berhasil disimpan!'); navigate('/dashboard'); }}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Pertanyaan</label>
          <textarea rows="3" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tulis soal kuis di sini..." required></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Pilihan Opsi A" className="w-full px-4 py-2 border rounded-xl outline-none" required />
          <input type="text" placeholder="Pilihan Opsi B" className="w-full px-4 py-2 border rounded-xl outline-none" required />
          <input type="text" placeholder="Pilihan Opsi C" className="w-full px-4 py-2 border rounded-xl outline-none" required />
          <input type="text" placeholder="Pilihan Opsi D" className="w-full px-4 py-2 border rounded-xl outline-none" required />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Kunci Jawaban Benar</label>
          <select className="w-full px-4 py-2.5 border rounded-xl bg-white outline-none">
            <option value="A">Opsi A</option>
            <option value="B">Opsi B</option>
            <option value="C">Opsi C</option>
            <option value="D">Opsi D</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition">
          Simpan ke Database
        </button>
      </form>
    </div>
  );
}