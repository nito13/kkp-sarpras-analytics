import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  KeyRound, 
  ChevronRight,
  Anchor,
  Shield,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { AUTH_USERS, authenticateUser } from '../data/authUsers';
import { apiLogin } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ onLogin }) {
  const { isDark, toggleTheme } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await apiLogin(identifier, password);
      if (res.success && res.user) {
        onLogin(res.user, rememberMe);
        return;
      }

      // Jika offline, coba autentikasi lokal
      if (res.isOffline) {
        const localUser = authenticateUser(identifier, password);
        if (localUser) {
          onLogin(localUser, rememberMe);
          return;
        }
      }

      setErrorMessage(res.message || 'Email/NIP atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.');
    } catch {
      const localUser = authenticateUser(identifier, password);
      if (localUser) {
        onLogin(localUser, rememberMe);
      } else {
        setErrorMessage('Email/NIP atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (user) => {
    setIdentifier(user.email);
    setPassword(user.password);
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      onLogin(user, true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Waves / Grids */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      ></div>

      {/* Decorative Ocean Glow circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      {/* Top Ministry Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-xs py-2 text-slate-400 relative z-10">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">Portal Keamanan SSO KKP Terpadu</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono text-[11px] text-cyan-400">
            SIM-SARPRAS v2.6 • 2026/2027
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center"
            title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
          </button>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-xl mx-auto w-full my-auto py-6 relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative">
          
          {/* Official Emblem & Titles */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800">
            {/* KKP Logo Container */}
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white p-2 shadow-xl shadow-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo-kkp.svg" 
                alt="Logo Kementerian Kelautan dan Perikanan" 
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                Kementerian Kelautan dan Perikanan Republik Indonesia
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                SIM-SARPRAS <span className="text-cyan-400">KKP</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Sistem Informasi & Analitik Sarana Prasarana Satuan Pendidikan Vokasi Kelautan dan Perikanan (BPPSDM KP)
              </p>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mt-5 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email / NIP Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Email Kedinasan (@kkp.go.id) atau NIP
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin.bppsdm@kkp.go.id / 19730412..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Kata Sandi (Password)
                </label>
                <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
                />
                <span>Ingat sesi login pada perangkat ini</span>
              </label>

              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL 256-Bit</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Sistem SIM-SARPRAS</span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Demo Login Profiles for Easy Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pilihan Masuk Cepat (Akun Penguji)</span>
              </span>
              <span className="text-[10px] text-slate-500">Klik 1-kali untuk masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {AUTH_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(user)}
                  className="bg-slate-950/70 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-white block text-[11px] group-hover:text-cyan-300 truncate">
                      {user.name.split(',')[0]}
                    </span>
                    <span className="text-[10px] text-cyan-400 block truncate">
                      {user.roleLabel}
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate">
                      {user.email}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Official Government Footer on Login Screen */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-500 py-3 relative z-10 border-t border-slate-800/60">
        <p>© 2026 Kementerian Kelautan dan Perikanan Republik Indonesia • Hak Cipta Dilindungi Undang-Undang</p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Gedung Mina Bahari III, Jl. Medan Merdeka Timur No. 16, Jakarta Pusat 10110
        </p>
      </div>
    </div>
  );
}
