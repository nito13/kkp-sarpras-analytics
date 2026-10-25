# 🌐 Modul APIs — SIM-SARPRAS KKP

Folder `APIs` berisi titik akhir antarmuka program aplikasi (REST API Endpoints) berbasis PHP Native yang melayani pertukaran data JSON antara Frontend dan Database MySQL.

---

## 📁 Daftar Endpoint REST API

```text
APIs/
├── assets.php              # REST API CRUD data sarana & prasarana (GET, POST, PUT, DELETE)
├── auth.php                # REST API Autentikasi akun pengguna & verifikasi password
├── satdik.php              # REST API Master data 18 Satuan Pendidikan Vokasi KKP
└── README.md               # Dokumentasi kontrak REST API
```

---

## 📑 Spesifikasi Kontrak Endpoint

### 1. `GET /APIs/assets.php`
- **Query Parameter**:
  - `id` (opsional): Mengambil 1 aset berdasarkan ID
  - `satdik_id` (opsional): Filter aset berdasarkan kampus vokasi KKP
  - `category` (opsional): Filter aset berdasarkan bidang/kategori sarpras
- **Response**: Array JSON data aset dengan properti camelCase (`id`, `name`, `satdikId`, `condition`, dll.).

### 2. `POST /APIs/assets.php`
- **Body JSON**: Objek aset baru (`name`, `satdikId`, `category`, `condition`, `acquisitionYear`, dll.)
- **Response**: Status 201 Created dengan objek aset yang tersimpan.

### 3. `PUT /APIs/assets.php?id={id}`
- **Body JSON**: Field-field yang ingin diperbarui
- **Response**: Status 200 OK dengan data aset ter-update.

### 4. `DELETE /APIs/assets.php?id={id}`
- **Response**: Status 200 OK dengan pesan sukses penghapusan.

### 5. `POST /APIs/auth.php`
- **Body JSON**: `{ "identifier": "admin.pusdik@kkp.go.id", "password": "..." }`
- **Response**: Objek profil pengguna beserta token hak akses (RBAC).

### 6. `GET /APIs/satdik.php`
- **Response**: Daftar lengkap 18 kampus Politeknik KP & SUPM beserta koordinat geospasial dan program studi.
