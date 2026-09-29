import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Moon,
  Smartphone,
  X,
  Copy,
  Check,
  Wifi
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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedIp, setSelectedIp] = useState('10.110.147.40');
  const availableNetworks = [
    { name: 'Wi-Fi', ip: '10.110.147.40' },
    { name: 'Hotspot / LAN', ip: '192.168.137.1' },
  ];

  const mobileAccessUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port || '5173'}`
    : `http://${selectedIp}:5173`;

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

            {/* Tombol Akses di Handphone (QR Code & IP) - Khusus Desktop */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hidden md:flex p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-105 active:scale-95 items-center justify-center shadow-sm"
              title="Buka SARPRAS di Handphone / Tablet (Scan QR)"
              aria-label="Akses di HP"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
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

      {/* Modal Akses HP / QR Code (Mounted to document.body via Portal to guarantee perfect center positioning) */}
      {isQrModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl p-6 text-center m-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Buka di Handphone
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-medium">Akses Jaringan Wi-Fi Lokal</span>
                </div>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {/* Pilihan Interface Jaringan Server */}
              <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
                {availableNetworks.map((net) => {
                  const isCurrent = selectedIp === net.ip;
                  return (
                    <button
                      key={net.ip}
                      type="button"
                      onClick={() => setSelectedIp(net.ip)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <span>{net.name}</span>
                      <span className="block text-[10px] font-mono opacity-80">{net.ip}</span>
                    </button>
                  );
                })}
              </div>

              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl border border-slate-600 flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileAccessUrl)}`}
                  alt="QR Code Akses HP" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <p className="text-xs text-slate-300 font-medium">
                  Arahkan kamera HP ke QR Code di atas, atau buka browser dan ketik alamat:
                </p>
                <div className="mt-2 flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-700/80">
                  <span className="font-mono text-xs text-cyan-300 font-bold select-all truncate mr-2">
                    {mobileAccessUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(mobileAccessUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-left space-y-1">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Petunjuk Mudah:</span>
                </p>
                <p>1. Sambungkan HP ke jaringan Wi-Fi yang sama dengan PC/Laptop.</p>
                <p>2. Scan QR Code atau ketik alamat IP di atas pada browser HP.</p>
                <p>3. Navigasi bawah (*Mobile Bottom Nav*) otomatis aktif untuk layar HP.</p>
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
