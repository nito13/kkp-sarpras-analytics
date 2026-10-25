/**
 * ============================================================================
 * SARPRAS KKP — Master Data 18 Satdik, 25 Prodi, 8 Bidang & Generator Aset BMN
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 * File ini dapat langsung dipantau dan diubah tanpa proses build (Zero-Build).
 */
(function (window) {
  'use strict';

// Dataset Satuan Pendidikan Kementerian Kelautan dan Perikanan (KKP)
// Badan Penyuluhan dan Pengembangan Sumber Daya Manusia Kelautan dan Perikanan (BPPSDM KP)

  const PRODI_LIST = [
  'Agribisnis Pengolahan Hasil Perikanan',
  'Agribisnis Perikanan',
  'Agribisnis Perikanan Air Payau dan Laut',
  'Agribisnis Perikanan Air Tawar',
  'Budidaya Ikan',
  'Ekowisata Bahari',
  'Konservasi',
  'Mekanisasi Perikanan',
  'Nautika Kapal Penangkap Ikan',
  'Pengolahan Hasil Laut',
  'Penyuluhan Perikanan',
  'Perikanan Tangkap',
  'Permesinan Kapal',
  'Permesinan Perikanan',
  'Teknik Budidaya Perikanan',
  'Teknik Kelautan',
  'Teknik Penanganan Patologi Perikanan',
  'Teknik Penangkapan Ikan',
  'Teknik Pengolahan Produk Perikanan',
  'Teknika Kapal Penangkap Ikan',
  'Teknologi Akuakultur',
  'Teknologi Kelautan',
  'Teknologi Penangkapan Ikan',
  'Teknologi Pengelolaan Sumberdaya Perairan',
  'Teknologi Pengolahan Hasil Perikanan'
];

  const SATDIK_LIST = [
  {
    id: 'poltek-aup',
    name: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
    shortName: 'Politeknik AUP',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Selatan',
    region: 'Jawa',
    alamat: 'Jl. AUP No. 1, RT. 01 / RW. 09, Pasar Minggu, Jakarta Selatan, DKI Jakarta 12520',
    lat: -6.2942,
    lng: 106.8406,
    mapX: 300,
    mapY: 340,
    tarunaCount: 1420,
    dosenCount: 112,
    luasLahanHa: 18.5,
    luasBangunanM2: 36200,
    akreditasi: 'Unggul',
    establishedYear: 1962,
    kampusCabang: ['Kampus Utama Pasar Minggu', 'Kampus Serang (Banten)', 'Kampus Bogor (Cilodong/Cibalagung)'],
    rector: 'Dr. Muhammad Hery Riyadi S.St.Pi., M.M.',
    prodi: ['Teknologi Penangkapan Ikan', 'Permesinan Perikanan', 'Teknologi Akuakultur', 'Teknologi Pengolahan Hasil Perikanan', 'Teknologi Pengelolaan Sumberdaya Perairan', 'Penyuluhan Perikanan'],
  },
  {
    id: 'poltek-kp-sidoarjo',
    name: 'Politeknik Kelautan dan Perikanan Sidoarjo',
    shortName: 'Politeknik KP Sidoarjo',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Jawa Timur',
    kota: 'Kab. Sidoarjo',
    region: 'Jawa',
    alamat: 'Jl. Raya Buncitan, Kotak Pos 1, Kec. Sedati, Kab. Sidoarjo, Jawa Timur 61253',
    lat: -7.3993,
    lng: 112.7920,
    mapX: 430,
    mapY: 365,
    tarunaCount: 880,
    dosenCount: 68,
    luasLahanHa: 24.0,
    luasBangunanM2: 24500,
    akreditasi: 'Unggul',
    establishedYear: 1982,
    kampusCabang: ['Kampus Sedati Sidoarjo', 'Kampus Tambak Banyuwangi'],
    rector: 'Dr. I Gusti Putu Gede Rumayasa, S.Pi., M.P.',
    prodi: ['Teknik Budidaya Perikanan', 'Teknik Pengolahan Produk Perikanan', 'Teknik Penanganan Patologi Perikanan', 'Mekanisasi Perikanan', 'Agribisnis Perikanan'],
  },
  {
    id: 'poltek-kp-bitung',
    name: 'Politeknik Kelautan dan Perikanan Bitung',
    shortName: 'Politeknik KP Bitung',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Sulawesi Utara',
    kota: 'Kota Bitung',
    region: 'Sulawesi',
    alamat: 'Jl. Tandurusa, Kel. Aertembaga Dua, Kec. Aertembaga, Kota Bitung, Sulawesi Utara 95526',
    lat: 1.4550,
    lng: 125.2120,
    mapX: 680,
    mapY: 185,
    tarunaCount: 650,
    dosenCount: 54,
    luasLahanHa: 14.8,
    luasBangunanM2: 19800,
    akreditasi: 'A',
    establishedYear: 1957,
    kampusCabang: ['Kampus Tandurusa Bitung'],
    rector: 'Daniel Heintje Ndahawali, S.Pi., M.Si.',
    prodi: ['Teknik Penangkapan Ikan', 'Permesinan Kapal', 'Teknik Pengolahan Produk Perikanan', 'Mekanisasi Perikanan'],
  },
  {
    id: 'poltek-kp-sorong',
    name: 'Politeknik Kelautan dan Perikanan Sorong',
    shortName: 'Politeknik KP Sorong',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Papua Barat Daya',
    kota: 'Kota Sorong',
    region: 'Papua',
    alamat: 'Jl. Kapitan Pattimura, Tanjung Kasuari - Suprau, Distrik Maladummes, Kota Sorong, Papua Barat Daya 98411',
    lat: -0.8355,
    lng: 131.2505,
    mapX: 810,
    mapY: 230,
    tarunaCount: 520,
    dosenCount: 46,
    luasLahanHa: 28.2,
    luasBangunanM2: 17200,
    akreditasi: 'A',
    establishedYear: 2001,
    kampusCabang: ['Kampus Klademak Sorong', 'Station Hatchery Saonek Raja Ampat'],
    rector: 'Muhammad Bilal, S.St.Pi., M.Si.',
    prodi: ['Teknik Penangkapan Ikan', 'Teknik Budidaya Perikanan', 'Teknik Pengolahan Produk Perikanan', 'Konservasi'],
  },
  {
    id: 'poltek-kp-karawang',
    name: 'Politeknik Kelautan dan Perikanan Karawang',
    shortName: 'Politeknik KP Karawang',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Jawa Barat',
    kota: 'Kab. Karawang',
    region: 'Jawa',
    alamat: 'Jl. Lingkar Tanjungpura Km. 3, Kel. Karangpawitan, Kec. Karawang Barat, Kab. Karawang, Jawa Barat 41315',
    lat: -6.2847,
    lng: 107.3182,
    mapX: 320,
    mapY: 345,
    tarunaCount: 490,
    dosenCount: 42,
    luasLahanHa: 12.0,
    luasBangunanM2: 15400,
    akreditasi: 'Baik Sekali',
    establishedYear: 2016,
    kampusCabang: ['Kampus Pasir Putih Karawang'],
    rector: 'Dr. Asep Ridwan, S.St.Pi., M.Si.',
    prodi: ['Teknik Penangkapan Ikan', 'Teknik Kelautan', 'Teknologi Akuakultur', 'Teknologi Kelautan', 'Pengolahan Hasil Laut'],
  },
  {
    id: 'poltek-kp-bone',
    name: 'Politeknik Kelautan dan Perikanan Bone',
    shortName: 'Politeknik KP Bone',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Sulawesi Selatan',
    kota: 'Kab. Bone',
    region: 'Sulawesi',
    alamat: 'Jl. Sungai Musi KM. 9, Kel. Waetuo, Kec. Tanete Riattang Timur, Kab. Bone, Sulawesi Selatan 92718',
    lat: -4.5422,
    lng: 120.3541,
    mapX: 586,
    mapY: 300,
    tarunaCount: 580,
    dosenCount: 48,
    luasLahanHa: 22.4,
    luasBangunanM2: 18100,
    akreditasi: 'Baik Sekali',
    establishedYear: 2016,
    kampusCabang: ['Kampus Tanete Riattang Timur'],
    rector: 'Dr. Dra. Hj. Andi Asni, M.Si.',
    prodi: ['Teknik Penangkapan Ikan', 'Teknik Budidaya Perikanan', 'Teknologi Pengolahan Hasil Perikanan', 'Teknik Kelautan'],
  },
  {
    id: 'poltek-kp-kupang',
    name: 'Politeknik Kelautan dan Perikanan Kupang',
    shortName: 'Politeknik KP Kupang',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Nusa Tenggara Timur',
    kota: 'Kab. Kupang',
    region: 'Bali-Nusa Tenggara',
    alamat: 'Jl. Kampung Baru, Kawasan Pelabuhan Ferry Bolok, Kec. Kupang Barat, Kab. Kupang, Nusa Tenggara Timur 85351',
    lat: -10.2223,
    lng: 123.5125,
    mapX: 650,
    mapY: 420,
    tarunaCount: 460,
    dosenCount: 38,
    luasLahanHa: 30.5,
    luasBangunanM2: 16500,
    akreditasi: 'Baik Sekali',
    establishedYear: 2016,
    kampusCabang: ['Kampus Bolok Kupang Barat'],
    rector: 'Dr. Aris Widagdo, S.St.Pi., M.Si.',
    prodi: ['Teknik Budidaya Perikanan', 'Teknik Penangkapan Ikan', 'Mekanisasi Perikanan', 'Teknik Pengolahan Produk Perikanan'],
  },
  {
    id: 'poltek-kp-dumai',
    name: 'Politeknik Kelautan dan Perikanan Dumai',
    shortName: 'Politeknik KP Dumai',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Riau',
    kota: 'Kota Dumai',
    region: 'Sumatera',
    alamat: 'Jl. Wan Amir No. 1, Kel. Pangkalan Sesai, Kec. Dumai Barat, Kota Dumai, Riau 28826',
    lat: 1.6845,
    lng: 101.4242,
    mapX: 200,
    mapY: 200,
    tarunaCount: 420,
    dosenCount: 36,
    luasLahanHa: 16.0,
    luasBangunanM2: 14200,
    akreditasi: 'Baik Sekali',
    establishedYear: 2017,
    kampusCabang: ['Kampus Purnama Dumai'],
    rector: 'Iskandar, S.St.Pi., M.Si.',
    prodi: ['Permesinan Perikanan', 'Pengolahan Hasil Laut', 'Perikanan Tangkap'],
  },
  {
    id: 'poltek-kp-pangandaran',
    name: 'Politeknik Kelautan dan Perikanan Pangandaran',
    shortName: 'Politeknik KP Pangandaran',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Jawa Barat',
    kota: 'Kab. Pangandaran',
    region: 'Jawa',
    alamat: 'Jl. Raya Babakan KM 2, Kawasan PPI Cikidang, Bulaksetra, Desa Babakan, Kec. Pangandaran, Kab. Pangandaran, Jawa Barat 46396',
    lat: -7.6892,
    lng: 108.6658,
    mapX: 350,
    mapY: 370,
    tarunaCount: 390,
    dosenCount: 35,
    luasLahanHa: 13.5,
    luasBangunanM2: 13800,
    akreditasi: 'Baik Sekali',
    establishedYear: 2017,
    kampusCabang: ['Kampus Babakan Pangandaran'],
    rector: 'Dr. Hendra Sugandhi, S.Pi., M.Si.',
    prodi: ['Budidaya Ikan', 'Pengolahan Hasil Laut', 'Teknologi Kelautan'],
  },
  {
    id: 'poltek-kp-jembrana',
    name: 'Politeknik Kelautan dan Perikanan Jembrana',
    shortName: 'Politeknik KP Jembrana',
    jenjang: 'Pendidikan Tinggi',
    type: 'Politeknik',
    provinsi: 'Bali',
    kota: 'Kab. Jembrana',
    region: 'Bali-Nusa Tenggara',
    alamat: 'Jl. Pelabuhan Perikanan Nusantara Pengambengan, Desa Pengambengan, Kec. Negara, Kab. Jembrana, Bali 82218',
    lat: -8.3903,
    lng: 114.5784,
    mapX: 475,
    mapY: 385,
    tarunaCount: 410,
    dosenCount: 34,
    luasLahanHa: 15.2,
    luasBangunanM2: 14000,
    akreditasi: 'Baik Sekali',
    establishedYear: 2017,
    kampusCabang: ['Kampus Pengambengan Jembrana'],
    rector: 'Dr. Ilham, S.St.Pi., M.St.Pi.',
    prodi: ['Perikanan Tangkap', 'Budidaya Ikan', 'Pengolahan Hasil Laut', 'Agribisnis Perikanan'],
  },
  {
    id: 'akkp-wakatobi',
    name: 'Akademi Komunitas KP Wakatobi',
    shortName: 'AK-KP Wakatobi',
    jenjang: 'Pendidikan Tinggi',
    type: 'Akademi',
    provinsi: 'Sulawesi Tenggara',
    kota: 'Kab. Wakatobi',
    region: 'Sulawesi',
    alamat: 'Jl. Poros Matahora, Desa Matahora, Kec. Wangi-Wangi Selatan, Kab. Wakatobi, Sulawesi Tenggara 93795',
    lat: -5.3340,
    lng: 123.5960,
    mapX: 645,
    mapY: 335,
    tarunaCount: 220,
    dosenCount: 22,
    luasLahanHa: 8.5,
    luasBangunanM2: 7800,
    akreditasi: 'Baik',
    establishedYear: 2017,
    kampusCabang: ['Kampus Wangi-Wangi Wakatobi'],
    rector: 'Drs. La Ode Muhammad Ridwan, M.Si.',
    prodi: ['Ekowisata Bahari', 'Konservasi'],
  },
  {
    id: 'supm-ladong',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Ladong',
    shortName: 'SUPM Ladong',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Aceh',
    kota: 'Kab. Aceh Besar',
    region: 'Sumatera',
    alamat: 'Jl. Laksamana Malahayati Km. 26, Desa Ladong, Kec. Mesjid Raya, Kab. Aceh Besar, Aceh 23381',
    lat: 5.5874,
    lng: 95.5155,
    mapX: 100,
    mapY: 100,
    tarunaCount: 340,
    dosenCount: 28,
    luasLahanHa: 12.0,
    luasBangunanM2: 9500,
    akreditasi: 'A',
    establishedYear: 1986,
    kampusCabang: ['Kampus Ladong Krueng Raya'],
    rector: 'Zulfikar, S.St.Pi.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Teknika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Payau dan Laut'],
  },
  {
    id: 'supm-pariaman',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Pariaman',
    shortName: 'SUPM Pariaman',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Sumatera Barat',
    kota: 'Kota Pariaman',
    region: 'Sumatera',
    alamat: 'Jl. Simpang Toboh, Desa Campago, Kec. V Koto Kampung Dalam, Kab. Padang Pariaman, Sumatera Barat 25552',
    lat: -0.5288,
    lng: 100.1166,
    mapX: 170,
    mapY: 250,
    tarunaCount: 380,
    dosenCount: 32,
    luasLahanHa: 14.5,
    luasBangunanM2: 11200,
    akreditasi: 'A',
    establishedYear: 1986,
    kampusCabang: ['Kampus Naras Pariaman'],
    rector: 'Dra. Harisjon, M.Si.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Payau dan Laut', 'Agribisnis Pengolahan Hasil Perikanan'],
  },
  {
    id: 'supm-kotaagung',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Kotaagung',
    shortName: 'SUPM Kotaagung',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Lampung',
    kota: 'Kab. Tanggamus',
    region: 'Sumatera',
    alamat: 'Jl. Pantai Harapan, Desa Way Gelang, Kec. Kota Agung Barat, Kab. Tanggamus, Lampung 35384',
    lat: -5.4987,
    lng: 104.5914,
    mapX: 250,
    mapY: 320,
    tarunaCount: 360,
    dosenCount: 30,
    luasLahanHa: 16.0,
    luasBangunanM2: 10800,
    akreditasi: 'A',
    establishedYear: 1987,
    kampusCabang: ['Kampus Way Gelang Kotaagung'],
    rector: 'Khaerudin, S.St.Pi., M.M.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Teknika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Payau dan Laut', 'Agribisnis Perikanan Air Tawar'],
  },
  {
    id: 'supm-tegal',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Tegal',
    shortName: 'SUPM Tegal',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Jawa Tengah',
    kota: 'Kota Tegal',
    region: 'Jawa',
    alamat: 'Jl. Martoloyo No. 22, Kel. Panggung, Kec. Tegal Timur, Kota Tegal, Jawa Tengah 52122',
    lat: -6.8639,
    lng: 109.1450,
    mapX: 370,
    mapY: 350,
    tarunaCount: 450,
    dosenCount: 38,
    luasLahanHa: 11.2,
    luasBangunanM2: 12400,
    akreditasi: 'A',
    establishedYear: 1962,
    kampusCabang: ['Kampus Martoloyo Tegal'],
    rector: 'H. Maskuri, S.St.Pi., M.Si.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Teknika Kapal Penangkap Ikan', 'Agribisnis Pengolahan Hasil Perikanan', 'Agribisnis Perikanan Air Payau dan Laut'],
  },
  {
    id: 'supm-pontianak',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Pontianak',
    shortName: 'SUPM Pontianak',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Kalimantan Barat',
    kota: 'Kab. Kubu Raya',
    region: 'Kalimantan',
    alamat: 'Jl. Pembangunan, Nipah Kuning, Kec. Sungai Kakap, Kab. Kubu Raya, Kalimantan Barat 78381',
    lat: -0.0090,
    lng: 109.2866,
    mapX: 380,
    mapY: 245,
    tarunaCount: 370,
    dosenCount: 31,
    luasLahanHa: 18.0,
    luasBangunanM2: 11500,
    akreditasi: 'A',
    establishedYear: 1988,
    kampusCabang: ['Kampus Sungai Raya Pontianak'],
    rector: 'Mustafa, S.St.Pi., M.Si.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Tawar', 'Agribisnis Pengolahan Hasil Perikanan'],
  },
  {
    id: 'supm-sorong',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Sorong',
    shortName: 'SUPM Sorong',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Papua Barat Daya',
    kota: 'Kota Sorong',
    region: 'Papua',
    alamat: 'Jl. Jenderal A. Yani No. 32, Kel. Klakublik, Kec. Sorong Kota, Kota Sorong, Papua Barat Daya 98401',
    lat: -0.8783,
    lng: 131.2622,
    mapX: 815,
    mapY: 245,
    tarunaCount: 320,
    dosenCount: 28,
    luasLahanHa: 14.5,
    luasBangunanM2: 9800,
    akreditasi: 'A',
    establishedYear: 1979,
    kampusCabang: ['Kampus Klakublik Sorong'],
    rector: 'Ibnu Khotob Rinjani, S.ST.Pi., M.T.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Teknika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Payau dan Laut'],
  },
  {
    id: 'supm-waiheru',
    name: 'Sekolah Usaha Perikanan Menengah (SUPM) Waiheru Ambon',
    shortName: 'SUPM Waiheru',
    jenjang: 'Pendidikan Menengah',
    type: 'SUPM',
    provinsi: 'Maluku',
    kota: 'Kota Ambon',
    region: 'Maluku',
    alamat: 'Jl. Laksdya Leo Wattimena Km. 16, Desa Waiheru, Kec. Baguala, Kota Ambon, Maluku 97233',
    lat: -3.6317,
    lng: 128.2206,
    mapX: 740,
    mapY: 290,
    tarunaCount: 390,
    dosenCount: 33,
    luasLahanHa: 20.0,
    luasBangunanM2: 12800,
    akreditasi: 'A',
    establishedYear: 1986,
    kampusCabang: ['Kampus Waiheru Baguala Ambon'],
    rector: 'Achmad Jais Ely, S.St.Pi., M.Si.',
    prodi: ['Nautika Kapal Penangkap Ikan', 'Teknika Kapal Penangkap Ikan', 'Agribisnis Perikanan Air Payau dan Laut', 'Agribisnis Pengolahan Hasil Perikanan'],
  }
];

  const SARPRAS_CATEGORIES = [
  {
    id: 'penangkapan_ikan',
    name: 'Penangkapan Ikan',
    iconName: 'Ship',
    color: '#0284c7', // Sky Blue
    bgLight: 'bg-sky-500/10',
    borderLight: 'border-sky-500/30',
    description: 'Kapal Latih Kenavigasian, Simulator Anjungan & Radar Navigasi (FMBS), Lab Nautika, dan Alat Tangkap Perikanan (Purse Seine, Longline, Gillnet).',
    standardMinimum: 'Minimal 1 Kapal Latih operasional per 200 taruna nautika dan 1 Full Mission Bridge Simulator.',
    prodis: [
      'Perikanan Tangkap',
      'Teknik Penangkapan Ikan',
      'Teknologi Penangkapan Ikan',
      'Nautika Kapal Penangkap Ikan'
    ]
  },
  {
    id: 'permesinan_mekanisasi',
    name: 'Permesinan dan Mekanisasi',
    iconName: 'Wrench',
    color: '#0ea5e9', // Light Blue / Steel
    bgLight: 'bg-sky-600/10',
    borderLight: 'border-sky-600/30',
    description: 'Simulator Kamar Mesin (ERS), Bengkel Bubut & Las Fabrikasi STCW, Mesin Diesel Penggerak Kapal, Unit Mekanisasi dan Otomasi Perikanan.',
    standardMinimum: 'Bengkel permesinan kapal terstandar STCW Ditjen Hubla, instalasi mesin penggerak dan simulator permesinan aktif.',
    prodis: [
      'Permesinan Perikanan',
      'Permesinan Kapal',
      'Mekanisasi Perikanan',
      'Teknika Kapal Penangkap Ikan'
    ]
  },
  {
    id: 'budidaya_perikanan',
    name: 'Budidaya Perikanan',
    iconName: 'Fish',
    color: '#10b981', // Emerald
    bgLight: 'bg-emerald-500/10',
    borderLight: 'border-emerald-500/30',
    description: 'Hatchery Pembenihan Udang & Ikan, Kolam Tambak Bioflok & RAS, Kolam Pendederan/Pembesaran, Lab Kualitas Air, Pabrik Mini Pakan Mandiri.',
    standardMinimum: 'Kapasitas produksi minimal 500.000 nauplii/ekor benih per siklus, Lab air terkalibrasi KAN.',
    prodis: [
      'Budidaya Ikan',
      'Teknik Budidaya Perikanan',
      'Teknologi Akuakultur',
      'Teknik Penanganan Patologi Perikanan'
    ]
  },
  {
    id: 'pengolahan_hasil',
    name: 'Pengolahan Hasil Perikanan/Laut',
    iconName: 'Boxes',
    color: '#f59e0b', // Amber
    bgLight: 'bg-amber-500/10',
    borderLight: 'border-amber-500/30',
    description: 'Unit Pengolahan Ikan (UPI) Latih Standard HACCP/GMP, Cold Storage (-20°C s/d -40°C), Air Blast Freezer (ABF), Mesin Pengalengan Retort, Lab Mikrobiologi Pangan.',
    standardMinimum: 'Kapasitas pembekuan ABF min. 2 Ton/batch, Cold storage min. 10 Ton, Sertifikasi Kelayakan Pengolahan (SKP).',
    prodis: [
      'Pengolahan Hasil Laut',
      'Teknologi Pengolahan Hasil Perikanan',
      'Teknik Pengolahan Produk Perikanan'
    ]
  },
  {
    id: 'agribisnis_perikanan',
    name: 'Agribisnis Perikanan',
    iconName: 'TrendingUp',
    color: '#8b5cf6', // Violet
    bgLight: 'bg-violet-500/10',
    borderLight: 'border-violet-500/30',
    description: 'Teaching Factory (TEFA) Pengolahan & Agribisnis Komersial, Inkubator Bisnis Vokasi KP, Pengemasan & Rantai Pasok Hasil Perikanan, Gerai Produk Taruna.',
    standardMinimum: 'Unit bisnis terintegrasi kurikulum vokasi 70% praktik, memiliki perizinan PIRT/BPOM/Halal.',
    prodis: [
      'Agribisnis Pengolahan Hasil Perikanan',
      'Agribisnis Perikanan',
      'Agribisnis Perikanan Air Payau dan Laut',
      'Agribisnis Perikanan Air Tawar'
    ]
  },
  {
    id: 'kelautan_konservasi',
    name: 'Kelautan, Konservasi, dan Pengolahan Lingkungan',
    iconName: 'Compass',
    color: '#06b6d4', // Cyan
    bgLight: 'bg-cyan-500/10',
    borderLight: 'border-cyan-500/30',
    description: 'Pusat Selam & Dive Center, Fasilitas Ekowisata Bahari Edukasi, Laboratorium Konservasi Kawasan Laut & Terumbu Karang, Wahana Wisata Mangrove & Pesisir.',
    standardMinimum: 'Fasilitas dive center bersertifikat, kompresor breathing air teruji, wahana edukasi konservasi aktif.',
    prodis: [
      'Teknik Kelautan',
      'Teknologi Kelautan',
      'Teknologi Pengelolaan Sumberdaya Perairan',
      'Ekowisata Bahari',
      'Konservasi'
    ]
  },
  {
    id: 'sosial_pemberdayaan',
    name: 'Sosial & Pemberdayaan Masyarakat',
    iconName: 'Users',
    color: '#ec4899', // Pink
    bgLight: 'bg-pink-500/10',
    borderLight: 'border-pink-500/30',
    description: 'Laboratorium Penyuluhan & Komunikasi Pesisir, Balai Pertemuan & Pemberdayaan Nelayan, Asrama Korps Taruna Bahari, Fasilitas Pembinaan Karakter Vokasi.',
    standardMinimum: 'Sarana penyuluhan dan pendampingan kelompok nelayan/pembudidaya aktif, asrama taruna terstandar kedisiplinan bahari.',
    prodis: [
      'Penyuluhan Perikanan',
      'Teknologi Pengelolaan Sumberdaya Perairan'
    ]
  },
  {
    id: 'administrasi_umum',
    name: 'Administrasi & Umum',
    iconName: 'Briefcase',
    color: '#6366f1', // Indigo
    bgLight: 'bg-indigo-500/10',
    borderLight: 'border-indigo-500/30',
    description: 'Gedung Rektorat & Tata Usaha, Ruang Administrasi & Layanan Terpadu, Kendaraan Dinas Operasional, Ruang Rapat Senat, Jaringan Server & Utilitas Kampus.',
    standardMinimum: 'Ketersediaan sarana perkantoran terakreditasi, jaringan intranet stabil, serta utilitas pendukung operasional kampus.',
    prodis: []
  }
];

