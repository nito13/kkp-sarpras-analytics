import React from 'react';
import { 
  Anchor, 
  BarChart3, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Calculator, 
  PlusCircle, 
  Download, 
  Printer, 
  Ship, 
  Sparkles,
  School,
  Activity,
  User,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { formatRupiah } from '../data/sarprasGenerator';
import { useTheme } from '../context/ThemeContext';
import logoKkp from '../assets/logo-kkp.svg';

export default function Navbar({
  activeTab,
  setActiveTab,
  totalAssets,
  totalValuation,
  criticalCount,
  onOpenAddModal,
  onExportCSV,
  onPrint,
  currentUser,
  onOpenProfile,
  onLogout,
  dbStatus
}) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan Eksekutif', icon: BarChart3 },
    { id: 'map', label: 'Peta Sebaran Geospasial', icon: MapPin },
    { id: 'explorer', label: 'Inventaris & Katalog BMN', icon: Layers },
    { id: 'vokasi', label: 'Standar & Kelaikan Vokasi', icon: School },
    { 
      id: 'maintenance', 
      label: 'Early Warning & Perbaikan', 
      icon: AlertTriangle,
      badge: criticalCount > 0 ? criticalCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { id: 'simulator', label: 'Simulasi Anggaran APBN', icon: Calculator, isNew: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-200">
      {/* Top Banner: Official KKP Branding & System Title */}
      <div className="top-branding-banner bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 px-3 sm:px-6 py-1.5 sm:py-2 border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs">
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 p-1 border border-cyan-400/60 shadow-sm flex-shrink-0">
                <img src={logoKkp} alt="Logo KKP" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-white tracking-wide uppercase text-[10px] sm:text-xs block leading-tight">
                  Kementerian Kelautan dan Perikanan
                </span>
                <p className="text-slate-400 text-[9px] sm:text-[10px] truncate max-w-[240px] sm:max-w-none">
                  Badan Penyuluhan & Pengembangan SDM KP
                </p>
              </div>
            </div>

            {/* Mobile Database Pill Badge */}
            <div className="sm:hidden">
              {dbStatus?.connected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-semibold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  MySQL Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-medium text-[10px]">
                  Lokal
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-[11px]">
            {dbStatus?.connected ? (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-medium shadow-sm"
                title={`MySQL Laragon Terhubung (localhost:3306 - ${dbStatus.info?.database || 'kkp_sarpras_db'})`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MySQL Laragon (Aktif)
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-medium"
                title="Laragon belum terhubung, menggunakan data lokal"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Mode Offline / Lokal
              </span>
            )}
            <span className="text-slate-400 hidden lg:inline">|</span>
            <span className="text-slate-300 hidden lg:inline">
              18 Satuan Pendidikan (11 Poltek & 7 SUPM)
            </span>
            <span className="text-slate-400 hidden lg:inline">|</span>
            <span className="text-cyan-300 font-semibold hidden sm:inline">
              Valuasi: {formatRupiah(totalValuation)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/50 hover:scale-105 transition-transform flex-shrink-0">
              <img src={logoKkp} alt="Logo Resmi Kementerian Kelautan dan Perikanan" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  SIM-SARPRAS <span className="text-cyan-400 font-extrabold">KKP</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/50 rounded">
                  v2.6 Analytics
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dashboard Analitik Sarana & Prasarana Vokasi Kelautan & Perikanan
              </p>
            </div>
          </div>

          {/* Quick Actions (Add Asset, Export, Print, User Profile) */}
          <div className="flex items-center space-x-2">
            {currentUser?.permissions?.includes('edit_all') || currentUser?.permissions?.includes('edit_own') ? (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                title="Input data aset sarana prasarana baru"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Sarpras</span>
              </button>
            ) : null}

            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
              title="Export data sarana ke file format CSV"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Unduh CSV</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
              title="Cetak ringkasan laporan sarpras"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden md:inline">Cetak</span>
            </button>

            {/* Switch Tema Terang / Gelap */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
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
            <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-700">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
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

              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
                title="Keluar dari sesi SIM-SARPRAS"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
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

                {tab.isNew && !isActive && (
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Simulator
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
