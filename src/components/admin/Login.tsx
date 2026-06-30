import React, { useState } from 'react';
import { Database } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'admin123') {
      localStorage.setItem('foto_momen_admin_auth', 'true');
      setLoginError('');
      onLoginSuccess();
    } else {
      setLoginError('PIN Admin tidak valid. Silakan coba lagi.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fade-in text-slate-800 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[36px] p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2.5">
          <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-100 text-[#1d90ff] flex items-center justify-center mx-auto shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Masukkan PIN administrator untuk mengakses data template, stiker, dan backdrop.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {loginError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-2xl text-xs font-bold text-center">
              {loginError}
            </div>
          )}
          
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-500">PIN Kredensial</label>
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1d90ff]/20 focus:border-[#1d90ff] text-xs font-bold text-center text-slate-800 bg-white transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-bold text-xs transition cursor-pointer select-none text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#1d90ff] hover:bg-blue-600 text-white rounded-full font-bold text-xs shadow transition cursor-pointer select-none text-center"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
