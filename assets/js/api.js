/**
 * ============================================================================
 * SARPRAS KKP — Layanan Koneksi REST API Backend PHP & MySQL (PDO)
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 * Modul assets/js/api.js:
 * Berkomunikasi dengan endpoint REST API di folder APIs/ dan Monitoring/
 * dengan fallback offline otomatis ke localStorage.
 */
(function (window) {
  'use strict';

  // Base URL relatif terhadap root aplikasi di Laragon
  const API_BASE_URL = 'APIs';
  const MONITORING_BASE_URL = 'Monitoring';

  async function checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(function () { controller.abort(); }, 3000);

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

  async function apiFetchAssets() {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/assets.php', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/assets.php', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memuat data aset dari server.');
    }
    return { success: true, data: data.data };
  }

  async function apiCreateAsset(assetPayload) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/assets.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(assetPayload)
      });
    } catch (e) {
      res = await fetch('api/assets.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(assetPayload)
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menyimpan aset baru ke database.');
    }
    return { success: true, data: data.data };
  }

  async function apiUpdateAsset(id, updates) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/assets.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    } catch (e) {
      res = await fetch('api/assets.php?id=' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.assign({ id: id }, updates))
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal memperbarui aset di database.');
    }
    return { success: true, data: data.data };
  }

  async function apiDeleteAsset(id) {
    let res;
    try {
      res = await fetch(API_BASE_URL + '/assets.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    } catch (e) {
      res = await fetch('api/assets.php?id=' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
    }
    const data = await res.json();
    if (!res.ok || (data.status !== 'success' && !data.success)) {
      throw new Error(data.message || 'Gagal menghapus aset dari database.');
    }
    return true;
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

  window.SARPRAS_API = {
    API_BASE_URL: API_BASE_URL,
    MONITORING_BASE_URL: MONITORING_BASE_URL,
    checkBackendHealth: checkBackendHealth,
    apiCheckHealth: checkBackendHealth,
    apiLogin: apiLogin,
    apiFetchAssets: apiFetchAssets,
    apiCreateAsset: apiCreateAsset,
    apiUpdateAsset: apiUpdateAsset,
    apiDeleteAsset: apiDeleteAsset,
    apiFetchSatdik: apiFetchSatdik
  };
})(window);