// Mapping resmi Program Studi ke Bidang Sarpras
  const PRODI_TO_CATEGORY_MAP = {
  // 1. Penangkapan Ikan
  'Perikanan Tangkap': 'penangkapan_ikan',
  'Teknik Penangkapan Ikan': 'penangkapan_ikan',
  'Teknologi Penangkapan Ikan': 'penangkapan_ikan',
  'Nautika Kapal Penangkap Ikan': 'penangkapan_ikan',

  // 2. Permesinan dan Mekanisasi
  'Permesinan Perikanan': 'permesinan_mekanisasi',
  'Permesinan Kapal': 'permesinan_mekanisasi',
  'Mekanisasi Perikanan': 'permesinan_mekanisasi',
  'Teknika Kapal Penangkap Ikan': 'permesinan_mekanisasi',

  // 3. Budidaya Perikanan
  'Budidaya Ikan': 'budidaya_perikanan',
  'Teknik Budidaya Perikanan': 'budidaya_perikanan',
  'Teknologi Akuakultur': 'budidaya_perikanan',
  'Teknik Penanganan Patologi Perikanan': 'budidaya_perikanan',

  // 4. Pengolahan Hasil Perikanan/Laut
  'Pengolahan Hasil Laut': 'pengolahan_hasil',
  'Teknologi Pengolahan Hasil Perikanan': 'pengolahan_hasil',
  'Teknik Pengolahan Produk Perikanan': 'pengolahan_hasil',

  // 5. Agribisnis Perikanan
  'Agribisnis Pengolahan Hasil Perikanan': 'agribisnis_perikanan',
  'Agribisnis Perikanan': 'agribisnis_perikanan',
  'Agribisnis Perikanan Air Payau dan Laut': 'agribisnis_perikanan',
  'Agribisnis Perikanan Air Tawar': 'agribisnis_perikanan',

  // 6. Kelautan, Konservasi, dan Pengolahan Lingkungan
  'Teknik Kelautan': 'kelautan_konservasi',
  'Teknologi Kelautan': 'kelautan_konservasi',
  'Teknologi Pengelolaan Sumberdaya Perairan': 'kelautan_konservasi',
  'Ekowisata Bahari': 'kelautan_konservasi',
  'Konservasi': 'kelautan_konservasi',

  // 7. Sosial & Pemberdayaan Masyarakat
  'Penyuluhan Perikanan': 'sosial_pemberdayaan',
};

