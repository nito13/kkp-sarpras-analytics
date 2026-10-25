# 🗄️ Modul Database — SIM-SARPRAS KKP

Folder `Database` menyimpan seluruh artefak basis data relasional MySQL, skema tabel (DDL), skrip migrasi/seeder awal (DML), dataset JSON master, serta file cadangan (database backup/dump).

---

## 📁 Struktur File & Direktori

```text
Database/
├── schema.sql                      # Skema DDL tabel MySQL: `satdik`, `users`, dan `assets`
├── seed.php                        # CLI skrip pengisian data otomatis via PHP PDO
├── seed_data.json                  # Dataset lengkap 18 Satdik, pengguna dinas RBAC, & inventaris aset
├── backup_kkp_sarpras_db.sql       # File dump cadangan SQL lengkap (struktur + data)
├── backup_monitoring_sarpras.sql   # File cadangan database monitoring & riwayat inspeksi
└── README.md                       # Dokumentasi modul Database
```

---

## 📋 Skema Tabel Utama (`schema.sql`)

1. **`satdik`**:
   - Master data 18 Satuan Pendidikan Vokasi KKP di seluruh Indonesia.
   - Kolom: `id`, `name`, `short_name`, `jenjang`, `provinsi`, `kota`, `region`, `lat`, `lng`, `taruna_count`, `dosen_count`, `luas_lahan_ha`, `luas_bangunan_m2`, `prodi_json`, dll.
2. **`users`**:
   - Akun pengguna dinas KKP dengan sistem hak akses berjenjang (Role-Based Access Control).
   - Kolom: `id`, `name`, `nip`, `email`, `password`, `role`, `accessible_satdik`, `permissions_json`, dll.
3. **`assets`**:
   - Inventaris aset sarana & prasarana pendidikan kelautan dan perikanan.
   - Kolom: `id`, `name`, `satdik_id` (Foreign Key ke `satdik.id`), `category`, `condition`, `condition_score`, `acquisition_year`, `utilization_rate`, `last_maintenance_date`, `next_maintenance_date`, `maintenance_urgency`, `issues_summary`.

---

## 🚀 Cara Menjalankan Seeder Database
Buka Laragon Terminal atau Command Prompt lalu jalankan:
```bash
php -f Database/seed.php
```
Skrip ini akan otomatis membuat database `kkp_sarpras_db` jika belum ada, mengeksekusi `schema.sql`, dan mengimpor seluruh data dari `seed_data.json`.
