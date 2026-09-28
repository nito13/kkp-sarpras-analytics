# SIM-SARPRAS KKP — Sistem Informasi & Analitik Sarana Prasarana Satdik Kelautan dan Perikanan

Aplikasi web analitik data modern dan interaktif yang dirancang khusus untuk memonitor, menganalisis, dan mensimulasikan data **Sarana dan Prasarana (Sarpras)** pada seluruh **Satuan Pendidikan di lingkungan Kementerian Kelautan dan Perikanan (KKP)** — di bawah naungan **Badan Penyuluhan dan Pengembangan Sumber Daya Manusia Kelautan dan Perikanan (BPPSDM KP)**.

---

## 🏛️ Cakupan Satuan Pendidikan (18 Kampus)

Aplikasi ini mencakup data autentik dan komprehensif dari 18 satuan pendidikan vokasi KKP di seluruh nusantara:

### 🎓 Pendidikan Tinggi (11 Kampus)
1. **Politeknik Ahli Usaha Perikanan (AUP) Jakarta** (Kampus Pasar Minggu, Serang, Bogor)
2. **Politeknik Kelautan dan Perikanan Sidoarjo** (Jawa Timur)
3. **Politeknik Kelautan dan Perikanan Bitung** (Sulawesi Utara)
4. **Politeknik Kelautan dan Perikanan Sorong** (Papua Barat Daya)
5. **Politeknik Kelautan dan Perikanan Karawang** (Jawa Barat)
6. **Politeknik Kelautan dan Perikanan Bone** (Sulawesi Selatan)
7. **Politeknik Kelautan dan Perikanan Kupang** (Nusa Tenggara Timur)
8. **Politeknik Kelautan dan Perikanan Dumai** (Riau)
9. **Politeknik Kelautan dan Perikanan Pangandaran** (Jawa Barat)
10. **Politeknik Kelautan dan Perikanan Jembrana** (Bali)
11. **Akademi Komunitas Kelautan dan Perikanan (AK-KP) Wakatobi** (Sulawesi Tenggara)

### 🏫 Pendidikan Menengah (7 SUPM)
12. **Sekolah Usaha Perikanan Menengah (SUPM) Ladong** (Aceh Besar)
13. **Sekolah Usaha Perikanan Menengah (SUPM) Pariaman** (Sumatera Barat)
14. **Sekolah Usaha Perikanan Menengah (SUPM) Kotaagung** (Lampung)
15. **Sekolah Usaha Perikanan Menengah (SUPM) Tegal** (Jawa Tengah)
16. **Sekolah Usaha Perikanan Menengah (SUPM) Pontianak** (Kalimantan Barat)
17. **Sekolah Usaha Perikanan Menengah (SUPM) Bone** (Sulawesi Selatan)
18. **Sekolah Usaha Perikanan Menengah (SUPM) Waiheru Ambon** (Maluku)

---

## 🔐 Sistem Login & Akses Peran Pengguna (Role-Based Access)

Aplikasi dilengkapi dengan portal otentikasi resmi berstandar kedinasan KKP dengan dukungan **Single Sign-On (SSO)** dan pilihan **Akun Demo Cepat (1-Click Login)**:

| No | Peran / Jabatan | Email Kedinasan / NIP | Password | Lingkup Hak Akses |
|---|---|---|---|---|
| 1 | **Super Admin BPPSDM KP** | `admin.bppsdm@kkp.go.id` | `admin` | Akses penuh 18 Satdik, approval APBN, input/edit seluruh aset |
| 2 | **Operator BMN Poltek AUP** | `operator.aup@kkp.go.id` | `aup` | Terfokus pada Politeknik AUP Jakarta, input & pemeliharaan aset |
| 3 | **Operator BMN SUPM Tegal** | `operator.tegal@kkp.go.id` | `tegal` | Terfokus pada SUPM Tegal, pembaruan fasilitas kapal latih & tambak |
| 4 | **Auditor Itjen KKP** | `auditor.itjen@kkp.go.id` | `itjen` | Mode audit & evaluasi standar kelayakan, ekspor laporan |

---

## 🚀 Fitur Utama Sistem

### 1. 📊 Executive KPI Dashboard
- **Metrik Utama Real-Time**: Total Aset BMN, Nilai Valuasi Aset BMN (Rupiah), Indeks Kelayakan Sarpras Nasional (IKSP), Jumlah Sarpras Kondisi Baik, Jumlah Sarpras Kritis/Rusak Berat, dan Estimasi Kebutuhan Biaya Rehabilitasi.
- **Visualisasi Chart.js Interaktif**:
  - *Donut Chart*: Komposisi kondisi fisik (Baik, Rusak Ringan, Rusak Berat).
  - *Horizontal Bar Chart*: Peringkat kelayakan sarpras per satuan pendidikan (Politeknik vs SUPM).
  - *Radar & Status Progress*: Kematangan dan kepatuhan sarpras per kategori bidang vokasi dibandingkan standar minimal KKP.
- **Early Warning Highlight Banner**: Peringatan darurat untuk fasilitas yang mengalami kerusakan mesin utama atau sertifikat BKI mati.

### 2. 🗺️ Peta Persebaran Geospasial Nusantara
- Peta vektor interaktif kepulauan Indonesia (Sumatera, Jawa, Kalimantan, Sulawesi, Bali-Nusa Tenggara, Maluku, Papua) dengan proyeksi koordinat akurat seluruh 18 kampus.
- Pin lokasi interaktif dengan *pulsating radar glow* dan kode warna indikator (*Emerald* $\ge 85\%$, *Sky* $75-84\%$, *Rose* $<75\%$).
- **Inspector Kampus**: Mengklik pin kampus menampilkan profil lengkap, program studi/kejuruan, luas lahan/bangunan, total aset BMN, rincian kondisi sarpras, dan tombol pintas ke katalog inventaris.

