/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Master Data 18 Satdik, 25 Prodi, 8 Bidang & Generator Aset BMN
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
    kampusList: [
      {
        id: 'jakarta',
        code: 'Jakarta',
        name: 'Kampus Jakarta (Pasar Minggu / Utama)',
        shortName: 'Kampus Jakarta',
        kota: 'Jakarta Selatan',
        provinsi: 'DKI Jakarta',
        alamat: 'Jl. AUP No. 1, RT. 01 / RW. 09, Pasar Minggu, Jakarta Selatan, DKI Jakarta 12520',
        lat: -6.2942,
        lng: 106.8406,
        deskripsi: 'Kampus Utama, Rektorat, Pascasarjana Terapan, Prodi TPI, Permesinan Perikanan & TPHP',
        asramaCount: 7,
        tambakCount: 0
      },
      {
        id: 'bogor',
        code: 'Bogor',
        name: 'Kampus Bogor (Cikaret / Cibalagung)',
        shortName: 'Kampus Bogor',
        kota: 'Kota Bogor',
        provinsi: 'Jawa Barat',
        alamat: 'Jl. Cikaret No. 1, Cikaret, Bogor Selatan, Kota Bogor, Jawa Barat 16132',
        lat: -6.6215,
        lng: 106.8042,
        deskripsi: 'Kampus Bogor, Prodi Penyuluhan Perikanan & Instalasi Budidaya Air Tawar (20 Kolam)',
        asramaCount: 5,
        tambakCount: 20
      },
      {
        id: 'serang',
        code: 'Serang',
        name: 'Kampus Serang (Banten)',
        shortName: 'Kampus Serang',
        kota: 'Kota Serang',
        provinsi: 'Banten',
        alamat: 'Jl. Raya Karangantu, Kasemen, Kota Serang, Banten 42191',
        lat: -6.0273,
        lng: 106.1608,
        deskripsi: 'Kampus Serang, Prodi Teknologi Akuakultur (Budidaya Payau & Laut), 10 Tambak & Tandon TEFA',
        asramaCount: 12,
        tambakCount: 10
      }
    ],
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

  const INITIAL_SARPRAS_DATA = [];

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
  return [];
}

  // Membangun daftar sarpras terpadu dari 3 dataset riil (Asrama, Tambak & Kolam, Standar Prodi)
  function buildRealSarprasItems(params = {}) {
  const {
    asramaData = window.SARPRAS_ASRAMA || {},
    tambakData = window.SARPRAS_TAMBAK || {},
    standarData = window.SARPRAS_STANDAR || {},
    satdikList = SATDIK_LIST
  } = params;

  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });

  const bidangMap = {};
  (standarData?.bidang || []).forEach(b => { bidangMap[b.id] = b; });

  const items = [];

  // 1. Gedung Asrama Taruna
  const buildings = Array.isArray(asramaData?.buildings) ? asramaData.buildings : [];
  buildings.forEach(b => {
    const sat = satdikMap[b.satdikId] || {};
    const status = b.status || 'Digunakan';
    const condition = (status === 'Tidak Digunakan' || status === 'Tidak Dipakai')
      ? 'Rusak Berat'
      : (status === 'Perlu Renovasi' ? 'Rusak Ringan' : 'Baik');
    const conditionScore = condition === 'Baik' ? 90 : (condition === 'Rusak Ringan' ? 68 : 30);
    const utilizationRate = condition === 'Baik' ? 88 : (condition === 'Rusak Ringan' ? 60 : 0);
    const maintenanceUrgency = condition === 'Rusak Berat'
      ? 'Kritis / Segera'
      : (condition === 'Rusak Ringan' ? 'Perlu Perhatian' : 'Normal');

    items.push({
      id: b.id,
      sourceModule: 'asrama',
      name: b.nama || ('Gedung Asrama ' + b.id),
      satdikId: b.satdikId,
      satdikName: sat.name || b.satdikId,
      prodi: 'Semua Program Studi (Asrama Taruna)',
      category: 'sosial_pemberdayaan',
      subcategory: 'Gedung Asrama Taruna',
      condition: condition,
      conditionScore: conditionScore,
      acquisitionYear: '-',
      utilizationRate: utilizationRate,
      capacityDesc: (b.jumlahKamar || 0) + ' Kamar • Kapasitas ' + Math.round(Number(b.kapasitas) || 0) + ' Taruna',
      specs: 'Luas: ' + (Number(b.luasM2) || 0).toLocaleString('id-ID') + ' m² • Peruntukan: ' + (b.peruntukan || 'Taruna'),
      maintenanceUrgency: maintenanceUrgency,
      nextMaintenanceDate: condition === 'Baik' ? 'Terjadwal Berkala' : 'Segera / Prioritas Renovasi',
      issuesSummary: b.keterangan || ('Status bangunan: ' + status + ' (' + (b.jumlahKamar || 0) + ' kamar, luas ' + (Number(b.luasM2) || 0).toLocaleString('id-ID') + ' m², kapasitas ' + Math.round(Number(b.kapasitas) || 0) + ' orang).')
    });
  });

  // 2. Unit Tambak & Kolam Budidaya
  const units = Array.isArray(tambakData?.units) ? tambakData.units : [];
  units.forEach(u => {
    const sat = satdikMap[u.satdikId] || {};
    const kondisiRaw = u.kondisi || 'Baik';
    const condition = kondisiRaw === 'Rusak Berat'
      ? 'Rusak Berat'
      : (kondisiRaw === 'Rusak Ringan' ? 'Rusak Ringan' : 'Baik');
    const conditionScore = condition === 'Baik' ? 92 : (condition === 'Rusak Ringan' ? 70 : 28);
    const opStatus = u.statusOperasional || 'Aktif';
    const isOpActive = /aktif/i.test(opStatus) && !/tidak/i.test(opStatus);
    const utilizationRate = isOpActive ? 88 : (condition === 'Rusak Ringan' ? 50 : 15);
    const maintenanceUrgency = condition === 'Rusak Berat'
      ? 'Kritis / Segera'
      : (condition === 'Rusak Ringan' ? 'Perlu Perhatian' : 'Normal');

    items.push({
      id: u.id,
      sourceModule: 'tambak',
      name: u.nama || ('Unit ' + (u.jenis || 'Tambak') + ' ' + u.id),
      satdikId: u.satdikId,
      satdikName: sat.name || u.namaSatdik || u.satdikId,
      prodi: (sat.prodi && sat.prodi.find(p => /akuakultur|budidaya/i.test(p))) || 'Budidaya Perikanan',
      category: 'budidaya_perikanan',
      subcategory: u.jenis || 'Tambak & Kolam',
      condition: condition,
      conditionScore: conditionScore,
      acquisitionYear: '-',
      utilizationRate: utilizationRate,
      capacityDesc: 'Luas ' + (Number(u.luasM2) || 0).toLocaleString('id-ID') + ' m² • ' + (u.pelataran || u.jenis || 'Tambak'),
      specs: [u.fungsi ? ('Fungsi: ' + u.fungsi) : '', u.listrik ? ('Listrik: ' + u.listrik) : '', u.kincir ? ('Kincir: ' + u.kincir) : ''].filter(Boolean).join(' • '),
      maintenanceUrgency: maintenanceUrgency,
      nextMaintenanceDate: condition === 'Baik' ? 'Terjadwal Berkala' : 'Segera / Rehabilitasi Petak',
      issuesSummary: [
        u.jenis ? ('Jenis: ' + u.jenis) : '',
        u.luasM2 ? ('Luas: ' + (Number(u.luasM2) || 0).toLocaleString('id-ID') + ' m²') : '',
        u.fungsi ? ('Fungsi: ' + u.fungsi) : '',
        'Status Operasional: ' + opStatus,
        u.keterangan || ''
      ].filter(Boolean).join(' • ')
    });
  });

  // 3. Rekapitulasi Standar Minimal Sarpras Prodi per Kampus
  const rekapList = Array.isArray(standarData?.rekap) ? standarData.rekap : [];
  rekapList.forEach(r => {
    const sat = satdikMap[r.satdikId] || {};
    const bid = bidangMap[r.bidangId] || {};
    const catId = normalizeCategory(bid.categoryId || bid.id);
    const pctPras = Number(r.persenPrasarana) || 0;
    const pctTot = Number(r.persenTotal) || 0;
    const condition = (pctPras >= 40 || pctTot >= 30)
      ? 'Baik'
      : ((pctPras >= 20 || pctTot >= 15) ? 'Rusak Ringan' : 'Rusak Berat');
    const conditionScore = condition === 'Baik' ? 86 : (condition === 'Rusak Ringan' ? 72 : 45);

    items.push({
      id: 'STD-' + (r.id || (r.bidangId + '-' + r.satdikId)),
      sourceModule: 'standar',
      name: 'Fasilitas Praktik Rumpun ' + (bid.nama || r.bidangId),
      satdikId: r.satdikId,
      satdikName: sat.name || r.satdikId,
      prodi: (Array.isArray(bid.prodi) && bid.prodi[0]) || bid.nama || 'Program Studi Vokasi',
      category: catId,
      subcategory: 'Standar Sarpras Prodi',
      condition: condition,
      conditionScore: conditionScore,
      acquisitionYear: '-',
      utilizationRate: Math.min(100, Math.max(60, Math.round(conditionScore * 0.95))),
      capacityDesc: (r.totalTerpenuhi || 0) + '/' + (r.totalItems || 0) + ' Item Standar Terpenuhi (' + pctTot + '%)',
      specs: 'Prasarana: ' + pctPras + '% • Sarana: ' + (r.persenSarana || 0) + '%',
      maintenanceUrgency: condition === 'Rusak Berat' ? 'Kritis / Segera' : (condition === 'Rusak Ringan' ? 'Perlu Perhatian' : 'Normal'),
      nextMaintenanceDate: 'Evaluasi Semester',
      issuesSummary: 'Capaian pemenuhan standar minimal rumpun ' + (bid.nama || r.bidangId) + ': Prasarana ' + pctPras + '%, Sarana ' + (r.persenSarana || 0) + '%, Total ' + pctTot + '%.'
    });
  });

  return items;
}

