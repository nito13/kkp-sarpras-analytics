/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Dataset Master Tanah & Lahan
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDM KP)
 * Meliputi 18 Satuan Pendidikan Vokasi KKP (Pendidikan Tinggi & Menengah SUPM)
 * ============================================================================
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'kkp_sarpras_tanah_v2';
  const LEGACY_STORAGE_KEY = 'kkp_sarpras_tanah_v1';

  // Data awal kosong agar pengguna dapat mengimpor data riil melalui fitur Excel
  const INITIAL_PARCELS = [];

  function loadParcels() {
    try {
      if (typeof localStorage !== 'undefined') {
        // Hapus cache data dummy lama jika masih tersimpan
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data tanah dari localStorage:', e);
    }
    return INITIAL_PARCELS;
  }

  function saveParcels(items) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
      }
    } catch (e) {
      console.warn('Gagal menyimpan data tanah ke localStorage:', e);
    }
  }

  function resetParcels() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Gagal mereset data tanah:', e);
    }
    return INITIAL_PARCELS;
  }

  function calculateKpis(items) {
    const list = Array.isArray(items) ? items : [];
    const totalBidang = list.length;
    const totalLuasM2 = list.reduce((sum, p) => sum + (Number(p.luasM2) || 0), 0);
    const totalLuasHa = totalLuasM2 / 10000;
    const bersertifikatCount = list.filter((p) => (p.statusSertifikat || '').includes('SHP') || (p.statusSertifikat || '').includes('Sertifikat')).length;
    const bersertifikatPct = totalBidang > 0 ? (bersertifikatCount / totalBidang) * 100 : 0;
    const operasionalCount = list.filter((p) => (p.statusPemanfaatan || '').includes('Operasional') || (p.statusPemanfaatan || '').includes('Sendiri')).length;
    const operasionalPct = totalBidang > 0 ? (operasionalCount / totalBidang) * 100 : 0;

    return {
      totalBidang,
      totalLuasM2,
      totalLuasHa: Number(totalLuasHa.toFixed(2)),
      bersertifikatCount,
      bersertifikatPct: Number(bersertifikatPct.toFixed(1)),
      operasionalCount,
      operasionalPct: Number(operasionalPct.toFixed(1))
    };
  }

  window.SARPRAS_TANAH = {
    meta: {
      sumber: 'Data Master Tanah & Lahan Satuan Pendidikan KP',
      tanggalData: '2026-11-13',
      jumlahSatdik: 18,
      statusSertifikatOptions: [
        'Sertifikat Hak Pakai (SHP)',
        'Dalam Proses BPN',
        'Hibah Pemda (Naskah Hibah)',
        'Girik / Adat / Pelepasan'
      ],
      peruntukanOptions: [
        'Kampus & Fasilitas Akademik',
        'Tambak & Budidaya Praktik',
        'Workshop & Laboratorium Lapangan',
        'Asrama & Fasilitas Penunjang',
        'Lahan Cadangan Pengembangan'
      ],
      statusPemanfaatanOptions: [
        'Digunakan Sendiri (Operasional)',
        'KSP / Kerjasama Mitra',
        'Pinjam Pakai',
        'Lahan Cadangan'
      ]
    },
    getAll: loadParcels,
    saveAll: saveParcels,
    resetToDefault: resetParcels,
    getKpiSummary: calculateKpis,
    initialData: INITIAL_PARCELS
  };
})(window);
