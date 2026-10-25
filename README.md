# ⚓ SIM-SARPRAS KKP — Sistem Informasi Analitik Sarana & Prasarana Satuan Pendidikan Tinggi KKP

Aplikasi web analitik terpusat untuk memantau, mengelola, dan menganalisis aset sarana dan prasarana pendidikan pada **18 Satuan Pendidikan Vokasi KKP** di bawah naungan **BPPSDM KP — Kementerian Kelautan dan Perikanan RI**.

---

## 📁 Struktur Direktori Projek (6 Modul Utama)

Projek ini telah disusun dalam 6 domain modular: **Frontend**, **Backend**, **Database**, **APIs**, **Services**, dan **Monitoring**, sehingga terorganisir rapi dengan pemisahan tanggung jawab (Separation of Concerns) yang jelas serta tetap mendukung model **Zero-Build (HTML + CSS + JS Murni + PHP Native)** di Laragon.

```text
kkp-sarpras-analytics/
├── index.html                      # Entry point UI utama (memuat komponen Frontend & Services)
├── index.php                       # Entry point Apache / Laragon
├── .htaccess                       # Routing rewrite Apache (APIs, Monitoring, Frontend, Services)
│
├── 🖥️ Frontend/                    # DOMAIN 1: Antarmuka Pengguna & Tampilan Visual
│   ├── index.html                  # Template utama antarmuka SPA
│   ├── README.md                   # Dokumentasi modul Frontend
│   └── assets/
│       ├── logo-kkp.png            # Logo resmi KKP
│       ├── logo-kkp.svg            # Logo resmi format vektor SVG
│       ├── app.js                  # Logika utama UI React: Navbar, Dashboard, Peta GIS, Explorer, Modal
│       ├── css/
│       │   ├── tailwind.min.css    # Utility stylesheet Tailwind CSS
│       │   ├── leaflet.css         # Stylesheet peta interaktif Leaflet
│       │   └── style.css           # Custom Glassmorphism, Theme Siang/Malam
│       └── vendor/
│           ├── react-vendor.min.js # React 18, ReactDOM, & Lucide Icons bundle
│           ├── leaflet.js          # Library Leaflet GIS Map
│           ├── xlsx.bundle.js      # Library SheetJS Excel
│           ├── icons.svg           # Sprite SVG iconografi dinas
│           └── favicon.svg         # Tab browser icon
│
├── ⚙️ Backend/                     # DOMAIN 2: Inti Server-Side & Konfigurasi
│   ├── index.php                   # Gateway & Pusat Informasi Layanan Backend
│   ├── README.md                   # Dokumentasi modul Backend
│   └── config/
│       └── database.php            # Konfigurasi PDO MySQL Laragon, CORS headers, & jsonResponse helper
│
├── 🗄️ Database/                    # DOMAIN 3: Basis Data Relasional, Skema & Seeder
│   ├── schema.sql                  # Skema DDL tabel MySQL: satdik, users, assets
│   ├── seed.php                    # CLI seeder otomatis via PHP PDO
│   ├── seed_data.json              # Dataset lengkap 18 Satdik, pengguna RBAC, & inventaris aset
│   ├── backup_kkp_sarpras_db.sql   # SQL dump backup database utama
│   ├── backup_monitoring_sarpras.sql # SQL dump backup database riwayat monitoring
│   └── README.md                   # Dokumentasi modul Database
│
├── 🌐 APIs/                        # DOMAIN 4: Titik Akhir REST API
│   ├── assets.php                  # Endpoint CRUD data sarana & prasarana (GET, POST, PUT, DELETE)
│   ├── auth.php                    # Endpoint otentikasi login pengguna dinas KKP
│   ├── satdik.php                  # Endpoint master data 18 kampus Politeknik & SUPM KKP
│   └── README.md                   # Spesifikasi kontrak REST API
│
├── 💼 Services/                    # DOMAIN 5: Lapisan Logika Bisnis & Layanan Pendukung
│   ├── api.js                      # HTTP Client (Fetch API) dengan pendeteksi status offline & auto-fallback
│   ├── auth.js                     # Layanan otentikasi, sesi login browser (localStorage/sessionStorage), RBAC
│   ├── data.js                     # Master dataset 18 Satdik, 25 Prodi, kalkulasi analitik KPI & target nasional
│   ├── excel-export.js             # Generator laporan resmi Microsoft Excel (.xlsx) dengan kop dinas KKP
│   └── README.md                   # Dokumentasi modul Services
│
└── 📡 Monitoring/                  # DOMAIN 6: Pemantauan Kesehatan Sistem & Telemetri
    ├── health.php                  # Endpoint health check real-time (koneksi MySQL, latensi, counter record)
    ├── diagnostic.php              # Utilitas diagnosa lengkap lingkungan PHP, ekstensi, & izin folder
    └── README.md                   # Dokumentasi modul Monitoring
```

---

## 🚀 Cara Menjalankan Aplikasi di Laragon

1. **Jalankan Laragon**:
   - Pastikan **Apache** dan **MySQL** berstatus **Running** (tombol *Start All* di Laragon).

2. **Inisialisasi Database (Opsional)**:
   - Jika ingin menggunakan database MySQL, jalankan CLI seeder melalui Laragon Terminal:
     ```bash
     php -f Database/seed.php
     ```
   - *Catatan: Jika database MySQL belum dijalankan, aplikasi tetap dapat beroperasi normal 100% menggunakan Local Storage & Dataset Master bawaan.*

3. **Akses Aplikasi**:
   - Buka browser dan arahkan ke:
     - `http://localhost/kkp-sarpras-analytics/` atau
     - `http://localhost/kkp-sarpras-analytics/kkp-sarpras-analytics/`

4. **Diagnosa & Pemantauan**:
   - Uji koneksi database: `http://localhost/kkp-sarpras-analytics/kkp-sarpras-analytics/Monitoring/health.php`
   - Cek diagnosa sistem: `http://localhost/kkp-sarpras-analytics/kkp-sarpras-analytics/Monitoring/diagnostic.php`
