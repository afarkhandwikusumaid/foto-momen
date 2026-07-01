import React from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginFormProps {
  onLogin: (email: string, password: string) => void;
  loginError: boolean;
  isLoggingIn?: boolean;
}

export default function AdminLoginForm({ onLogin, loginError, isLoggingIn }: AdminLoginFormProps) {
  const [emailInput, setEmailInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(emailInput, passwordInput);
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 w-full animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Login Admin</h2>
        <p className="text-slate-500 text-sm mb-6">Masuk menggunakan akun Supabase Anda.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Email Admin"
              className={`w-full px-4 py-3 mb-3 bg-slate-50 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-[#1d90ff] ${loginError ? 'border-red-400' : 'border-slate-200'}`}
              required
            />
            <input 
              type="password" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Kata Sandi"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-[#1d90ff] ${loginError ? 'border-red-400' : 'border-slate-200'}`}
              required
            />
            {loginError && <p className="text-red-500 text-xs mt-2">Email atau kata sandi salah!</p>}
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-[#1d90ff] hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
          >
            {isLoggingIn ? 'Memproses...' : 'Masuk Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