// Mapping relasi multi-bidang (prodi yang terhubung ke lebih dari 1 bidang sarpras)
  const PRODI_TO_CATEGORIES_MAP = {
  'Perikanan Tangkap': ['penangkapan_ikan'],
  'Teknik Penangkapan Ikan': ['penangkapan_ikan'],
  'Teknologi Penangkapan Ikan': ['penangkapan_ikan'],
  'Nautika Kapal Penangkap Ikan': ['penangkapan_ikan'],

  'Permesinan Perikanan': ['permesinan_mekanisasi'],
  'Permesinan Kapal': ['permesinan_mekanisasi'],
  'Mekanisasi Perikanan': ['permesinan_mekanisasi'],
  'Teknika Kapal Penangkap Ikan': ['permesinan_mekanisasi'],

  'Budidaya Ikan': ['budidaya_perikanan'],
  'Teknik Budidaya Perikanan': ['budidaya_perikanan'],
  'Teknologi Akuakultur': ['budidaya_perikanan'],
  'Teknik Penanganan Patologi Perikanan': ['budidaya_perikanan'],

  'Pengolahan Hasil Laut': ['pengolahan_hasil'],
  'Teknologi Pengolahan Hasil Perikanan': ['pengolahan_hasil'],
  'Teknik Pengolahan Produk Perikanan': ['pengolahan_hasil'],

  'Agribisnis Pengolahan Hasil Perikanan': ['agribisnis_perikanan'],
  'Agribisnis Perikanan': ['agribisnis_perikanan'],
  'Agribisnis Perikanan Air Payau dan Laut': ['agribisnis_perikanan'],
  'Agribisnis Perikanan Air Tawar': ['agribisnis_perikanan'],

  'Teknik Kelautan': ['kelautan_konservasi'],
  'Teknologi Kelautan': ['kelautan_konservasi'],
  'Teknologi Pengelolaan Sumberdaya Perairan': ['kelautan_konservasi', 'sosial_pemberdayaan'],
  'Ekowisata Bahari': ['kelautan_konservasi'],
  'Konservasi': ['kelautan_konservasi'],

  'Penyuluhan Perikanan': ['sosial_pemberdayaan'],
};

  const getCategoryForProdi = (prodiName) => {
  if (!prodiName) return null;
  return PRODI_TO_CATEGORY_MAP[prodiName] || null;
};

  const getProdisForCategory = (categoryId) => {
  const cat = SARPRAS_CATEGORIES.find(c => c.id === categoryId);
  return cat?.prodis || [];
};

  const INITIAL_SARPRAS_DATA = [
  // Politeknik AUP Jakarta
  {
    id: 'SAR-AUP-001',
    name: 'Kapal Latih KM. Madidihang 03',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi',
    condition: 'Baik',
    conditionScore: 92,
    acquisitionYear: 2014,
    valuation: 38500000000,
    utilizationRate: 88,
    capacityDesc: '520 GT, Kapasitas 45 Taruna + 18 Awak Kapal',
    specs: 'LOA: 50.2 m, Breadth: 9.5 m, Main Engine: Yanmar 1800 HP, Longline & Purse Seine gear, Cold Storage -30°C',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Biro Klasifikasi Indonesia (BKI) & Ditjen Hubla',
    certExpiryDate: '2027-08-15',
    lastMaintenanceDate: '2025-11-10',
    nextMaintenanceDate: '2026-11-10',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 450000000,
    issuesSummary: 'Operasional prima untuk praktek laut WPP-NRI 711 & 712, persiapan docking berkala tahunan.',
  },
  {
    id: 'SAR-AUP-002',
    name: 'Full Mission Ship Bridge Simulator System',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'penangkapan_ikan',
    subcategory: 'Simulator Kenavigasian',
    condition: 'Baik',
    conditionScore: 95,
    acquisitionYear: 2019,
    valuation: 14200000000,
    utilizationRate: 94,
    capacityDesc: 'Visual 360 Derajat HD, 6 Konsol Taruna Terhubung',
    specs: 'Transas / Wärtsilä Navi-Trainer Pro 5000, IMO Model Course 1.22 & 7.03 Compliant, Radar/ARPA, ECDIS, GMDSS Terpadu',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'DNV-GL & Ditjen Perhubungan Laut',
    certExpiryDate: '2028-03-20',
    lastMaintenanceDate: '2026-02-14',
    nextMaintenanceDate: '2026-08-14',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 120000000,
    issuesSummary: 'Software scenario diperbarui ke standar STCW 2010 Manila Amendments.',
  },
  {
    id: 'SAR-AUP-003',
    name: 'Hatchery Modern Udang Vaname & Windu (Kampus Serang)',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'budidaya_perikanan',
    subcategory: 'Hatchery Pembenihan',
    condition: 'Baik',
    conditionScore: 88,
    acquisitionYear: 2017,
    valuation: 8750000000,
    utilizationRate: 85,
    capacityDesc: 'Kapasitas Produksi 2.500.000 PL/Siklus',
    specs: '16 Bak Induk & Larva, Sistem Filtrasi Biofilter & UV Sterilizer, Root Blower 5 HP x 3 unit, Lab Pakan Alami Chaetoceros',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikat CPIB (Cara Pembenihan Ikan yang Baik) - Ditjen Perikanan Budidaya',
    certExpiryDate: '2027-05-10',
    lastMaintenanceDate: '2026-01-20',
    nextMaintenanceDate: '2026-07-20',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 85000000,
    issuesSummary: 'Unit aerasi cadangan bekerja baik, pengadaan pakan induk teratur.',
  },
  {
    id: 'SAR-AUP-004',
    name: 'Unit Pengolahan Ikan (UPI) Modern Latih & Cold Storage',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'pengolahan_hasil',
    subcategory: 'UPI & Cold Chain',
    condition: 'Rusak Ringan',
    conditionScore: 58,
    acquisitionYear: 2015,
    valuation: 9400000000,
    utilizationRate: 60,
    capacityDesc: 'Cold Storage 30 Ton, ABF 3 Ton/Batch',
    specs: 'Freon R404A Semi-Hermetic Bitzer Compressor 25 PK, Suhu Ruang -25°C, Retort Autoclave 250 Can/Cycle',
    certificationStatus: 'Perlu Pembaruan',
    certificationAuthority: 'SKP KKP & HACCP Grade A',
    certExpiryDate: '2026-04-12',
    lastMaintenanceDate: '2025-08-10',
    nextMaintenanceDate: '2026-02-10',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 680000000,
    issuesSummary: 'Kompresor ABF unit 2 mengalami kebocoran seal freon dan efisiensi insulasi panel dinding cold storage menurun 20%. Memerlukan penggantian evaporator segara sebelum audit SKP.',
  },
  {
    id: 'SAR-AUP-005',
    name: 'Gedung Asrama Korps Taruna Bima-Yudistira (Putra)',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'sosial_pemberdayaan',
    subcategory: 'Asrama Taruna',
    condition: 'Baik',
    conditionScore: 84,
    acquisitionYear: 2011,
    valuation: 16500000000,
    utilizationRate: 98,
    capacityDesc: 'Daya Tampung 650 Ranjang Tingkat Bertingkat',
    specs: 'Gedung 4 Lantai, 130 Kamar Taruna, Sanitasi Terpusat, Ruang Belajar Mandiri, Sistem CCTV & Keamanan Semi-Militer',
    certificationStatus: 'Tidak Wajib',
    certificationAuthority: 'Dinas Cipta Karya & Tata Ruang DKI',
    certExpiryDate: '2030-01-01',
    lastMaintenanceDate: '2025-12-05',
    nextMaintenanceDate: '2026-06-05',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 180000000,
    issuesSummary: 'Perbaikan plafon rembes lantai 4 dan pengecatan ulang fasad luar telah selesai.',
  },
  {
    id: 'SAR-AUP-006',
    name: 'Teaching Factory (TEFA) Pengalengan & Produk Nilai Tambah',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'agribisnis_perikanan',
    subcategory: 'TEFA Pengolahan',
    condition: 'Baik',
    conditionScore: 90,
    acquisitionYear: 2020,
    valuation: 5600000000,
    utilizationRate: 82,
    capacityDesc: 'Produksi 1.500 Kaleng Ikan Cakalang/Tuna per Hari',
    specs: 'Seamer Otomatis Can Closer, Exhaust Box, Boiler Steam 500 kg/h, Ruang Pengemasan Cleanroom Class D',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BPOM RI & Halal BPJPH',
    certExpiryDate: '2028-11-30',
    lastMaintenanceDate: '2026-01-15',
    nextMaintenanceDate: '2026-07-15',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 65000000,
    issuesSummary: 'Produk kaleng berlabel AUP Fish beredar di jaringan kantin kementerian dan pameran kelautan.',
  },
  {
    id: 'SAR-AUP-007',
    name: 'Gedung Rektorat & Layanan Administrasi Terpadu',
    satdikId: 'poltek-aup',
    satdikName: 'Politeknik Ahli Usaha Perikanan Jakarta',
    category: 'administrasi_umum',
    subcategory: 'Gedung Kantor & Administrasi',
    condition: 'Baik',
    conditionScore: 92,
    acquisitionYear: 2018,
    valuation: 16500000000,
    utilizationRate: 90,
    capacityDesc: 'Gedung 4 Lantai, 45 Ruang Kerja & Senat',
    specs: 'Luas Bangunan 3.200 m², Sistem Smart Office, Ruang Rapat Senat, Server Room & Backup Genset 250 kVA',
    certificationStatus: 'Tidak Wajib',
    certificationAuthority: 'Dinas Cipta Karya & Tata Ruang DKI Jakarta',
    certExpiryDate: '2032-12-31',
    lastMaintenanceDate: '2026-01-15',
    nextMaintenanceDate: '2026-07-15',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 85000000,
    issuesSummary: 'Kondisi fisik gedung dan jaringan server administrasi operasional prima.',
  },

  // Politeknik KP Sidoarjo
  {
    id: 'SAR-SDJ-001',
    name: 'Tambak Pendidikan Intensif Budidaya Udang & Bandeng',
    satdikId: 'poltek-kp-sidoarjo',
    satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo',
    category: 'budidaya_perikanan',
    subcategory: 'Tambak Akuakultur',
    condition: 'Baik',
    conditionScore: 91,
    acquisitionYear: 2016,
    valuation: 7800000000,
    utilizationRate: 90,
    capacityDesc: '8 Petak Tambak HDPE @1.000 m², Produksi 15 Ton/Siklus',
    specs: 'Lapisan Geomembran HDPE 0.75 mm, Auto-feeder ber-timer, Kincir Air Paddle Wheel 1 HP x 32 unit, Central Drain',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikat CBIB (Cara Budidaya Ikan yang Baik)',
    certExpiryDate: '2027-09-18',
    lastMaintenanceDate: '2026-01-10',
    nextMaintenanceDate: '2026-07-10',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 75000000,
    issuesSummary: 'Kualitas air payau stabil dengan suplai tandon pengendapan primer yang telah dikeruk.',
  },
  {
    id: 'SAR-SDJ-002',
    name: 'Teaching Factory Bandeng Cabut Duri & Fish Jelly (Surimi)',
    satdikId: 'poltek-kp-sidoarjo',
    satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo',
    category: 'agribisnis_perikanan',
    subcategory: 'TEFA Pengolahan',
    condition: 'Baik',
    conditionScore: 94,
    acquisitionYear: 2018,
    valuation: 4300000000,
    utilizationRate: 95,
    capacityDesc: 'Kapasitas 1.000 kg Bandeng Duri Lunak / Hari',
    specs: 'Mesin Meat-Bone Separator 200 kg/h, Silent Cutter 50L, Vacuum Packaging Chamber Double Nozzle, Autoclave Presto',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BPOM MD & Halal MUI/BPJPH',
    certExpiryDate: '2028-06-25',
    lastMaintenanceDate: '2026-02-01',
    nextMaintenanceDate: '2026-08-01',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 45000000,
    issuesSummary: 'Menjadi sentra rujukan TEFA pengolahan nasional dan menghasilkan PNBP yang berkelanjutan.',
  },
  {
    id: 'SAR-SDJ-003',
    name: 'Laboratorium Terpadu Hama Penyakit Ikan & Lingkungan',
    satdikId: 'poltek-kp-sidoarjo',
    satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo',
    category: 'budidaya_perikanan',
    subcategory: 'Laboratorium Akuakultur',
    condition: 'Baik',
    conditionScore: 89,
    acquisitionYear: 2019,
    valuation: 5100000000,
    utilizationRate: 86,
    capacityDesc: 'Kapasitas Praktik 60 Taruna Bersamaan',
    specs: 'Real-Time PCR Machine Bio-Rad CFX96, Spektrofotometer UV-Vis Double Beam, Laminar Air Flow Class II, Autoclave Digital',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Akreditasi ISO/IEC 17025:2017 oleh KAN',
    certExpiryDate: '2027-10-15',
    lastMaintenanceDate: '2025-10-20',
    nextMaintenanceDate: '2026-04-20',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 60000000,
    issuesSummary: 'Kalibrasi mikropipet dan termocycler terjadwal bulan depan.',
  },
  {
    id: 'SAR-SDJ-004',
    name: 'Asrama Taruna Dewaruci & Menza Graha Bahari',
    satdikId: 'poltek-kp-sidoarjo',
    satdikName: 'Politeknik Kelautan dan Perikanan Sidoarjo',
    category: 'sosial_pemberdayaan',
    subcategory: 'Asrama & Menza',
    condition: 'Rusak Ringan',
    conditionScore: 76,
    acquisitionYear: 2012,
    valuation: 13500000000,
    utilizationRate: 96,
    capacityDesc: 'Daya Tampung 550 Taruna, Menza 600 Kursi',
    specs: 'Bangunan 3 Lantai, Dapur Gas Sentral, Exhaust Hood Stainless Steel, Sistem Filter Air Bersih Reverse Osmosis',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikat Layak Sehat Dapur Dinas Kesehatan',
    certExpiryDate: '2026-12-30',
    lastMaintenanceDate: '2025-09-12',
    nextMaintenanceDate: '2026-03-12',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 140000000,
    issuesSummary: 'Beberapa kran dan pipa pembuangan air kotor di blok asrama timur bocor dan memerlukan peremajaan.',
  },

  // Politeknik KP Bitung
  {
    id: 'SAR-BTG-001',
    name: 'Kapal Latih KM. Airaha 02',
    satdikId: 'poltek-kp-bitung',
    satdikName: 'Politeknik Kelautan dan Perikanan Bitung',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi',
    condition: 'Baik',
    conditionScore: 86,
    acquisitionYear: 2012,
    valuation: 26000000000,
    utilizationRate: 82,
    capacityDesc: '320 GT, 35 Taruna Praktik Laut',
    specs: 'LOA: 42.5 m, Main Engine: Niigata 1200 HP, Pole and Line (Tuna Fishing), Sonar Furuno CSH-8L, Radar Furuno 2117',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI Kelas Laut Lepas & Ditjen Hubla',
    certExpiryDate: '2027-02-28',
    lastMaintenanceDate: '2025-10-05',
    nextMaintenanceDate: '2026-10-05',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 380000000,
    issuesSummary: 'Rutin beroperasi di perairan Maluku & Bitung untuk praktik huhate (pole and line).',
  },
  {
    id: 'SAR-BTG-002',
    name: 'Engine Room Simulator & Marine Workshop Bengkel Las',
    satdikId: 'poltek-kp-bitung',
    satdikName: 'Politeknik Kelautan dan Perikanan Bitung',
    category: 'permesinan_mekanisasi',
    subcategory: 'Simulator & Bengkel Mesin',
    condition: 'Baik',
    conditionScore: 90,
    acquisitionYear: 2018,
    valuation: 9200000000,
    utilizationRate: 88,
    capacityDesc: '12 Stasiun Kerja Mesin Taruna & 1 Main Control Console',
    specs: 'Kongsberg ERS-L11 Marine Diesel Simulator, 8 Unit Mesin Bubut Horizontal, 6 Mesin Las TIG/MIG inverter',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Ditjen Hubla (Standar STCW 2010 Teknika)',
    certExpiryDate: '2028-04-18',
    lastMaintenanceDate: '2026-01-22',
    nextMaintenanceDate: '2026-07-22',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 90000000,
    issuesSummary: 'Perangkat simulator bekerja dengan baik, pasokan elektroda las dan bahan praktik mencukupi.',
  },
  {
    id: 'SAR-BTG-003',
    name: 'Unit Pengolahan Ikan Tuna Loin & Cold Storage 50 Ton',
    satdikId: 'poltek-kp-bitung',
    satdikName: 'Politeknik Kelautan dan Perikanan Bitung',
    category: 'pengolahan_hasil',
    subcategory: 'UPI & Cold Chain',
    condition: 'Rusak Ringan',
    conditionScore: 74,
    acquisitionYear: 2015,
    valuation: 11200000000,
    utilizationRate: 70,
    capacityDesc: 'Cold Storage 50 Ton (-35°C), ABF 4 Ton',
    specs: 'Kompresor Sabroe Twin Screw Ammonia/Freon, Flake Ice Machine 5 Ton/Day, Meja Stainless Steel Grade 304',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'SKP Nilai A & HACCP KKP',
    certExpiryDate: '2026-11-20',
    lastMaintenanceDate: '2025-07-15',
    nextMaintenanceDate: '2026-01-15',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 280000000,
    issuesSummary: 'Mesin flake ice membutuhkan penggantian bantalan penggerak scraper es yang mulai aus dan menimbulkan getaran.',
  },

  // Politeknik KP Sorong
  {
    id: 'SAR-SRG-001',
    name: 'Kapal Latih KM. Frans Kaisiepo',
    satdikId: 'poltek-kp-sorong',
    satdikName: 'Politeknik Kelautan dan Perikanan Sorong',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi',
    condition: 'Rusak Berat',
    conditionScore: 25,
    acquisitionYear: 2009,
    valuation: 21500000000,
    utilizationRate: 15,
    capacityDesc: '200 GT, Kapasitas 25 Taruna',
    specs: 'LOA: 34.0 m, Breadth: 7.2 m, Main Engine Caterpillar 800 HP, Gillnet & Trolling Line',
    certificationStatus: 'Kadaluarsa',
    certificationAuthority: 'BKI & KSOP Sorong',
    certExpiryDate: '2024-08-10',
    lastMaintenanceDate: '2023-11-05',
    nextMaintenanceDate: '2024-05-05',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 1450000000,
    issuesSummary: 'Mesin induk mengalami kerusakan turbocharger dan poros propeller aus. Lambung kapal di bawah garis air penuh teritip. Kapal saat ini lego jangkar di perairan Sorong dan mendesak untuk dry-docking dan overhaul total.',
  },
  {
    id: 'SAR-SRG-002',
    name: 'Hatchery Ikan Kerapu & Teripang Pasir Saonek Raja Ampat',
    satdikId: 'poltek-kp-sorong',
    satdikName: 'Politeknik Kelautan dan Perikanan Sorong',
    category: 'budidaya_perikanan',
    subcategory: 'Hatchery Spesifik Lokal',
    condition: 'Baik',
    conditionScore: 87,
    acquisitionYear: 2018,
    valuation: 6200000000,
    utilizationRate: 80,
    capacityDesc: 'Produksi 300.000 Benih Kerapu Bebek/Tikus & Teripang',
    specs: '12 Bak Pembenihan Outdoor & Indoor, Pembangkit Listrik PLTS Hybrid 20 kWp, Genset Silent 40 kVA, Pompa Air Laut Sentrifugal Submersible',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikat CPIB Ditjen Budidaya KKP',
    certExpiryDate: '2027-04-12',
    lastMaintenanceDate: '2025-11-19',
    nextMaintenanceDate: '2026-05-19',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 95000000,
    issuesSummary: 'Sistem tenaga surya bekerja optimal menyuplai listrik pompa air laut dan aerasi 24 jam di pulau terpencil.',
  },
  {
    id: 'SAR-SRG-003',
    name: 'Dive Center & Kompresor Breathing Air Scuba Latih',
    satdikId: 'poltek-kp-sorong',
    satdikName: 'Politeknik Kelautan dan Perikanan Sorong',
    category: 'kelautan_konservasi',
    subcategory: 'Sarana Selam & Konservasi',
    condition: 'Baik',
    conditionScore: 93,
    acquisitionYear: 2021,
    valuation: 2100000000,
    utilizationRate: 92,
    capacityDesc: '40 Set Tabung Scuba Alumunium 80 cuft & BCD',
    specs: 'Kompresor Udara Bauer Poseidon PE-250 (300 Bar), Filling Station 4 Tabung Serentak, 40 Set Regulator Mares, 2 Unit Perahu Karet RIB 6m Mesin Tempel 85 HP',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'POSSI / CMAS & Sertifikasi Hydrotest Balai K3',
    certExpiryDate: '2028-09-10',
    lastMaintenanceDate: '2026-01-08',
    nextMaintenanceDate: '2026-07-08',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 35000000,
    issuesSummary: 'Pusat pelatihan sertifikasi selam ilmiah A1-A3 bagi taruna di kawasan perairan Raja Ampat.',
  },

  // Politeknik KP Karawang
  {
    id: 'SAR-KRW-001',
    name: 'Klaster Tambak Udang Super Intensif Millennial Shrimp Farm',
    satdikId: 'poltek-kp-karawang',
    satdikName: 'Politeknik Kelautan dan Perikanan Karawang',
    category: 'budidaya_perikanan',
    subcategory: 'Tambak Super Intensif',
    condition: 'Baik',
    conditionScore: 96,
    acquisitionYear: 2021,
    valuation: 8900000000,
    utilizationRate: 95,
    capacityDesc: '12 Kolam Bulat Terpal D30 & 6 Tambak HDPE Kotak, Target 40 Ton/Ha',
    specs: 'Oksigen Cair Liquid Oxygen Injection, Nanobubble Generator, IoT Water Monitoring Sensor (DO, pH, Salinitas, Suhu real-time), Automatic Feeder WiFi',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CBIB & IndoGAP Perikanan',
    certExpiryDate: '2028-01-20',
    lastMaintenanceDate: '2026-02-10',
    nextMaintenanceDate: '2026-08-10',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 70000000,
    issuesSummary: 'Model tambak presisi berbasis teknologi 4.0 dan percontohan nasional transfer teknologi ke petambak muda.',
  },
  {
    id: 'SAR-KRW-002',
    name: 'Laboratorium Dinamika Rancang Bangun Perahu & Fiber',
    satdikId: 'poltek-kp-karawang',
    satdikName: 'Politeknik Kelautan dan Perikanan Karawang',
    category: 'permesinan_mekanisasi',
    subcategory: 'Bengkel & Rancang Bangun',
    condition: 'Baik',
    conditionScore: 88,
    acquisitionYear: 2018,
    valuation: 3750000000,
    utilizationRate: 84,
    capacityDesc: 'Kapasitas Produksi 4 Perahu Nelayan FRP (Fiberglass) 5 GT / Tahun',
    specs: 'Cetakan Mold Lambung Perahu FRP 10m, Spray Gelcoat Roving, Exhaust Dust Collector, CNC Router 3-Axis',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI Klasifikasi Kapal Kecil',
    certExpiryDate: '2027-12-15',
    lastMaintenanceDate: '2025-10-18',
    nextMaintenanceDate: '2026-04-18',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 40000000,
    issuesSummary: 'Aktivitas rancang bangun kapal taruna berjalan lancar.',
  },

  // Politeknik KP Bone
  {
    id: 'SAR-BNE-001',
    name: 'Kapal Latih KM. Bone Raya 01',
    satdikId: 'poltek-kp-bone',
    satdikName: 'Politeknik Kelautan dan Perikanan Bone',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi',
    condition: 'Rusak Ringan',
    conditionScore: 72,
    acquisitionYear: 2017,
    valuation: 18900000000,
    utilizationRate: 75,
    capacityDesc: '180 GT, Kapasitas 28 Taruna',
    specs: 'LOA: 32.8 m, Main Engine Mitsubishi 650 HP, Purse Seine Gear dengan Power Block Hidrolik, Fish Finder Furuno FCV-295',
    certificationStatus: 'Perlu Pembaruan',
    certificationAuthority: 'BKI & Syahbandar Bajoe Bone',
    certExpiryDate: '2026-05-15',
    lastMaintenanceDate: '2025-05-10',
    nextMaintenanceDate: '2026-05-10',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 320000000,
    issuesSummary: 'Pompa hidrolik power block mengalami rembes oli dan sistem radio komunikasi SSB saluran frekuensi 8 MHz memerlukan penyetelan antena.',
  },
  {
    id: 'SAR-BNE-002',
    name: 'Hatchery Ikan Nila Salin & Kepiting Bakau Mangrove',
    satdikId: 'poltek-kp-bone',
    satdikName: 'Politeknik Kelautan dan Perikanan Bone',
    category: 'budidaya_perikanan',
    subcategory: 'Hatchery Pembenihan',
    condition: 'Baik',
    conditionScore: 85,
    acquisitionYear: 2018,
    valuation: 4800000000,
    utilizationRate: 82,
    capacityDesc: 'Kapasitas 800.000 Benih Nila Salin & 50.000 Crablet',
    specs: 'Bak Pembenihan Beton 20 Unit, Salinitas Kontrol 10-25 ppt, Sistem Aerasi Turbo Blower 3 HP x 2',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CPIB KKP',
    certExpiryDate: '2027-08-30',
    lastMaintenanceDate: '2025-12-14',
    nextMaintenanceDate: '2026-06-14',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 55000000,
    issuesSummary: 'Siklus pemijahan kepiting bakau (Scylla serrata) berhasil menghasilkan crablet sehat.',
  },

  // Politeknik KP Kupang
  {
    id: 'SAR-KPG-001',
    name: 'Balai Praktik Budidaya Rumput Laut & Kerapu Semau',
    satdikId: 'poltek-kp-kupang',
    satdikName: 'Politeknik Kelautan dan Perikanan Kupang',
    category: 'budidaya_perikanan',
    subcategory: 'Keramba Jaring Apung & Alga',
    condition: 'Rusak Ringan',
    conditionScore: 70,
    acquisitionYear: 2017,
    valuation: 5400000000,
    utilizationRate: 78,
    capacityDesc: '24 Lubang KJA HDPE Aquatec 3x3m & Lahan Tali Longline 2 Ha',
    specs: 'KJA Silinder HDPE Modular, Rumah Rakit Jaga, Solar Cell 5 kWp, Desalinasi Mini Reverse Osmosis',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CBIB KKP',
    certExpiryDate: '2026-10-14',
    lastMaintenanceDate: '2025-06-20',
    nextMaintenanceDate: '2026-06-20',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 110000000,
    issuesSummary: 'Beberapa jaring KJA terkorosi tiram tajam dan tali tambat jangkar utama perlu diperkuat menghadapi gelombang musim barat NTT.',
  },
  {
    id: 'SAR-KPG-002',
    name: 'Asrama Taruna Sasando & Dapur Umum Bahari',
    satdikId: 'poltek-kp-kupang',
    satdikName: 'Politeknik Kelautan dan Perikanan Kupang',
    category: 'sosial_pemberdayaan',
    subcategory: 'Asrama & Fasilitas Taruna',
    condition: 'Rusak Ringan',
    conditionScore: 62,
    acquisitionYear: 2016,
    valuation: 11800000000,
    utilizationRate: 98,
    capacityDesc: 'Daya Tampung 480 Taruna',
    specs: 'Gedung 3 Lantai Asrama, Tandon Air Bawah Tanah 100.000 Liter, Sistem Pompa Dorong Booster',
    certificationStatus: 'Tidak Wajib',
    certificationAuthority: 'Dinas PUPR Provinsi NTT',
    certExpiryDate: '2029-01-01',
    lastMaintenanceDate: '2025-04-10',
    nextMaintenanceDate: '2025-10-10',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 340000000,
    issuesSummary: 'Krisis debit air bersih di musim kemarau karena pompa submersible sumur bor utama rusak terbakar. Pipa distribusi asrama mengalami kerak kapur tinggi.',
  },

  // Politeknik KP Dumai
  {
    id: 'SAR-DMI-001',
    name: 'Laboratorium Simulator Kenavigasian & ECDIS Selat Malaka',
    satdikId: 'poltek-kp-dumai',
    satdikName: 'Politeknik Kelautan dan Perikanan Dumai',
    category: 'penangkapan_ikan',
    subcategory: 'Simulator Kenavigasian',
    condition: 'Baik',
    conditionScore: 91,
    acquisitionYear: 2019,
    valuation: 8500000000,
    utilizationRate: 89,
    capacityDesc: 'Simulator 240 Derajat dengan Alur Pelayaran Selat Malaka TSS',
    specs: 'Konsol Kemudi Otomatis Anschuetz, Radar JRC 28-Mile, AIS Class A Transponder, Sounder Furuno',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Ditjen Perhubungan Laut & IMO Model',
    certExpiryDate: '2027-11-05',
    lastMaintenanceDate: '2025-12-18',
    nextMaintenanceDate: '2026-06-18',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 75000000,
    issuesSummary: 'Skenario navigasi alur pelayaran ramai Selat Malaka terpasang dan diperbarui.',
  },
  {
    id: 'SAR-DMI-002',
    name: 'Unit Pengolahan Ikan Terubuk & Patin Asap Tradisional-Modern',
    satdikId: 'poltek-kp-dumai',
    satdikName: 'Politeknik Kelautan dan Perikanan Dumai',
    category: 'pengolahan_hasil',
    subcategory: 'UPI & TEFA',
    condition: 'Baik',
    conditionScore: 88,
    acquisitionYear: 2018,
    valuation: 3800000000,
    utilizationRate: 85,
    capacityDesc: '500 kg Ikan Asap Kering / Hari',
    specs: 'Lemari Asap Stainless Steel Berpengatur Suhu & Asap Cair (Liquid Smoke), Sealer Vacuum Otomatis, Dehydrator Suhu Rendah',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'SKP & P-IRT Kemenkes',
    certExpiryDate: '2027-07-22',
    lastMaintenanceDate: '2026-01-25',
    nextMaintenanceDate: '2026-07-25',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 35000000,
    issuesSummary: 'Hasil produk olahan ikan asap taruna menjadi suvenir khas kelautan Riau.',
  },

  // Politeknik KP Pangandaran
  {
    id: 'SAR-PNG-001',
    name: 'Hatchery Lobster & Rajungan Pantai Pasir Putih',
    satdikId: 'poltek-kp-pangandaran',
    satdikName: 'Politeknik Kelautan dan Perikanan Pangandaran',
    category: 'budidaya_perikanan',
    subcategory: 'Hatchery Krustasea',
    condition: 'Baik',
    conditionScore: 90,
    acquisitionYear: 2019,
    valuation: 5900000000,
    utilizationRate: 86,
    capacityDesc: 'Kapasitas 100.000 Benih Bening Lobster (BBL) / Siklus Pendederan',
    specs: 'Sistem RAS (Recirculating Aquaculture System) Tertutup, Protein Skimmer 5000L/h, Chiller Pengatur Suhu Air Laut 22-26°C',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikasi Budidaya Berkelanjutan KKP',
    certExpiryDate: '2028-02-12',
    lastMaintenanceDate: '2026-02-05',
    nextMaintenanceDate: '2026-08-05',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 60000000,
    issuesSummary: 'Pusat riset dan praktik pembesaran lobster pasir dan mutiara taruna.',
  },
  {
    id: 'SAR-PNG-002',
    name: 'Dermaga Latih & Bengkel Mesin Tempel Nelayan',
    satdikId: 'poltek-kp-pangandaran',
    satdikName: 'Politeknik Kelautan dan Perikanan Pangandaran',
    category: 'permesinan_mekanisasi',
    subcategory: 'Dermaga & Bengkel',
    condition: 'Rusak Ringan',
    conditionScore: 55,
    acquisitionYear: 2017,
    valuation: 7200000000,
    utilizationRate: 50,
    capacityDesc: 'Dermaga Terapung 60m & Bengkel Servis 6 Perahu Bersamaan',
    specs: 'Ponton Apung HDPE Cubisystem, Gangway Baja Galvanis, Crane Hoist 3 Ton, Test Tank Mesin Tempel 2-Stroke & 4-Stroke',
    certificationStatus: 'Perlu Pembaruan',
    certificationAuthority: 'Dinas Perhubungan Laut & Kelautan Kab. Pangandaran',
    certExpiryDate: '2025-12-30',
    lastMaintenanceDate: '2024-11-10',
    nextMaintenanceDate: '2025-05-10',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 520000000,
    issuesSummary: 'Abrasi gelombang pantai selatan merusak engsel sambungan ponton dermaga terapung barat. Gangway mengalami kemiringan 15 derajat saat pasang tinggi dan membahayakan taruna naik perahu.',
  },

  // Politeknik KP Jembrana
  {
    id: 'SAR-JMB-001',
    name: 'Unit Pengolahan Ikan Lemuru & Lab Pengalengan Sarden Pengambengan',
    satdikId: 'poltek-kp-jembrana',
    satdikName: 'Politeknik Kelautan dan Perikanan Jembrana',
    category: 'pengolahan_hasil',
    subcategory: 'UPI & Pengalengan',
    condition: 'Baik',
    conditionScore: 92,
    acquisitionYear: 2019,
    valuation: 6800000000,
    utilizationRate: 90,
    capacityDesc: 'Kapasitas Pengolahan 3 Ton Ikan Lemuru / Hari',
    specs: 'Mesin Potong Kepala Ikan Heading Machine, Rotary Seamer Semi Otomatis, Steam Retort Horisontal 1.000 Kaleng/Siklus, Lab Sensori Organoleptik 12 Bilik',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'SKP & BPOM MD',
    certExpiryDate: '2028-05-20',
    lastMaintenanceDate: '2026-01-30',
    nextMaintenanceDate: '2026-07-30',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 65000000,
    issuesSummary: 'Bekerja sama erat dengan industri pengalengan sarden di pelabuhan Pengambengan.',
  },

  // Akademi Komunitas KP Wakatobi
  {
    id: 'SAR-WKT-001',
    name: 'Pusat Praktik Konservasi Terumbu Karang & Ekowisata Bahari Wangi-Wangi',
    satdikId: 'akkp-wakatobi',
    satdikName: 'Akademi Komunitas KP Wakatobi',
    category: 'kelautan_konservasi',
    subcategory: 'Konservasi & Ekowisata',
    condition: 'Baik',
    conditionScore: 89,
    acquisitionYear: 2019,
    valuation: 3200000000,
    utilizationRate: 85,
    capacityDesc: '30 Set Selam Scuba, 2 Kapal Glass-Bottom Catamaran',
    specs: 'Kapal Pengamatan Bawah Laut Kaca Katamaran LOA 11m Twin Mesin 115 HP, 30 Tabung Udara, Lab Taksonomi Karang & Ikan Karang',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Balai Taman Nasional Wakatobi & POSSI',
    certExpiryDate: '2027-09-08',
    lastMaintenanceDate: '2025-12-10',
    nextMaintenanceDate: '2026-06-10',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 45000000,
    issuesSummary: 'Sarana unggulan pembelajaran konservasi biosfer Wakatobi.',
  },

  // SUPM Ladong (Aceh)
  {
    id: 'SAR-LDG-001',
    name: 'Kapal Latih KM. Ladong Bahari 01',
    satdikId: 'supm-ladong',
    satdikName: 'SUPM Ladong Aceh',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi Menengah',
    condition: 'Rusak Ringan',
    conditionScore: 71,
    acquisitionYear: 2013,
    valuation: 12500000000,
    utilizationRate: 68,
    capacityDesc: '95 GT, 20 Siswa Taruna',
    specs: 'LOA: 26.5 m, Mesin Yanmar 450 HP, Alat Tangkap Pancing Ulur & Gillnet Hanyut, Radar Garmin 48nm',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI & Syahbandar Malahayati Krueng Raya',
    certExpiryDate: '2026-08-25',
    lastMaintenanceDate: '2025-06-18',
    nextMaintenanceDate: '2026-06-18',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 220000000,
    issuesSummary: 'Sistem generator bantu aux-engine genset 15 kVA mengalami penurunan kompresi dan mengeluarkan asap putih pekat saat beban penuh.',
  },
  {
    id: 'SAR-LDG-002',
    name: 'Asrama Taruna Teuku Umar & Ruang Makan Menza',
    satdikId: 'supm-ladong',
    satdikName: 'SUPM Ladong Aceh',
    category: 'sosial_pemberdayaan',
    subcategory: 'Asrama & Menza',
    condition: 'Baik',
    conditionScore: 83,
    acquisitionYear: 2012,
    valuation: 7800000000,
    utilizationRate: 94,
    capacityDesc: 'Kapasitas 350 Ranjang Tingkat Siswa',
    specs: 'Bangunan 2 Lantai Tahan Gempa, Sanitasi Air Bersih Mata Air Krueng Raya, Ruang Belajar Terbuka',
    certificationStatus: 'Tidak Wajib',
    certificationAuthority: 'Dinas Perkim Aceh',
    certExpiryDate: '2030-01-01',
    lastMaintenanceDate: '2025-10-02',
    nextMaintenanceDate: '2026-04-02',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 80000000,
    issuesSummary: 'Kondisi bangunan terawat dengan baik pasca pemeliharaan cat dan atap seng.',
  },

  // SUPM Pariaman (Sumbar)
  {
    id: 'SAR-PRM-001',
    name: 'Kapal Latih KM. Pariaman Bahari 02',
    satdikId: 'supm-pariaman',
    satdikName: 'SUPM Pariaman',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi Menengah',
    condition: 'Rusak Berat',
    conditionScore: 28,
    acquisitionYear: 2008,
    valuation: 11000000000,
    utilizationRate: 10,
    capacityDesc: '85 GT, 18 Siswa Taruna',
    specs: 'LOA: 24.0 m, Main Engine Daewoo 360 HP, Tuna Longline Gear, Furuno Sounder',
    certificationStatus: 'Kadaluarsa',
    certificationAuthority: 'BKI & Syahbandar Teluk Bayur',
    certExpiryDate: '2024-03-12',
    lastMaintenanceDate: '2023-08-15',
    nextMaintenanceDate: '2024-02-15',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 890000000,
    issuesSummary: 'Kerusakan poros as baling-baling bocor pada stern tube gland packing saat mesin dihidupkan, generator utama mati total, sertifikat keselamatan kapal mati sejak 2024.',
  },
  {
    id: 'SAR-PRM-002',
    name: 'Laboratorium Pengolahan Hasil Laut & TEFA Dendeng Tuna & Randang Belut',
    satdikId: 'supm-pariaman',
    satdikName: 'SUPM Pariaman',
    category: 'agribisnis_perikanan',
    subcategory: 'TEFA Pengolahan Tradisional',
    condition: 'Baik',
    conditionScore: 89,
    acquisitionYear: 2017,
    valuation: 2600000000,
    utilizationRate: 88,
    capacityDesc: 'Kapasitas Produksi 200 kg Randang Ikan Tuna / Hari',
    specs: 'Kuali Pengaduk Otomatis Berpemanas Gas LPG, Mesin Pengering Minyak Spinner 25 kg, Sealer Aluminium Foil Stand-Pouch',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'P-IRT & Halal Kemenag Sumbar',
    certExpiryDate: '2027-10-18',
    lastMaintenanceDate: '2025-11-20',
    nextMaintenanceDate: '2026-05-20',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 35000000,
    issuesSummary: 'Produk TEFA terjual luas pada gerai oleh-oleh Sumatera Barat.',
  },

  // SUPM Kotaagung (Lampung)
  {
    id: 'SAR-KTG-001',
    name: 'Tambak Pembesaran Udang Vaname Way Gelang',
    satdikId: 'supm-kotaagung',
    satdikName: 'SUPM Kotaagung Lampung',
    category: 'budidaya_perikanan',
    subcategory: 'Tambak Budidaya',
    condition: 'Baik',
    conditionScore: 86,
    acquisitionYear: 2016,
    valuation: 4200000000,
    utilizationRate: 84,
    capacityDesc: '6 Petak Tambak Plastik Mulsa @800 m²',
    specs: 'Pompa Celup Air Laut 4 Inch x 4 Unit, Kincir Taiwan 1 HP x 16, Saluran Pasok & Buang Terpisah, Tandon Biofilter Ikan Nila',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CBIB KKP',
    certExpiryDate: '2027-06-15',
    lastMaintenanceDate: '2025-12-01',
    nextMaintenanceDate: '2026-06-01',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 45000000,
    issuesSummary: 'Survival Rate (SR) udang mencapai 86% pada siklus tebar terakhir.',
  },
  {
    id: 'SAR-KTG-002',
    name: 'Bengkel Mesin Perkapalan & Bubut SUPM Kotaagung',
    satdikId: 'supm-kotaagung',
    satdikName: 'SUPM Kotaagung Lampung',
    category: 'permesinan_mekanisasi',
    subcategory: 'Bengkel Mesin',
    condition: 'Rusak Ringan',
    conditionScore: 73,
    acquisitionYear: 2014,
    valuation: 3100000000,
    utilizationRate: 78,
    capacityDesc: '30 Siswa Praktik Mesin Bersamaan',
    specs: '4 Mesin Bubut Logam C6240, 2 Mesin Frais Universal, 6 Meja Las Listrik SMAW, Mesin Bor Duduk',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Sertifikasi K3 Balai Ketenagakerjaan',
    certExpiryDate: '2026-11-10',
    lastMaintenanceDate: '2025-07-28',
    nextMaintenanceDate: '2026-01-28',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 75000000,
    issuesSummary: 'Gearbox pada mesin bubut unit 2 macet pada putaran tinggi dan membutuhkan perbaikan roda gigi internal.',
  },

  // SUPM Tegal (Jawa Tengah)
  {
    id: 'SAR-TGL-001',
    name: 'Kapal Latih KM. Bahari Mandiri 01',
    satdikId: 'supm-tegal',
    satdikName: 'SUPM Tegal',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi Menengah',
    condition: 'Baik',
    conditionScore: 88,
    acquisitionYear: 2015,
    valuation: 15400000000,
    utilizationRate: 85,
    capacityDesc: '120 GT, Kapasitas 24 Siswa Taruna',
    specs: 'LOA: 28.5 m, Main Engine Mitsubishi 600 HP, Gillnet Dasar & Rawai Dasar, Radar JRC 36 Mil',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'BKI & Syahbandar Pelabuhan Perikanan Samudera Tegal',
    certExpiryDate: '2027-05-18',
    lastMaintenanceDate: '2025-11-25',
    nextMaintenanceDate: '2026-11-25',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 190000000,
    issuesSummary: 'Aktif berlayar di perairan Laut Jawa Utara untuk praktik kenavigasian taruna tingkat II & III.',
  },
  {
    id: 'SAR-TGL-002',
    name: 'Gedung Workshop Alat Tangkap & Kolam Uji Dinamika Jaring',
    satdikId: 'supm-tegal',
    satdikName: 'SUPM Tegal',
    category: 'penangkapan_ikan',
    subcategory: 'Bengkel & Uji Jaring',
    condition: 'Baik',
    conditionScore: 92,
    acquisitionYear: 2016,
    valuation: 4100000000,
    utilizationRate: 88,
    capacityDesc: 'Area Jahit Jaring 450 m², Kolam Uji Flume Tank Skala Mini',
    specs: 'Lantai Kerja Kayu Jati Terbuka Bebas Tiang, Rak Penyimpanan Webbing PA/PE 50 Roll, Alat Uji Kekuatan Benang Tensile Tester',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'Standar SNI Alat Tangkap Ramah Lingkungan',
    certExpiryDate: '2028-04-10',
    lastMaintenanceDate: '2026-01-12',
    nextMaintenanceDate: '2026-07-12',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 40000000,
    issuesSummary: 'Pusat keahlian perakitan cantrang ramah lingkungan dan gillnet milenium.',
  },
  {
    id: 'SAR-TGL-003',
    name: 'Unit Pengolahan Ikan & Cold Storage 15 Ton Martoloyo',
    satdikId: 'supm-tegal',
    satdikName: 'SUPM Tegal',
    category: 'pengolahan_hasil',
    subcategory: 'UPI & Cold Chain',
    condition: 'Rusak Ringan',
    conditionScore: 75,
    acquisitionYear: 2014,
    valuation: 5200000000,
    utilizationRate: 72,
    capacityDesc: 'Cold Storage 15 Ton, ABF 1.5 Ton/Batch',
    specs: 'Kompresor Maneurop 15 PK Freon R404A, Meja Filet Stainless Steel, Mesin Pembuat Flake Ice 2 Ton/Hari',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'SKP KKP & Sertifikat HACCP',
    certExpiryDate: '2026-09-15',
    lastMaintenanceDate: '2025-08-20',
    nextMaintenanceDate: '2026-02-20',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 115000000,
    issuesSummary: 'Karet gasket pintu kedap cold storage telah getas menyebabkan bunga es cepat menebal di koil evaporator.',
  },

  // SUPM Pontianak (Kalbar)
  {
    id: 'SAR-PTK-001',
    name: 'Balai Budidaya Ikan Air Tawar & Hatchery Jelawat Sungai Raya',
    satdikId: 'supm-pontianak',
    satdikName: 'SUPM Pontianak',
    category: 'budidaya_perikanan',
    subcategory: 'Hatchery Ikan Lokal Endemik',
    condition: 'Baik',
    conditionScore: 89,
    acquisitionYear: 2017,
    valuation: 4600000000,
    utilizationRate: 86,
    capacityDesc: 'Produksi 600.000 Benih Ikan Jelawat, Baung & Patin',
    specs: 'Bak Pemijahan Sirkulasi Tertutup, Kolam Pendederan Semi-Intensif 1.200 m² x 4, Sistem Filtrasi Bioball & Zeolit',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CPIB KKP',
    certExpiryDate: '2027-11-28',
    lastMaintenanceDate: '2025-12-15',
    nextMaintenanceDate: '2026-06-15',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 50000000,
    issuesSummary: 'Konservasi dan pembudidayaan ikan endemik Sungai Kapuas berjalan sukses.',
  },
  {
    id: 'SAR-PTK-002',
    name: 'Kapal Latih KM. Kapuas Bahari 01',
    satdikId: 'supm-pontianak',
    satdikName: 'SUPM Pontianak',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Sungai & Estuari',
    condition: 'Rusak Ringan',
    conditionScore: 74,
    acquisitionYear: 2015,
    valuation: 8900000000,
    utilizationRate: 70,
    capacityDesc: '75 GT, Kapasitas 18 Siswa Taruna',
    specs: 'LOA: 22.0 m, Mesin Weichai 320 HP, Draft Dangkal Cocok untuk Muara Kapuas, GPS & Echo Sounder Garmin',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'KSOP Pontianak & BKI',
    certExpiryDate: '2026-12-10',
    lastMaintenanceDate: '2025-06-30',
    nextMaintenanceDate: '2026-06-30',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 160000000,
    issuesSummary: 'Korosi lumpur payau pada kemudi dan propeller memerlukan pembersihan dan penggantian zinc anode sacrificial.',
  },

  // SUPM Sorong (Papua Barat Daya)
  {
    id: 'SAR-SSO-001',
    name: 'Tambak Percontohan & Hatchery Air Payau Klakublik Sorong',
    satdikId: 'supm-sorong',
    satdikName: 'SUPM Sorong',
    category: 'budidaya_perikanan',
    subcategory: 'Tambak Budidaya',
    condition: 'Baik',
    conditionScore: 87,
    acquisitionYear: 2016,
    valuation: 3900000000,
    utilizationRate: 85,
    capacityDesc: '4 Petak Tambak @1.500 m²',
    specs: 'Tanggul Tanah Dipadatkan Berlapis Terpal, Pintu Air Pasut Monik Kayu Ulin, Kincir Air 1 HP x 8',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CBIB KKP',
    certExpiryDate: '2027-08-20',
    lastMaintenanceDate: '2025-11-12',
    nextMaintenanceDate: '2026-05-12',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 40000000,
    issuesSummary: 'Hasil panen udang windu bebas antibiotik dan dipasok ke UPI mitra.',
  },
  {
    id: 'SAR-SSO-002',
    name: 'Gedung Asrama Siswa Taruna Cenderawasih Sorong',
    satdikId: 'supm-sorong',
    satdikName: 'SUPM Sorong',
    category: 'sosial_pemberdayaan',
    subcategory: 'Asrama Taruna',
    condition: 'Rusak Ringan',
    conditionScore: 77,
    acquisitionYear: 2013,
    valuation: 6500000000,
    utilizationRate: 95,
    capacityDesc: 'Daya Tampung 320 Siswa Taruna',
    specs: 'Gedung 2 Lantai, Kamar Siswa Kapasitas 8 Orang, Fasilitas Jemuran Terpadu, Ruang Rohani',
    certificationStatus: 'Tidak Wajib',
    certificationAuthority: 'Dinas Tata Ruang Kota Sorong',
    certExpiryDate: '2030-01-01',
    lastMaintenanceDate: '2025-08-14',
    nextMaintenanceDate: '2026-02-14',
    maintenanceUrgency: 'Medium',
    estimatedRepairCost: 85000000,
    issuesSummary: 'Pengecatan ulang dan perbaikan jaringan instalasi air bersih serta talang atap blok asrama taruna.',
  },

  // SUPM Waiheru Ambon (Maluku)
  {
    id: 'SAR-WHR-001',
    name: 'Kapal Latih KM. Siwalima 01',
    satdikId: 'supm-waiheru',
    satdikName: 'SUPM Waiheru Ambon',
    category: 'penangkapan_ikan',
    subcategory: 'Kapal Latih Vokasi Menengah',
    condition: 'Rusak Ringan',
    conditionScore: 60,
    acquisitionYear: 2011,
    valuation: 14800000000,
    utilizationRate: 45,
    capacityDesc: '110 GT, Kapasitas 22 Siswa Taruna',
    specs: 'LOA: 27.2 m, Main Engine Cummins 500 HP, Handline & Tuna Longline, Furuno Radar & GPS Navigator',
    certificationStatus: 'Perlu Pembaruan',
    certificationAuthority: 'BKI & KSOP Pelabuhan Yos Sudarso Ambon',
    certExpiryDate: '2025-11-20',
    lastMaintenanceDate: '2024-09-10',
    nextMaintenanceDate: '2025-03-10',
    maintenanceUrgency: 'Kritis / Segera',
    estimatedRepairCost: 580000000,
    issuesSummary: 'Sistem kemudi elektro-hidrolik bocor seal silinder dan kompresor pendingin palka ikan tidak dapat mencapai suhu beku (-5°C maksimal). Memerlukan perbaikan di galangan kapal Ambon.',
  },
  {
    id: 'SAR-WHR-002',
    name: 'Teaching Factory Pengasapan Ikan Cakalang Fufu & Abon Ikan Laut Banda',
    satdikId: 'supm-waiheru',
    satdikName: 'SUPM Waiheru Ambon',
    category: 'agribisnis_perikanan',
    subcategory: 'TEFA Pengolahan Tradisional',
    condition: 'Baik',
    conditionScore: 91,
    acquisitionYear: 2018,
    valuation: 3400000000,
    utilizationRate: 92,
    capacityDesc: 'Kapasitas 800 kg Cakalang Fufu / Hari',
    specs: '6 Rumah Asap Tradisional Higienis Sabut Kelapa, Mesin Suwir Daging Ikan Abon, Spinner Minyak 25 kg, Vacuum Packaging',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'SKP & P-IRT Dinkes Kota Ambon',
    certExpiryDate: '2028-03-15',
    lastMaintenanceDate: '2026-01-18',
    nextMaintenanceDate: '2026-07-18',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 35000000,
    issuesSummary: 'Produk Cakalang Fufu SUPM Waiheru menjadi suvenir resmi kunjungan dinas dan dipasarkan ke retail lokal.',
  },
  {
    id: 'SAR-WHR-003',
    name: 'Keramba Jaring Apung Teluk Baguala Ambon',
    satdikId: 'supm-waiheru',
    satdikName: 'SUPM Waiheru Ambon',
    category: 'budidaya_perikanan',
    subcategory: 'KJA Budidaya Laut',
    condition: 'Baik',
    conditionScore: 86,
    acquisitionYear: 2019,
    valuation: 2900000000,
    utilizationRate: 84,
    capacityDesc: '16 Kantong KJA HDPE 3x3m untuk Pembesaran Ikan Kakap Putih & Kuwe',
    specs: 'Pipa HDPE Ketebalan 20mm Anti-Gelombang, Jaring Tanpa Simpul Knotless Netting PE, Dermaga Apung Akses Taruna',
    certificationStatus: 'Tersertifikasi Aktif',
    certificationAuthority: 'CBIB KKP',
    certExpiryDate: '2027-04-20',
    lastMaintenanceDate: '2025-11-05',
    nextMaintenanceDate: '2026-05-05',
    maintenanceUrgency: 'Normal',
    estimatedRepairCost: 45000000,
    issuesSummary: 'Pertumbuhan ikan kakap putih mencapai target panen 600-800 gram per ekor.',
  }
];

