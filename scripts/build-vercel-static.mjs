import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const bladePath = path.join(rootDir, 'resources', 'views', 'app.blade.php');

// 1. Bersihkan dan buat ulang folder dist/
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// 2. Salin aset statis publik (assets/, Templates/, favicon.ico)
for (const rel of ['assets', 'Templates']) {
  const src = path.join(publicDir, rel);
  const dest = path.join(distDir, rel);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

for (const file of ['favicon.ico', 'robots.txt']) {
  const src = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

// 3. Buat shim khusus Demo Statis Vercel (hanya ada di dist/, tidak menyentuh Laravel public/)
const staticDemoShim = `/**
 * Static Demo Mode Shim (Vercel Preview Only)
 * Mengaktifkan login & penyimpanan localStorage saat aplikasi dijalankan tanpa backend PHP/MySQL.
 */
(function (window) {
  'use strict';
  window.__STATIC_DEMO_MODE = true;

  const adminPerms = ['view_all', 'edit_all', 'delete', 'manage_users', 'view_audit_logs', 'manage_database', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports', 'full_control'];
  const pusdikPerms = ['view_all', 'edit_all', 'delete', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports'];
  const operatorPerms = ['view_all', 'edit_own', 'request_maintenance', 'export_reports'];

  const DEMO_ACCOUNTS = [
    { id: 'USR-ADMIN', name: 'Super Administrator Sistem Sarpras KP', nip: '198001012005011001', email: 'administrator@kkp.go.id', pw: 'administrator', role: 'administrator', roleLabel: 'Administrator Utama (Full Control)', jabatan: 'Super Administrator Sistem & Database Sarpras KP', unitKerja: 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP', accessibleSatdik: 'ALL', satdikName: 'Seluruh Satuan Pendidikan (18 Kampus KKP) — Kendali Penuh', permissions: adminPerms },
    { id: 'USR-001', name: 'Admin Sarpras Pusdik KP', nip: '198503122009011002', email: 'admin.pusdik@kkp.go.id', pw: 'pusdik', role: 'admin_pusdik', roleLabel: 'Admin Pusat (Pusdik KP)', jabatan: 'Koordinator Kelompok Sarana dan Prasarana Pusdik KP', unitKerja: 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP', accessibleSatdik: 'ALL', satdikName: 'Seluruh Satuan Pendidikan (18 Kampus KKP)', permissions: pusdikPerms },
    { id: 'USR-SAT-01', name: 'Admin Sarpras Politeknik AUP Jakarta', nip: '198601012010011001', email: 'sarpras.aup@kkp.go.id', pw: 'aup', role: 'operator_kampus', roleLabel: 'Operator Satdik — Politeknik AUP', jabatan: 'Kepala Subbagian Umum & Sarpras Politeknik AUP', unitKerja: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta', accessibleSatdik: 'poltek-aup', satdikName: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta', permissions: operatorPerms },
    { id: 'USR-SAT-02', name: 'Admin Sarpras Politeknik KP Sidoarjo', nip: '198602012010011002', email: 'sarpras.sidoarjo@kkp.go.id', pw: 'sidoarjo', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Sidoarjo', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Sidoarjo', accessibleSatdik: 'poltek-kp-sidoarjo', satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo', permissions: operatorPerms },
    { id: 'USR-SAT-03', name: 'Admin Sarpras Politeknik KP Bitung', nip: '198603012010011003', email: 'sarpras.bitung@kkp.go.id', pw: 'bitung', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Bitung', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Bitung', accessibleSatdik: 'poltek-kp-bitung', satdikName: 'Politeknik Kelautan dan Perikanan Bitung', permissions: operatorPerms },
    { id: 'USR-SAT-04', name: 'Admin Sarpras Politeknik KP Sorong', nip: '198604012010011004', email: 'sarpras.polteksorong@kkp.go.id', pw: 'polteksorong', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Sorong', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Sorong', accessibleSatdik: 'poltek-kp-sorong', satdikName: 'Politeknik Kelautan dan Perikanan Sorong', permissions: operatorPerms },
    { id: 'USR-SAT-05', name: 'Admin Sarpras Politeknik KP Karawang', nip: '198605012010011005', email: 'sarpras.karawang@kkp.go.id', pw: 'karawang', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Karawang', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Karawang', accessibleSatdik: 'poltek-kp-karawang', satdikName: 'Politeknik Kelautan dan Perikanan Karawang', permissions: operatorPerms },
    { id: 'USR-SAT-06', name: 'Admin Sarpras Politeknik KP Bone', nip: '198606012010011006', email: 'sarpras.bone@kkp.go.id', pw: 'bone', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Bone', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Bone', accessibleSatdik: 'poltek-kp-bone', satdikName: 'Politeknik Kelautan dan Perikanan Bone', permissions: operatorPerms },
    { id: 'USR-SAT-07', name: 'Admin Sarpras Politeknik KP Kupang', nip: '198607012010011007', email: 'sarpras.kupang@kkp.go.id', pw: 'kupang', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Kupang', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Kupang', accessibleSatdik: 'poltek-kp-kupang', satdikName: 'Politeknik Kelautan dan Perikanan Kupang', permissions: operatorPerms },
    { id: 'USR-SAT-08', name: 'Admin Sarpras Politeknik KP Dumai', nip: '198608012010011008', email: 'sarpras.dumai@kkp.go.id', pw: 'dumai', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Dumai', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Dumai', accessibleSatdik: 'poltek-kp-dumai', satdikName: 'Politeknik Kelautan dan Perikanan Dumai', permissions: operatorPerms },
    { id: 'USR-SAT-09', name: 'Admin Sarpras Politeknik KP Pangandaran', nip: '198609012010011009', email: 'sarpras.pangandaran@kkp.go.id', pw: 'pangandaran', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Pangandaran', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Pangandaran', accessibleSatdik: 'poltek-kp-pangandaran', satdikName: 'Politeknik Kelautan dan Perikanan Pangandaran', permissions: operatorPerms },
    { id: 'USR-SAT-10', name: 'Admin Sarpras Politeknik KP Jembrana', nip: '198610012010011010', email: 'sarpras.jembrana@kkp.go.id', pw: 'jembrana', role: 'operator_kampus', roleLabel: 'Operator Satdik — Poltek KP Jembrana', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Politeknik Kelautan dan Perikanan Jembrana', accessibleSatdik: 'poltek-kp-jembrana', satdikName: 'Politeknik Kelautan dan Perikanan Jembrana', permissions: operatorPerms },
    { id: 'USR-SAT-11', name: 'Admin Sarpras AK-KP Wakatobi', nip: '198611012010011011', email: 'sarpras.wakatobi@kkp.go.id', pw: 'wakatobi', role: 'operator_kampus', roleLabel: 'Operator Satdik — AK-KP Wakatobi', jabatan: 'Pengelola Sarana dan Prasarana Kampus', unitKerja: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', accessibleSatdik: 'akkp-wakatobi', satdikName: 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', permissions: operatorPerms },
    { id: 'USR-SAT-12', name: 'Admin Sarpras SUPM Ladong', nip: '198612012010011012', email: 'sarpras.ladong@kkp.go.id', pw: 'ladong', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Ladong', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Ladong Aceh', accessibleSatdik: 'supm-ladong', satdikName: 'SUPM Negeri Ladong Aceh', permissions: operatorPerms },
    { id: 'USR-SAT-13', name: 'Admin Sarpras SUPM Pariaman', nip: '198701012010011013', email: 'sarpras.pariaman@kkp.go.id', pw: 'pariaman', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Pariaman', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Pariaman', accessibleSatdik: 'supm-pariaman', satdikName: 'SUPM Negeri Pariaman', permissions: operatorPerms },
    { id: 'USR-SAT-14', name: 'Admin Sarpras SUPM Kota Agung', nip: '198702012010011014', email: 'sarpras.kotaagung@kkp.go.id', pw: 'kotaagung', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Kota Agung', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Kota Agung', accessibleSatdik: 'supm-kotaagung', satdikName: 'SUPM Negeri Kota Agung', permissions: operatorPerms },
    { id: 'USR-SAT-15', name: 'Admin Sarpras SUPM Tegal', nip: '198703012010011015', email: 'sarpras.tegal@kkp.go.id', pw: 'tegal', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Tegal', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Tegal', accessibleSatdik: 'supm-tegal', satdikName: 'SUPM Negeri Tegal', permissions: operatorPerms },
    { id: 'USR-SAT-16', name: 'Admin Sarpras SUPM Pontianak', nip: '198704012010011016', email: 'sarpras.pontianak@kkp.go.id', pw: 'pontianak', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Pontianak', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Pontianak', accessibleSatdik: 'supm-pontianak', satdikName: 'SUPM Negeri Pontianak', permissions: operatorPerms },
    { id: 'USR-SAT-17', name: 'Admin Sarpras SUPM Waiheru Ambon', nip: '198705012010011017', email: 'sarpras.waiheru@kkp.go.id', pw: 'waiheru', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Waiheru', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Waiheru Ambon', accessibleSatdik: 'supm-waiheru', satdikName: 'SUPM Negeri Waiheru Ambon', permissions: operatorPerms },
    { id: 'USR-SAT-18', name: 'Admin Sarpras SUPM Sorong', nip: '198706012010011018', email: 'sarpras.supmsorong@kkp.go.id', pw: 'supmsorong', role: 'operator_kampus', roleLabel: 'Operator Satdik — SUPM Sorong', jabatan: 'Pengelola Sarana dan Prasarana Sekolah', unitKerja: 'SUPM Negeri Sorong', accessibleSatdik: 'supm-sorong', satdikName: 'SUPM Negeri Sorong', permissions: operatorPerms }
  ];

  function toPublicUser(acc) {
    const copy = Object.assign({}, acc);
    delete copy.pw;
    return copy;
  }

  if (window.SARPRAS_API) {
    window.SARPRAS_API.checkBackendHealth = async function () {
      return { online: false, isConnected: false, mode: 'static-demo' };
    };

    window.SARPRAS_API.apiLogin = async function (identifier, password) {
      const idNorm = String(identifier || '').trim().toLowerCase();
      const pwRaw = String(password || '');
      const found = DEMO_ACCOUNTS.find(function (u) {
        return (u.email.toLowerCase() === idNorm || u.nip === idNorm || u.id.toLowerCase() === idNorm) && u.pw === pwRaw;
      });
      if (!found) {
        throw new Error('Email / NIP atau kata sandi tidak cocok pada Mode Demo Statis.');
      }
      return { success: true, user: toPublicUser(found) };
    };

    window.SARPRAS_API.apiFetchUsers = async function () {
      return { success: true, users: DEMO_ACCOUNTS.map(toPublicUser) };
    };
  }
})(window);
`;

fs.writeFileSync(path.join(distDir, 'assets', 'static-demo-shim.js'), staticDemoShim, 'utf8');

// 4. Konversi resources/views/app.blade.php menjadi dist/index.html statis
let html = fs.readFileSync(bladePath, 'utf8');
html = html
  .replace(/\{\{\s*csrf_token\(\)\s*\}\}/g, '')
  .replace(/@json\(asset\(['"]([^'"]+)['"]\)\)/g, '"/$1"')
  .replace(/\{\{\s*asset\(['"]([^'"]+)['"]\)\s*\}\}/g, '/$1');

// Sisipkan static-demo-shim.js tepat sebelum app.js
html = html.replace(
  /(<script\s+src="\/assets\/app\.js[^"]*"><\/script>)/,
  '<script src="/assets/static-demo-shim.js"></script>\n    $1'
);

fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

console.log('Static Vercel build selesai -> dist/index.html + dist/assets + dist/Templates');
