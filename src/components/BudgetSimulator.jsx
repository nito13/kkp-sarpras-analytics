import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  DollarSign, 
  Building2, 
  Download,
  Check
} from 'lucide-react';
import { formatRupiah, simulateBudgetImpact } from '../data/sarprasGenerator';
import { NATIONAL_SARPRAS_TARGETS } from '../data/kkpData';

export default function BudgetSimulator({
  assets,
  onApplySimulatedAssets
}) {
  // Default budget allocation: Rp 15 Miliar (15.000.000.000)
  const [allocatedBudget, setAllocatedBudget] = useState(15000000000);
  const [appliedToast, setAppliedToast] = useState(false);

  // Run simulation reactively
  const simulation = useMemo(() => {
    return simulateBudgetImpact(allocatedBudget, assets);
  }, [allocatedBudget, assets]);

  const presetBudgets = [
    { label: 'Rp 5 Miliar', value: 5000000000 },
    { label: 'Rp 10 Miliar', value: 10000000000 },
    { label: 'Rp 15 Miliar (Rekomendasi)', value: 15000000000 },
    { label: 'Rp 25 Miliar', value: 25000000000 },
    { label: 'Rp 40 Miliar (Pagu Penuh)', value: 40000000000 },
  ];

  const handleApply = () => {
    if (onApplySimulatedAssets) {
      // Create new asset array with updated status
      const updated = assets.map(asset => {
        const funded = simulation.fundedAssets.find(f => f.id === asset.id);
        if (funded) {
          return {
            ...asset,
            condition: 'Baik',
            conditionScore: 92,
            maintenanceUrgency: 'Normal',
            certificationStatus: 'Tersertifikasi Aktif',
            issuesSummary: `Telah direhabilitasi melalui alokasi anggaran APBN/BOPTN sebesar ${formatRupiah(funded.fundedAmount)}. Kondisi fisik siap operasi penuh.`
          };
        }
        return asset;
      });
      onApplySimulatedAssets(updated);
      setAppliedToast(true);
      setTimeout(() => setAppliedToast(false), 3000);
    }
  };

  const handleDownloadRKA = () => {
    const csvHeader = 'ID,Kode BMN,Nama Sarpras,Satuan Pendidikan,Kategori,Kondisi Awal,Biaya Perbaikan Disetujui (Rp),Status Pendanaan\n';
    const csvRows = simulation.fundedAssets.map(a => 
      `"${a.id}","${a.bmnCode}","${a.name}","${a.satdikName}","${a.subcategory || a.category}","${a.condition}","${a.fundedAmount}","DISETUJUI DIBIAYAI"`
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RKA_Prioritas_Sarpras_KKP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Modul Perencanaan Strategis
            </span>
            <span className="text-slate-400 text-xs">• Decision Support System (DSS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <span>Simulator Alokasi Anggaran Rehabilitasi Sarpras</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-3xl">
            Simulasikan dampak alokasi belanja modal (CAPEX/OPEX) APBN terhadap peningkatan Indeks Kelaikan Sarpras Nasional dan penuntasan fasilitas rusak berat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleDownloadRKA}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Unduh Format RKA (CSV)</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {appliedToast && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Hasil simulasi berhasil diterapkan ke data operasional SIM-SARPRAS KKP! Seluruh metrik telah diperbarui.</span>
        </div>
      )}

      {/* Main Interactive Budget Slider Box */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/70 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Tentukan Nominal Alokasi Anggaran Pemeliharaan:
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Geser slider atau pilih salah satu preset anggaran di bawah.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
              {formatRupiah(allocatedBudget)}
            </span>
            <span className="text-[11px] text-slate-400 block">Alokasi Rencana APBN</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="1000000000"
            max="50000000000"
            step="500000000"
            value={allocatedBudget}
            onChange={(e) => setAllocatedBudget(Number(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Rp 1 Miliar</span>
            <span>Rp 25 Miliar</span>
            <span>Rp 50 Miliar</span>
          </div>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 mr-1">Preset Cepat:</span>
          {presetBudgets.map((p) => (
            <button
              key={p.value}
              onClick={() => setAllocatedBudget(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                allocatedBudget === p.value
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Simulation Impact Cards (Before vs After) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Indeks Kelaikan Sarpras Impact */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Indeks Kelaikan (IKSP)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-400 line-through">
              {simulation.originalKPIs.avgConditionScore}%
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-2xl font-black text-emerald-400">
              {simulation.simulatedKPIs.avgConditionScore}%
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            ▲ Meningkat +{simulation.scoreImprovement}%
          </div>
        </div>

        {/* Fasilitas Rusak Berat Tuntas */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fasilitas Rusak Berat</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-rose-400">
              {simulation.originalKPIs.conditionCounts['Rusak Berat']} Unit
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-2xl font-black text-emerald-400">
              {simulation.simulatedKPIs.conditionCounts['Rusak Berat']} Unit
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            ✓ {simulation.rusakBeratEliminated} Unit Berhasil Dipulihkan
          </div>
        </div>

        {/* Total Aset Terdanai */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aset Terehabilitasi</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">
              {simulation.fundedAssetsCount} <span className="text-xs font-normal text-slate-400">Aset Dipulihkan</span>
            </div>
            <div className="text-[11px] text-cyan-400 mt-1">
              Dari {simulation.originalKPIs.totalAssets - simulation.originalKPIs.conditionCounts['Baik']} aset bermasalah
            </div>
          </div>
        </div>

        {/* Realisasi Anggaran & Efisiensi */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/70 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Terserap / Sisa Pagu</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-amber-400 truncate" title={formatRupiah(simulation.usedBudget)}>
              {formatRupiah(simulation.usedBudget)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Sisa Efisiensi: {formatRupiah(simulation.remainingBudget)}
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Funded Projects Table */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Daftar Prioritas Usulan Aset yang Didanai (RKA Alokasi)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Urutan pemulihan aset berdasarkan algoritma prioritas urgensi, keselamatan taruna, dan efisiensi biaya.
            </p>
          </div>

          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 whitespace-nowrap self-start sm:self-center"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Hasil Simulasi Ini</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-700 text-[11px] font-semibold">
                <th className="p-3">No</th>
                <th className="p-3">Nama Sarpras & Kode BMN</th>
                <th className="p-3">Satuan Pendidikan</th>
                <th className="p-3">Kondisi Awal</th>
                <th className="p-3">Alokasi Anggaran (Rp)</th>
                <th className="p-3">Status Kelaikan Baru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {simulation.fundedAssets.length > 0 ? (
                simulation.fundedAssets.map((asset, idx) => (
                  <tr key={asset.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <span className="font-bold text-white block">{asset.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{asset.bmnCode}</span>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{asset.satdikName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asset.condition === 'Rusak Berat' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-sky-500/20 text-sky-300'
                      }`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {formatRupiah(asset.fundedAmount)}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3 h-3" />
                        <span>Pulih Baik (92%)</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    Alokasi anggaran belum mencukupi untuk membiayai aset rusak prioritas. Naikkan slider pagu anggaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
