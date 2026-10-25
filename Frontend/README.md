# 🖥️ Modul Frontend — SIM-SARPRAS KKP

Folder `Frontend` berisi seluruh antarmuka pengguna (User Interface), tata letak halaman web, styling tampilan visual, iconografi, dan pustaka client-side untuk Sistem Informasi Analitik Sarana & Prasarana Satuan Pendidikan Tinggi Kementerian Kelautan dan Perikanan RI.

---

## 📁 Struktur File & Direktori

```text
Frontend/
├── index.html                  # Halaman utama aplikasi (SPA)
├── assets/
│   ├── logo-kkp.png            # Logo resmi KKP (PNG)
│   ├── logo-kkp.svg            # Logo resmi KKP (SVG)
│   ├── css/
│   │   ├── tailwind.min.css    # Framework CSS utility
│   │   ├── leaflet.css         # Stylesheet peta geospasial Leaflet
│   │   └── style.css           # Tema visual, glassmorphism, & mode siang/malam
│   ├── app.js                  # Komponen utama antarmuka React:
│   │                           # - Navbar & User Profile Modal
│   │                           # - Login Portal & RBAC Handler
│   │                           # - Ringkasan Eksekutif (Chart.js & KPI)
│   │                           # - Peta Sebaran Geospasial (Leaflet GIS)
│   │                           # - Eksplorasi Data Aset & Modal CRUD
│   │                           # - Sistem Peringatan Dini Pemeliharaan
│   │                           # - Navigasi Mobile Bawah (Bottom Navigation)
│   └── vendor/
│       ├── react-vendor.min.js # React 18, ReactDOM, & Lucide Icons
│       ├── leaflet.js          # Library Leaflet GIS Map
│       ├── xlsx.bundle.js      # Library generator Excel xlsx-js-style
│       ├── icons.svg           # Sprite iconografi KKP
│       └── favicon.svg         # Favicon tab browser
└── README.md                   # Dokumentasi modul Frontend
```

---

## ⚙️ Integrasi dengan Folder Lain
1. **`Services/`**: Frontend memanggil layanan data, autentikasi, export Excel, dan konektor API melalui:
   - `window.SARPRAS_DATA` (dari `Services/data.js`)
   - `window.SARPRAS_AUTH` (dari `Services/auth.js`)
   - `window.SARPRAS_API` (dari `Services/api.js`)
   - `window.SARPRAS_EXCEL` (dari `Services/excel-export.js`)
2. **`APIs/` & `Monitoring/`**: Komunikasi data asinkronus dilakukan via Fetch API ke endpoint REST backend.
3. **Zero-Build**: Tidak memerlukan proses `npm run build` atau Vite. Setiap perubahan pada file di `Frontend/` langsung aktif saat me-refresh browser (Ctrl + F5).
