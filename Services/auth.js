/**
 * ============================================================================
 * SARPRAS KKP — Modul Autentikasi & Manajemen Sesi Pengguna (RBAC)
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 */
(function (window) {
  'use strict';

  const SESSION_KEY = 'kkp_auth_session_v2';

  // Daftar Akun & Hak Akses Pengguna SARPRAS KKP (1 Admin Pusat + 18 Satdik KKP)
  // Kementerian Kelautan dan Perikanan Republik Indonesia
  const AUTH_USERS = [
    {
      id: 'USR-001',
      name: 'Admin Sarpras Pusdik KP',
      nip: '198501012010011001',
      email: 'admin.pusdik@kkp.go.id',
      password: 'pusdik',
      role: 'admin_pusdik',
      roleLabel: 'Admin Pusat (Pusdik KP)',
      jabatan: 'Koordinator Kelompok Sarana dan Prasarana Pusdik KP',
      unitKerja: 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP',
      accessibleSatdik: 'ALL',
      satdikName: 'Seluruh Satuan Pendidikan (18 Kampus KKP)',
      permissions: ['view_all', 'edit_all', 'delete', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-01',
      name: 'Admin Sarpras Politeknik AUP Jakarta',
      nip: '198602112011011001',
      email: 'sarpras.aup@kkp.go.id',
      password: 'aup',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Politeknik AUP',
      jabatan: 'Kepala Subbagian Umum & Sarpras Politeknik AUP',
      unitKerja: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
      accessibleSatdik: 'poltek-aup',
      satdikName: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-02',
      name: 'Admin Sarpras Politeknik KP Sidoarjo',
      nip: '198703122012011002',
      email: 'sarpras.sidoarjo@kkp.go.id',
      password: 'sidoarjo',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Sidoarjo',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Sidoarjo',
      accessibleSatdik: 'poltek-kp-sidoarjo',
      satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-03',
      name: 'Admin Sarpras Politeknik KP Bitung',
      nip: '198804132013011003',
      email: 'sarpras.bitung@kkp.go.id',
      password: 'bitung',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Bitung',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Bitung',
      accessibleSatdik: 'poltek-kp-bitung',
      satdikName: 'Politeknik Kelautan dan Perikanan Bitung',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-04',
      name: 'Admin Sarpras Politeknik KP Sorong',
      nip: '198905142014011004',
      email: 'sarpras.polteksorong@kkp.go.id',
      password: 'polteksorong',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Sorong',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Sorong',
      accessibleSatdik: 'poltek-kp-sorong',
      satdikName: 'Politeknik Kelautan dan Perikanan Sorong',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-05',
      name: 'Admin Sarpras Politeknik KP Karawang',
      nip: '199006152015011005',
      email: 'sarpras.karawang@kkp.go.id',
      password: 'karawang',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Karawang',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Karawang',
      accessibleSatdik: 'poltek-kp-karawang',
      satdikName: 'Politeknik Kelautan dan Perikanan Karawang',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-06',
      name: 'Admin Sarpras Politeknik KP Bone',
      nip: '199107162016011006',
      email: 'sarpras.bone@kkp.go.id',
      password: 'bone',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Bone',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Bone',
      accessibleSatdik: 'poltek-kp-bone',
      satdikName: 'Politeknik Kelautan dan Perikanan Bone',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-07',
      name: 'Admin Sarpras Politeknik KP Kupang',
      nip: '199208172017011007',
      email: 'sarpras.kupang@kkp.go.id',
      password: 'kupang',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Kupang',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Kupang',
      accessibleSatdik: 'poltek-kp-kupang',
      satdikName: 'Politeknik Kelautan dan Perikanan Kupang',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-08',
      name: 'Admin Sarpras Politeknik KP Dumai',
      nip: '199309182018011008',
      email: 'sarpras.dumai@kkp.go.id',
      password: 'dumai',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Dumai',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Dumai',
      accessibleSatdik: 'poltek-kp-dumai',
      satdikName: 'Politeknik Kelautan dan Perikanan Dumai',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-09',
      name: 'Admin Sarpras Politeknik KP Pangandaran',
      nip: '199410192019011009',
      email: 'sarpras.pangandaran@kkp.go.id',
      password: 'pangandaran',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Pangandaran',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Pangandaran',
      accessibleSatdik: 'poltek-kp-pangandaran',
      satdikName: 'Politeknik Kelautan dan Perikanan Pangandaran',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-10',
      name: 'Admin Sarpras Politeknik KP Jembrana',
      nip: '199511202020011010',
      email: 'sarpras.jembrana@kkp.go.id',
      password: 'jembrana',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — Poltek KP Jembrana',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Politeknik Kelautan dan Perikanan Jembrana',
      accessibleSatdik: 'poltek-kp-jembrana',
      satdikName: 'Politeknik Kelautan dan Perikanan Jembrana',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-11',
      name: 'Admin Sarpras AK-KP Wakatobi',
      nip: '199612212021011011',
      email: 'sarpras.wakatobi@kkp.go.id',
      password: 'wakatobi',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — AK-KP Wakatobi',
      jabatan: 'Pengelola Sarana dan Prasarana Kampus',
      unitKerja: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi',
      accessibleSatdik: 'ak-kp-wakatobi',
      satdikName: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-12',
      name: 'Admin Sarpras SUPM Ladong',
      nip: '198701222012011012',
      email: 'sarpras.ladong@kkp.go.id',
      password: 'ladong',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Ladong',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Ladong Aceh',
      accessibleSatdik: 'supm-ladong',
      satdikName: 'SUPM Negeri Ladong Aceh',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-13',
      name: 'Admin Sarpras SUPM Pariaman',
      nip: '198802232013011013',
      email: 'sarpras.pariaman@kkp.go.id',
      password: 'pariaman',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Pariaman',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Pariaman',
      accessibleSatdik: 'supm-pariaman',
      satdikName: 'SUPM Negeri Pariaman',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-14',
      name: 'Admin Sarpras SUPM Kota Agung',
      nip: '198903242014011014',
      email: 'sarpras.kotaagung@kkp.go.id',
      password: 'kotaagung',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Kota Agung',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Kota Agung',
      accessibleSatdik: 'supm-kota-agung',
      satdikName: 'SUPM Negeri Kota Agung',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-15',
      name: 'Admin Sarpras SUPM Tegal',
      nip: '199004252015011015',
      email: 'sarpras.tegal@kkp.go.id',
      password: 'tegal',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Tegal',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Tegal',
      accessibleSatdik: 'supm-tegal',
      satdikName: 'SUPM Negeri Tegal',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-16',
      name: 'Admin Sarpras SUPM Pontianak',
      nip: '199105262016011016',
      email: 'sarpras.pontianak@kkp.go.id',
      password: 'pontianak',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Pontianak',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Pontianak',
      accessibleSatdik: 'supm-pontianak',
      satdikName: 'SUPM Negeri Pontianak',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-17',
      name: 'Admin Sarpras SUPM Waiheru Ambon',
      nip: '199206272017011017',
      email: 'sarpras.waiheru@kkp.go.id',
      password: 'waiheru',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Waiheru',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Waiheru Ambon',
      accessibleSatdik: 'supm-waiheru',
      satdikName: 'SUPM Negeri Waiheru Ambon',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
    },
    {
      id: 'USR-SAT-18',
      name: 'Admin Sarpras SUPM Sorong',
      nip: '199307282018011018',
      email: 'sarpras.supmsorong@kkp.go.id',
      password: 'supmsorong',
      role: 'operator_kampus',
      roleLabel: 'Operator Satdik — SUPM Sorong',
      jabatan: 'Pengelola Sarana dan Prasarana Sekolah',
      unitKerja: 'SUPM Negeri Sorong',
      accessibleSatdik: 'supm-sorong',
      satdikName: 'SUPM Negeri Sorong',
      permissions: ['view_all', 'edit_own', 'request_maintenance', 'export_reports'],
      avatarUrl: ''
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
