import { SATDIK_LIST, SARPRAS_CATEGORIES, INITIAL_SARPRAS_DATA } from './kkpData.js';

// Generates a comprehensive dataset of 100+ assets ensuring all 18 Satdik have rich, realistic sarpras

export function normalizeCategory(cat) {
  if (!cat) return 'penangkapan_mesin';
  if (cat === 'maritim_kapal' || cat === 'alat_tangkap') return 'penangkapan_mesin';
  if (cat === 'akuakultur') return 'budidaya_perikanan';
  if (cat === 'pengolahan_upi') return 'pengolahan_hasil';
  if (cat === 'tefa') return 'agribisnis_penyuluhan';
  if (cat === 'administrasi_umum') return 'administrasi_umum';
  if (cat === 'asrama_penunjang') return 'konservasi_pariwisata';
  return cat;
}

export function getFullSarprasData() {
  const assets = [...INITIAL_SARPRAS_DATA].map(a => ({ ...a, category: normalizeCategory(a.category) }));

  // Helper to check existing count per satdik
  const countPerSatdik = {};
  assets.forEach(a => {
    countPerSatdik[a.satdikId] = (countPerSatdik[a.satdikId] || 0) + 1;
  });

  // Additional assets template for institutions that need full representation
  const additionalTemplates = [
    {
      satdikId: 'poltek-kp-dumai',
      category: 'penangkapan_mesin',
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
      category: 'konservasi_pariwisata',
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
      category: 'konservasi_pariwisata',
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
      category: 'konservasi_pariwisata',
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
      category: 'penangkapan_mesin',
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
      category: 'pengolahan_hasil',
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
      category: 'konservasi_pariwisata',
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
      category: 'penangkapan_mesin',
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
      category: 'konservasi_pariwisata',
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
      category: 'agribisnis_penyuluhan',
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
      category: 'pengolahan_hasil',
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
      category: 'agribisnis_penyuluhan',
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
      category: 'agribisnis_penyuluhan',
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
      category: 'agribisnis_penyuluhan',
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
      category: 'agribisnis_penyuluhan',
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
      bmnCode: `BMN-3.05.09.01.${String(idx + 1).padStart(3, '0')}-00${idx + 10}`,
      satdikName: satdik ? satdik.name : 'Satdik KKP',
      ...item
    });
  });

  return assets;
}

// Compute comprehensive national KPIs and analytics
export function calculateSarprasKPIs(assets, satdikList = SATDIK_LIST) {
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
export function formatRupiah(amount) {
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
export function simulateBudgetImpact(allocatedBudgetRp, currentAssets) {
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
