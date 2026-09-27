// Daftar Akun & Hak Akses Pengguna SIM-SARPRAS KKP
// Kementerian Kelautan dan Perikanan Republik Indonesia

export const AUTH_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Ir. I Nyoman Radiarta, M.Sc.',
    nip: '19730412 199803 1 002',
    email: 'admin.bppsdm@kkp.go.id',
    password: 'admin',
    role: 'super_admin',
    roleLabel: 'Super Admin BPPSDM KP',
    jabatan: 'Kepala Badan Penyuluhan & Pengembangan SDM KP',
    unitKerja: 'Kantor Pusat BPPSDM KP - Gedung Mina Bahari III Jakarta',
    accessibleSatdik: 'ALL', // Hak akses seluruh 18 kampus
    permissions: ['view_all', 'edit_all', 'delete', 'approve_budget', 'export_rka'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'USR-002',
    name: 'Ahmad Fauzi, S.St.Pi., M.M.',
    nip: '19820516 200604 1 003',
    email: 'operator.aup@kkp.go.id',
    password: 'aup',
    role: 'operator_kampus',
    roleLabel: 'Operator BMN Politeknik AUP',
    jabatan: 'Koordinator Pengelolaan Sarpras & BMN Kampus AUP',
    unitKerja: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
    accessibleSatdik: 'poltek-aup', // Terbatas pada Politeknik AUP
    satdikName: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
    permissions: ['view_own', 'edit_own', 'request_maintenance'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'USR-003',
    name: 'Siti Rohmah, S.Pi., M.Tr.Pi.',
    nip: '19871104 201012 2 002',
    email: 'operator.tegal@kkp.go.id',
    password: 'tegal',
    role: 'operator_kampus',
    roleLabel: 'Operator BMN SUPM Tegal',
    jabatan: 'Staf Urusan Sarpras & Bengkel Praktik',
    unitKerja: 'Sekolah Usaha Perikanan Menengah (SUPM) Tegal',
    accessibleSatdik: 'supm-tegal',
    satdikName: 'SUPM Tegal',
    permissions: ['view_own', 'edit_own', 'request_maintenance'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'USR-004',
    name: 'Bambang Tri Setiawan, Ak., M.Ak.',
    nip: '19790822 200312 1 004',
    email: 'auditor.itjen@kkp.go.id',
    password: 'itjen',
    role: 'auditor',
    roleLabel: 'Auditor Itjen KKP',
    jabatan: 'Auditor Madya Inspektorat IV Bidang SDM & Aparatur',
    unitKerja: 'Inspektorat Jenderal Kementerian Kelautan dan Perikanan',
    accessibleSatdik: 'ALL',
    permissions: ['view_all', 'audit_mode', 'export_reports'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  }
];

// Helper to authenticate user
export function authenticateUser(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  return AUTH_USERS.find(u => 
    (u.email.toLowerCase() === cleanId || u.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) &&
    u.password === cleanPass
  );
}