// Compute comprehensive national KPIs and analytics
  function calculateSarprasKPIs(assets = [], satdikList = SATDIK_LIST, context = {}) {
  const safeAssets = Array.isArray(assets) ? assets : [];
  const totalAssets = safeAssets.length;

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
      assets: [],
      calibration: null
    };
  });

  const urgentAssets = [];

  safeAssets.forEach(asset => {
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

  // Calculate averages per category
  Object.values(categoryBreakdown).forEach(c => {
    c.avgScore = c.count > 0 ? (c.totalScore / c.count) : 0;
  });

  // =========================================================================
  // KALIBRASI MULTI-PILAR INDEKS KELAYAKAN SARPRAS (IKSP) PER SATUAN PENDIDIKAN
  // Menggabungkan 3 Pilar Resmi BPPSDM KP:
  // 1. Asrama Taruna (Kelaikan Fisik Bangunan + Rasio Kecukupan Kapasitas)
  // 2. Tambak & Kolam Praktik (Kondisi Fisik Petak/Kolam + Rasio Operasional Aktif)
  // 3. Standar Minimal Kurikulum Prodi (Pemenuhan Fasilitas Ruang Lab/Workshop & Sarana)
  // =========================================================================
  const asrMaster = context.asramaData || window.SARPRAS_ASRAMA || {};
  const tbkMaster = context.tambakData || window.SARPRAS_TAMBAK || {};
  const stdMaster = context.standarData || window.SARPRAS_STANDAR || {};

  let sumCalibratedScores = 0;

  Object.values(satdikBreakdown).forEach(s => {
    const sat = s.satdik;
    const asrRows = (asrMaster.buildings || []).filter(b => b.satdikId === sat.id);
    const asrSum = (asrMaster.summary || []).find(x => x.satdikId === sat.id);
    const tbkRows = (tbkMaster.units || []).filter(u => u.satdikId === sat.id);
    const stdRekap = (stdMaster.rekap || []).filter(r => r.satdikId === sat.id);

    // PILAR 1: ASRAMA TARUNA (Bobot Acuan 35%)
    let asrScore = null;
    let asrDesc = '';
    let asrDetails = null;
    if (asrRows.length > 0) {
      const baik = asrRows.filter(b => b.status === 'Digunakan').length;
      const renov = asrRows.filter(b => b.status === 'Perlu Renovasi').length;
      const rusak = asrRows.filter(b => b.status === 'Tidak Digunakan' || b.status === 'Tidak Dipakai').length;
      const physicalScore = (baik * 100 + renov * 65 + rusak * 25) / asrRows.length;

      let kapScore = 85;
      const kapAktif = Number(asrSum?.kapasitasAktif) || 0;
      if (kapAktif > 0 && sat.tarunaCount > 0) {
        const rasio = kapAktif / sat.tarunaCount;
        kapScore = Math.min(100, Math.max(45, Math.round(rasio >= 1.0 ? 98 : (rasio >= 0.85 ? 90 : (rasio >= 0.70 ? 80 : 50 + rasio * 35)))));
      }
      asrScore = Math.round(physicalScore * 0.65 + kapScore * 0.35);
      asrDesc = `${baik}/${asrRows.length} gedung siap huni, kapasitas ${Math.round(kapAktif)}/${sat.tarunaCount} taruna`;
      asrDetails = {
        totalGedung: asrRows.length,
        layak: baik,
        perluRenovasi: renov,
        tidakDigunakan: rusak,
        kapasitasAktif: Math.round(kapAktif),
        targetTaruna: sat.tarunaCount,
        rasioKapasitas: sat.tarunaCount > 0 ? Math.round((kapAktif / sat.tarunaCount) * 100) : 100
      };
    }

    // PILAR 2: TAMBAK & KOLAM PRAKTIK (Bobot Acuan 35%)
    let tbkScore = null;
    let tbkDesc = '';
    let tbkDetails = null;
    if (tbkRows.length > 0) {
      const baik = tbkRows.filter(u => u.kondisi === 'Baik').length;
      const ringan = tbkRows.filter(u => u.kondisi === 'Rusak Ringan').length;
      const berat = tbkRows.filter(u => u.kondisi === 'Rusak Berat').length;
      const physicalScore = (baik * 100 + ringan * 65 + berat * 25) / tbkRows.length;

      const aktif = tbkRows.filter(u => /aktif/i.test(u.statusOperasional || '') && !/tidak/i.test(u.statusOperasional || '')).length;
      const opScore = (aktif / tbkRows.length) * 100;

      if (tbkRows.length <= 4) {
        const rawScore = physicalScore * 0.70 + opScore * 0.30;
        tbkScore = Math.round(rawScore * 0.65 + 80 * 0.35);
      } else {
        tbkScore = Math.round(physicalScore * 0.70 + opScore * 0.30);
      }
      tbkDesc = `${baik}/${tbkRows.length} unit kondisi baik, ${aktif} unit aktif beroperasi`;
      tbkDetails = {
        totalUnit: tbkRows.length,
        baik,
        rusakRingan: ringan,
        rusakBerat: berat,
        aktifOperasi: aktif,
        persenAktif: Math.round(opScore)
      };
    }

    // PILAR 3: PEMENUHAN STANDAR MINIMAL SARPRAS PRODI (Bobot Acuan 30%)
    let stdScore = null;
    let stdDesc = '';
    let stdDetails = null;
    if (stdRekap.length > 0) {
      const avgPras = stdRekap.reduce((a, b) => a + (Number(b.persenPrasarana) || 0), 0) / stdRekap.length;
      const avgSar = stdRekap.reduce((a, b) => a + (Number(b.persenSarana) || 0), 0) / stdRekap.length;
      const avgTot = stdRekap.reduce((a, b) => a + (Number(b.persenTotal) || 0), 0) / stdRekap.length;

      stdScore = Math.min(100, Math.max(35, Math.round(avgPras * 0.65 + avgSar * 0.20 + avgTot * 0.15 + 35)));
      stdDesc = `${stdRekap.length} rumpun: prasarana ${Math.round(avgPras)}%, sarana ${Math.round(avgSar)}%`;
      stdDetails = {
        jumlahRumpun: stdRekap.length,
        avgPersenPrasarana: Math.round(avgPras * 10) / 10,
        avgPersenSarana: Math.round(avgSar * 10) / 10,
        avgPersenTotal: Math.round(avgTot * 10) / 10
      };
    }

    // PILAR PENDUKUNG: KESIAPAN SARANA KEJURUAN & BMN (Untuk kampus yang datanya belum lengkap di survey tertentu)
    const akredScore = sat.akreditasi === 'Unggul' || sat.akreditasi === 'A' ? 84 : 78;

    const components = [];
    if (asrScore !== null) {
      components.push({
        id: 'asrama',
        name: 'Asrama Taruna',
        score: asrScore,
        rawWeight: 0.35,
        desc: asrDesc,
        details: asrDetails,
        source: 'Rekapitulasi Ketersediaan Ruang Asrama Taruna (BPPSDM KP 2025)'
      });
    }
    if (tbkScore !== null) {
      components.push({
        id: 'tambak',
        name: 'Tambak & Kolam',
        score: tbkScore,
        rawWeight: 0.35,
        desc: tbkDesc,
        details: tbkDetails,
        source: 'Inventarisasi Lahan Tambak, Kolam & Hatchery Satdik KP'
      });
    }
    if (stdScore !== null) {
      components.push({
        id: 'standar',
        name: 'Standar Sarpras Prodi',
        score: stdScore,
        rawWeight: 0.30,
        desc: stdDesc,
        details: stdDetails,
        source: 'Matriks Pemenuhan Standar Minimal Sarpras Prodi (Zero-Build)'
      });
    } else {
      // Kampus Menengah (SUPM) tanpa matriks D3/D4 diselaraskan dengan bobot Kesiapan Sarana Kejuruan & Standar Vokasi
      components.push({
        id: 'kejuruan',
        name: 'Kesiapan Sarana Kejuruan & Standar Vokasi Menengah',
        score: akredScore,
        rawWeight: 0.30,
        desc: `Standar sarana pembelajaran kejuruan & vokasi (Akreditasi ${sat.akreditasi})`,
        details: { akreditasi: sat.akreditasi, score: akredScore },
        source: 'Master Profil Kampus & Akreditasi Pendidikan KP'
      });
    }

    if (components.length === 1) {
      components.push({
        id: 'kejuruan',
        name: 'Kesiapan Sarana Kejuruan & BMN',
        score: akredScore,
        rawWeight: 0.50,
        desc: `Fasilitas pembelajaran kejuruan terakreditasi ${sat.akreditasi}`,
        details: { akreditasi: sat.akreditasi, score: akredScore },
        source: 'Master Profil Kampus & Akreditasi Pendidikan KP'
      });
      components[0].rawWeight = 0.50;
    } else if (components.length === 0) {
      const fallbackScore = s.count > 0 ? Math.round(s.totalScore / s.count) : akredScore;
      components.push({
        id: 'sarpras_umum',
        name: 'Kelayakan Sarana & Prasarana Kampus',
        score: fallbackScore,
        rawWeight: 1.0,
        desc: `Rata-rata kondisi fisik ${s.count} aset terdata`,
        details: { totalAssets: s.count },
        source: 'Inventarisasi Sarpras Pendidikan KP'
      });
    }

    const totalWeight = components.reduce((sum, c) => sum + c.rawWeight, 0);
    components.forEach(c => {
      c.weightPercent = Math.round((c.rawWeight / totalWeight) * 100);
    });

    const finalScore = Math.round(components.reduce((sum, c) => sum + (c.score * c.rawWeight), 0) / totalWeight);

    s.avgScore = finalScore;
    s.calibration = {
      finalScore,
      components,
      penjelasan: `Indeks kelayakan kampus dikalibrasikan secara berimbang dari ${components.length} pilar data resmi: ${components.map(c => `${c.name} (${c.weightPercent}%)`).join(', ')}.`
    };

    sumCalibratedScores += finalScore;
  });

  // =========================================================================
  // KALIBRASI INDEKS KEMATANGAN & KELAYAKAN SARPRAS PER BIDANG VOKASI
  // Memadukan kondisi kelayakan fisik sarpras eksisting dan tingkat
  // pemenuhan standar minimal prodi BPPSDM KP untuk 8 bidang kejuruan.
  // =========================================================================
  const getStdMetricsForCat = (catId) => {
    const rekapList = (stdMaster.rekap || []).filter(r => {
      const bid = (stdMaster.bidang || []).find(b => b.id === r.bidangId);
      return normalizeCategory(bid?.categoryId || bid?.id || r.bidangId) === catId;
    });
    if (rekapList.length === 0) return null;
    const pPras = rekapList.reduce((sum, r) => sum + (Number(r.persenPrasarana) || 0), 0) / rekapList.length;
    const pSar = rekapList.reduce((sum, r) => sum + (Number(r.persenSarana) || 0), 0) / rekapList.length;
    const pTot = rekapList.reduce((sum, r) => sum + (Number(r.persenTotal) || 0), 0) / rekapList.length;
    return { count: rekapList.length, pPras, pSar, pTot };
  };

  const tbkUnits = tbkMaster.units || [];
  const tbkBaik = tbkUnits.filter(u => u.kondisi === 'Baik').length;
  const tbkRR = tbkUnits.filter(u => u.kondisi === 'Rusak Ringan').length;
  const tbkRB = tbkUnits.filter(u => u.kondisi === 'Rusak Berat').length;
  const tbkPhysScore = tbkUnits.length > 0 ? (tbkBaik * 100 + tbkRR * 65 + tbkRB * 25) / tbkUnits.length : 85;

  const asrBldgs = asrMaster.buildings || [];
  const asrBaik = asrBldgs.filter(b => b.status === 'Digunakan').length;
  const asrRenov = asrBldgs.filter(b => b.status === 'Perlu Renovasi').length;
  const asrRusak = asrBldgs.filter(b => b.status === 'Tidak Digunakan' || b.status === 'Tidak Dipakai').length;
  const asrPhysScore = asrBldgs.length > 0 ? (asrBaik * 100 + asrRenov * 65 + asrRusak * 25) / asrBldgs.length : 85;
  const asrSumKapasitas = (asrMaster.summary || []).reduce((sum, r) => sum + (Number(r.kapasitasAktif) || 0), 0);
  const totalTarunaTerdata = satdikList.reduce((sum, sat) => sum + (sat.tarunaCount || 0), 0);
  const asrKapRatio = totalTarunaTerdata > 0 ? (asrSumKapasitas / totalTarunaTerdata) * 100 : 80;
  const asrCombinedScore = Math.round(asrPhysScore * 0.65 + Math.min(100, asrKapRatio) * 0.35);

  Object.values(categoryBreakdown).forEach(cat => {
    const std = getStdMetricsForCat(cat.id);
    let calibratedScore = 80;

    if (cat.id === 'budidaya_perikanan') {
      const stdScore = std ? (std.pPras * 0.55 + std.pSar * 0.25 + std.pTot * 0.20 + 38) : 80;
      calibratedScore = Math.round(tbkPhysScore * 0.55 + stdScore * 0.45);
    } else if (cat.id === 'administrasi_umum') {
      calibratedScore = 86;
    } else if (cat.id === 'sosial_pemberdayaan') {
      calibratedScore = 85;
    } else if (cat.id === 'penangkapan_ikan') {
      const stdScore = std ? (std.pPras * 0.55 + std.pSar * 0.25 + std.pTot * 0.20 + 36) : 74;
      calibratedScore = Math.round(88 * 0.55 + stdScore * 0.45);
    } else if (cat.id === 'pengolahan_hasil') {
      const stdScore = std ? (std.pPras * 0.55 + std.pSar * 0.25 + std.pTot * 0.20 + 36) : 73;
      calibratedScore = Math.round(88 * 0.55 + stdScore * 0.45);
    } else if (cat.id === 'agribisnis_perikanan') {
      const stdScore = std ? (std.pPras * 0.50 + std.pSar * 0.25 + std.pTot * 0.25 + 32) : 72;
      calibratedScore = Math.round(84 * 0.50 + stdScore * 0.50);
    } else if (cat.id === 'permesinan_mekanisasi') {
      const stdScore = std ? (std.pPras * 0.55 + std.pSar * 0.25 + std.pTot * 0.20 + 35) : 70;
      calibratedScore = Math.round(86 * 0.55 + stdScore * 0.45);
    } else if (cat.id === 'kelautan_konservasi') {
      const stdScore = std ? (std.pPras * 0.55 + std.pSar * 0.25 + std.pTot * 0.20 + 35) : 60;
      calibratedScore = Math.round(81 * 0.50 + stdScore * 0.50);
    }

    cat.avgScore = calibratedScore;
    cat.isTargetMet = calibratedScore >= NATIONAL_SARPRAS_TARGETS.targetIndeksKelayakan;
  });

  const avgConditionScore = satdikList.length > 0 ? (sumCalibratedScores / satdikList.length) : 0;
  const avgUtilization = totalAssets > 0 ? (totalUtilization / totalAssets) : 0;
  const totalTaruna = satdikList.reduce((sum, s) => sum + (s.tarunaCount || 0), 0);

  const pBaik = totalAssets > 0 ? Math.round((conditionCounts['Baik'] / totalAssets) * 1000) / 10 : 0;
  const pRusakRingan = totalAssets > 0 ? Math.round((conditionCounts['Rusak Ringan'] / totalAssets) * 1000) / 10 : 0;
  const pRusakBerat = totalAssets > 0 ? Math.round((100 - pBaik - pRusakRingan) * 10) / 10 : 0;

  return {
    totalAssets,
    totalValuation,
    avgConditionScore: Math.round(avgConditionScore * 10) / 10,
    avgUtilization: Math.round(avgUtilization * 10) / 10,
    totalEstimatedRepairCost,
    totalTaruna,
    conditionCounts,
    conditionPercentages: {
      baik: pBaik,
      rusakRingan: pRusakRingan,
      rusakBerat: pRusakBerat,
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
    AUP_KAMPUS_LIST: SATDIK_LIST[0].kampusList,
    INITIAL_SARPRAS_DATA: INITIAL_SARPRAS_DATA,
    getFullSarprasData: getFullSarprasData,
    buildRealSarprasItems: buildRealSarprasItems,
    calculateSarprasKPIs: calculateSarprasKPIs,
    formatRupiah: formatRupiah,
    simulateBudgetImpact: simulateBudgetImpact
  };
})(window);
