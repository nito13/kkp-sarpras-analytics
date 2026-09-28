import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Wrench, 
  ArrowUpRight, 
  TrendingUp, 
  Ship, 
  Fish, 
  Boxes, 
  Compass, 
  Factory, 
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
import '../utils/chartSetup';
import { formatRupiah } from '../data/sarprasGenerator';
import { NATIONAL_SARPRAS_TARGETS, SARPRAS_CATEGORIES } from '../data/kkpData';
import { useTheme } from '../context/ThemeContext';
import logoKkp from '../assets/logo-kkp.svg';

export default function ExecutiveDashboard({
  kpis,
  onNavigateTab,
  onFilterCategory,
  onSelectSatdik
}) {
  const { isDark } = useTheme();
  const [jenjangFilter, setJenjangFilter] = useState('ALL'); // 'ALL' | 'Politeknik' | 'SUPM'

  if (!kpis) return null;

  // Dynamic theme colors for Chart.js based on Light / Dark Mode
  const textColor = isDark ? '#cbd5e1' : '#090d16'; // Deep bold black in light mode
  const textMuted = isDark ? '#94a3b8' : '#1e293b'; // Slate 800 in light mode
  const textBold = isDark ? '#e2e8f0' : '#000000';  // True pure black for titles
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : '#cbd5e1';

  // Extract condition counts and percentages
  const {
    totalAssets,
    totalValuation,
    avgConditionScore,
    avgUtilization,
    totalEstimatedRepairCost,
    conditionCounts,
    conditionPercentages,
    categoryBreakdown,
    satdikBreakdown,
    urgentAssets,
  } = kpis;

  // Donut Chart: Komposisi Kondisi Sarpras (Standar BMN Kemenkeu: Baik, Rusak Ringan, Rusak Berat)
  const donutData = {
    labels: ['Baik (Laik Operasi Penuh)', 'Rusak Ringan (Operasi Terbatas)', 'Rusak Berat (Tidak Laik / Stop)'],
    datasets: [
      {
        data: [
          conditionCounts['Baik'],
          conditionCounts['Rusak Ringan'],
          conditionCounts['Rusak Berat'],
        ],
        backgroundColor: isDark ? [
          'rgba(16, 185, 129, 0.85)', // Emerald
          'rgba(14, 165, 233, 0.85)', // Sky
          'rgba(244, 63, 94, 0.85)',   // Rose
        ] : [
          '#10b981', // Solid Emerald
          '#0ea5e9', // Solid Sky
          '#f43f5e', // Solid Rose
        ],
        borderColor: [
          '#10b981',
          '#0ea5e9',
          '#f43f5e',
        ],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { size: 11, family: 'Inter, system-ui', weight: '600' },
          boxWidth: 12,
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            const percentage = totalAssets > 0 ? ((value / totalAssets) * 100).toFixed(1) : 0;
            return ` ${context.label}: ${value} Unit (${percentage}%)`;
          },
        },
      },
    },
    cutout: '68%',
  };

  // Bar Chart: 8 Satuan Pendidikan dengan Skor Kelaikan Tertinggi / Pembanding
  const satdikEntries = Object.values(satdikBreakdown)
    .filter(s => {
      if (jenjangFilter === 'Politeknik') return s.satdik.type === 'Politeknik' || s.satdik.type === 'Akademi';
      if (jenjangFilter === 'SUPM') return s.satdik.type === 'SUPM';
      return true;
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  const barData = {
    labels: satdikEntries.slice(0, 8).map(s => s.satdik.shortName),
    datasets: [
      {
        label: 'Indeks Kelaikan Sarpras (%)',
        data: satdikEntries.slice(0, 8).map(s => Math.round(s.avgScore)),
        backgroundColor: satdikEntries.slice(0, 8).map(s => {
          if (!isDark) {
            return s.avgScore >= 85 ? '#10b981' : s.avgScore >= 75 ? '#0ea5e9' : '#f59e0b';
          }
          return s.avgScore >= 85 ? 'rgba(16, 185, 129, 0.75)' : s.avgScore >= 75 ? 'rgba(14, 165, 233, 0.75)' : 'rgba(245, 158, 11, 0.75)';
        }),
        borderColor: satdikEntries.slice(0, 8).map(s => 
          s.avgScore >= 85 ? '#10b981' : s.avgScore >= 75 ? '#0ea5e9' : '#f59e0b'
        ),
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Indeks Kelaikan: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: gridColor },
        ticks: { color: textMuted, callback: (v) => `${v}%` },
      },
      y: {
        grid: { display: false },
        ticks: { color: textBold, font: { size: 11, weight: '600' } },
      },
    },
  };

  // Radar Chart: Kematangan per Kategori Sarpras
  const categoryKeys = Object.keys(categoryBreakdown);
  const radarLabels = categoryKeys.map(k => categoryBreakdown[k].name);
  const radarScores = categoryKeys.map(k => Math.round(categoryBreakdown[k].avgScore || 0));

  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Kondisi Realistis Saat Ini (%)',
        data: radarScores,
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#06b6d4',
        borderWidth: 2,
      },
      {
        label: 'Target Standar Vokasi KKP (%)',
        data: categoryKeys.map(() => NATIONAL_SARPRAS_TARGETS.targetIndeksKelaikan),
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.6)',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { size: 10, weight: '600' } },
      },
    },
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: { color: textColor, font: { size: 10, weight: '600' } },
        ticks: {
          backdropColor: 'transparent',
          color: textMuted,
          stepSize: 20,
          showLabelBackdrop: false,
        },
        suggestedMin: 30,
        suggestedMax: 100,
      },
    },
  };

  // Line Chart: Tren Jam Praktik & Utilisasi Sarpras 6 Semester Terakhir
  const lineData = {
    labels: ['2023 Genap', '2024 Ganjil', '2024 Genap', '2025 Ganjil', '2025 Genap', '2026 Ganjil (Berjalan)'],
    datasets: [
      {
        label: 'Tingkat Utilisasi Sarpras (%)',
        data: [74, 76, 79, 81, 83, Math.round(avgUtilization)],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#0284c7',
      },
      {
        label: 'Rata-rata Jam Praktik Operasional/Bulan',
        data: [52, 55, 58, 62, 64, 66],
        borderColor: '#9333ea',
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#9333ea',
        yAxisID: 'y1',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { size: 10, weight: '600' } },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textMuted, font: { size: 10 } },
      },
      y: {
        min: 50,
        max: 100,
        grid: { color: gridColor },
        ticks: { color: '#0284c7', callback: (v) => `${v}%`, font: { size: 10, weight: '600' } },
      },
      y1: {
        position: 'right',
        min: 30,
        max: 90,
        grid: { display: false },
        ticks: { color: '#9333ea', callback: (v) => `${v} Jam`, font: { size: 10, weight: '600' } },
      },
    },
  };

  // Determine readiness status badge
  const isTargetAchieved = avgConditionScore >= NATIONAL_SARPRAS_TARGETS.targetIndeksKelaikan;

  return (
    <div className="space-y-6">
      {/* Welcome & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 p-5 rounded-2xl border border-slate-700/80 shadow-lg relative overflow-hidden">
        {/* Subtle background watermark */}
        <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-6">
          <img src={logoKkp} alt="KKP Watermark" className="w-56 h-56 object-contain" />
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <img src={logoKkp} alt="Logo KKP" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                National Sarpras Overview
              </span>
              <span className="text-slate-400 text-xs">• Semester Ganjil TA 2026/2027</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Dasbor Analitik Sarana & Prasarana Vokasi KKP
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 max-w-2xl">
              Monitoring kondisi fisik, kelaikan operasi armada kapal latih, tambak super intensif, UPI, laboratorium, dan asrama pada 18 Satuan Pendidikan Kelautan dan Perikanan se-Indonesia.
            </p>
          </div>
        </div>

        {/* Filter Jenjang Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/60 self-start md:self-center">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setJenjangFilter('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              jenjangFilter === 'ALL'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua (18)
          </button>
          <button
            onClick={() => setJenjangFilter('Politeknik')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              jenjangFilter === 'Politeknik'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Politeknik (11)
          </button>
          <button
            onClick={() => setJenjangFilter('SUPM')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              jenjangFilter === 'SUPM'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SUPM (7)
          </button>
        </div>
      </div>

      {/* Critical Early Warning Alert Bar if any Rusak Berat exist */}
      {urgentAssets.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900/80 border border-rose-500/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0 text-rose-400 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-300 text-sm">
                  Peringatan Dini: {urgentAssets.length} Fasilitas Sarpras Kritis & Rusak Berat!
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Perlu Atensi KKP
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Contoh: <span className="font-semibold text-white">{urgentAssets[0]?.name}</span> ({urgentAssets[0]?.satdikName}) — {urgentAssets[0]?.issuesSummary.substring(0, 100)}...
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('maintenance')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/40 transition-colors whitespace-nowrap self-start sm:self-center"
          >
            <span>Tinjau Aset Kritis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Key Metric Cards Grid (6 KPI Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {/* Total Assets */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-cyan-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Sarpras BMN</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{totalAssets}</div>
            <div className="text-[11px] text-cyan-400/90 mt-0.5 flex items-center gap-1">
              <span>Unit terdata di SIM-BMN</span>
            </div>
          </div>
        </div>

        {/* Total Valuation */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Nilai Valuasi BMN</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-emerald-400 truncate" title={formatRupiah(totalValuation)}>
              {formatRupiah(totalValuation)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Aset negara tercatat
            </div>
          </div>
        </div>

        {/* Indeks Kelaikan Sarpras */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-blue-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Indeks Kelaikan (IKSP)</span>
            <div className={`w-8 h-8 rounded-lg ${isTargetAchieved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${isTargetAchieved ? 'text-emerald-400' : 'text-amber-400'}`}>
                {avgConditionScore}%
              </span>
              <span className="text-[11px] text-slate-400">Target: {NATIONAL_SARPRAS_TARGETS.targetIndeksKelaikan}%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isTargetAchieved ? '✓ Memenuhi standar target' : '⚠ Di bawah target nasional'}
            </div>
          </div>
        </div>

        {/* Kondisi Baik */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-emerald-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Kondisi Baik</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400">
              {conditionCounts['Baik']} <span className="text-xs font-normal text-slate-400">({conditionPercentages.baik}%)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Laik fungsi operasional
            </div>
          </div>
        </div>

        {/* Rusak Berat */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-rose-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Rusak Berat (Kritis)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-400">
              {conditionCounts['Rusak Berat']} <span className="text-xs font-normal text-slate-400">Unit ({conditionPercentages.rusakBerat}%)</span>
            </div>
            <div className="text-[11px] text-rose-400 mt-0.5 font-medium">
              Tidak laik / stop operasi
            </div>
          </div>
        </div>

        {/* Kebutuhan Anggaran Perbaikan */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 hover:border-amber-500/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Kebutuhan Anggaran</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-amber-400 truncate" title={formatRupiah(totalEstimatedRepairCost)}>
              {formatRupiah(totalEstimatedRepairCost)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Estimasi rehab & docking
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Donut Condition Breakdown & Top Satdik Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart - Komposisi Kondisi Sarpras */}
        <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Distribusi Kondisi Sarpras Nasional</span>
              </h3>
              <span className="text-xs text-cyan-400 font-semibold">{totalAssets} Unit Total</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Klasifikasi kelayakan fisik seluruh sarana pendidikan vokasi KKP.
            </p>
          </div>

          <div className="h-64 relative flex items-center justify-center my-2">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
              <span className="text-2xl font-black text-white">{conditionPercentages.baik}%</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Kondisi Baik</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-xs">
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left">
              <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Baik (Laik)</span>
              <span className="text-emerald-400 font-bold text-xs sm:text-sm block mt-0.5">{conditionCounts['Baik']} <span className="text-[10px] font-normal text-slate-400">({conditionPercentages.baik}%)</span></span>
            </div>
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left">
              <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Rusak Ringan</span>
              <span className="text-sky-400 font-bold text-xs sm:text-sm block mt-0.5">{conditionCounts['Rusak Ringan']} <span className="text-[10px] font-normal text-slate-400">({conditionPercentages.rusakRingan}%)</span></span>
            </div>
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 text-center sm:text-left">
              <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Rusak Berat</span>
              <span className="text-rose-400 font-bold text-xs sm:text-sm block mt-0.5">{conditionCounts['Rusak Berat']} <span className="text-[10px] font-normal text-slate-400">({conditionPercentages.rusakBerat}%)</span></span>
            </div>
          </div>
        </div>

        {/* Right: Bar Chart - Kelaikan Sarpras per Satdik */}
        <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white tracking-tight">
                Peringkat Kelaikan Sarpras Satuan Pendidikan
              </h3>
              <button
                onClick={() => onNavigateTab('vokasi')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
              >
                <span>Lihat Seluruh Kampus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Indeks kelayakan operasional sarpras berdasarkan audit teknis (Top Satdik).
            </p>
          </div>

          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/60">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Sangat Baik (≥85%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>Cukup (75-84%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Perlu Pemeliharaan (&lt;75%)</span>
              </span>
            </div>
            <span className="text-cyan-400 font-semibold hidden sm:inline">
              Rata-rata Nasional: {avgConditionScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row: Radar Kategori & Tren Utilisasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Radar Chart - Kelaikan per Bidang Vokasi */}
        <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Radar Kematangan Sarpras per Bidang Vokasi
            </h3>
            <span className="text-xs text-slate-400 font-mono">Benchmark KKP</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Perbandingan tingkat kelaikan aktual vs target standar minimal vokasi.
          </p>
          <div className="h-72">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Right: Line Chart - Tren Jam Praktik & Utilisasi */}
        <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Tren Utilisasi & Jam Praktik Sarpras (2023 - 2026)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Efektivitas Pembelajaran
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Peningkatan pemanfaatan fasilitas workshop, kapal latih, dan tambak per semester.
          </p>
          <div className="h-72">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Category Cards Quick Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Katalog Kategori Sarana & Prasarana Vokasi
            </h3>
            <p className="text-xs text-slate-400">
              Klik kategori untuk melihat rincian inventaris dan spesifikasi sarpras.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('explorer')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>Buka Inventaris Penuh</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {SARPRAS_CATEGORIES.map((cat) => {
            const data = categoryBreakdown[cat.id] || { count: 0, valuation: 0, avgScore: 0 };
            const IconComponent = cat.iconName === 'Ship' ? Ship :
              cat.iconName === 'Fish' ? Fish :
              cat.iconName === 'Boxes' ? Boxes :
              cat.iconName === 'Anchor' ? Compass :
              cat.iconName === 'Factory' ? Factory : Building2;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onFilterCategory(cat.id);
                  onNavigateTab('explorer');
                }}
                className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/70 hover:border-cyan-500/60 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {data.count} Unit
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs mt-3 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Kelaikan:</span>
                  <span className="font-bold text-white" style={{ color: cat.color }}>
                    {Math.round(data.avgScore)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
