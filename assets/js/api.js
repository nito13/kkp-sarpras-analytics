/**
 * ============================================================================
 * SARPRAS KKP — Layanan Koneksi REST API Backend PHP & MySQL (PDO)
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 * Secara otomatis mendeteksi ketersediaan database MySQL melalui api/health.php
 * dan melakukan fallback ke localStorage apabila berjalan dalam mode offline.
 */
(function (window) {
  'use strict';

  // Gunakan path relatif terhadap root aplikasi di Laragon
  const API_BASE_URL = 'api';

  async function checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(function () { controller.abort(); }, 2500);

      const res = await fetch(API_BASE_URL + '/health.php', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) return { online: false };
      const data = await res.json();
      return { online: Boolean(data && data.success), info: data };
    } catch (err) {
      return { online: false, error: err.message };
    }
  }

  async function apiLogin(identifier, password) {
    const res = await fetch(API_BASE_URL + '/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ identifier: identifier, password: password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal autentikasi ke server database.');
    }
    return data.user;
  }

  async function apiFetchAssets() {
    const res = await fetch(API_BASE_URL + '/assets.php', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memuat data aset dari server.');
    }
    return data.data;
  }

  async function apiCreateAsset(assetPayload) {
    const res = await fetch(API_BASE_URL + '/assets.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(assetPayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menyimpan aset baru ke database.');
    }
    return data.data;
  }

  async function apiUpdateAsset(id, updates) {
    const res = await fetch(API_BASE_URL + '/assets.php?id=' + encodeURIComponent(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.assign({ id: id }, updates))
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memperbarui aset di database.');
    }
    return data.data;
  }

  async function apiDeleteAsset(id) {
    const res = await fetch(API_BASE_URL + '/assets.php?id=' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus aset dari database.');
    }
    return true;
  }

  async function apiFetchSatdik() {
    const res = await fetch(API_BASE_URL + '/satdik.php', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal memuat daftar Satdik.');
    }
    return data.data;
  }

  window.SARPRAS_API = {
    API_BASE_URL: API_BASE_URL,
    checkBackendHealth: checkBackendHealth,
    apiLogin: apiLogin,
    apiFetchAssets: apiFetchAssets,
    apiCreateAsset: apiCreateAsset,
    apiUpdateAsset: apiUpdateAsset,
    apiDeleteAsset: apiDeleteAsset,
    apiFetchSatdik: apiFetchSatdik
  };
})(window);
