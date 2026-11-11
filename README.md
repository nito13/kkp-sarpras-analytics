# ⚓ Sarana dan Prasarana Satuan Pendidikan KP — Sistem Informasi Analitik Sarana & Prasarana Satuan Pendidikan Vokasi KKP

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
│   ├── Dokumentasi_Database_SARPRAS_KKP.pdf # Dokumen arsitektur database (Versi PDF)
│   ├── Dokumentasi_Database_SARPRAS_KKP.pptx # Presentasi arsitektur database (Versi PPTX)
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

## 🐳 Cara Menjalankan Aplikasi Menggunakan Docker

Projek ini sudah dilengkapi dengan konfigurasi **Docker & Docker Compose** multi-container (PHP 8.2 Apache + MySQL 8.0 + phpMyAdmin), sehingga dapat langsung dijalankan tanpa perlu menginstal Laragon, PHP, ataupun MySQL manual di sistem host.

### 1. Menjalankan Container
Buka terminal pada direktori proyek ini, lalu jalankan:
```bash
docker compose up -d --build
```
> *Catatan:* Perintah di atas akan otomatis mengunduh image, membangun web server, menyalakan database MySQL, mengeksekusi skema tabel, dan menjalankan seeder otomatis (`Database/seed.php`).

### 2. Akses Layanan Melalui Browser
| Layanan | URL Browser | Keterangan |
| :--- | :--- | :--- |
| **Aplikasi Sarana dan Prasarana Satuan Pendidikan KP** | [http://localhost:8080](http://localhost:8080) | Antarmuka web utama analitik sarpras |
| **Pemeriksaan Health API** | [http://localhost:8080/Monitoring/health.php](http://localhost:8080/Monitoring/health.php) | Status koneksi PDO MySQL & counter aset |
| **Diagnosa Sistem** | [http://localhost:8080/Monitoring/diagnostic.php](http://localhost:8080/Monitoring/diagnostic.php) | Diagnosa ekstensi PHP, latensi & memori |
| **phpMyAdmin** | [http://localhost:8081](http://localhost:8081) | Web GUI database (User: `root`, Pass: `rootpassword`) |

### 3. Kredensial Database Docker
- **Host dari dalam container**: `db`
- **Host dari komputer Anda (Navicat/DBeaver/HeidiSQL)**: `127.0.0.1` port `3307`
- **Database**: `kkp_sarpras_db`
- **User**: `root`
- **Password**: `rootpassword`

*(Port external disetel ke `3307` dan port web ke `8080` agar tidak bentrok jika Laragon lokal Anda sedang aktif).*

### 4. Perintah Tambahan Docker
- **Melihat status container**:
  ```bash
  docker compose ps
  ```
- **Melihat log real-time**:
  ```bash
  docker compose logs -f
  ```
- **Menjalankan ulang seeder database secara manual**:
  ```bash
  docker compose exec web php Database/seed.php
  ```
- **Menghentikan container**:
  ```bash
  docker compose down
  ```
- **Menghentikan & menghapus volume database (reset data)**:
  ```bash
  docker compose down -v
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
