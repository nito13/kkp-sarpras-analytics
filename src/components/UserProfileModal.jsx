import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Key, 
  LogOut, 
  CheckCircle2, 
  Calendar,
  Lock,
  BadgeCheck
} from 'lucide-react';

export default function UserProfileModal({
  user,
  isOpen,
  onClose,
  onLogout
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-cyan-950 p-6 border-b border-slate-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {user.roleLabel}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                {user.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">NIP. {user.nip}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Unit Kerja & Jabatan */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-400 text-[10px] block">Jabatan Kedinasan:</span>
              <span className="text-slate-200 font-semibold">{user.jabatan}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-slate-400 text-[10px] block">Unit Kerja:</span>
              <span className="text-cyan-300 font-medium">{user.unitKerja}</span>
            </div>
          </div>

          {/* Email & Wilayah Wewenang */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Email Kedinasan:</span>
              <span className="text-slate-200 font-medium truncate block mt-0.5">{user.email}</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Cakupan Wilayah:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">
                {user.accessibleSatdik === 'ALL' ? '18 Satdik Nasional' : user.satdikName || 'Kampus Khusus'}
              </span>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div>
            <span className="text-slate-400 font-semibold block mb-2 uppercase text-[10px] tracking-wider">
              Hak Akses Sistem (Permissions):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>{perm.replace('_', ' ').toUpperCase()}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Sesi aktif Anda diamankan dengan protokol TLS 1.3 dan tersambung ke SSO KKP.</span>
          </div>
        </div>

        {/* Footer with Logout action */}
        <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Tutup
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