// Standar Kebutuhan Sarpras Vokasi KKP & Target Kinerja Nasional
  const NATIONAL_SARPRAS_TARGETS = {
  targetIndeksKelayakan: 85.0, // Target persentase kelayakan minimal nasional (%)
  targetIndeksKelaikan: 85.0, // Backward compatibility
  maxPersentaseRusakBerat: 5.0, // Maksimal persentase sarpras rusak berat (%)
  rasioBedTarunaTarget: 1.0, // 1 tempat tidur per taruna
  jamPraktikKapalLatihTarget: 60, // Minimal jam praktik berlayar per taruna per semester
  totalAlokasiAPBNTahunanRp: 45000000000, // Rp 45 Miliar anggaran pemeliharaan & rehab nasional
};



// Generates a comprehensive dataset of 100+ assets ensuring all 18 Satdik have rich, realistic sarpras

  function normalizeCategory(cat, asset = {}) {
  if (!cat) return 'penangkapan_ikan';
  const c = String(cat).toLowerCase().trim();
  const sub = String(asset?.subcategory || '').toLowerCase();
  const name = String(asset?.name || '').toLowerCase();
  const itemText = `${sub} ${name}`;
  const text = `${c} ${sub} ${name}`;

  if (c === 'penangkapan_ikan' || c === 'penangkapan ikan') return 'penangkapan_ikan';
  if (c === 'permesinan_mekanisasi' || c === 'permesinan dan mekanisasi') return 'permesinan_mekanisasi';
  if (c === 'budidaya_perikanan' || c === 'budidaya perikanan' || c === 'akuakultur') return 'budidaya_perikanan';
  if (c === 'pengolahan_hasil' || c === 'pengolahan hasil perikanan' || c === 'pengolahan hasil perikanan/laut' || c === 'pengolahan_upi') return 'pengolahan_hasil';
  if (c === 'agribisnis_perikanan' || c === 'agribisnis perikanan') return 'agribisnis_perikanan';
  if (c === 'kelautan_konservasi' || c === 'kelautan, konservasi, dan pengolahan lingkungan' || c === 'konservasi_pariwisata' || c === 'konservasi dan pariwisata') return 'kelautan_konservasi';
  if (c === 'sosial_pemberdayaan' || c === 'sosial & pemberdayaan masyarakat' || c === 'sosial dan pemberdayaan masyarakat') return 'sosial_pemberdayaan';
  if (c === 'administrasi_umum' || c === 'administrasi & umum' || c === 'administasi & umum' || c === 'administasi_umum') return 'administrasi_umum';

  // Legacy mappings: penangkapan_mesin
  if (c === 'penangkapan_mesin' || c.includes('penangkapan ikan dan permesinan kapal')) {
    if (/mesin|bengkel|las|bubut|diesel|motor|mekanisasi/i.test(itemText)) {
      return 'permesinan_mekanisasi';
    }
    return 'penangkapan_ikan';
  }

  // Legacy: maritim_kapal / alat_tangkap
  if (c === 'maritim_kapal' || c === 'alat_tangkap') {
    if (/mesin|bengkel|las|bubut|motor/i.test(itemText)) return 'permesinan_mekanisasi';
    return 'penangkapan_ikan';
  }

  // Legacy: agribisnis_penyuluhan
  if (c === 'agribisnis_penyuluhan' || c.includes('agribisnis, pengolahan')) {
    if (/asrama|menza|siswa|taruna|karakter|penyuluhan|sosial/i.test(itemText)) {
      return 'sosial_pemberdayaan';
    }
    return 'agribisnis_perikanan';
  }

  // Legacy: konservasi_pariwisata
  if (c === 'konservasi_pariwisata' || c.includes('konservasi dan pariwisata')) {
    if (/asrama|menza|siswa|taruna/i.test(itemText)) {
      return 'sosial_pemberdayaan';
    }
    return 'kelautan_konservasi';
  }

  // Legacy: asrama_penunjang
  if (c === 'asrama_penunjang') return 'sosial_pemberdayaan';
  if (c === 'tefa') return 'agribisnis_perikanan';

  // Fallback by keyword search
  if (/mesin|bengkel|las|bubut|motor|mekanisasi/i.test(text)) return 'permesinan_mekanisasi';
  if (/kapal|navigasi|simulator|nautika|tangkap|jaring|sonar/i.test(text)) return 'penangkapan_ikan';
  if (/tambak|hatchery|akuakultur|benih|bioflok|kolam|kja/i.test(text)) return 'budidaya_perikanan';
  if (/cold storage|upi|beku|freezer|abf|pengalengan|mutu/i.test(text)) return 'pengolahan_hasil';
  if (/tefa|bisnis|agribisnis|produk|gerai|kantin/i.test(text)) return 'agribisnis_perikanan';
  if (/dive|selam|konservasi|terumbu|mangrove|bahari|wisata/i.test(text)) return 'kelautan_konservasi';
  if (/asrama|menza|taruna|siswa|komunikasi|penyuluhan|sosial/i.test(text)) return 'sosial_pemberdayaan';
  if (/rektorat|kantor|administrasi|administasi|layanan|tata usaha/i.test(text)) return 'administrasi_umum';

  return 'penangkapan_ikan';
}

  function getProdiForAsset(asset, satdik) {
  if (asset.prodi && typeof asset.prodi === 'string' && asset.prodi.trim()) return asset.prodi.trim();
  const campus = satdik || SATDIK_LIST.find(s => s.id === asset.satdikId);
  const prodis = campus?.prodi || [];
  if (prodis.length === 0) return 'Semua Program Studi (Umum)';

  const cat = normalizeCategory(asset.category, asset);
  const text = `${asset.name || ''} ${asset.specs || ''}`.toLowerCase();

  // Fasilitas umum / pendukung non-teknis / administrasi
  if (cat === 'administrasi_umum' || /asrama|menza|gedung kantor|layanan terpadu|senat|tata usaha|utilitas/i.test(text)) {
    return 'Semua Program Studi (Umum)';
  }

  // Cari prodi yang resmi terhubung dengan kategori bidang sarpras ini
  const targetProdis = getProdisForCategory(cat);
  if (targetProdis && targetProdis.length > 0) {
    // Utamakan prodi yang memang dimiliki oleh kampus
    const match = prodis.find(p => targetProdis.includes(p));
    if (match) return match;
    // Jika kampus belum memiliki prodi tersebut secara spesifik, gunakan prodi standar bidang
    return targetProdis[0];
  }

  return prodis[0] || 'Semua Program Studi (Umum)';
}

  function getFullSarprasData() {
  const assets = [...INITIAL_SARPRAS_DATA].map(a => ({ ...a, category: normalizeCategory(a.category, a) }));

  // Helper to check existing count per satdik
  const countPerSatdik = {};
  assets.forEach(a => {
    countPerSatdik[a.satdikId] = (countPerSatdik[a.satdikId] || 0) + 1;
  });

  // Additional assets template for institutions that need full representation
  const additionalTemplates = [
    {
      satdikId: 'poltek-kp-dumai',
      category: 'permesinan_mekanisasi',
      subcategory: 'Bengkel Permesinan Kapal',
      name: 'Bengkel Bubut & Fabrikasi Mesin Kapal Dumai',
      specs: '5 Unit Mesin Bubut Metal 3-Phase, 4 Unit Mesin Las SMAW & GTAW Argon, Crane Gantry 5 Ton',
      condition: 'Baik',
      conditionScore: 88,
      acquisitionYear: 2018,
      valuation: 4200000000,
      utilizationRate: 85,
      capacityDesc: '40 Taruna Praktik Mesin',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'Ditjen Hubla STCW Teknika',
      certExpiryDate: '2027-04-10',
      lastMaintenanceDate: '2025-11-20',
      nextMaintenanceDate: '2026-05-20',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 60000000,
      issuesSummary: 'Operasional normal untuk praktik taruna prodi Permesinan Perikanan.',
    },
    {
      satdikId: 'poltek-kp-dumai',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Gedung Asrama Lancang Kuning Taruna Dumai',
      specs: 'Gedung 3 Lantai, 80 Kamar, Sistem Filter Air Payau Menjadi Tawar (SWRO 20 m³/hari)',
      condition: 'Baik',
      conditionScore: 86,
      acquisitionYear: 2017,
      valuation: 12500000000,
      utilizationRate: 95,
      capacityDesc: '420 Ranjang Taruna Lengkap',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kota Dumai',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-10-15',
      nextMaintenanceDate: '2026-04-15',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 110000000,
      issuesSummary: 'Unit SWRO (Sea Water Reverse Osmosis) berfungsi prima memasok kebutuhan air bersih asrama.',
    },
    {
      satdikId: 'poltek-kp-dumai',
      category: 'administrasi_umum',
      subcategory: 'Gedung Kantor & Administrasi',
      name: 'Gedung Administrasi & Pusat Layanan Akademik Dumai',
      specs: 'Gedung 2 Lantai, Ruang Tata Usaha, Ruang Dosen & Rapat Senat, Jaringan LAN Fiber Optic 1 Gbps',
      condition: 'Baik',
      conditionScore: 90,
      acquisitionYear: 2019,
      valuation: 6500000000,
      utilizationRate: 91,
      capacityDesc: 'Kapasitas 60 Staf & Dosen',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas Tata Ruang Kota Dumai',
      certExpiryDate: '2031-12-31',
      lastMaintenanceDate: '2025-11-10',
      nextMaintenanceDate: '2026-05-10',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 45000000,
      issuesSummary: 'Kondisi operasional kantor dan layanan administrasi akademik lancar.',
    },
    {
      satdikId: 'poltek-kp-karawang',
      category: 'pengolahan_hasil',
      subcategory: 'UPI & Laboratorium Pengujian',
      name: 'Unit Pengolahan Ikan Latih & Laboratorium Mutu Mikrobiologi',
      specs: 'Cleanroom Class 10.000, Mesin Vakum Thermoforming, Biosafety Cabinet Level 2, Autoclave Vertikal',
      condition: 'Baik',
      conditionScore: 92,
      acquisitionYear: 2020,
      valuation: 7100000000,
      utilizationRate: 88,
      capacityDesc: 'Kapasitas 1.5 Ton/Hari Produk Olahan Beku',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'SKP KKP & ISO 17025',
      certExpiryDate: '2028-08-20',
      lastMaintenanceDate: '2026-01-20',
      nextMaintenanceDate: '2026-07-20',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 80000000,
      issuesSummary: 'Terakreditasi pengujian Salmonella, E.coli, dan Histamin produk perikanan.',
    },
    {
      satdikId: 'poltek-kp-karawang',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Taruna Tarumanegara & Menza Bahari',
      specs: 'Gedung 3 Lantai, Kapasitas 480 Tempat Tidur, Menza Berkapasitas 500 Taruna, Lapangan Apel',
      condition: 'Baik',
      conditionScore: 90,
      acquisitionYear: 2017,
      valuation: 14800000000,
      utilizationRate: 98,
      capacityDesc: '480 Tempat Tidur Taruna',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas Cipta Karya Kab. Karawang',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-12-05',
      nextMaintenanceDate: '2026-06-05',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 120000000,
      issuesSummary: 'Kondisi asrama bersih dan terawat dengan sistem disiplin semi-militer.',
    },
    {
      satdikId: 'poltek-kp-bone',
      category: 'pengolahan_hasil',
      subcategory: 'UPI & Cold Chain',
      name: 'Mini Plant Pengolahan Rumput Laut & Cold Storage 20 Ton Bone',
      specs: 'Ekstraktor Alkali Panas untuk ATC (Alkali Treated Cottonii), Mesin Pemotong Chip Rumput Laut, Cold Storage -20°C',
      condition: 'Rusak Ringan',
      conditionScore: 73,
      acquisitionYear: 2017,
      valuation: 6300000000,
      utilizationRate: 72,
      capacityDesc: 'Kapasitas 2 Ton Rumput Laut Kering / Hari',
      specs: 'Kompresor Maneurop 20 PK, Tangki Reaksi Stainless Steel SUS316L',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'SKP KKP',
      certExpiryDate: '2026-09-18',
      lastMaintenanceDate: '2025-07-10',
      nextMaintenanceDate: '2026-01-10',
      maintenanceUrgency: 'Medium',
      estimatedRepairCost: 145000000,
      issuesSummary: 'Pemanas steam pada bejana ekstraksi membutuhkan penggantian valve tekanan uap.',
    },
    {
      satdikId: 'poltek-kp-bone',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Gedung Asrama Taruna Mappanyukki',
      specs: 'Gedung 3 Lantai, Kapasitas 520 Taruna, Dapur Gas Sentral, Sistem Penampungan Air Hujan',
      condition: 'Baik',
      conditionScore: 84,
      acquisitionYear: 2016,
      valuation: 13200000000,
      utilizationRate: 96,
      capacityDesc: '520 Ranjang Taruna Putra/Putri',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas Tata Ruang Kab. Bone',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-11-15',
      nextMaintenanceDate: '2026-05-15',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 95000000,
      issuesSummary: 'Sirkulasi udara dan penerangan asrama sangat memadai.',
    },
    {
      satdikId: 'poltek-kp-kupang',
      category: 'penangkapan_ikan',
      subcategory: 'Kapal Latih Vokasi',
      name: 'Kapal Latih KM. Flobamora 01',
      specs: 'LOA: 28.0 m, 120 GT, Mesin Yanmar 600 HP, Pancing Rawai Tuna (Longline), Sonar Furuno',
      condition: 'Rusak Ringan',
      conditionScore: 56,
      acquisitionYear: 2016,
      valuation: 16800000000,
      utilizationRate: 50,
      capacityDesc: '22 Taruna Praktik Laut',
      certificationStatus: 'Perlu Pembaruan',
      certificationAuthority: 'BKI & KSOP Kupang Tenau',
      certExpiryDate: '2025-10-30',
      lastMaintenanceDate: '2024-10-15',
      nextMaintenanceDate: '2025-04-15',
      maintenanceUrgency: 'Kritis / Segera',
      estimatedRepairCost: 650000000,
      issuesSummary: 'Genset aux 20 kW terbakar lilitan alternator saat praktik laut di Laut Sawu, line hauler hidrolik tersendat.',
    },
    {
      satdikId: 'poltek-kp-kupang',
      category: 'agribisnis_perikanan',
      subcategory: 'UPI & TEFA',
      name: "Teaching Factory Se'i Ikan & Abon Cakalang Timor",
      specs: 'Smoker Cabinet Digital 6 Rak Stainless Steel, Vacuum Packaging Machine, Cold Room 10 Ton',
      condition: 'Baik',
      conditionScore: 90,
      acquisitionYear: 2019,
      valuation: 3500000000,
      utilizationRate: 86,
      capacityDesc: 'Kapasitas 400 kg Daging Se\'i Ikan / Hari',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'BPOM & SKP KKP',
      certExpiryDate: '2028-02-14',
      lastMaintenanceDate: '2026-01-10',
      nextMaintenanceDate: '2026-07-10',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 40000000,
      issuesSummary: 'Produk Se\'i Ikan Tuna Kupang memiliki permintaan tinggi sebagai produk unggulan daerah.',
    },
    {
      satdikId: 'poltek-kp-pangandaran',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Taruna & Taruni Nyi Roro Kidul Pangandaran',
      specs: 'Gedung 2 Lantai Tahan Gempa & Tsunami-Ready, 60 Kamar, Ruang Komputer Multimedia',
      condition: 'Baik',
      conditionScore: 89,
      acquisitionYear: 2018,
      valuation: 11500000000,
      utilizationRate: 97,
      capacityDesc: '380 Tempat Tidur Taruna',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kab. Pangandaran',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-10-25',
      nextMaintenanceDate: '2026-04-25',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 75000000,
      issuesSummary: 'Struktur bangunan kokoh dengan jalur evakuasi vertikal tsunami terintegrasi.',
    },
    {
      satdikId: 'poltek-kp-jembrana',
      category: 'penangkapan_ikan',
      subcategory: 'Kapal Latih & Kenavigasian',
      name: 'Kapal Latih KM. Bali Bahari 01 & Simulator Navigasi',
      specs: '90 GT, Mesin Mitsubishi 450 HP, Purse Seine Mini, Simulator JRC Selat Bali',
      condition: 'Baik',
      conditionScore: 87,
      acquisitionYear: 2018,
      valuation: 14200000000,
      utilizationRate: 84,
      capacityDesc: '20 Taruna Praktik Berlayar Selat Bali',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'BKI & Syahbandar Benoa/Pengambengan',
      certExpiryDate: '2027-06-30',
      lastMaintenanceDate: '2025-12-10',
      nextMaintenanceDate: '2026-06-10',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 150000000,
      issuesSummary: 'Operasi navigasi di perairan Selat Bali berjalan teratur.',
    },
    {
      satdikId: 'poltek-kp-jembrana',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Taruna Tirta Gangga Jembrana',
      specs: 'Gedung 3 Lantai Arsitektur Bali-Modern, 72 Kamar, Ruang Menza Kapasitas 450 Taruna',
      condition: 'Baik',
      conditionScore: 92,
      acquisitionYear: 2018,
      valuation: 12800000000,
      utilizationRate: 98,
      capacityDesc: '400 Ranjang Taruna/i',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kab. Jembrana',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2026-01-15',
      nextMaintenanceDate: '2026-07-15',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 85000000,
      issuesSummary: 'Fasilitas sangat rapi dan tertata asri.',
    },
    {
      satdikId: 'akkp-wakatobi',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Taruna Bajo Wangi-Wangi',
      specs: 'Gedung 2 Lantai Konsep Tropis Bahari, Kapasitas 220 Siswa, Menza Bersama',
      condition: 'Rusak Ringan',
      conditionScore: 78,
      acquisitionYear: 2018,
      valuation: 5600000000,
      utilizationRate: 96,
      capacityDesc: '220 Ranjang Taruna',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Wakatobi',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-09-10',
      nextMaintenanceDate: '2026-03-10',
      maintenanceUrgency: 'Medium',
      estimatedRepairCost: 65000000,
      issuesSummary: 'Korosi angin laut pada kusen besi jendela lantai 2, perlu penggantian profil aluminium powder coated.',
    },
    {
      satdikId: 'akkp-wakatobi',
      category: 'budidaya_perikanan',
      subcategory: 'Budidaya Teripang & Abalone',
      name: 'Unit Budidaya Teripang Pasir & Abalone Tropis Wakatobi',
      specs: '10 Bak Fiberglass Sirkulasi Air Laut Terbuka, Substrat Pasir Putih Terfilter, Pompa Solar Cell 3 kWp',
      condition: 'Baik',
      conditionScore: 88,
      acquisitionYear: 2020,
      valuation: 1950000000,
      utilizationRate: 82,
      capacityDesc: '15.000 Ekor Benih Teripang & Abalone per Tahun',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'CBIB KKP',
      certExpiryDate: '2028-06-10',
      lastMaintenanceDate: '2025-11-28',
      nextMaintenanceDate: '2026-05-28',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 25000000,
      issuesSummary: 'Siklus hidup teripang pasir (Holothuria scabra) berhasil didomestikasi dengan baik.',
    },
    {
      satdikId: 'supm-ladong',
      category: 'agribisnis_perikanan',
      subcategory: 'UPI & TEFA',
      name: 'TEFA Keumamah (Ikan Kayu Tradisional Aceh) & Cold Room',
      specs: 'Ruang Pengasapan Stainless Steel Higienis, Mesin Vacuum Packaging, Cold Room 5 Ton',
      condition: 'Baik',
      conditionScore: 87,
      acquisitionYear: 2017,
      valuation: 2400000000,
      utilizationRate: 85,
      capacityDesc: '300 kg Ikan Keumamah Siap Saji / Hari',
      certificationStatus: 'Tersertifikasi Aktif',
      certificationAuthority: 'SKP & Halal BPJPH',
      certExpiryDate: '2027-12-15',
      lastMaintenanceDate: '2025-10-10',
      nextMaintenanceDate: '2026-04-10',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 35000000,
      issuesSummary: 'Inovasi keumamah bumbu kari instan dalam pouch retort.',
    },
    {
      satdikId: 'supm-pariaman',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Siswa Taruna Imam Bonjol Pariaman',
      specs: 'Gedung 2 Lantai, 48 Kamar Siswa, Ruang Makan Menza Bersama, Lapangan Futsal',
      condition: 'Rusak Ringan',
      conditionScore: 61,
      acquisitionYear: 2011,
      valuation: 6800000000,
      utilizationRate: 98,
      capacityDesc: '380 Tempat Tidur Siswa',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kota Pariaman',
      certExpiryDate: '2029-01-01',
      lastMaintenanceDate: '2024-12-10',
      nextMaintenanceDate: '2025-06-10',
      maintenanceUrgency: 'Kritis / Segera',
      estimatedRepairCost: 290000000,
      issuesSummary: 'Atap genteng blok B bocor parah merembes ke plafon kamar tidur taruna, instalasi listrik sering trip karena korsleting saat hujan deras.',
    },
    {
      satdikId: 'supm-kotaagung',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Siswa Taruna Raden Intan & Menza Way Gelang',
      specs: 'Gedung 2 Lantai, Kapasitas 360 Siswa, Dapur Sentral, Lapangan Upacara Taruna',
      condition: 'Baik',
      conditionScore: 82,
      acquisitionYear: 2013,
      valuation: 7100000000,
      utilizationRate: 97,
      capacityDesc: '360 Tempat Tidur Siswa',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas Perkim Kab. Tanggamus',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-11-05',
      nextMaintenanceDate: '2026-05-05',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 70000000,
      issuesSummary: 'Pemeliharaan rutin terjadwal.',
    },
    {
      satdikId: 'supm-tegal',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Gedung Asrama Siswa Taruna Bahari Kalinyamat',
      specs: 'Gedung 3 Lantai, Kapasitas 450 Siswa, Menza Kapasitas 500 Taruna, Klinik Kesehatan Bahari',
      condition: 'Baik',
      conditionScore: 88,
      acquisitionYear: 2015,
      valuation: 11400000000,
      utilizationRate: 98,
      capacityDesc: '450 Ranjang Siswa Taruna Lengkap',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kota Tegal',
      certExpiryDate: '2030-01-01',
      lastMaintenanceDate: '2025-12-12',
      nextMaintenanceDate: '2026-06-12',
      maintenanceUrgency: 'Normal',
      estimatedRepairCost: 95000000,
      issuesSummary: 'Fasilitas sangat rapi dan tertib dengan fasilitas laundry terpadu.',
    },
    {
      satdikId: 'supm-pontianak',
      category: 'sosial_pemberdayaan',
      subcategory: 'Asrama Taruna',
      name: 'Asrama Taruna Khatulistiwa & Balai Pertemuan',
      specs: 'Gedung 2 Lantai Konstruksi Beton Tiang Pancang Rawa, 45 Kamar Siswa, Menza Sungai Raya',
      condition: 'Rusak Ringan',
      conditionScore: 72,
      acquisitionYear: 2012,
      valuation: 7200000000,
      utilizationRate: 96,
      capacityDesc: '370 Ranjang Siswa',
      certificationStatus: 'Tidak Wajib',
      certificationAuthority: 'Dinas PUPR Kab. Kubu Raya',
      certExpiryDate: '2029-01-01',
      lastMaintenanceDate: '2025-08-22',
      nextMaintenanceDate: '2026-02-22',
      maintenanceUrgency: 'Medium',
      estimatedRepairCost: 115000000,
      issuesSummary: 'Penurunan tanah gambut sekitar pondasi selasar penghubung asrama dengan menza membutuhkan perkuatan cerucuk gelam.',
    }
  ];

  // Merge additional templates
  additionalTemplates.forEach((item, idx) => {
    const satdik = SATDIK_LIST.find(s => s.id === item.satdikId);
    assets.push({
      id: `SAR-ADD-${String(idx + 1).padStart(3, '0')}`,
      satdikName: satdik ? satdik.name : 'Satdik KKP',
      ...item
    });
  });

  return assets.map(a => {
    const satdik = SATDIK_LIST.find(s => s.id === a.satdikId);
    return {
      ...a,
      prodi: a.prodi || getProdiForAsset(a, satdik)
    };
  });
}

