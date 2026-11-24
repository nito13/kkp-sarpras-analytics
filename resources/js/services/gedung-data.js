/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Dataset Master Gedung & Bangunan
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDM KP)
 * Meliputi 18 Satuan Pendidikan Vokasi KKP (Pendidikan Tinggi & Menengah SUPM)
 * ============================================================================
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'kkp_sarpras_gedung_v1';

  // Data awal kosong agar pengguna dapat mengisi / mengimpor data riil
  const INITIAL_GEDUNG = [];

  function loadGedung() {
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
      console.warn('Gagal membaca data gedung & bangunan dari localStorage:', e);
    }
    return INITIAL_GEDUNG;
  }

  function saveGedung(items) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
      }
    } catch (e) {
      console.warn('Gagal menyimpan data gedung & bangunan ke localStorage:', e);
    }
  }

  function resetGedung() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Gagal mereset data gedung & bangunan:', e);
    }
    return INITIAL_GEDUNG;
  }

  function calculateKpis(items) {
    const list = Array.isArray(items) ? items : [];
    const totalRecord = list.length;
    const totalUnit = list.reduce((sum, g) => sum + (Number(g.jumlah) || 1), 0);
    const totalLuasM2 = list.reduce((sum, g) => sum + (Number(g.luasM2) || 0), 0);
    const maxLantai = list.reduce((max, g) => Math.max(max, Number(g.jumlahLantai) || 1), 0);
    const bertingkatCount = list.filter((g) => (Number(g.jumlahLantai) || 1) > 1).length;

    return {
      totalRecord,
      totalUnit,
      totalLuasM2: Number(totalLuasM2.toFixed(2)),
      maxLantai,
      bertingkatCount
    };
  }

  window.SARPRAS_GEDUNG = {
    meta: {
      sumber: 'Data Master Gedung dan Bangunan Satuan Pendidikan KP',
      tanggalData: '2026-11-16',
      jumlahSatdik: 18,
      jenisGedungOptions: [
        'Gedung Kantor / Administrasi / Rektorat',
        'Gedung Perkuliahan / Ruang Kelas',
        'Gedung Laboratorium / Workshop / Bengkel',
        'Gedung Teaching Factory (TEFA) / Simulator',
        'Gedung Perpustakaan',
        'Gedung Asrama / Mess Taruna',
        'Gedung Aula / Auditorium / Serbaguna',
        'Gedung Ruang Makan / Dapur / Menza',
        'Gedung Poliklinik / Kesehatan',
        'Gedung Rumah Ibadah (Masjid / Musholla / Kapel)',
        'Rumah Negara / Mess Dosen & Pegawai',
        'Bangunan Utilitas / Gardu / Gudang / Pos Jaga'
      ]
    },
    getAll: loadGedung,
    saveAll: saveGedung,
    reset: resetGedung,
    calculateKpis: calculateKpis
  };
})(window);
