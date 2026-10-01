import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Ship, 
  Fish, 
  Boxes, 
  Users,
  Compass,
  Briefcase,
  TrendingUp,
  Save, 
  Clock, 
  Info,
  Edit3,
  Sliders,
  Eye,
  AlertCircle,
  Sparkles,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { SATDIK_LIST, SARPRAS_CATEGORIES, PRODI_LIST, getCategoryForProdi, getProdisForCategory } from '../data/kkpData';

// Helper icon category
const getCategoryIcon = (category) => {
  switch(category) {
    case 'penangkapan_ikan':
    case 'penangkapan_mesin':
    case 'maritim_kapal':
    case 'alat_tangkap':
      return Ship;
    case 'permesinan_mekanisasi':
      return Wrench;
    case 'budidaya_perikanan':
    case 'akuakultur':
      return Fish;
    case 'pengolahan_hasil':
    case 'pengolahan_upi':
      return Boxes;
    case 'agribisnis_perikanan':
    case 'agribisnis_penyuluhan':
    case 'tefa':
      return TrendingUp;
    case 'kelautan_konservasi':
    case 'konservasi_pariwisata':
      return Compass;
    case 'sosial_pemberdayaan':
    case 'asrama_penunjang':
      return Users;
    case 'administrasi_umum':
    case 'administasi_umum':
      return Briefcase;
    default:
      return Building2;
  }
};