// Compute comprehensive national KPIs and analytics
  function calculateSarprasKPIs(assets, satdikList = SATDIK_LIST) {
  const totalAssets = assets.length;
  if (totalAssets === 0) return null;

  let totalValuation = 0;
  let totalConditionScore = 0;
  let totalUtilization = 0;
  let totalEstimatedRepairCost = 0;

  const conditionCounts = {
    'Baik': 0,
    'Rusak Ringan': 0,
    'Rusak Berat': 0,
  };

  const categoryBreakdown = {};
  SARPRAS_CATEGORIES.forEach(cat => {
    categoryBreakdown[cat.id] = {
      id: cat.id,
      name: cat.name,
      count: 0,
      valuation: 0,
      baik: 0,
      rusakRingan: 0,
      rusakBerat: 0,
      avgScore: 0,
      totalScore: 0,
    };
  });

  const satdikBreakdown = {};
  satdikList.forEach(sat => {
    satdikBreakdown[sat.id] = {
      satdik: sat,
      count: 0,
      valuation: 0,
      totalScore: 0,
      avgScore: 0,
      baik: 0,
      rusakRingan: 0,
      rusakBerat: 0,
      totalRepairNeeded: 0,
      assets: []
    };
  });

  const urgentAssets = [];

  assets.forEach(asset => {
    totalValuation += asset.valuation || 0;
    totalConditionScore += asset.conditionScore || 0;
    totalUtilization += asset.utilizationRate || 0;
    totalEstimatedRepairCost += asset.estimatedRepairCost || 0;

    // Condition counts
    if (conditionCounts[asset.condition] !== undefined) {
      conditionCounts[asset.condition]++;
    }

    // Category breakdown
    if (categoryBreakdown[asset.category]) {
      const cat = categoryBreakdown[asset.category];
      cat.count++;
      cat.valuation += asset.valuation || 0;
      cat.totalScore += asset.conditionScore || 0;
      if (asset.condition === 'Baik') cat.baik++;
      else if (asset.condition === 'Rusak Ringan') cat.rusakRingan++;
      else if (asset.condition === 'Rusak Berat') cat.rusakBerat++;
    }

    // Satdik breakdown
    if (satdikBreakdown[asset.satdikId]) {
      const s = satdikBreakdown[asset.satdikId];
      s.count++;
      s.valuation += asset.valuation || 0;
      s.totalScore += asset.conditionScore || 0;
      s.totalRepairNeeded += asset.estimatedRepairCost || 0;
      if (asset.condition === 'Baik') s.baik++;
      else if (asset.condition === 'Rusak Ringan') s.rusakRingan++;
      else if (asset.condition === 'Rusak Berat') s.rusakBerat++;
      s.assets.push(asset);
    }

    // Urgent / Critical condition
    if (asset.condition === 'Rusak Berat' || asset.maintenanceUrgency === 'Kritis / Segera' || asset.certificationStatus === 'Kadaluarsa') {
      urgentAssets.push(asset);
    }
  });

  // Calculate averages
  const avgConditionScore = totalConditionScore / totalAssets;
  const avgUtilization = totalUtilization / totalAssets;

  Object.values(categoryBreakdown).forEach(c => {
    c.avgScore = c.count > 0 ? (c.totalScore / c.count) : 0;
  });

  Object.values(satdikBreakdown).forEach(s => {
    s.avgScore = s.count > 0 ? (s.totalScore / s.count) : 0;
  });

  const totalTaruna = satdikList.reduce((sum, s) => sum + (s.tarunaCount || 0), 0);

  return {
    totalAssets,
    totalValuation,
    avgConditionScore: Math.round(avgConditionScore * 10) / 10,
    avgUtilization: Math.round(avgUtilization * 10) / 10,
    totalEstimatedRepairCost,
    totalTaruna,
    conditionCounts,
    conditionPercentages: {
      baik: Math.round((conditionCounts['Baik'] / totalAssets) * 1000) / 10,
      rusakRingan: Math.round((conditionCounts['Rusak Ringan'] / totalAssets) * 1000) / 10,
      rusakBerat: Math.round((conditionCounts['Rusak Berat'] / totalAssets) * 1000) / 10,
    },
    categoryBreakdown,
    satdikBreakdown,
    urgentAssets: urgentAssets.sort((a, b) => (a.conditionScore - b.conditionScore)),
  };
}

