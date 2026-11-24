/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Dataset Master Kapal Latih
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDM KP)
 * Meliputi 18 Satuan Pendidikan Vokasi KKP (Pendidikan Tinggi & Menengah SUPM)
 * ============================================================================
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'kkp_sarpras_kapal_v1';

  // Data awal kosong agar pengguna dapat mengisi / mengimpor data riil
  const INITIAL_VESSELS = [];

  function loadVessels() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data kapal latih dari localStorage:', e);
    }
    return INITIAL_VESSELS;
  }

  function saveVessels(items) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
      }
    } catch (e) {
      console.warn('Gagal menyimpan data kapal latih ke localStorage:', e);
    }
  }

  function resetVessels() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Gagal mereset data kapal latih:', e);
    }
    return INITIAL_VESSELS;
  }

  function calculateKpis(items) {
    const list = Array.isArray(items) ? items : [];
    const totalKapal = list.length;
    const totalGt = list.reduce((sum, v) => sum + (Number(v.tonageGt) || 0), 0);
    const totalAbk = list.reduce((sum, v) => sum + (Number(v.jumlahAbk) || 0), 0);
    const totalBbm = list.reduce((sum, v) => sum + (Number(v.kapasitasBbm) || 0), 0);
    const aktifCount = list.filter((v) => {
      const s = (v.statusBmn || '').toLowerCase();
      return s.includes('aktif') || s.includes('terdaftar') || s.includes('baik');
    }).length;
    const aktifPct = totalKapal > 0 ? (aktifCount / totalKapal) * 100 : 0;

    return {
      totalKapal,
      totalGt: Number(totalGt.toFixed(2)),
      totalAbk,
      totalBbm: Number(totalBbm.toFixed(0)),
      aktifCount,
      aktifPct: Number(aktifPct.toFixed(1))
    };
  }

  window.SARPRAS_KAPAL = {
    meta: {
      sumber: 'Data Master Kapal Latih Satuan Pendidikan KP',
      tanggalData: '2026-11-16',
      jumlahSatdik: 18,
      jenisKapalOptions: [
        'Kapal Latih Perikanan',
        'Kapal Latih Purse Seine',
        'Kapal Latih Longline',
        'Kapal Latih Pole and Line',
        'Kapal Latih Gillnet / Handline',
        'Kapal Latih Navigasi & Riset',
        'Perahu Motor / Speedboat Latih'
      ],
      statusBmnOptions: [
        'Terdaftar BMN (Aktif Operasional)',
        'Terdaftar BMN (Docking / Perbaikan)',
        'Terdaftar BMN (Rusak Berat)',
        'Proses Penghapusan BMN',
        'Hibah / Pinjam Pakai'
      ]
    },
    getAll: loadVessels,
    saveAll: saveVessels,
    reset: resetVessels,
    calculateKpis: calculateKpis
  };
})(window);