export default function AssetDetailModal({
  asset,
  isOpen,
  onClose,
  onUpdateAsset,
  onUpdateCondition,
  currentUser
}) {
  // Modes
  const [isFullEditMode, setIsFullEditMode] = useState(false);
  const [isQuickEditMode, setIsQuickEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('identitas'); // 'identitas' | 'valuasi' | 'kondisi' | 'spesifikasi' | 'catatan'
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Full Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    satdikId: '',
    satdikName: '',
    prodi: '',
    category: 'penangkapan_ikan',
    condition: 'Baik',
    conditionScore: 85,
    acquisitionYear: 2020,
    utilizationRate: 80,
    capacityDesc: '',
    specs: '',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: '',
    certExpiryDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 0,
    issuesSummary: '',
  });

  // Quick Edit State (for operator or fast status updates)
  const [quickCondition, setQuickCondition] = useState('Baik');
  const [quickNotes, setQuickNotes] = useState('');

  // Sync state whenever asset or modal visibility changes
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        satdikId: asset.satdikId || (SATDIK_LIST[0]?.id || ''),
        satdikName: asset.satdikName || (SATDIK_LIST[0]?.name || ''),
        prodi: asset.prodi || (SATDIK_LIST[0]?.prodi?.[0] || 'Semua Program Studi (Umum)'),
        category: asset.category || (SARPRAS_CATEGORIES[0]?.id || 'penangkapan_ikan'),
        condition: asset.condition || 'Baik',
        conditionScore: asset.conditionScore !== undefined ? asset.conditionScore : 85,
        acquisitionYear: asset.acquisitionYear || 2020,
        utilizationRate: asset.utilizationRate !== undefined ? asset.utilizationRate : 80,
        capacityDesc: asset.capacityDesc || '',
        specs: asset.specs || '',
        certificationStatus: asset.certificationStatus || 'Tersertifikasi Aktif',
        certificationAuthority: asset.certificationAuthority || '',
        certExpiryDate: asset.certExpiryDate || '',
        lastMaintenanceDate: asset.lastMaintenanceDate || '',
        nextMaintenanceDate: asset.nextMaintenanceDate || '',
        maintenanceUrgency: asset.maintenanceUrgency || 'Normal',
        estimatedRepairCost: asset.estimatedRepairCost || 0,
        issuesSummary: asset.issuesSummary || '',
      });
      setQuickCondition(asset.condition || 'Baik');
      setQuickNotes(asset.issuesSummary || '');
      setIsFullEditMode(false);
      setIsQuickEditMode(false);
      setErrorMsg('');
      setActiveTab('identitas');
    }
  }, [asset, isOpen]);

  // Hook rules: all hooks called above, early return follows safely
  if (!isOpen || !asset) return null;

  // Role & Permissions check
  const canEditFull = 
    currentUser?.permissions?.includes('edit_all') ||
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin_pusdik';

  const canEditOwn =
    currentUser?.permissions?.includes('edit_own') ||
    currentUser?.role === 'operator_kampus';

  const isOwnCampus = 
    currentUser?.accessibleSatdik === 'ALL' ||
    currentUser?.accessibleSatdik === asset.satdikId;

  const canQuickEdit = canEditFull || (canEditOwn && isOwnCampus);
  const isAuditor = currentUser?.role === 'auditor' || currentUser?.permissions?.includes('audit_mode');

  // Input change handler for full edit form
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for Satuan Pendidikan change (auto-sync satdikName, prodi, and category)
  const handleSatdikChange = (newSatdikId) => {
    const selected = SATDIK_LIST.find(s => s.id === newSatdikId);
    const newProdi = selected?.prodi?.[0] || 'Semua Program Studi (Umum)';
    const matchedCat = getCategoryForProdi(newProdi);
    setFormData(prev => ({
      ...prev,
      satdikId: newSatdikId,
      satdikName: selected ? selected.name : prev.satdikName,
      prodi: newProdi,
      ...(matchedCat ? { category: matchedCat } : {})
    }));
  };

  // Handler for Prodi change (auto-sync category)
  const handleProdiChange = (newProdi) => {
    const matchedCat = getCategoryForProdi(newProdi);
    setFormData(prev => ({
      ...prev,
      prodi: newProdi,
      ...(matchedCat ? { category: matchedCat } : {})
    }));
  };

  // Handler for Category change (auto-align prodi)
  const handleCategoryChange = (newCategory) => {
    const catProdis = getProdisForCategory(newCategory);
    let nextProdi = formData.prodi;
    if (catProdis.length > 0 && !catProdis.includes(formData.prodi)) {
      const currentCampus = SATDIK_LIST.find(s => s.id === formData.satdikId);
      const campusProdis = currentCampus?.prodi || [];
      const campusMatch = campusProdis.find(p => catProdis.includes(p));
      nextProdi = campusMatch || catProdis[0];
    } else if (catProdis.length === 0) {
      nextProdi = 'Semua Program Studi (Umum)';
    }
    setFormData(prev => ({
      ...prev,
      category: newCategory,
      prodi: nextProdi
    }));
  };

  // Handler for condition selection in full edit mode
  const handleConditionSelect = (cond) => {
    const scoreMap = { 'Baik': 92, 'Rusak Ringan': 75, 'Rusak Berat': 25 };
    const urgencyMap = {
      'Baik': 'Normal',
      'Rusak Ringan': 'Normal',
      'Rusak Berat': 'Kritis / Segera'
    };

    setFormData(prev => ({
      ...prev,
      condition: cond,
      conditionScore: scoreMap[cond] || prev.conditionScore,
      maintenanceUrgency: urgencyMap[cond] || prev.maintenanceUrgency,
    }));
  };

  // Save Full Edit Handler
  const handleSaveFull = () => {
    if (!formData.name.trim()) {
      setErrorMsg('Nama sarana prasarana tidak boleh kosong.');
      setActiveTab('identitas');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      satdikId: formData.satdikId,
      satdikName: formData.satdikName,
      prodi: (formData.prodi || '').trim() || 'Semua Program Studi (Umum)',
      category: formData.category,
      condition: formData.condition,
      conditionScore: Math.min(100, Math.max(0, Number(formData.conditionScore) || 0)),
      acquisitionYear: Number(formData.acquisitionYear) || 2020,
      utilizationRate: Math.min(100, Math.max(0, Number(formData.utilizationRate) || 0)),
      capacityDesc: formData.capacityDesc.trim(),
      specs: formData.specs.trim(),
      certificationStatus: formData.certificationStatus,
      certificationAuthority: formData.certificationAuthority.trim(),
      certExpiryDate: formData.certExpiryDate || null,
      lastMaintenanceDate: formData.lastMaintenanceDate || null,
      nextMaintenanceDate: formData.nextMaintenanceDate || null,
      maintenanceUrgency: formData.maintenanceUrgency,
      estimatedRepairCost: Number(formData.estimatedRepairCost) || 0,
      issuesSummary: formData.issuesSummary.trim(),
    };

    const updateFunc = onUpdateAsset || onUpdateCondition;
    if (updateFunc) {
      updateFunc(asset.id, payload);
    }

    setToastMessage('Seluruh perubahan data sarpras berhasil disimpan dan disinkronkan ke database!');
    setIsSavedToast(true);
    setIsFullEditMode(false);
    setErrorMsg('');
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };

  // Save Quick Condition Handler
  const handleSaveQuick = () => {
    const updateFunc = onUpdateAsset || onUpdateCondition;
    if (updateFunc) {
      updateFunc(asset.id, quickCondition, quickNotes);
    }

    setToastMessage('Status kondisi fisik dan log pemeliharaan berhasil diperbarui!');
    setIsSavedToast(true);
    setIsQuickEditMode(false);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 3000);
  };



  const CategoryIcon = getCategoryIcon(isFullEditMode ? formData.category : asset.category);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-800/95 px-5 sm:px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-cyan-400 font-semibold px-2 py-0.5 bg-cyan-950/80 rounded border border-cyan-800">
                  {asset.id}
                </span>
                
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  (isFullEditMode ? formData.condition : asset.condition) === 'Baik' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  (isFullEditMode ? formData.condition : asset.condition) === 'Rusak Ringan' 
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                    'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {isFullEditMode ? formData.condition : asset.condition} ({isFullEditMode ? formData.conditionScore : asset.conditionScore}%)
                </span>

                {/* Badge Hak Akses Pengguna */}
                {canEditFull ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Kendali Penuh</span>
                  </span>
                ) : canEditOwn && isOwnCampus ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <Wrench className="w-3 h-3 text-amber-400" />
                    <span>Operator Kampus</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>Mode Tinjauan</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate" title={isFullEditMode ? formData.name : asset.name}>
                {isFullEditMode ? (formData.name || 'Nama Sarana Prasarana') : asset.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {/* Action Edit Button di Header jika belum mode edit */}
            {!isFullEditMode && !isQuickEditMode && canEditFull && (
              <button
                type="button"
                onClick={() => setIsFullEditMode(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all active:scale-95 border border-cyan-400/30"
                title="Buka form untuk mengedit seluruh data sarana prasarana"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Lengkap</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* Toast Notification */}
          {isSavedToast && (
            <div className="bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-xs shadow-lg animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="bg-rose-950/90 border border-rose-500/80 text-rose-200 p-3 rounded-xl flex items-center gap-2.5 text-xs shadow-lg animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* CASE 1: FULL EDIT MODE (KENDALI PENUH UNTUK SUPER ADMIN / PUSDIK) */}
          {/* ============================================================== */}
          {isFullEditMode ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Info Banner Mode Kendali Penuh */}
              <div className="bg-gradient-to-r from-cyan-950/70 via-blue-950/50 to-slate-900 border border-cyan-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Mode Edit Kendali Penuh</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                        {currentUser?.roleLabel || 'Admin Berwenang'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-cyan-200/90">
                      Anda berwenang mengedit seluruh master atribut sarana prasarana: nama, satdik, utilisasi, spesifikasi, dan jadwal pemeliharaan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullEditMode(false)}
                  className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Batal Edit</span>
                </button>
              </div>

              {/* Navigation Tabs for Full Edit Form */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
                {[
                  { id: 'identitas', label: '1. Identitas & Satdik', icon: FileText },
                  { id: 'valuasi', label: '2. Utilisasi & Perolehan', icon: Activity },
                  { id: 'kondisi', label: '3. Kondisi Fisik', icon: Wrench },
                  { id: 'spesifikasi', label: '4. Spesifikasi Teknis', icon: Sliders },
                  { id: 'catatan', label: '5. Catatan Teknis', icon: AlertTriangle },
                ].map(tab => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                        isActive 
                          ? 'bg-slate-800/90 text-cyan-400 border-cyan-400' 
                          : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Identitas & Satuan Pendidikan */}
              {activeTab === 'identitas' && (
                <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama Sarpras */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Nama Sarana / Prasarana <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Contoh: Kapal Latih KM. Madidihang 03"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                      />
                    </div>

                    {/* Satuan Pendidikan */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Satuan Pendidikan (18 Kampus Vokasi KKP) <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.satdikId}
                        onChange={(e) => handleSatdikChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {SATDIK_LIST.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.shortName} — ({s.kota}, {s.provinsi})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Program Studi */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                        <span>Program Studi</span>
                        <span className="text-[10px] text-cyan-400 font-normal">
                          ({(SATDIK_LIST.find(s => s.id === formData.satdikId)?.prodi || []).length} prodi kampus)
                        </span>
                      </label>
                      <select
                        value={formData.prodi}
                        onChange={(e) => handleProdiChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 truncate"
                      >
                        <option value="Semua Program Studi (Umum)">Semua Program Studi (Umum / Fasilitas Bersama)</option>
                        {(() => {
                          const currentCampus = SATDIK_LIST.find(s => s.id === formData.satdikId);
                          const prodis = currentCampus?.prodi || [];
                          return (
                            <>
                              {prodis.length > 0 && (
                                <optgroup label={`Program Studi ${currentCampus.shortName}`}>
                                  {prodis.map(p => {
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
                                {PRODI_LIST.filter(p => !prodis.includes(p)).map(p => {
                                  const catId = getCategoryForProdi(p);
                                  const catName = SARPRAS_CATEGORIES.find(c => c.id === catId)?.name;
                                  return (
                                    <option key={p} value={p}>
                                      {p} {catName ? `(${catName})` : ''}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            </>
                          );
                        })()}
                      </select>
                    </div>

                    {/* Bidang Sarpras */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Bidang Sarpras <span className="text-rose-400">*</span>
                        </label>
                        {formData.prodi && formData.prodi !== 'Semua Program Studi (Umum)' && (
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                            <GraduationCap className="w-3 h-3 text-cyan-400" />
                            <span>Sesuai Prodi: {formData.prodi}</span>
                          </span>
                        )}
                      </div>
                      <select
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {SARPRAS_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.prodis?.length > 0 ? `(${c.prodis.length} Prodi Terkait)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Valuasi & Utilisasi */}
              {activeTab === 'valuasi' && (
                <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tahun Perolehan */}
                    <div className="sm:col-span-3">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Tahun Perolehan <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="1970"
                        max="2030"
                        value={formData.acquisitionYear}
                        onChange={(e) => handleInputChange('acquisitionYear', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                      />
                      <span className="text-[11px] text-cyan-400 mt-1 block">
                        Usia Pakai: {2026 - (Number(formData.acquisitionYear) || 2026)} Tahun
                      </span>
                    </div>

                    {/* Tingkat Utilisasi Operasional */}
                    <div className="sm:col-span-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Tingkat Utilisasi Praktik Taruna & Operasional (%)</span>
                        </label>
                        <span className="text-xs font-bold text-cyan-300 font-mono">
                          {formData.utilizationRate}% Terpakai
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.utilizationRate}
                        onChange={(e) => handleInputChange('utilizationRate', Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>0% (Idle / Menganggur)</span>
                        <span>50% (Moderat)</span>
                        <span>100% (Kapasitas Penuh)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Kondisi & Pemeliharaan */}
              {activeTab === 'kondisi' && (
                <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4">
                  {/* Status Kondisi Fisik Pill Group */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Status Kondisi Fisik Sarpras <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'Baik', label: 'Baik (Skor ~92%)', color: 'emerald' },
                        { id: 'Rusak Ringan', label: 'Rusak Ringan (Skor ~75%)', color: 'sky' },
                        { id: 'Rusak Berat', label: 'Rusak Berat (Skor ~25%)', color: 'rose' }
                      ].map(c => {
                        const isSelected = formData.condition === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleConditionSelect(c.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                              isSelected
                                ? c.color === 'emerald' ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950' :
                                  c.color === 'sky' ? 'bg-sky-600/30 border-sky-400 text-sky-300 shadow-md shadow-sky-950' :
                                  'bg-rose-600/30 border-rose-400 text-rose-300 shadow-md shadow-rose-950'
                                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Skor Kondisi Persen */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Skor Kondisi Presisi (0 - 100%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.conditionScore}
                        onChange={(e) => handleInputChange('conditionScore', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    {/* Tingkat Urgensi Pemeliharaan */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Tingkat Urgensi Intervensi
                      </label>
                      <select
                        value={formData.maintenanceUrgency}
                        onChange={(e) => handleInputChange('maintenanceUrgency', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Normal">Normal (Pemeliharaan Berkala)</option>
                        <option value="Pemeliharaan Rutin">Pemeliharaan Rutin (Dalam Antrian)</option>
                        <option value="Kritis / Segera">Kritis / Segera (Overhaul / Darurat)</option>
                      </select>
                    </div>

                    {/* Tanggal Pemeliharaan Terakhir */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Tanggal Pemeliharaan Terakhir
                      </label>
                      <input
                        type="date"
                        value={formData.lastMaintenanceDate || ''}
                        onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Jadwal Pemeliharaan Berikutnya */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Jadwal Pemeliharaan Berikutnya
                      </label>
                      <input
                        type="date"
                        value={formData.nextMaintenanceDate || ''}
                        onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Spesifikasi & Legalitas */}
              {activeTab === 'spesifikasi' && (
                <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kapasitas Desain */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Kapasitas Desain & Operasional
                      </label>
                      <input
                        type="text"
                        value={formData.capacityDesc}
                        onChange={(e) => handleInputChange('capacityDesc', e.target.value)}
                        placeholder="Contoh: Daya Tampung 30 Taruna Latih, DWT 150 Ton"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Detail Spesifikasi Teknis */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Detail Mesin / Konfigurasi Teknis / Dimensi
                      </label>
                      <textarea
                        rows="3"
                        value={formData.specs}
                        onChange={(e) => handleInputChange('specs', e.target.value)}
                        placeholder="Contoh: LOA: 50.2 m, Breadth: 9.5 m, Main Engine: Yanmar 1800 HP..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Catatan Teknis / Log Masalah */}
              {activeTab === 'catatan' && (
                <div className="bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-700/60 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Catatan Analisis Masalah & Riwayat Tindakan Pemeliharaan
                  </label>
                  <textarea
                    rows="5"
                    value={formData.issuesSummary}
                    onChange={(e) => handleInputChange('issuesSummary', e.target.value)}
                    placeholder="Masukkan uraian riwayat perbaikan, kendala suku cadang, atau rekomendasi teknis operasional..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>
              )}

              {/* Action Buttons Full Edit */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsFullEditMode(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Batal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveFull}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/40 transition-all active:scale-95 border border-cyan-400/40"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Seluruh Data Sarpras</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* CASE 2: NORMAL VIEW MODE + RESTRICTED EDIT FOR OPERATOR */
            /* ============================================================== */
            <div className="space-y-5 animate-fadeIn">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Satuan Pendidikan</span>
                  <span className="font-semibold text-white mt-0.5 block truncate" title={asset.satdikName}>
                    {asset.satdikName}
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
                    <span className="text-slate-400 text-[11px] block">Bidang Sarpras:</span>
                    <p className="text-slate-200 font-medium mt-0.5 truncate" title={SARPRAS_CATEGORIES.find(c => c.id === asset.category)?.name || asset.category}>
                      {SARPRAS_CATEGORIES.find(c => c.id === asset.category)?.name || asset.category || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Program Studi:</span>
                    <p className="text-cyan-300 font-medium mt-0.5 flex items-center gap-1.5 truncate" title={asset.prodi || 'Semua Program Studi (Umum)'}>
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate font-semibold">{asset.prodi || 'Semua Program Studi (Umum)'}</span>
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 text-[11px] block">Kapasitas Operasional:</span>
                    <p className="text-slate-200 font-medium mt-0.5">{asset.capacityDesc || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 text-[11px] block">Detail Mesin / Konfigurasi:</span>
                    <p className="text-slate-200 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 mt-1 leading-relaxed">
                      {asset.specs || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Maintenance & Technical Issues Card */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Analisis Kondisi & Catatan Pemeliharaan</span>
                  </div>
                  {asset.nextMaintenanceDate && (
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Jadwal Berikutnya: {asset.nextMaintenanceDate}</span>
                    </span>
                  )}
                </div>

                {/* Quick Edit Form for Operator / Fast Condition Edit */}
                {isQuickEditMode ? (
                  <div className="space-y-3 bg-slate-900/90 p-3.5 rounded-xl border border-cyan-800/60 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">
                        Pembaruan Status Kondisi Lapangan
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {canEditFull ? 'Akses: Kendali Penuh' : 'Akses: Operator Kampus'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <label className="text-xs text-slate-300 font-medium">Kondisi Fisik Baru:</label>
                      <div className="flex flex-wrap gap-2">
                        {['Baik', 'Rusak Ringan', 'Rusak Berat'].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setQuickCondition(cond)}
                            className={`px-3 py-1 text-xs rounded-lg font-semibold border transition-all ${
                              quickCondition === cond
                                ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-950'
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
                        Catatan Teknis / Log Riwayat Perbaikan:
                      </label>
                      <textarea
                        rows="3"
                        value={quickNotes}
                        onChange={(e) => setQuickNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                        placeholder="Uraikan tindakan perbaikan atau pemeliharaan yang telah dikerjakan di lapangan..."
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsQuickEditMode(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveQuick}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/40"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Status</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {asset.issuesSummary || 'Tidak ada catatan permasalahan teknis.'}
                    </p>

                    {/* Tombol aksi sesuai hak akses pengguna */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800/80">
                      <div>
                        {canEditFull ? (
                          <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Akun Anda memiliki kendali penuh atas master data sarpras ini.</span>
                          </span>
                        ) : canEditOwn && isOwnCampus ? (
                          <span className="text-[11px] text-amber-300 flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Operator Kampus berwenang memperbarui kondisi & log pemeliharaan.</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>{isAuditor ? 'Akun Anda dalam mode audit tinjauan (Hanya Baca).' : 'Akses edit terbatas pada operator kampus terkait.'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Tombol Ubah Cepat Kondisi jika punya wewenang */}
                        {canQuickEdit && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuickCondition(asset.condition);
                              setQuickNotes(asset.issuesSummary || '');
                              setIsQuickEditMode(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                          >
                            <Wrench className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ubah Kondisi / Log</span>
                          </button>
                        )}

                        {/* Tombol Edit Kendali Penuh untuk Full Control */}
                        {canEditFull && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsFullEditMode(true);
                              setIsQuickEditMode(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all border border-cyan-400/30"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Keseluruhan Data</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-800/80 px-5 sm:px-6 py-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Terakhir disinkronkan: {asset.lastMaintenanceDate || '2026-01-15'}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