// Format Rupiah currency
  function formatRupiah(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  if (amount >= 1000000000000) {
    return `Rp ${(amount / 1000000000000).toFixed(2)} Triliun`;
  }
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(2)} Miliar`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)} Juta`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

// Budget simulation calculation
  function simulateBudgetImpact(allocatedBudgetRp, currentAssets) {
  // Sort assets by priority: Rusak Berat first, then Rusak Ringan, lowest score first
  const repairableAssets = currentAssets
    .filter(a => a.condition !== 'Baik' && a.estimatedRepairCost > 0)
    .sort((a, b) => {
      const conditionWeight = { 'Rusak Berat': 3, 'Rusak Ringan': 1 };
      const weightDiff = (conditionWeight[b.condition] || 0) - (conditionWeight[a.condition] || 0);
      if (weightDiff !== 0) return weightDiff;
      return a.conditionScore - b.conditionScore;
    });

  let remainingBudget = allocatedBudgetRp;
  const fundedAssets = [];
  let simulatedAssets = JSON.parse(JSON.stringify(currentAssets));

  repairableAssets.forEach(target => {
    if (remainingBudget >= target.estimatedRepairCost) {
      remainingBudget -= target.estimatedRepairCost;
      fundedAssets.push({
        ...target,
        fundedAmount: target.estimatedRepairCost,
      });

      // In simulated assets, upgrade condition to 'Baik' and score to 92
      const assetIdx = simulatedAssets.findIndex(a => a.id === target.id);
      if (assetIdx !== -1) {
        simulatedAssets[assetIdx].condition = 'Baik';
        simulatedAssets[assetIdx].conditionScore = 92;
        simulatedAssets[assetIdx].maintenanceUrgency = 'Normal';
        simulatedAssets[assetIdx].certificationStatus = 'Tersertifikasi Aktif';
      }
    }
  });

  const originalKPIs = calculateSarprasKPIs(currentAssets);
  const simulatedKPIs = calculateSarprasKPIs(simulatedAssets);

  return {
    allocatedBudget: allocatedBudgetRp,
    usedBudget: allocatedBudgetRp - remainingBudget,
    remainingBudget,
    fundedAssetsCount: fundedAssets.length,
    fundedAssets,
    originalKPIs,
    simulatedKPIs,
    scoreImprovement: Math.round((simulatedKPIs.avgConditionScore - originalKPIs.avgConditionScore) * 10) / 10,
    rusakBeratEliminated: originalKPIs.conditionCounts['Rusak Berat'] - simulatedKPIs.conditionCounts['Rusak Berat'],
    rusakRinganRepaired: originalKPIs.conditionCounts['Rusak Ringan'] - simulatedKPIs.conditionCounts['Rusak Ringan'],
  };
}


  // Helper untuk mendapatkan nama bidang dari ID bidang
  function getCategoryName(catIdOrName) {
    const found = SARPRAS_CATEGORIES.find(function (c) {
      return c.id === catIdOrName || c.name === catIdOrName;
    });
    return found ? found.name : (catIdOrName || 'Penangkapan Ikan');
  }

  function getCategoryObj(catIdOrName) {
    return SARPRAS_CATEGORIES.find(function (c) {
      return c.id === catIdOrName || c.name === catIdOrName;
    }) || SARPRAS_CATEGORIES[0];
  }

  // Expose ke global window.SARPRAS_DATA
  window.SARPRAS_DATA = {
    PRODI_LIST: PRODI_LIST,
    SATDIK_LIST: SATDIK_LIST,
    SARPRAS_CATEGORIES: SARPRAS_CATEGORIES,
    PRODI_TO_CATEGORY_MAP: PRODI_TO_CATEGORY_MAP,
    PRODI_TO_CATEGORIES_MAP: PRODI_TO_CATEGORIES_MAP,
    getCategoryForProdi: getCategoryForProdi,
    getProdisForCategory: getProdisForCategory,
    getCategoryName: getCategoryName,
    getCategoryObj: getCategoryObj,
    normalizeCategory: normalizeCategory,
    getProdiForAsset: getProdiForAsset,
    NATIONAL_SARPRAS_TARGETS: NATIONAL_SARPRAS_TARGETS,
    INITIAL_SARPRAS_DATA: INITIAL_SARPRAS_DATA,
    getFullSarprasData: getFullSarprasData,
    calculateSarprasKPIs: calculateSarprasKPIs,
    formatRupiah: formatRupiah,
    simulateBudgetImpact: simulateBudgetImpact
  };
})(window);
