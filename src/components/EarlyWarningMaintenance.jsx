import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Ship, 
  Building2, 
  Anchor, 
  ChevronRight, 
  Check, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatRupiah } from '../data/sarprasGenerator';

export default function EarlyWarningMaintenance({
  urgentAssets,
  onResolveAsset,
  onNavigateToSimulator
}) {
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Rusak Berat' | 'Kadaluarsa'

  const handleQuickResolve = (assetId) => {
    setResolvedIds(prev => new Set([...prev, assetId]));
    if (onResolveAsset) {
      onResolveAsset(assetId, 'Baik', 'Telah diselesaikan melalui program perbaikan mendesak BPPSDM KP.');
    }
  };

  const filteredUrgent = urgentAssets.filter(asset => {
    if (resolvedIds.has(asset.id)) return false;
    if (filterType === 'Rusak Berat') return asset.condition === 'Rusak Berat';
    if (filterType === 'Kadaluarsa') return asset.certificationStatus === 'Kadaluarsa';
    return true;
  });

  const totalUrgentCost = filteredUrgent.reduce((sum, a) => sum + (a.estimatedRepairCost || 0), 0);

  // Scheduled Docking & Maintenance Timeline
  const maintenanceSchedule = [
    {
      date: 'Oktober 2026',
      title: 'Jadwal Dry-Docking KM. Madidihang 03 (Poltek AUP)',
      facility: 'Galangan Kapal Jakarta Port',
      budget: 'Rp 450.000.000',
      status: 'Terjadwal',
      type: 'Docking Kapal',
    },
    {
      date: 'November 2026',
      title: 'Overhaul Total & Penggantian Turbocharger KM. Frans Kaisiepo (Sorong)',
      facility: 'Dok & Galangan Kapal Sorong',
      budget: 'Rp 1.450.000.000',
      status: 'Mendesak (Pending Anggaran)',
      type: 'Overhaul Darurat',
    },
    {
      date: 'November 2026',
      title: 'Audit & Sertifikasi Kalibrasi Alat Lab Lingkungan (Poltek KP Sidoarjo)',
      facility: 'Komite Akreditasi Nasional (KAN)',
      budget: 'Rp 60.000.000',
      status: 'Persiapan Berkas',
      type: 'Kalibrasi ISO',
    },
    {
      date: 'Desember 2026',
      title: 'Penggantian Evaporator & Kompresor Cold Storage 30 Ton (Poltek AUP)',
      facility: 'Teknisi Khusus Bitzer Refrigeration',
      budget: 'Rp 680.000.000',
      status: 'Verifikasi Teknis',
      type: 'Refrigerasi',
    },
    {
      date: 'Januari 2027',
      title: 'Perbaikan Dermaga Apung & Gangway Pasir Putih (Poltek KP Pangandaran)',
      facility: 'Kontraktor Maritim Jabar',
      budget: 'Rp 520.000.000',
      status: 'Usulan Prioritas',
      type: 'Dermaga Latih',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 p-5 rounded-2xl border border-rose-500/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              Early Warning System (EWS)
            </span>
            <span className="text-slate-400 text-xs">• Aset Sarpras Berstatus Darurat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Pusat Peringatan Dini & Manajemen Perbaikan Darurat</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-3xl">
            Deteksi dini kerusakan kritis pada armada kapal latih, mesin pendingin UPI, dan instalasi asrama yang berisiko menghentikan proses belajar mengajar taruna.
          </p>
        </div>

        {/* Emergency Stats Card */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/30 text-xs self-start md:self-center flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-[10px] block">Aset Kritis Aktif:</span>
            <span className="text-lg font-black text-rose-400">{filteredUrgent.length} Fasilitas</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 text-[10px] block">Total Kebutuhan Darurat:</span>
            <span className="text-base font-bold text-amber-400">{formatRupiah(totalUrgentCost)}</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter Kritis:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'ALL' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Semua ({filteredUrgent.length})
          </button>
          <button
            onClick={() => setFilterType('Rusak Berat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'Rusak Berat' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Rusak Berat ({urgentAssets.filter(a => a.condition === 'Rusak Berat').length})
          </button>
          <button
            onClick={() => setFilterType('Kadaluarsa')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'Kadaluarsa' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Sertifikat Mati ({urgentAssets.filter(a => a.certificationStatus === 'Kadaluarsa').length})
          </button>
        </div>

        <button
          onClick={onNavigateToSimulator}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-900/40"
        >
          <span>Simulasikan Alokasi Anggaran APBN</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Critical Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUrgent.map((asset) => (
          <div
            key={asset.id}
            className="bg-slate-800/90 rounded-2xl p-5 border border-rose-500/40 shadow-lg flex flex-col justify-between space-y-4 hover:border-rose-400 transition-all"
          >
            <div>
              {/* Card Header with Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{asset.bmnCode}</span>
                    <h3 className="text-base font-bold text-white leading-tight">{asset.name}</h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 whitespace-nowrap">
                  {asset.condition} ({asset.conditionScore}%)
                </span>
              </div>

              {/* Institution and Subcategory */}
              <div className="text-xs text-slate-300 mt-2 flex items-center justify-between">
                <span className="font-medium text-cyan-300">{asset.satdikName}</span>
                <span className="text-[11px] text-slate-400">{asset.subcategory}</span>
              </div>

              {/* Technical Issues Summary */}
              <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-rose-300 block mb-1">
                  Diagnosa Kerusakan & Risiko:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {asset.issuesSummary}
                </p>
              </div>

              {/* Status and Specs */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Status Sertifikasi:</span>
                  <span className={`font-semibold ${
                    asset.certificationStatus === 'Kadaluarsa' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {asset.certificationStatus}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Estimasi Biaya Perbaikan:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {formatRupiah(asset.estimatedRepairCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">
                Jadwal Servis: {asset.nextMaintenanceDate || 'Mendesak'}
              </span>

              <button
                onClick={() => handleQuickResolve(asset.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tandai Selesai Diperbaiki</span>
              </button>
            </div>
          </div>
        ))}

        {filteredUrgent.length === 0 && (
          <div className="col-span-2 bg-emerald-950/40 p-8 rounded-2xl border border-emerald-500/40 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Seluruh Sarpras Kritis Telah Tertangani!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Tidak ada aset berstatus Rusak Berat atau sertifikat mati yang belum tertangani. Kelaikan operasional vokasi berjalan optimal.
            </p>
          </div>
        )}
      </div>

      {/* Maintenance & Docking Timeline Schedule */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Jadwal Docking Kapal Latih & Pemeliharaan Berkala 2026/2027</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rencana aksi pemeliharaan preventif dan kuratif yang terjadwal pada galangan mitra dan balai pengujian.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
            5 Agenda Terjadwal
          </span>
        </div>

        <div className="space-y-2.5 pt-2">
          {maintenanceSchedule.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {item.date}
                    </span>
                    <span className="text-[10px] text-slate-400">• {item.type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Lokasi / Mitra: {item.facility}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Kebutuhan Anggaran</span>
                  <span className="font-bold text-amber-400 font-mono">{item.budget}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                  item.status.includes('Mendesak')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
