# ⚓ SIM-SARPRAS KKP — Sistem Informasi Analitik Sarana & Prasarana Satuan Pendidikan Vokasi KKP (Laravel 10)

Aplikasi web analitik terpusat berbasis **Laravel 10 (PHP 8.1+)** & **React 18 SPA** untuk memantau, mengelola, dan menganalisis aset sarana dan prasarana pendidikan pada **18 Satuan Pendidikan Vokasi KKP** di bawah naungan **BPPSDM KP — Kementerian Kelautan dan Perikanan RI**.

---

## 📁 Arsitektur Projek Laravel 10

```text
kkp-sarpras-analytics/
├── app/
│   ├── Http/Controllers/Api/       # REST API Controllers (Auth, Satdik, Asrama, Gedung, Kapal, Tanah, Tambak, Standar, AuditLog, BulkImport, Document, Monitoring)
│   ├── Models/                     # 14 Eloquent ORM Models (Satdik, User, Asset, AsramaRekap, AsramaGedung, Standar*, Tambak*, TanahBidang, GedungBangunan, KapalLatih, AuditLog)
│   └── Services/                   # Domain Services (AsramaService, StandarSarprasService, TambakService, AuditLogService, SatdikMapService)
├── database/
│   ├── data/                       # Master JSON datasets (seed_data, asrama_data, standar_data, tambak_data)
│   ├── legacy/                     # Arsip skema SQL lama, backup dump, dokumentasi PDF/PPTX, & skrip ETL Python
│   ├── migrations/                 # Laravel Schema Migrations untuk seluruh 14 tabel MySQL + Sanctum
│   └── seeders/                    # Modular Laravel Seeders (Satdik, User, Asrama, StandarSarpras, Tambak, AuditLog)
├── public/
│   ├── index.php                   # Laravel Front Controller
│   ├── assets/                     # Frontend React SPA bundle, Tailwind CSS, Leaflet GIS, SheetJS, Logo KKP
│   └── Templates/                  # Template Excel Import Sarpras KKP (.xlsx)
├── resources/
│   ├── views/app.blade.php         # Blade Shell SPA utama
│   └── js/services/                # Referensi source layanan JS Frontend
├── routes/
│   ├── api.php                     # Clean REST API (/api/*) + alias .php
│   ├── legacy_api.php              # Backward-compatible routes (/APIs/*.php, /Monitoring/*.php)
│   └── web.php                     # SPA Web Route & fallback
└── tests/Feature/
    └── SarprasApiTest.php          # Automated Feature Tests seluruh endpoint
```

---

## 🚀 Cara Menjalankan di Lokal (Laragon / Artisan)

### 1. Konfigurasi Lingkungan
Pastikan MySQL Laragon aktif dan database `kkp_sarpras_db` tersedia, lalu sesuaikan `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kkp_sarpras_db
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Migrasi & Seeder Database
```bash
php artisan migrate
php artisan db:seed
```

### 3. Menjalankan Server
- **Via Laragon Auto Virtual Host**: Klik **Start All** di Laragon (Laragon otomatis mengarahkan document root ke folder `public/`), lalu buka `http://kkp-sarpras-analytics.test`.
- **Via Artisan Serve**:
  ```bash
  php artisan serve
  ```
  Lalu buka [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 4. Menjalankan Automated Tests
```bash
php artisan test
```

---

## 🌐 Daftar REST API Endpoints

Seluruh endpoint tersedia dalam format **REST Laravel modern (`/api/*`)** sekaligus tetap mendukung **alias legacy (`/APIs/*.php` & `/Monitoring/*.php`)** untuk kompatibilitas penuh dengan frontend SPA.

| Modul | REST Endpoint Laravel | Alias Kompatibilitas | Metode |
| :--- | :--- | :--- | :--- |
| **Health & Diagnostik** | `/api/health`, `/api/diagnostic` | `/Monitoring/health.php`, `/Monitoring/diagnostic.php` | `GET` |
| **Login & Pengguna (RBAC)** | `/api/auth/login`, `/api/users` | `/APIs/auth.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Master 18 Satdik** | `/api/satdik` | `/APIs/satdik.php` | `GET` |
| **Asrama Taruna** | `/api/asrama` | `/APIs/asrama.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Gedung & Bangunan** | `/api/gedung` | `/APIs/gedung.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Kapal Latih** | `/api/kapal` | `/APIs/kapal.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Bidang Tanah & Lahan** | `/api/tanah` | `/APIs/tanah.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Tambak & Kolam** | `/api/tambak-kolam` | `/APIs/tambak_kolam.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Standar Minimal Sarpras** | `/api/standar-sarpras` | `/APIs/standar_sarpras.php` | `GET`, `POST`, `PUT`, `DELETE` |
| **Audit Log Database** | `/api/audit-logs` | `/APIs/audit_logs.php` | `GET`, `POST`, `DELETE` |
| **Batch Import Excel** | `/api/bulk-import` | `/APIs/bulk_import.php` | `GET`, `POST` |
| **Gateway Dokumen Resmi** | `/api/doc?ref=...` | `/APIs/doc.php?ref=...` | `GET` |

---

## 🐳 Cara Menjalankan dengan Docker

```bash
docker compose up -d --build
```
- Aplikasi Web (Laravel 10 + Apache): [http://localhost:8080](http://localhost:8080)
- Health API: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- phpMyAdmin: [http://localhost:8081](http://localhost:8081)
