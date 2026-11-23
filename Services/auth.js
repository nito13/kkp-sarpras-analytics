/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Modul Manajemen Sesi Pengguna (RBAC)
 * Autentikasi dikelola 100% di sisi Server (PHP & MySQL Bcrypt) tanpa menyimpan kredensial di Client.
 * ============================================================================
 */
(function (window) {
  'use strict';

  const SESSION_KEY = 'kkp_auth_session_v2';

  // Kredensial akun tidak lagi disimpan di sisi client (Frontend) demi keamanan.
  const AUTH_USERS = [];

  function authenticateUser() {
    return null;
  }

  function isAdministrator(user) {
    if (!user) return false;
    return Boolean(
      user.role === 'administrator' ||
      user.role === 'super_admin' ||
      (Array.isArray(user.permissions) && (
        user.permissions.includes('full_control') ||
        user.permissions.includes('view_audit_logs')
      ))
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
    isAdministrator: isAdministrator,
    getSavedSession: getSavedSession,
    saveSession: saveSession,
    clearSession: clearSession
  };
})(window);
