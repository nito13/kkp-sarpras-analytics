// Daftar Akun & Hak Akses Pengguna SIM-SARPRAS KKP
// Kementerian Kelautan dan Perikanan Republik Indonesia

export const AUTH_USERS = [
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
export function authenticateUser(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  return AUTH_USERS.find(u => 
    (u.email.toLowerCase() === cleanId || (u.nip && u.nip !== '-' && u.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))) &&
    u.password === cleanPass
  );
}
