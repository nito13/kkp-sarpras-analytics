import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import GeospatialMap from './components/GeospatialMap';
import AssetExplorer from './components/AssetExplorer';
import VokasiAnalytics from './components/VokasiAnalytics';
import EarlyWarningMaintenance from './components/EarlyWarningMaintenance';
import BudgetSimulator from './components/BudgetSimulator';
import AddAssetModal from './components/AddAssetModal';
import LoginScreen from './components/LoginScreen';
import UserProfileModal from './components/UserProfileModal';
import MobileBottomNav from './components/MobileBottomNav';

import { SATDIK_LIST, SARPRAS_CATEGORIES } from './data/kkpData';
import { getFullSarprasData, calculateSarprasKPIs } from './data/sarprasGenerator';
import { Shield } from 'lucide-react';
import { apiCheckHealth, apiFetchAssets, apiCreateAsset, apiUpdateAsset } from './services/api';
import { exportAssetsToExcel } from './utils/excelExport';
import logoKkp from './assets/logo-kkp.svg';

const STORAGE_KEY = 'kkp_sarpras_database_v2';
const AUTH_STORAGE_KEY = 'kkp_auth_session_v2';

export default function App() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Failed to parse auth session', e);
    }
    return null;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Status koneksi database Laragon MySQL
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true, info: null });

  // Load assets from localStorage or default dataset (fallback)
  const [assets, setAssets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load local storage, using initial dataset', e);
    }
    return getFullSarprasData();
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Pre-filter states for Explorer tab
  const [explorerSatdikFilter, setExplorerSatdikFilter] = useState('ALL');
  const [explorerCategoryFilter, setExplorerCategoryFilter] = useState('ALL');

  // Add Asset modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Periksa koneksi ke MySQL Laragon dan muat data real-time
  useEffect(() => {
    let isMounted = true;

    async function checkAndLoadData() {
      try {
        const health = await apiCheckHealth();
        if (!isMounted) return;

        if (health.isConnected) {
          setDbStatus({ connected: true, loading: false, info: health.info });
          const res = await apiFetchAssets();
          if (isMounted && res.success && res.data.length > 0) {
            setAssets(res.data);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
            } catch {}
          }
        } else {
          setDbStatus({ connected: false, loading: false, info: null });
        }
      } catch {
        if (isMounted) {
          setDbStatus({ connected: false, loading: false, info: null });
        }
      }
    }

    checkAndLoadData();
    return () => { isMounted = false; };
  }, []);

  // Save to localStorage when assets change (as cache/fallback)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [assets]);

  // Handle Login
  const handleLogin = (user, rememberMe) => {
    setCurrentUser(user);
    if (rememberMe) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Failed to save auth session', e);
      }
    }
    // If operator of a specific campus, autofocus on that campus
    if (user.accessibleSatdik && user.accessibleSatdik !== 'ALL') {
      setExplorerSatdikFilter(user.accessibleSatdik);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  // Reactive KPI calculation
  const kpis = useMemo(() => {
    return calculateSarprasKPIs(assets, SATDIK_LIST);
  }, [assets]);

  // Update asset handler (supports full update payload or legacy condition/notes)
  const handleUpdateAsset = async (assetId, payloadOrCondition, notes) => {
    let updatePayload = {};

    if (typeof payloadOrCondition === 'object' && payloadOrCondition !== null) {
      updatePayload = { ...payloadOrCondition };
    } else {
      const newCondition = payloadOrCondition;
      const scoreMap = { 'Baik': 92, 'Rusak Ringan': 75, 'Rusak Berat': 25 };
      const urgencyMap = {
        'Baik': 'Normal',
        'Rusak Ringan': 'Normal',
        'Rusak Berat': 'Kritis / Segera'
      };

      const target = assets.find(a => a.id === assetId);
      const newCertStatus = (newCondition === 'Baik' && target?.certificationStatus === 'Kadaluarsa') 
        ? 'Tersertifikasi Aktif' 
        : target?.certificationStatus;
      const nowIso = new Date().toISOString().slice(0, 10);

      updatePayload = {
        condition: newCondition,
        conditionScore: scoreMap[newCondition] || target?.conditionScore || 80,
        maintenanceUrgency: urgencyMap[newCondition] || target?.maintenanceUrgency || 'Normal',
        issuesSummary: notes !== undefined ? notes : target?.issuesSummary,
        lastMaintenanceDate: nowIso,
        certificationStatus: newCertStatus,
      };
    }

    // Optimistic UI update
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          ...updatePayload,
        };
      }
      return a;
    }));

    // Sinkronisasi ke MySQL Laragon
    if (dbStatus.connected) {
      await apiUpdateAsset(assetId, updatePayload);
    }
  };

  // Add new asset handler
  const handleAddAsset = async (newAsset) => {
    setAssets(prev => [newAsset, ...prev]);

    // Sinkronisasi ke MySQL Laragon
    if (dbStatus.connected) {
      await apiCreateAsset(newAsset);
    }
  };

  // Quick navigation handlers
  const handleFilterCategoryAndNavigate = (categoryId) => {
    setExplorerCategoryFilter(categoryId);
    setExplorerSatdikFilter('ALL');
    setActiveTab('explorer');
  };

  const handleSelectSatdikAndNavigate = (satdikId) => {
    setExplorerSatdikFilter(satdikId);
    setExplorerCategoryFilter('ALL');
    setActiveTab('explorer');
  };

  // Export Excel handler dengan format tabel rapi, kop KKP, dan formula
  const handleExportExcel = () => {
    exportAssetsToExcel(assets, {
      currentUser,
      filterSatdikName: currentUser?.accessibleSatdik === 'ALL' 
        ? 'Seluruh Satuan Pendidikan (18 Kampus Vokasi KKP)' 
        : (currentUser?.satdikName || 'Kampus Khusus'),
      filterCategoryName: 'Semua Kategori Bidang',
      filenamePrefix: 'SIM_SARPRAS_KKP_Inventaris_Lengkap'
    });
  };

  // Print summary handler
  const handlePrint = () => {
    window.print();
  };

  // If user is not authenticated, show the official government Login Portal
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalAssets={kpis?.totalAssets || 0}
        totalValuation={kpis?.totalValuation || 0}
        criticalCount={kpis?.urgentAssets?.length || 0}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportExcel}
        onPrint={handlePrint}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        dbStatus={dbStatus}
      />

      {/* Role Notice Banner (if operator of specific campus) */}
      {currentUser.accessibleSatdik && currentUser.accessibleSatdik !== 'ALL' && (
        <div className="bg-cyan-950/70 border-b border-cyan-800/50 py-2 px-4 text-xs text-cyan-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>
                Mode Operator Kampus Aktif: <strong>{currentUser.satdikName}</strong>. Data terfokus pada satdik Anda.
              </span>
            </span>
            <button
              onClick={() => {
                setExplorerSatdikFilter(currentUser.accessibleSatdik);
                setActiveTab('explorer');
              }}
              className="underline text-cyan-300 hover:text-white font-medium text-[11px]"
            >
              Lihat Sarpras Kampus Saya
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 mobile-main-container pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            kpis={kpis}
            onNavigateTab={setActiveTab}
            onFilterCategory={handleFilterCategoryAndNavigate}
            onSelectSatdik={handleSelectSatdikAndNavigate}
          />
        )}

        {activeTab === 'map' && (
          <GeospatialMap
            satdikBreakdown={kpis.satdikBreakdown}
            onSelectSatdikForExplorer={handleSelectSatdikAndNavigate}
          />
        )}

        {activeTab === 'explorer' && (
          <AssetExplorer
            assets={assets}
            initialSatdikFilter={explorerSatdikFilter}
            initialCategoryFilter={explorerCategoryFilter}
            onUpdateAsset={handleUpdateAsset}
            onUpdateAssetCondition={handleUpdateAsset}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'vokasi' && (
          <VokasiAnalytics
            satdikBreakdown={kpis.satdikBreakdown}
            assets={assets}
          />
        )}

        {activeTab === 'maintenance' && (
          <EarlyWarningMaintenance
            urgentAssets={kpis.urgentAssets}
            onResolveAsset={handleUpdateAsset}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <BudgetSimulator
            assets={assets}
            onApplySimulatedAssets={(updated) => setAssets(updated)}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Add New Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAsset={handleAddAsset}
      />

      {/* User Profile & Permissions Modal */}
      <UserProfileModal
        user={currentUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />

      {/* Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 sm:px-6 text-xs text-slate-400 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 shadow-md">
              <img src={logoKkp} alt="Logo KKP" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                SIM-SARPRAS KKP — Sistem Informasi & Analitik Sarana Prasarana Satdik
              </p>
              <p className="text-[11px] text-slate-400">
                Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) — BPPSDM KP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standar BMN Kementerian Keuangan</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-400">
              Gedung Mina Bahari III, Jl. Medan Merdeka Timur No. 16, Jakarta Pusat
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Muncul Khusus di Handphone/Layar Kecil) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={kpis?.urgentAssets?.length || 0}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        canAddAsset={currentUser?.permissions?.includes('edit_all') || currentUser?.permissions?.includes('edit_own')}
      />
    </div>
  );
}
