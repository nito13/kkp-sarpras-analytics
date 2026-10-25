/**
 * ============================================================================
 * SARPRAS KKP — Modul Autentikasi & Manajemen Sesi Pengguna (RBAC)
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 */
(function (window) {
  'use strict';

  const SESSION_KEY = 'kkp_auth_session_v2';

// Daftar Akun & Hak Akses Pengguna SARPRAS KKP
// Kementerian Kelautan dan Perikanan Republik Indonesia

  const AUTH_USERS = [
  {
    id: 'USR-001',
    name: 'Admin Sarpras Pusdik KP',
    nip: '-',
    email: 'admin.pusdik@kkp.go.id',
    password: 'pusdik',
    role: 'admin_pusdik',
    roleLabel: 'Admin Sarpras Pusdik KP',
    jabatan: 'Koordinator Kelompok Sarana dan Prasarana Pusdik KP',
    unitKerja: 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP',
    accessibleSatdik: 'ALL', // Hak akses pembinaan seluruh 18 satuan pendidikan vokasi KKP
    permissions: ['view_all', 'edit_all', 'delete', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports'],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  }
];

// Helper to authenticate user
  function authenticateUser(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  return AUTH_USERS.find(u => 
    (u.email.toLowerCase() === cleanId || (u.nip && u.nip !== '-' && u.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))) &&
    u.password === cleanPass
  );
}


  function getSavedSession() {
    try {
      const saved = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(user, rememberMe) {
    try {
      if (rememberMe !== false) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    } catch (e) {}
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  window.SARPRAS_AUTH = {
    SESSION_KEY: SESSION_KEY,
    AUTH_USERS: AUTH_USERS,
    authenticateUser: authenticateUser,
    getSavedSession: getSavedSession,
    saveSession: saveSession,
    clearSession: clearSession
  };
})(window);
