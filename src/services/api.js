// src/services/api.js
// Service layer untuk komunikasi ke Backend PHP Laragon MySQL

// Endpoint API dinamis (bekerja baik di Vite dev server port 5173 maupun Apache Laragon)
const API_BASE = (() => {
  if (typeof window === 'undefined') return '/api';
  if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
    return '/api';
  }
  if (window.location.pathname.includes('/kkp-sarpras-analytics')) {
    return '/kkp-sarpras-analytics/backend/api';
  }
  return '/backend/api';
})();


/**
 * Cek status koneksi ke backend Laragon & MySQL
 */
export async function apiCheckHealth() {
  try {
    const res = await fetch(`${API_BASE}/health.php`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000), // Timeout 3 detik
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return { isConnected: json.status === 'connected', info: json };
  } catch (err) {
    return { isConnected: false, error: err.message };
  }
}

/**
 * Mengambil seluruh data aset dari MySQL
 */
export async function apiFetchAssets(satdikFilter = 'ALL', categoryFilter = 'ALL') {
  try {
    const params = new URLSearchParams();
    if (satdikFilter && satdikFilter !== 'ALL') params.append('satdik_id', satdikFilter);
    if (categoryFilter && categoryFilter !== 'ALL') params.append('category', categoryFilter);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/assets.php${qs}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      return { success: true, data: json.data };
    }
    throw new Error(json.message || 'Format respons aset tidak valid');
  } catch (err) {
    console.warn('[API] Gagal mengambil aset dari MySQL:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Menambahkan aset baru ke MySQL
 */
export async function apiCreateAsset(asset) {
  try {
    const res = await fetch(`${API_BASE}/assets.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    const json = await res.json();
    if (res.ok && json.status === 'success') {
      return { success: true, data: json.data };
    }
    throw new Error(json.message || 'Gagal menyimpan aset ke database');
  } catch (err) {
    console.warn('[API] Gagal tambah aset ke MySQL:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Memperbarui kondisi fisik dan catatan aset di MySQL
 */
export async function apiUpdateAsset(assetId, updatePayload) {
  try {
    const res = await fetch(`${API_BASE}/assets.php?id=${encodeURIComponent(assetId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    const json = await res.json();
    if (res.ok && json.status === 'success') {
      return { success: true, data: json.data };
    }
    throw new Error(json.message || 'Gagal memperbarui aset di database');
  } catch (err) {
    console.warn('[API] Gagal update aset di MySQL:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Menghapus aset dari MySQL
 */
export async function apiDeleteAsset(assetId) {
  try {
    const res = await fetch(`${API_BASE}/assets.php?id=${encodeURIComponent(assetId)}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    const json = await res.json();
    return { success: res.ok && json.status === 'success' };
  } catch (err) {
    console.warn('[API] Gagal menghapus aset dari MySQL:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Login akun kedinasan ke database MySQL
 */
export async function apiLogin(identifier, password) {
  try {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const json = await res.json();
    if (res.ok && json.status === 'success') {
      return { success: true, user: json.user };
    }
    return { success: false, message: json.message || 'Kredensial tidak valid' };
  } catch (err) {
    console.warn('[API] Gagal otentikasi ke MySQL:', err.message);
    return { success: false, message: 'Server backend Laragon tidak dapat dijangkau', isOffline: true };
  }
}
