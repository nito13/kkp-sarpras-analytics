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
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } from '../data/kkpData';

export default function AddAssetModal({
  isOpen,
  onClose,
  onAddAsset
}) {
  if (!isOpen) return null;

  const initialProdi = SATDIK_LIST[0]?.prodi?.[0] || 'Semua Program Studi (Umum)';
  const initialCategory = getCategoryForProdi(initialProdi) || SARPRAS_CATEGORIES[0].id;

  const [formData, setFormData] = useState({
    name: '',
    satdikId: SATDIK_LIST[0].id,
    prodi: initialProdi,
    category: initialCategory,
    condition: 'Baik',
    acquisitionYear: 2024,
    utilizationRate: 85,
    capacityDesc: '',
    specs: '',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI / Hubla / KKP',
    estimatedRepairCost: 0,
    issuesSummary: 'Kondisi aset baru beroperasi normal sesuai standar teknis operasional vokasi.',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const selectedSatdik = SATDIK_LIST.find(s => s.id === formData.satdikId) || SATDIK_LIST[0];
  const campusProdis = selectedSatdik?.prodi || [];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'satdikId') {
      const nextSatdik = SATDIK_LIST.find(s => s.id === value);
      const nextProdis = nextSatdik?.prodi || [];
      const newProdi = nextProdis[0] || 'Semua Program Studi (Umum)';
      const matchedCat = getCategoryForProdi(newProdi);
      setFormData(prev => ({
        ...prev,
        satdikId: value,
        prodi: newProdi,
        ...(matchedCat ? { category: matchedCat } : {})
      }));
      return;
    }

    if (name === 'prodi') {
      const matchedCat = getCategoryForProdi(value);
      setFormData(prev => ({
        ...prev,
        prodi: value,
        ...(matchedCat ? { category: matchedCat } : {})
      }));
      return;
    }

    if (name === 'category') {
      const catProdis = getProdisForCategory(value);
      let nextProdi = formData.prodi;
      if (catProdis.length > 0 && !catProdis.includes(formData.prodi)) {
        const campusMatch = campusProdis.find(p => catProdis.includes(p));
        nextProdi = campusMatch || catProdis[0];
      } else if (catProdis.length === 0) {
        nextProdi = 'Semua Program Studi (Umum)';
      }
      setFormData(prev => ({
        ...prev,
        category: value,
        prodi: nextProdi
      }));
      return;
    }

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

    const scoreMap = { 'Baik': 92, 'Rusak Ringan': 75, 'Rusak Berat': 25 };
    const urgencyMap = {
      'Baik': 'Normal',
      'Rusak Ringan': 'Normal',
      'Rusak Berat': 'Kritis / Segera'
    };

    const newAsset = {
      id: `SAR-USR-${Date.now().toString().slice(-4)}`,
      satdikName: selectedSatdik ? selectedSatdik.name : 'Satdik KKP',
      conditionScore: scoreMap[formData.condition] || 85,
      maintenanceUrgency: urgencyMap[formData.condition] || 'Normal',
      lastMaintenanceDate: new Date().toISOString().slice(0, 10),
      nextMaintenanceDate: '2027-01-15',
      ...formData,
      prodi: formData.prodi || campusProdis[0] || 'Semua Program Studi (Umum)'
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

          {/* Row 2: Satdik & Program Studi */}
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
              <label className="text-slate-300 font-semibold block mb-1 flex items-center justify-between">
                <span>Program Studi</span>
                <span className="text-[10px] text-cyan-400 font-normal">({campusProdis.length} prodi kampus)</span>
              </label>
              <select
                name="prodi"
                value={formData.prodi}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
              >
                <option value="Semua Program Studi (Umum)">Semua Program Studi (Umum / Fasilitas Bersama)</option>
                {campusProdis.length > 0 && (
                  <optgroup label={`Program Studi ${selectedSatdik.shortName}`}>
                    {campusProdis.map(p => {
                      const catId = getCategoryForProdi(p);
                      const catName = SARPRAS_CATEGORIES.find(c => c.id === catId)?.name;
                      return (
                        <option key={p} value={p}>
                          {p} {catName ? `(${catName})` : ''}
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                <optgroup label="Daftar 25 Program Studi Nasional">
                  {PRODI_LIST.filter(p => !campusProdis.includes(p)).map(p => {
                    const catId = getCategoryForProdi(p);
                    const catName = SARPRAS_CATEGORIES.find(c => c.id === catId)?.name;
                    return (
                      <option key={p} value={p}>
                        {p} {catName ? `(${catName})` : ''}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Row 3: Bidang Sarpras */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold block">Bidang Sarpras</label>
              {formData.prodi && formData.prodi !== 'Semua Program Studi (Umum)' && (
                <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3 h-3 text-cyan-400" />
                  <span>Sesuai Prodi: {formData.prodi}</span>
                </span>
              )}
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {SARPRAS_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.prodis?.length > 0 ? `(${c.prodis.length} Prodi Terkait)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Kondisi, Utilisasi & Tahun Perolehan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Kondisi Fisik Aset</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Baik">Baik (Layak)</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat (Kritis)</option>
              </select>
            </div>

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
