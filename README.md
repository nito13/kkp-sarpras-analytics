# ⚓ SIM-SARPRAS KKP — Sistem Informasi Analitik Sarana & Prasarana Satuan Pendidikan Tinggi KKP

Aplikasi web analitik terpusat untuk memantau, mengelola, dan menganalisis aset sarana dan prasarana pendidikan pada **11 Satuan Pendidikan Tinggi (Politeknik KP & Akademi Komunitas KP)** di bawah naungan **BPPSDM KP — Kementerian Kelautan dan Perikanan RI**.

---

## 📁 Struktur Direktori Projek (Clean Architecture — Tanpa Build Step)

Projek ini telah dirapikan menggunakan struktur modular **HTML + CSS + JavaScript Murni + PHP Native** (serupa dengan arsitektur `C:\laragon\www\Coba`) sehingga **tidak memerlukan Node.js / Vite / `npm run build`**. Setiap perubahan pada kode dapat langsung terlihat saat halaman di-*refresh* di browser.

```text
kkp-sarpras-analytics/
├── index.html                  # Halaman utama aplikasi (HTML5 + struktur root)
├── index.php                   # Entry point Laragon / Apache (memuat index.html)
├── .htaccess                   # Konfigurasi routing Apache & REST API
├── assets/
│   ├── logo-kkp.png            # Logo resmi KKP (PNG)
│   ├── logo-kkp.svg            # Logo resmi KKP (SVG)
│   ├── css/
│   │   ├── tailwind.min.css    # Utility stylesheet Tailwind CSS (pre-compiled)
│   │   ├── leaflet.css         # Stylesheet peta interaktif Leaflet
│   │   └── style.css           # Custom CSS, Glassmorphism, & Tema Siang/Malam (Light/Dark Mode)
│   └── js/
│       ├── data.js             # Data master 11 Satdik KKP, 6 Kategori Sarpras, & Generator Aset
│       ├── auth.js             # Manajemen autentikasi pengguna, sesi, & hak akses (RBAC)
│       ├── api.js              # Klien HTTP (Fetch API) ke backend PHP + fallback offline otomatis
│       ├── excel-export.js     # Modul ekspor laporan Excel (.xlsx) multi-sheet berwarna
│       ├── app.js              # Logika utama UI, Dasbor Eksekutif, Peta GIS, Eksplorasi, & Modal CRUD
│       └── vendor/
│           ├── chart.umd.min.js # Library visualisasi grafik Chart.js
│           ├── leaflet.js       # Library peta geospasial Leaflet.js
│           └── xlsx.bundle.js   # Library pembuat laporan Excel (xlsx-js-style)
├── api/
│   ├── health.php              # Endpoint cek status koneksi database MySQL
│   ├── auth.php                # Endpoint autentikasi login pengguna
│   ├── satdik.php              # Endpoint daftar Satuan Pendidikan & Program Studi
│   └── assets.php              # Endpoint CRUD (GET, POST, PUT, DELETE) aset sarpras
├── config/
│   └── database.php            # Konfigurasi koneksi PDO MySQL & helper response JSON
└── database/
    ├── setup_database_lengkap.sql  # File SQL satu-klik (DDL + Data Awal) untuk phpMyAdmin / HeidiSQL
    ├── buat_database_otomatis.bat  # Script klik-dua-kali pembuat database otomatis di Laragon
    ├── schema.sql                  # Skema tabel relasional MySQL
    ├── seed.php                    # Seeder data awal via PHP CLI
    └── setup_db.bat                # Script inisialisasi skema & seeder
```

---

## 🚀 Cara Menjalankan & Mengubah Kode

### 1. Menjalankan di Laragon
1. Pastikan **Laragon** (Apache & MySQL) sudah berstatus **Running**.
2. Untuk membuat database MySQL secara otomatis (opsional, aplikasi tetap berjalan dalam *Mode Offline/Local* jika database belum aktif):
   - Klik dua kali file `database/buat_database_otomatis.bat`, **ATAU**
   - Import file `database/setup_database_lengkap.sql` melalui **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Buka browser dan akses:
   - `http://localhost/kkp-sarpras-analytics/kkp-sarpras-analytics/` atau `http://localhost/kkp-sarpras-analytics/`

### 2. Memantau & Mengubah Kode Secara Langsung
- **Ubah Tampilan / Warna / Tema**: Edit langsung `assets/css/style.css` atau `index.html`.
- **Ubah Data Satdik / Aset Default**: Edit langsung `assets/js/data.js`.
- **Ubah Akun Login**: Edit langsung `assets/js/auth.js`.
- **Ubah Fitur Dasbor, Peta, Tabel, atau Modal**: Edit langsung `assets/js/app.js`.
- **Ubah Koneksi Database / Endpoint API**: Edit langsung `config/database.php` atau file di dalam `api/`.
- Cukup tekan **Ctrl + F5** di browser untuk melihat hasil perubahan tanpa perlu proses *build*.
