import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Building2, 
  FileText, 
  Coins, 
  ShieldCheck, 
  Wrench, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SATDIK_LIST, SARPRAS_CATEGORIES } from '../data/kkpData';

export default function AddAssetModal({
  isOpen,
  onClose,
  onAddAsset
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    satdikId: SATDIK_LIST[0].id,
    category: SARPRAS_CATEGORIES[0].id,
    subcategory: '',
    condition: 'Baik',
    acquisitionYear: 2024,
    valuation: 1500000000,
    utilizationRate: 85,
    capacityDesc: '',
    specs: '',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI / Hubla / KKP',
    estimatedRepairCost: 0,
    issuesSummary: 'Kondisi aset baru beroperasi normal sesuai standar teknis operasional vokasi.',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Nama sarana/prasarana wajib diisi.');
      return;
    }

    const selectedSatdik = SATDIK_LIST.find(s => s.id === formData.satdikId);
    const scoreMap = { 'Baik': 92, 'Rusak Ringan': 75, 'Rusak Berat': 25 };
    const urgencyMap = {
      'Baik': 'Normal',
      'Rusak Ringan': 'Normal',
      'Rusak Berat': 'Kritis / Segera'
    };

    const newAsset = {
      id: `SAR-USR-${Date.now().toString().slice(-4)}`,
      bmnCode: `BMN-3.05.99.01.${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
      satdikName: selectedSatdik ? selectedSatdik.name : 'Satdik KKP',
      conditionScore: scoreMap[formData.condition] || 85,
      maintenanceUrgency: urgencyMap[formData.condition] || 'Normal',
      lastMaintenanceDate: new Date().toISOString().slice(0, 10),
      nextMaintenanceDate: '2027-01-15',
      ...formData
    };

    onAddAsset(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Tambah Data Sarana Prasarana
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan aset baru pada Satuan Pendidikan Kementerian Kelautan dan Perikanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-700 text-xs">
          {errorMsg && (
            <div className="bg-rose-950/80 border border-rose-500 text-rose-300 p-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nama Sarpras */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nama Sarana / Prasarana *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kapal Latih KM. Nusantara Bahari 01 / Hatchery Udang Superintensif"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Row 2: Satdik & Bidang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Satuan Pendidikan (Satdik)</label>
              <select
                name="satdikId"
                value={formData.satdikId}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {SATDIK_LIST.map(s => (
                  <option key={s.id} value={s.id}>{s.shortName} ({s.kota})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Bidang Sarpras Vokasi</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {SARPRAS_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Sub-Bidang & Kondisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sub-Bidang / Tipe</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="Contoh: Simulator Kenavigasian / Hatchery / Cold Chain"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Kondisi Fisik Aset</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Baik">Baik (Layak Penuh)</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat (Kritis)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Utilisasi & Tahun Perolehan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tingkat Utilisasi (%)</label>
              <input
                type="number"
                name="utilizationRate"
                min="0"
                max="100"
                value={formData.utilizationRate}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tahun Perolehan</label>
              <input
                type="number"
                name="acquisitionYear"
                min="1980"
                max="2026"
                value={formData.acquisitionYear}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Kapasitas Desain & Spesifikasi */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Kapasitas Desain Operasional</label>
            <input
              type="text"
              name="capacityDesc"
              value={formData.capacityDesc}
              onChange={handleChange}
              placeholder="Contoh: Daya Tampung 120 Taruna / 30 Ton Cold Storage / 200 GT Kapal"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Spesifikasi Mesin / Teknis Terperinci</label>
            <textarea
              name="specs"
              rows="2"
              value={formData.specs}
              onChange={handleChange}
              placeholder="Detail mesin utama, dimensi, daya listrik, tipe peralatan, dll."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Catatan Kondisi / Analisis Teknis</label>
            <textarea
              name="issuesSummary"
              rows="2"
              value={formData.issuesSummary}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-900/40 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
