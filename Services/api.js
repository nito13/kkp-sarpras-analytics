/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Layanan Koneksi REST API Backend PHP & MySQL (PDO)
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 * Modul Services/api.js:
 * Berkomunikasi dengan endpoint REST API di folder APIs/ dan Monitoring/
 * dengan fallback offline otomatis ke localStorage.
 */
(function (window) {
  'use strict';

  // Base URL relatif terhadap root aplikasi di Laragon
  const isFrontendSubdir = typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('/frontend');
  const API_BASE_URL = isFrontendSubdir ? '../APIs' : 'APIs';
  const MONITORING_BASE_URL = isFrontendSubdir ? '../Monitoring' : 'Monitoring';

  async function checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(function () { controller.abort(); }, 3000);

      // Coba Monitoring/health.php terlebih dahulu, dengan fallback ke api/health.php
      let res;
      try {
        res = await fetch(MONITORING_BASE_URL + '/health.php', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
      } catch (netErr) {
        res = await fetch('api/health.php', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
      }
      clearTimeout(timeoutId);
      if (!res.ok) return { online: false, isConnected: false };
      const data = await res.json();
      const isOnline = Boolean(data && (data.success || data.status === 'connected'));
      return { online: isOnline, isConnected: isOnline, info: data };
    } catch (err) {
      return { online: false, isConnected: false, error: err.message };
    }
  }

  async function apiLogin(identifier, password) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ identifier: identifier, password: password })
      });
    } catch (e) {
      res = await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ identifier: identifier, password: password })
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal autentikasi ke server database.');
    }
    return { success: true, user: data.user };
  }

  async function apiFetchSatdik() {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/satdik.php', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/satdik.php', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memuat daftar Satdik.');
    }
    return { success: true, data: data.data };
  }

  async function apiFetchAsrama(satdikId) {
    const query = satdikId && satdikId !== 'ALL' ? '?satdik_id=' + encodeURIComponent(satdikId) : '';
    let res;
    try {
      res = await fetch(API_BASE_URL + '/asrama.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/asrama.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memuat data kapasitas asrama.');
    }
    return {
      success: true,
      meta: data.meta || null,
      summary: data.summary || [],
      buildings: data.buildings || []
    };
  }

  async function apiCreateAsramaBuilding(payload) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/asrama.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      res = await fetch('api/asrama.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menambahkan gedung asrama ke database.');
    }
    return { success: true, data: data.data, summaryRow: data.summaryRow };
  }

  async function apiUpdateAsramaBuilding(id, updates) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/asrama.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    } catch (e) {
      res = await fetch('api/asrama.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memperbarui gedung asrama.');
    }
    return { success: true, data: data.data, summaryRow: data.summaryRow };
  }

  async function apiDeleteAsramaBuilding(id) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/asrama.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/asrama.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menghapus gedung asrama.');
    }
    return { success: true, deletedId: id, summaryRow: data.summaryRow };
  }

  async function apiFetchStandarSarpras(params) {
    const opts = params || {};
    const parts = [];
    if (opts.mode) parts.push('mode=' + encodeURIComponent(opts.mode));
    if (opts.bidangId && opts.bidangId !== 'ALL') parts.push('bidang_id=' + encodeURIComponent(opts.bidangId));
    if (opts.satdikId && opts.satdikId !== 'ALL') parts.push('satdik_id=' + encodeURIComponent(opts.satdikId));
    const query = parts.length > 0 ? '?' + parts.join('&') : '';

    let res;
    try {
      res = await fetch(API_BASE_URL + '/standar_sarpras.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/standar_sarpras.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memuat data standar sarpras prodi.');
    }
    return {
      success: true,
      meta: data.meta || null,
      bidang: data.bidang || [],
      rekap: data.rekap || [],
      items: data.items || []
    };
  }

  async function apiCreateStandarItem(payload) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/standar_sarpras.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      res = await fetch('api/standar_sarpras.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menambahkan item standar sarpras.');
    }
    return { success: true, data: data.data, bidang: data.bidang, rekap: data.rekap };
  }

  async function apiUpdateStandarItem(id, updates) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/standar_sarpras.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    } catch (e) {
      res = await fetch('api/standar_sarpras.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memperbarui item standar sarpras.');
    }
    return { success: true, data: data.data, bidang: data.bidang, rekap: data.rekap };
  }

  async function apiDeleteStandarItem(id) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/standar_sarpras.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/standar_sarpras.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menghapus item standar sarpras.');
    }
    return { success: true, deletedId: id, bidang: data.bidang, rekap: data.rekap };
  }

  async function apiBulkImport(payload) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/bulk_import.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      res = await fetch('api/bulk_import.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal mengimpor data Excel ke database.');
    }
    return {
      success: true,
      message: data.message,
      counts: data.counts || {},
      assets: data.assets || [],
      buildings: data.buildings || [],
      asramaSummary: data.asramaSummary || [],
      standarItems: data.standarItems || [],
      standarBidang: data.standarBidang || [],
      standarRekap: data.standarRekap || []
    };
  }

  async function apiFetchTambakKolam(satdikId) {
    const query = satdikId && satdikId !== 'ALL' ? '?satdik_id=' + encodeURIComponent(satdikId) : '';
    let res;
    try {
      res = await fetch(API_BASE_URL + '/tambak_kolam.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/tambak_kolam.php' + query, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memuat data tambak dan kolam.');
    }
    return {
      success: true,
      meta: data.meta || null,
      summary: data.summary || [],
      units: data.units || []
    };
  }

  async function apiCreateTambakUnit(payload) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/tambak_kolam.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      res = await fetch('api/tambak_kolam.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menambahkan unit tambak/kolam.');
    }
    return {
      success: true,
      unit: data.data ? data.data.unit : null,
      summaryRow: data.data ? data.data.summary : null
    };
  }

  async function apiUpdateTambakUnit(id, updates) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/tambak_kolam.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    } catch (e) {
      res = await fetch('api/tambak_kolam.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memperbarui unit tambak/kolam.');
    }
    return {
      success: true,
      unit: data.data ? data.data.unit : null,
      summaryRow: data.data ? data.data.summary : null
    };
  }

  async function apiDeleteTambakUnit(id) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/tambak_kolam.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/tambak_kolam.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menghapus unit tambak/kolam.');
    }
    return {
      success: true,
      deletedId: id,
      satdikId: data.data ? data.data.satdikId : null,
      summaryRow: data.data ? data.data.summary : null
    };
  }

  window.SARPRAS_API = {
    API_BASE_URL: API_BASE_URL,
    MONITORING_BASE_URL: MONITORING_BASE_URL,
    checkBackendHealth: checkBackendHealth,
    apiCheckHealth: checkBackendHealth,
    apiLogin: apiLogin,
    apiFetchSatdik: apiFetchSatdik,
    apiFetchAsrama: apiFetchAsrama,
    apiCreateAsramaBuilding: apiCreateAsramaBuilding,
    apiUpdateAsramaBuilding: apiUpdateAsramaBuilding,
    apiDeleteAsramaBuilding: apiDeleteAsramaBuilding,
    apiFetchStandarSarpras: apiFetchStandarSarpras,
    apiCreateStandarItem: apiCreateStandarItem,
    apiUpdateStandarItem: apiUpdateStandarItem,
    apiDeleteStandarItem: apiDeleteStandarItem,
    apiFetchTambakKolam: apiFetchTambakKolam,
    apiCreateTambakUnit: apiCreateTambakUnit,
    apiUpdateTambakUnit: apiUpdateTambakUnit,
    apiDeleteTambakUnit: apiDeleteTambakUnit,
    apiBulkImport: apiBulkImport
  };
})(window);
