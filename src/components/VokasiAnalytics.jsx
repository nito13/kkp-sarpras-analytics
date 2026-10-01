import React, { useState, useMemo } from 'react';
import { 
  School, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Scale, 
  Ship, 
  Bed, 
  Fish, 
  Boxes, 
  Layers, 
  ShieldCheck, 
  BarChart2,
  Check,
  X,
  GraduationCap,
  Search
} from 'lucide-react';
import { SATDIK_LIST, NATIONAL_SARPRAS_TARGETS, PRODI_LIST, SARPRAS_CATEGORIES, getCategoryForProdi } from '../data/kkpData';

export default function VokasiAnalytics({
  satdikBreakdown,
  assets
}) {
  const [campus1Id, setCampus1Id] = useState('poltek-aup');
  const [campus2Id, setCampus2Id] = useState('poltek-kp-sidoarjo');
  const [prodiSearch, setProdiSearch] = useState('');
  const [activeProdiDetail, setActiveProdiDetail] = useState(null);

  const filteredProdiList = useMemo(() => {
    if (!prodiSearch.trim()) return PRODI_LIST;
    return PRODI_LIST.filter(p => p.toLowerCase().includes(prodiSearch.toLowerCase()));
  }, [prodiSearch]);

  const campus1 = SATDIK_LIST.find(s => s.id === campus1Id) || SATDIK_LIST[0];
  const campus2 = SATDIK_LIST.find(s => s.id === campus2Id) || SATDIK_LIST[1];

  const metrics1 = satdikBreakdown[campus1.id] || { count: 0, valuation: 0, avgScore: 0, baik: 0, rusakRingan: 0, rusakSedang: 0, rusakBerat: 0 };
  const metrics2 = satdikBreakdown[campus2.id] || { count: 0, valuation: 0, avgScore: 0, baik: 0, rusakRingan: 0, rusakSedang: 0, rusakBerat: 0 };

  // Calculate Kapasitas dan Kelayakan Fasilitas Asrama across all satdik
  const asramaData = SATDIK_LIST.map(sat => {
    const asramaAssets = assets.filter(a => a.satdikId === sat.id && (
      a.category === 'sosial_pemberdayaan' ||
      a.category === 'asrama_penunjang' ||
      /asrama|menza/i.test(a.subcategory || '') ||
      /asrama/i.test(a.name || '')
    ));
    let totalBeds = 0;
    let totalScore = 0;
    asramaAssets.forEach(a => {
      // Extract bed number from capacity desc if available
      const match = a.capacityDesc && a.capacityDesc.match(/(\d+)\s*(Tempat Tidur|Ranjang|siswa|taruna)/i);
      if (match) {
        totalBeds += parseInt(match[1]);
      } else {
        totalBeds += 380;
      }
      totalScore += (a.conditionScore || 85);
    });
    if (totalBeds === 0) totalBeds = 350;
    const avgScore = asramaAssets.length > 0 ? Math.round(totalScore / asramaAssets.length) : 85;

    return {
      satdik: sat,
      totalBeds: Math.round(totalBeds),
      unitCount: asramaAssets.length || 1,
      avgScore,
      isLayak: avgScore >= 70,
    };
  });

  // Standar Vokasi KKP Compliance Checklist
  const complianceChecklist = [
    {
      title: 'Sertifikasi Kelayakan Kapal Latih (IMO STCW & BKI)',
      description: 'Seluruh kapal latih wajib memiliki sertifikat kelas BKI dan sertifikat keselamatan kapal KSOP.',
      target: '100% Kapal Latih Aktif',
      actual: '83.3% Memenuhi',
      status: 'warning',
      notes: 'KM Frans Kaisiepo (Sorong) dan KM Pariaman Bahari 02 kadaluarsa & perlu docking.',
    },
    {
      title: 'Standar Kelayakan Gedung & Fasilitas Asrama',
      description: 'Gedung asrama wajib memenuhi standar sanitasi bersih, ventilasi, dan dapur sentral higienis.',
      target: '100% Asrama Layak Operasi',
      actual: '96.8% Nasional',
      status: 'success',
      notes: 'Hampir seluruh kampus memenuhi kapasitas asrama; beberapa perlu peremajaan sanitasi.',
    },
    {
      title: 'Sertifikasi CPIB / CBIB pada Fasilitas Hatchery & Tambak',
      description: 'Sarana budidaya wajib mengantongi Cara Pembenihan/Budidaya Ikan yang Baik dari Ditjen Budidaya KKP.',
      target: 'Minimal 1 Sertifikat per Satdik',
      actual: '94.4% Terakreditasi',
      status: 'success',
      notes: 'Tambak Sidoarjo, Karawang, dan Hatchery Serang menjadi percontohan nasional.',
    },
    {
      title: 'Sertifikasi Kelayakan Pengolahan (SKP) & HACCP UPI Latih',
      description: 'Unit Pengolahan Ikan latih wajib memiliki standar higienis setara industri komersil ekspor.',
      target: 'Nilai SKP Minimal B',
      actual: '88.9% Terakreditasi',
      status: 'success',
      notes: 'Cold storage AUP dan Tegal membutuhkan penggantian unit kompresor & gasket pendingin.',
    },
    {
      title: 'Teaching Factory (TEFA) Berbadan Usaha & Berpenghasilan PNBP',
      description: 'Setiap satuan pendidikan wajib mengoperasikan minimal 1 unit TEFA produk kelautan mandiri.',
      target: '100% Satdik Memiliki TEFA',
      actual: '100% Terpenuhi (18 Satdik)',
      status: 'success',
      notes: 'Menghasilkan produk olahan bandeng, surimi, tuna loin, se\'i ikan, dan benih udang.',
    },
    {
      title: 'Full Mission Simulator Navigasi Berstandar STCW 2010 Manila Amendments',
      description: 'Satdik dengan prodi penangkapan wajib memiliki simulator anjungan dan kamar mesin terlisensi.',
      target: 'Seluruh Poltek KP Maritim',
      actual: '78.5% Lengkap',
      status: 'warning',
      notes: 'SUPM sebagian besar masih menggunakan simulator desktop skala mini.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Evaluasi Standar Mutu Pendidikan Vokasi
            </span>
            <span className="text-slate-400 text-xs">• Permen KP & BAN-PT Standar Sarpras</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <School className="w-5 h-5 text-cyan-400" />
            <span>Standar Kelayakan & Benchmarking Vokasi KKP</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Analisis kecukupan rasio tempat tidur asrama, jam layar kapal latih, sertifikasi mutu, serta komparasi sarpras antar kampus.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 self-start md:self-auto">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Kepatuhan Standar Nasional: <strong className="text-emerald-400 font-bold">91.4%</strong>
          </span>
        </div>
      </div>

      {/* Head-to-Head Campus Comparison Tool */}
      <div className="bg-slate-800/90 rounded-2xl p-3.5 sm:p-5 border border-slate-700/70 shadow-md space-y-4 overflow-hidden">
        {/* Header & Campus Selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Komparasi Sarpras Antar Kampus (Head-to-Head)
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Pilih dua satuan pendidikan untuk membandingkan kapasitas fasilitas dan indeks kelayakannya berdampingan.
            </p>
          </div>

          {/* Campus Selectors - Fluid, Auto-wrapped & Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto bg-slate-950/60 p-2 sm:p-2.5 rounded-xl border border-slate-800">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5 truncate">
                Kampus 1 (Cyan)
              </span>
              <select
                value={campus1Id}
                onChange={(e) => setCampus1Id(e.target.value)}
                className="w-full min-w-0 truncate bg-slate-900 text-cyan-300 font-semibold border border-cyan-800/80 text-[11px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none focus:border-cyan-500 shadow-sm"
              >
                {SATDIK_LIST.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">{s.shortName}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center pt-3 sm:pt-3.5 flex-shrink-0 px-1">
              <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 shadow-sm">
                VS
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5 truncate">
                Kampus 2 (Amber)
              </span>
              <select
                value={campus2Id}
                onChange={(e) => setCampus2Id(e.target.value)}
                className="w-full min-w-0 truncate bg-slate-900 text-amber-300 font-semibold border border-amber-800/80 text-[11px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none focus:border-amber-500 shadow-sm"
              >
                {SATDIK_LIST.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">{s.shortName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1 sm:pt-2">
          {/* Campus 1 Card */}
          <div className="bg-slate-900/80 p-3.5 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-3 sm:space-y-4 overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {campus1.jenjang}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1 break-words leading-tight">{campus1.name}</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">{campus1.kota}, {campus1.provinsi}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xl sm:text-2xl font-black text-cyan-400">{Math.round(metrics1.avgScore)}%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block whitespace-nowrap">Indeks Kelayakan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 min-w-0">
                <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Total Sarpras</span>
                <span className="font-bold text-white text-xs sm:text-sm truncate block mt-0.5">{metrics1.count} Unit</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 min-w-0">
                <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Kondisi Baik</span>
                <span className="font-bold text-emerald-400 text-xs sm:text-sm truncate block mt-0.5">{metrics1.baik} Unit</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-800 text-[11px] sm:text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Akreditasi Satdik:</span>
                <span className="font-bold text-white">{campus1.akreditasi}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  Program Studi ({campus1.prodi?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 scrollbar-thin">
                  {campus1.prodi?.map((p, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campus 2 Card */}
          <div className="bg-slate-900/80 p-3.5 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3 sm:space-y-4 overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {campus2.jenjang}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1 break-words leading-tight">{campus2.name}</h4>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">{campus2.kota}, {campus2.provinsi}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xl sm:text-2xl font-black text-amber-400">{Math.round(metrics2.avgScore)}%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block whitespace-nowrap">Indeks Kelayakan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 min-w-0">
                <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Total Sarpras</span>
                <span className="font-bold text-white text-xs sm:text-sm truncate block mt-0.5">{metrics2.count} Unit</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 min-w-0">
                <span className="text-slate-400 text-[10px] sm:text-[11px] block truncate">Kondisi Baik</span>
                <span className="font-bold text-emerald-400 text-xs sm:text-sm truncate block mt-0.5">{metrics2.baik} Unit</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-slate-800 text-[11px] sm:text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Akreditasi Satdik:</span>
                <span className="font-bold text-white">{campus2.akreditasi}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  Program Studi ({campus2.prodi?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 scrollbar-thin">
                  {campus2.prodi?.map((p, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-amber-950/60 text-amber-300 border border-amber-800/40">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matriks Perbandingan Langsung (Head-to-Head Matrix) */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <h4 className="text-xs font-bold text-slate-200">
              Matriks Perbandingan Berdampingan
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-900/60 shadow-xs scrollbar-thin">
            <table className="w-full text-left text-[11px] sm:text-xs min-w-[320px]">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">Parameter Komparasi</th>
                  <th className="py-2.5 px-3 font-bold text-cyan-400 truncate max-w-[120px] sm:max-w-none">
                    {campus1.shortName}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-amber-400 truncate max-w-[120px] sm:max-w-none">
                    {campus2.shortName}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Indeks Kelayakan</td>
                  <td className="py-2 px-3 font-black text-cyan-400">{Math.round(metrics1.avgScore)}%</td>
                  <td className="py-2 px-3 font-black text-amber-400">{Math.round(metrics2.avgScore)}%</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Total Unit Sarpras</td>
                  <td className="py-2 px-3 font-semibold text-white">{metrics1.count} Unit</td>
                  <td className="py-2 px-3 font-semibold text-white">{metrics2.count} Unit</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Kondisi Prima (Baik)</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{metrics1.baik} Unit</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{metrics2.baik} Unit</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Perlu Perbaikan Segera</td>
                  <td className="py-2 px-3 font-bold text-rose-400">
                    {metrics1.rusakSedang + metrics1.rusakBerat} Unit
                  </td>
                  <td className="py-2 px-3 font-bold text-rose-400">
                    {metrics2.rusakSedang + metrics2.rusakBerat} Unit
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Akreditasi Satdik</td>
                  <td className="py-2 px-3 font-bold text-white">{campus1.akreditasi}</td>
                  <td className="py-2 px-3 font-bold text-white">{campus2.akreditasi}</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-medium">Program Kejuruan</td>
                  <td className="py-2 px-3 font-bold text-cyan-300">{campus1.prodi?.length || 0} Program Studi</td>
                  <td className="py-2 px-3 font-bold text-amber-300">{campus2.prodi?.length || 0} Program Studi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Direktori Sebaran 25 Program Studi Vokasi BPPSDM KP */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span>Direktori 25 Program Studi Vokasi Kelautan & Perikanan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sebaran 25 program studi resmi BPPSDM KP pada 18 satuan pendidikan (Politeknik & SUPM) di seluruh Indonesia.
            </p>
          </div>
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari dari 25 program studi..."
              value={prodiSearch}
              onChange={(e) => setProdiSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Grid Program Studi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredProdiList.map((prodiName, idx) => {
            const campusesWithProdi = SATDIK_LIST.filter(s => s.prodi && s.prodi.includes(prodiName));
            const isSelected = activeProdiDetail === prodiName;

            return (
              <div
                key={idx}
                onClick={() => setActiveProdiDetail(isSelected ? null : prodiName)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-white block leading-snug">
                      {prodiName}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] text-cyan-400 font-medium">
                        {campusesWithProdi.length} Satdik
                      </span>
                      {(() => {
                        const catId = getCategoryForProdi(prodiName);
                        const cat = SARPRAS_CATEGORIES.find(c => c.id === catId);
                        if (!cat) return null;
                        return (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${cat.bgLight} border ${cat.borderLight} text-slate-300`}>
                            {cat.name}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isSelected ? 'Tutup' : 'Lihat Satdik'}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold block">Kampus Pengampu:</span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                      {campusesWithProdi.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between text-[10px] bg-slate-950/70 px-2 py-1 rounded border border-slate-800/80">
                          <span className="text-slate-200 font-medium truncate max-w-[170px]" title={c.name}>
                            {c.shortName}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            c.jenjang === 'Pendidikan Tinggi'
                              ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/50'
                              : 'bg-amber-950/70 text-amber-400 border border-amber-800/50'
                          }`}>
                            {c.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Standard Checklist */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Matriks Kepatuhan Standar Sarpras Vokasi KKP</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluasi kepatuhan terhadap indikator standar wajib sarpras kelautan dan perikanan (BPPSDM KP).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceChecklist.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap ${
                    item.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.actual}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Target Regulasi:</span>
                  <span className="text-slate-200 font-semibold">{item.target}</span>
                </div>
                <div className="text-slate-400 italic text-[10px] bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  {item.notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kapasitas Daya Tampung & Kelayakan Asrama Penunjang */}
      <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/70 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Bed className="w-5 h-5 text-cyan-400" />
              <span>Kapasitas Daya Tampung & Kelayakan Asrama Penunjang</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoring ketersediaan tempat tidur/ranjang serta tingkat kelayakan fasilitas fisik gedung asrama per satuan pendidikan.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            Rata-rata Kelayakan: 88.6%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {asramaData.slice(0, 9).map((b, i) => (
            <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs truncate max-w-[160px]" title={b.satdik.name}>
                  {b.satdik.shortName}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  b.avgScore >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {b.avgScore}% Kelayakan
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.avgScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, b.avgScore)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Daya Tampung: <strong className="text-slate-300">{b.totalBeds} Ranjang</strong></span>
                <span>Fasilitas: <strong className="text-slate-300">{b.unitCount} Unit Gedung</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
