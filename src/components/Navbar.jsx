import React from 'react';
import { 
  Anchor, 
  BarChart3, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  PlusCircle, 
  Download, 
  Ship, 
  Sparkles,
  Activity,
  User,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoKkp from '../assets/logo-kkp.png';

export default function Navbar({
  activeTab,
  setActiveTab,
  totalAssets,
  criticalCount,
  onOpenAddModal,
  onExportCSV,
  onExportExcel,
  currentUser,
  onOpenProfile,
  onLogout,
  dbStatus
}) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan Eksekutif', icon: BarChart3 },
    { id: 'map', label: 'Peta Sebaran Geospasial', icon: MapPin },
    { id: 'explorer', label: 'Inventaris & Katalog Sarpras', icon: Layers },
    { 
      id: 'maintenance', 
      label: 'Early Warning & Perbaikan', 
      icon: AlertTriangle,
      badge: criticalCount > 0 ? criticalCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-200">

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0" onClick={() => setActiveTab('dashboard')}>
            <div className={`header-logo-container w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0 border ${
              isDark ? 'border-cyan-400/50 shadow-cyan-500/20' : 'border-black shadow-slate-400/20'
            }`}>
              <img src={logoKkp} alt="Logo Resmi Kementerian Kelautan dan Perikanan" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight truncate">
                  SARPRAS <span className="text-cyan-400 font-extrabold">KKP</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dashboard Analitik Sarana & Prasarana Vokasi Kelautan & Perikanan
              </p>
            </div>
          </div>

          {/* Quick Actions (Add Asset, Export, Print, User Profile, Logout) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {currentUser?.permissions?.includes('edit_all') || currentUser?.permissions?.includes('edit_own') ? (
              <button
                onClick={onOpenAddModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Input data aset sarana prasarana baru"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Sarpras</span>
              </button>
            ) : null}

            <button
              onClick={onExportExcel || onExportCSV}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Ekspor data inventaris sarpras ke Microsoft Excel (.xls) dengan tabel berformat resmi & rapi"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Ekspor Excel</span>
            </button>



            {/* Switch Tema Terang / Gelap */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm flex-shrink-0"
              title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
              aria-label="Toggle Theme Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500" />
              )}
            </button>

            {/* Authenticated User Capsule */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1 sm:pl-2 border-l border-slate-700/80">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left transition-colors flex-shrink-0"
                title="Klik untuk melihat profil & hak akses akun"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden xl:block max-w-[120px] truncate pr-1">
                  <span className="text-[11px] font-bold text-white block truncate leading-tight">
                    {currentUser?.name?.split(',')[0] || 'Pengguna'}
                  </span>
                  <span className="text-[9px] text-cyan-400 block truncate">
                    {currentUser?.roleLabel || 'Operator'}
                  </span>
                </div>
              </button>

              {/* Tombol Logout - Tampil Jelas & Menonjol di Layar HP maupun Desktop */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white dark:hover:text-white border border-rose-300 dark:border-rose-500/40 hover:border-rose-600 text-xs font-bold transition-all shadow-sm flex-shrink-0 active:scale-95 group"
                title="Keluar dari sesi SARPRAS"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400 group-hover:text-white transition-colors" />
                <span className="text-[11px] sm:text-xs font-bold tracking-tight">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar - Khusus Tampil di Desktop (Di HP dihilangkan karena memakai bar navigasi bawah MobileBottomNav) */}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-300 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
