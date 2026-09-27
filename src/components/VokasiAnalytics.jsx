import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { SATDIK_LIST, NATIONAL_SARPRAS_TARGETS } from '../data/kkpData';
import { formatRupiah } from '../data/sarprasGenerator';

export default function VokasiAnalytics({
  satdikBreakdown,
  assets
}) {
  const [campus1Id, setCampus1Id] = useState('poltek-aup');
  const [campus2Id, setCampus2Id] = useState('poltek-kp-sidoarjo');

  const campus1 = SATDIK_LIST.find(s => s.id === campus1Id) || SATDIK_LIST[0];
  const campus2 = SATDIK_LIST.find(s => s.id === campus2Id) || SATDIK_LIST[1];

  const metrics1 = satdikBreakdown[campus1.id] || { count: 0, valuation: 0, avgScore: 0, baik: 0, rusakRingan: 0, rusakSedang: 0, rusakBerat: 0 };
  const metrics2 = satdikBreakdown[campus2.id] || { count: 0, valuation: 0, avgScore: 0, baik: 0, rusakRingan: 0, rusakSedang: 0, rusakBerat: 0 };

  // Calculate Bed to Taruna Ratio across all satdik
  const bedRatioData = SATDIK_LIST.map(sat => {
    const asramaAssets = assets.filter(a => a.satdikId === sat.id && a.category === 'asrama_penunjang');
    let totalBeds = 0;
    asramaAssets.forEach(a => {
      // Extract bed number from capacity desc if available, or approximate based on capacity
      const match = a.capacityDesc && a.capacityDesc.match(/(\d+)\s*(Tempat Tidur|Ranjang|siswa|taruna)/i);
      if (match) {
        totalBeds += parseInt(match[1]);
      } else {
        totalBeds += sat.tarunaCount * 0.95; // realistic fallback
      }
    });
    if (totalBeds === 0) totalBeds = Math.round(sat.tarunaCount * 0.98);

    const ratio = Math.round((totalBeds / sat.tarunaCount) * 100);
    return {
      satdik: sat,
      totalBeds: Math.round(totalBeds),
      tarunaCount: sat.tarunaCount,
      ratio,
      isCompliant: ratio >= 95,
    };
  });

  // Standar Vokasi KKP Compliance Checklist
  const complianceChecklist = [
    {
      title: 'Sertifikasi Kelaikan Kapal Latih (IMO STCW & BKI)',
      description: 'Seluruh kapal latih wajib memiliki sertifikat kelas BKI dan sertifikat keselamatan kapal KSOP.',
      target: '100% Kapal Latih Aktif',
      actual: '83.3% Memenuhi',
      status: 'warning',
      notes: 'KM Frans Kaisiepo (Sorong) dan KM Pariaman Bahari 02 kadaluarsa & perlu docking.',
    },
    {
      title: 'Rasio Tempat Tidur Asrama (Sistem Boarding School Taruna)',
      description: 'Taruna wajib tinggal 100% di asrama dengan sanitasi dan dapur higienis berstandar.',
      target: 'Rasio 1 : 1 (100%)',
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
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Evaluasi Standar Mutu Pendidikan Vokasi
            </span>
            <span className="text-slate-400 text-xs">• Permen KP & BAN-PT Standar Sarpras</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <School className="w-5 h-5 text-cyan-400" />
            <span>Standar Kelaikan & Benchmarking Vokasi KKP</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Analisis kecukupan rasio tempat tidur asrama, jam layar kapal latih, sertifikasi mutu, serta komparasi sarpras antar kampus.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/80 p-2 rounded-xl border border-slate-700">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Kepatuhan Standar Nasional: <strong className="text-emerald-400">91.4%</strong>
          </span>
        </div>
      </div>

      {/* Head-to-Head Campus Comparison Tool */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Komparasi Sarpras Antar Kampus (Head-to-Head)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih dua satuan pendidikan untuk membandingkan kapasitas fasilitas dan indeks kelaikannya berdampingan.
            </p>
          </div>

          {/* Campus Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={campus1Id}
              onChange={(e) => setCampus1Id(e.target.value)}
              className="bg-slate-900 text-cyan-300 font-semibold border border-cyan-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {SATDIK_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.shortName}</option>
              ))}
            </select>

            <span className="text-xs text-slate-400 font-bold px-1">VS</span>

            <select
              value={campus2Id}
              onChange={(e) => setCampus2Id(e.target.value)}
              className="bg-slate-900 text-amber-300 font-semibold border border-amber-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
            >
              {SATDIK_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* Campus 1 Card */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {campus1.jenjang}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{campus1.name}</h4>
                <p className="text-xs text-slate-400">{campus1.kota}, {campus1.provinsi}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-cyan-400">{Math.round(metrics1.avgScore)}%</span>
                <span className="text-[10px] text-slate-400 block">Indeks Kelaikan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Taruna</span>
                <span className="font-bold text-white">{campus1.tarunaCount.toLocaleString()}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Luas Lahan</span>
                <span className="font-bold text-white">{campus1.luasLahanHa} Ha</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Total Sarpras</span>
                <span className="font-bold text-white">{metrics1.count} Unit</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Kondisi Baik</span>
                <span className="font-bold text-emerald-400">{metrics1.baik} Unit</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Valuasi BMN:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(metrics1.valuation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kebutuhan Perbaikan:</span>
                <span className="font-bold text-amber-400">{formatRupiah(metrics1.totalRepairNeeded)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Akreditasi Satdik:</span>
                <span className="font-bold text-white">{campus1.akreditasi}</span>
              </div>
            </div>
          </div>

          {/* Campus 2 Card */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-amber-500/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {campus2.jenjang}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{campus2.name}</h4>
                <p className="text-xs text-slate-400">{campus2.kota}, {campus2.provinsi}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{Math.round(metrics2.avgScore)}%</span>
                <span className="text-[10px] text-slate-400 block">Indeks Kelaikan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Taruna</span>
                <span className="font-bold text-white">{campus2.tarunaCount.toLocaleString()}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Luas Lahan</span>
                <span className="font-bold text-white">{campus2.luasLahanHa} Ha</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Total Sarpras</span>
                <span className="font-bold text-white">{metrics2.count} Unit</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Kondisi Baik</span>
                <span className="font-bold text-emerald-400">{metrics2.baik} Unit</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Valuasi BMN:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(metrics2.valuation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kebutuhan Perbaikan:</span>
                <span className="font-bold text-amber-400">{formatRupiah(metrics2.totalRepairNeeded)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Akreditasi Satdik:</span>
                <span className="font-bold text-white">{campus2.akreditasi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Standard Checklist */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-4">
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

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Target Regulasi:</span>
                  <span className="text-slate-200 font-medium">{item.target}</span>
                </div>
                <div className="text-slate-400 italic text-[10px] bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  {item.notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rasio Asrama per Taruna (Boarding Readiness) */}
      <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/70 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Bed className="w-5 h-5 text-cyan-400" />
              <span>Rasio Kecukupan Tempat Tidur Asrama (Target 100% Boarding)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Perbandingan kapasitas ranjang asrama terhadap jumlah seluruh taruna aktif per satuan pendidikan.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            Rata-rata: 97.4%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {bedRatioData.slice(0, 9).map((b, i) => (
            <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs truncate max-w-[160px]" title={b.satdik.name}>
                  {b.satdik.shortName}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  b.ratio >= 98 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {b.ratio}% Terpenuhi
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.ratio >= 98 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, b.ratio)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Ranjang: {b.totalBeds} Unit</span>
                <span>Taruna: {b.tarunaCount} Orang</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
