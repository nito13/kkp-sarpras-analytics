# 📡 Modul Monitoring — SIM-SARPRAS KKP

Folder `Monitoring` bertanggung jawab atas pemantauan operasional sistem (System Health), status koneksi basis data MySQL Laragon, metrik telemetri server, dan diagnosa lingkungan PHP.

---

## 📁 Struktur File & Direktori

```text
Monitoring/
├── health.php              # Endpoint health check real-time (koneksi MySQL, latensi, jumlah rekaman)
├── diagnostic.php          # Utilitas diagnosa komprehensif lingkungan PHP, ekstensi PDO, dan struktur folder
└── README.md               # Dokumentasi modul Monitoring
```

---

## 📑 Spesifikasi Endpoint Monitoring

### 1. `GET /Monitoring/health.php`
- **Fungsi**: Digunakan oleh frontend (`Services/api.js`) setiap kali aplikasi dimuat untuk menentukan apakah sistem berjalan dalam *Mode Online (MySQL)* atau *Mode Offline (Local Cache)*.
- **Contoh Response Sukses**:
  ```json
  {
    "status": "connected",
    "success": true,
    "database": "kkp_sarpras_db",
    "host": "127.0.0.1:3306",
    "serverTime": "2026-10-25 14:50:00",
    "counts": {
      "assets": 320,
      "satdik": 18,
      "users": 5
    }
  }
  ```

### 2. `GET /Monitoring/diagnostic.php`
- **Fungsi**: Memberikan laporan lengkap kesiapan server Laragon untuk administrator:
  - Versi PHP dan mode SAPI
  - Ketersediaan ekstensi penting (`pdo`, `pdo_mysql`, `json`, `mbstring`)
  - Status keberadaan folder arsitektur (`Frontend`, `Backend`, `Database`, `APIs`, `Services`, `Monitoring`)
  - Latensi ping basis data MySQL
  - Penggunaan memori server (Memory Usage & Peak Usage)
