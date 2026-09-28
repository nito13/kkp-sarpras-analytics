// src/components/MobileBottomNav.jsx
import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Layers, 
  School, 
  AlertTriangle, 
  PlusCircle
} from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab, 
  setActiveTab, 
  criticalCount,
  onOpenAddModal,
  canAddAsset
}) {
  const tabs = [
    { id: 'dashboard', label: 'Ringkasan', icon: BarChart3 },
    { id: 'map', label: 'Peta', icon: MapPin },
    { id: 'explorer', label: 'Katalog', icon: Layers },
    { id: 'vokasi', label: 'Standar', icon: School },
    { 
      id: 'maintenance', 
      label: 'Perbaikan', 
      icon: AlertTriangle,
      badge: criticalCount > 0 ? criticalCount : null 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 dark:bg-slate-900/95 border-t border-slate-800 dark:border-slate-800 backdrop-blur-lg px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-rose-500 text-white rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-cyan-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-cyan-400 rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}

        {canAddAsset && (
          <button
            onClick={onOpenAddModal}
            className="flex flex-col items-center justify-center py-1 px-1 text-cyan-400 hover:text-cyan-300"
            title="Tambah Sarpras Baru"
          >
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium text-cyan-400">
              +Aset
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
