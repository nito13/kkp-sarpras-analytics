# 💼 Modul Services — SIM-SARPRAS KKP

Folder `Services` merupakan lapisan logika bisnis (Business Logic Layer) dan layanan pendukung yang terpisah dari antarmuka visual. Modul di dalam folder ini menangani komputasi analitik, manajemen sesi pengguna, komunikasi jaringan HTTP, serta pembuatan dokumen laporan.

---

## 📁 Struktur File & Direktori

```text
Services/
├── api.js                  # Layanan Klien HTTP (Fetch API) ke endpoint backend dengan auto-fallback offline
├── auth.js                 # Layanan autentikasi, manajemen sesi browser (localStorage/sessionStorage), & RBAC
├── data.js                 # Engine data: master dataset 18 Satdik, 25 Prodi, generator aset, & rumus KPI
├── excel-export.js         # Layanan pembuatan laporan resmi Microsoft Excel (.xlsx) dengan styling kop dinas KKP
└── README.md               # Dokumentasi modul Services
```

---

## ⚙️ Tanggung Jawab Setiap Service

1. **`Services/api.js` (`window.SARPRAS_API`)**:
   - Mendeteksi status online/offline server backend via `Monitoring/health.php`.
   - Mengirim request CRUD aset dan login ke endpoint di folder `APIs/`.
   - Menangani error jaringan secara terisolasi tanpa merusak tampilan UI.

2. **`Services/auth.js` (`window.SARPRAS_AUTH`)**:
   - Menyimpan dan memulihkan sesi login dinas dari browser storage (`kkp_auth_session_v2`).
   - Menyediakan fungsi otentikasi akun pengguna berdasar NIP / Email.
   - Mengatur izin operasi (Admin Pusdik vs Operator Satdik).

3. **`Services/data.js` (`window.SARPRAS_DATA`)**:
   - Menyimpan data master 18 satuan pendidikan vokasi KKP, target nasional, dan kategori sarpras.
   - Menghitung indikator kinerja (KPI): Total Aset, Nilai Kondisi Rata-rata, Tingkat Utilisasi, dan Distribusi Kerusakan.
   - Simulasi dampak anggaran perbaikan.

4. **`Services/excel-export.js` (`window.SARPRAS_EXCEL`)**:
   - Menghasilkan file `.xlsx` asli (OpenXML) menggunakan pustaka SheetJS.
   - Menyusun kop dinas resmi Kementerian Kelautan dan Perikanan.
   - Pewarnaan sel dinamis (Kondisi Baik: Hijau, Rusak: Merah/Kuning) dan formula hitung otomatis.
