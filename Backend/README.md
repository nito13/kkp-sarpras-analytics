# ⚙️ Modul Backend — SIM-SARPRAS KKP

Folder `Backend` bertindak sebagai inti server-side (Server-Side Core) untuk aplikasi SIM-SARPRAS KKP. Modul ini bertanggung jawab atas konfigurasi koneksi database, response payload formatting, handling CORS, dan manajemen gateway server.

---

## 📁 Struktur File & Direktori

```text
Backend/
├── index.php               # Gateway & API Information Center (JSON Response)
├── config/
│   └── database.php        # Konfigurasi koneksi PDO MySQL Laragon, CORS headers, & jsonResponse helper
└── README.md               # Dokumentasi modul Backend
```

---

## 🔑 Fungsi Kunci `Backend/config/database.php`

1. **`getDbConnection($selectDb = true)`**:
   Membuka koneksi PDO ke MySQL Laragon pada `127.0.0.1:3306` dengan opsi `ERRMODE_EXCEPTION`, `FETCH_ASSOC`, dan `EMULATE_PREPARES => false`.
2. **`jsonResponse($data, $statusCode = 200)`**:
   Mengirimkan header HTTP status code dan header `Content-Type: application/json; charset=utf-8` dengan serialisasi JSON terformat (`JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE`).
3. **CORS Handling**:
   Menangani HTTP Preflight `OPTIONS` serta mengizinkan request cross-origin untuk pengembangan lokal.
