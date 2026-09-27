import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Coins, 
  FileText, 
  CheckCircle2, 
  Ship, 
  Fish, 
  Boxes, 
  Anchor, 
  Factory, 
  Layers, 
  Save, 
  Clock, 
  Check, 
  Info
} from 'lucide-react';
import { formatRupiah } from '../data/sarprasGenerator';

export default function AssetDetailModal({
  asset,
  isOpen,
  onClose,
  onUpdateCondition
}) {
  if (!isOpen || !asset) return null;

  const [editMode, setEditMode] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(asset.condition);
  const [maintenanceNotes, setMaintenanceNotes] = useState(asset.issuesSummary || '');
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateCondition(asset.id, selectedCondition, maintenanceNotes);
    setIsSavedToast(true);
    setEditMode(false);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 2500);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'maritim_kapal': return Ship;
      case 'akuakultur': return Fish;
      case 'pengolahan_upi': return Boxes;
      case 'alat_tangkap': return Anchor;
      case 'tefa': return Factory;
      default: return Building2;
    }
  };

  const CategoryIcon = getCategoryIcon(asset.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-800">
                  {asset.bmnCode}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  asset.condition === 'Baik' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  asset.condition === 'Rusak Ringan' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {asset.condition} ({asset.conditionScore}%)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {asset.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Toast Notification when saved */}
          {isSavedToast && (
            <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs animate-bounce">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Status kondisi sarpras berhasil diperbarui dan disinkronkan ke SIM-SARPRAS!</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Satuan Pendidikan</span>
              <span className="font-semibold text-white mt-0.5 block truncate" title={asset.satdikName}>
                {asset.satdikName}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Nilai Valuasi BMN</span>
              <span className="font-bold text-emerald-400 mt-0.5 block truncate">
                {formatRupiah(asset.valuation)}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Tingkat Utilisasi</span>
              <span className="font-bold text-cyan-400 mt-0.5 block">
                {asset.utilizationRate}% Terpakai
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[11px]">Tahun Perolehan</span>
              <span className="font-semibold text-white mt-0.5 block">
                {asset.acquisitionYear} ({2026 - asset.acquisitionYear} Thn Pakai)
              </span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Spesifikasi Teknis & Kapasitas Desain</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 text-[11px] block">Kapasitas Operasional:</span>
                <p className="text-slate-200 font-medium mt-0.5">{asset.capacityDesc}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Sub-Kategori:</span>
                <p className="text-slate-200 font-medium mt-0.5">{asset.subcategory}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 text-[11px] block">Detail Mesin / Konfigurasi:</span>
                <p className="text-slate-200 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 mt-1 leading-relaxed">
                  {asset.specs}
                </p>
              </div>
            </div>
          </div>

          {/* Kelaikan & Sertifikasi Info */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Status Kelaikan & Legalitas Sertifikasi</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                asset.certificationStatus === 'Tersertifikasi Aktif' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                asset.certificationStatus === 'Perlu Pembaruan' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {asset.certificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 text-[11px] block">Lembaga Pemberi Sertifikat:</span>
                <span className="text-slate-200 font-medium">{asset.certificationAuthority || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Masa Berlaku Sertifikat:</span>
                <span className="text-slate-200 font-medium">{asset.certExpiryDate || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Jadwal Pemeliharaan Berikutnya:</span>
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{asset.nextMaintenanceDate || '-'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance & Technical Issues */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Analisis Kondisi & Catatan Pemeliharaan</span>
              </div>
              <span className="text-xs text-amber-400 font-mono">
                Estimasi Biaya: {formatRupiah(asset.estimatedRepairCost)}
              </span>
            </div>

            {!editMode ? (
              <div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {asset.issuesSummary}
                </p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setSelectedCondition(asset.condition);
                      setMaintenanceNotes(asset.issuesSummary || '');
                      setEditMode(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Ubah Status Kondisi / Log Perbaikan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-900/80 p-3.5 rounded-lg border border-cyan-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs text-slate-300 font-medium">Pilih Kondisi Baru:</label>
                  <div className="flex flex-wrap gap-2">
                    {['Baik', 'Rusak Ringan', 'Rusak Berat'].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setSelectedCondition(cond)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                          selectedCondition === cond
                            ? 'bg-cyan-600 border-cyan-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Catatan Teknis / Log Tindakan Perbaikan:
                  </label>
                  <textarea
                    rows="3"
                    value={maintenanceNotes}
                    onChange={(e) => setMaintenanceNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    placeholder="Contoh: Telah dilakukan overhaul mesin utama dan docking tahunan. Fasilitas kembali siap operasi penuh..."
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/40"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/80 px-6 py-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Terakhir disinkronkan: {asset.lastMaintenanceDate || '2026-01-15'}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