### 3. 📦 Inventaris & Katalog Aset BMN
- **Pencarian Cerdas & Filter Multidimensi**: Pencarian teks bebas (nama aset, kode BMN, spesifikasi mesin), filter Kategori Sarpras, filter Satdik, filter Kondisi Fisik, filter Status Sertifikasi, dan filter Urgensi Pemeliharaan.
- **Mode Tampilan Ganda**:
  - *Tampilan Tabel Data*: Padat, dapat diurutkan (*sortable*), dilengkapi indikator kemajuan utilisasi, dan kode BMN.
  - *Tampilan Kartu Grid*: Kartu visual informatif dengan ikon spesifik per kategori.
- **Modal Detail Teknis & Editor Status**:
  - Menampilkan spesifikasi mesin lengkap, legalitas sertifikasi (BKI, Hubla, SKP, HACCP, CPIB, CBIB), riwayat servis.
  - Fitur simulasi pembaruan kondisi: Pengguna dapat mengubah status (misal dari Rusak Berat menjadi Baik) dan mencatat log tindakan pemeliharaan yang langsung tersimpan di *Local Storage*.

### 4. 🎓 Standar Kelayakan & Benchmarking Vokasi
- **Kapasitas & Fasilitas Fisik**:
  - *Kapasitas Daya Tampung Asrama*: Evaluasi ketersediaan ranjang tempat tidur dan indeks kelayakan fasilitas asrama penunjang kampus.
  - *Kelayakan Armada Kapal Latih*: Kesiapan sertifikasi IMO STCW dan operasional berlayar.
- **Matriks Kepatuhan Standar Vokasi**: Evaluasi kepatuhan terhadap regulasi krusial BPPSDM KP / Kemendikbudristek / IMO STCW.
- **Head-to-Head Campus Comparison**: Komparasi berdampingan antara dua kampus terpilih untuk membandingkan kapasitas sarpras, luas bangunan & lahan, nilai BMN, dan skor kelayakan.

### 5. ⚠️ Early Warning System & Pemeliharaan Kritis
- Daftar merah aset darurat yang membutuhkan penanganan segera (*Critical Immediate Attention*).
- Dampak langsung terhadap kegiatan belajar mengajar taruna (contoh: kapal latih lego jangkar, turbocharger rusak, pompa air asrama mati).
- **Jadwal Docking & Pemeliharaan Berkala 2026/2027**: Rencana aksi docking tahunan, kalibrasi alat lab ISO 17025, dan perbaikan kompresor *cold storage*.

### 6. 💡 Simulator Alokasi Anggaran APBN / BOPTN
- *Interactive Budget Slider*: Pengguna dapat mengatur alokasi anggaran pemeliharaan dari Rp 1 Miliar hingga Rp 50 Miliar.
- *Real-time Impact Calculation*: Menghitung proyeksi kenaikan Indeks Kelayakan Sarpras Nasional, jumlah unit rusak berat yang berhasil diselamatkan, dan efisiensi sisa pagu.
- *Daftar Prioritas Usulan RKA*: Menampilkan urutan sarpras yang direkomendasikan untuk didanai berdasarkan *Return on Education (ROE)*.
- Tombol **"Terapkan Hasil Simulasi Ini"** yang langsung memutakhirkan kondisi database secara live.

### 7. ➕ Form Tambah Aset Sarpras (CRUD)
- Modal form input pencatatan BMN baru dengan validasi otomatis, pembentukan kode BMN standar KKP, dan penyimpanan langsung ke state aplikasi.

### 8. 📄 Fitur Ekspor & Cetak
- **Ekspor CSV**: Unduh data inventaris lengkap dalam format `.csv` dengan header resmi bahasa Indonesia.
- **Cetak Laporan**: Tata letak siap cetak (*print-friendly*) untuk ringkasan laporan eksekutif pimpinan.

---

## 🛠️ Arsitektur Teknologi

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan tema kelautan *Deep Marine Navy & Cyan*
- **Visualisasi Data**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Peta Interaktif**: Vektor SVG Nusantara Proportional Projection
- **Data Persistence**: Browser `localStorage`

---

## 💻 Cara Menjalankan Aplikasi

Seluruh file proyek kini telah disatukan di folder Laragon:
📍 **`C:\laragon\www\kkp-sarpras-analytics`**

### Pilihan 1: Akses Langsung via Laragon Apache (Tanpa Jalankan Dev Server)
1. Buka Laragon dan klik **Start All** (Apache & MySQL aktif).
2. Langsung buka di peramban:
   👉 **[http://localhost/kkp-sarpras-analytics/](http://localhost/kkp-sarpras-analytics/)**
   atau via Virtual Host:
   👉 **[http://kkp-sarpras-analytics.test/](http://kkp-sarpras-analytics.test/)**

### Pilihan 2: Mode Pengembang (Vite Hot-Reload)
Jika sedang mengembangkan kode antarmuka dan membutuhkan hot-reload:
```bash
# Pindah ke direktori proyek di Laragon
cd C:\laragon\www\kkp-sarpras-analytics

# Jalankan dev server Vite
npm.cmd run dev
```
Buka peramban (*browser*) Anda pada tautan:
👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

Untuk membuat berkas rilis produksi (*production build*) terbaru:
```bash
npm.cmd run build
```

---

© 2026 Kementerian Kelautan dan Perikanan Republik Indonesia | BPPSDM KP
#   C o b a  
 #   C o b a  
 