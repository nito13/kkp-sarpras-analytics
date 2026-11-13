/**
 * ============================================================================
 * Sarana dan Prasarana Satuan Pendidikan KP — Modul Ekspor Laporan Excel Resmi (.xlsx) Multi-Sheet
 * Badan Penyuluhan dan Pengembangan SDM Kelautan dan Perikanan (BPPSDMKP)
 * ============================================================================
 */
(function (window) {
  'use strict';

// src/utils/excelExport.js
// Generator Dokumen Microsoft Excel Asli (.xlsx OpenXML)
// Menghasilkan tabel rapi bergaris, kop dinas resmi KKP, pewarnaan status, dan formula angka
// 100% kompatibel tanpa peringatan corrupt / extension mismatch di Microsoft Excel

  const XLSX = window.XLSX;

/**
 * Format angka ke format Rupiah teks
 */
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('id-ID');
}

/**
 * Mendapatkan tanggal dan jam format Indonesia
 */
function getFormattedDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return now.toLocaleDateString('id-ID', options);
}

// Border styles
const borderThin = {
  top: { style: 'thin', color: { rgb: 'CBD5E1' } },
  bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
  left: { style: 'thin', color: { rgb: 'CBD5E1' } },
  right: { style: 'thin', color: { rgb: 'CBD5E1' } }
};

const borderDoubleBottom = {
  top: { style: 'thin', color: { rgb: '0B3D60' } },
  bottom: { style: 'double', color: { rgb: '0B3D60' } },
  left: { style: 'thin', color: { rgb: 'CBD5E1' } },
  right: { style: 'thin', color: { rgb: 'CBD5E1' } }
};

/**
 * Helper untuk membuat sel dengan nilai dan style
 */
function createCell(val, style = {}, type = null) {
  const cell = { v: val };
  if (type) cell.t = type;
  else if (typeof val === 'number') cell.t = 'n';
  else if (typeof val === 'boolean') cell.t = 'b';
  else cell.t = 's';
  cell.s = style;
  return cell;
}

/**
 * Ekspor Format RKA Prioritas Anggaran ke File Asli Microsoft Excel (.xlsx)
 */
  function exportRKAToExcel(simulation, options = {}) {
  const {
    currentUser = null,
    filenamePrefix = 'RKA_Prioritas_Sarpras_Pusdik_KP'
  } = options;

  if (!simulation || !Array.isArray(simulation.fundedAssets)) {
    alert('Data simulasi RKA belum siap untuk diekspor.');
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = {};

  const fundedAssets = simulation.fundedAssets;
  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';

  // 1. KOP SURAT
  const kopKemen = { font: { name: 'Calibri', sz: 13, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center' } };
  const kopPusat = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center' } };
  const kopSub = { font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: '64748B' } }, alignment: { horizontal: 'center' } };

  ws['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopKemen);
  ws['A2'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP) — BPPSDM KP', kopPusat);
  ws['A3'] = createCell('Rencana Kerja dan Anggaran (RKA) Prioritas Rehabilitasi & Pemeliharaan Sarpras', kopSub);

  ws['A5'] = createCell('FORMAT USULAN PRIORITAS ANGGARAN RKA REHABILITASI SARPRAS 2026/2027', {
    font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '1E1B4B' } },
    fill: { fgColor: { rgb: 'EEF2FF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderThin
  });

  // Metadata RKA
  const metaLabel = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '475569' } }, fill: { fgColor: { rgb: 'F8FAFC' } } };
  const metaVal = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } } };
  const metaValBold = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '1E1B4B' } }, numFmt: '#,##0' };
  const metaValGreen = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '166534' } }, numFmt: '#,##0' };

  ws['A6'] = createCell('Total Pagu Dialokasikan:', metaLabel);
  ws['C6'] = createCell(simulation.budgetLimit || 0, metaValBold, 'n');
  ws['E6'] = createCell('Total Aset Dibiayai:', metaLabel);
  ws['G6'] = createCell(`${fundedAssets.length} Item Sarpras`, metaVal);

  ws['A7'] = createCell('Realisasi Anggaran RKA:', metaLabel);
  ws['C7'] = createCell(simulation.totalFundedCost || 0, metaValGreen, 'n');
  ws['E7'] = createCell('Sisa Alokasi Pagu:', metaLabel);
  ws['G7'] = createCell(simulation.remainingBudget || 0, metaValBold, 'n');

  ws['A8'] = createCell('Waktu Penyusunan:', metaLabel);
  ws['C8'] = createCell(printedAt, metaVal);
  ws['E8'] = createCell('Disusun Oleh:', metaLabel);
  ws['G8'] = createCell(userName, metaVal);

  // Table Headers
  const rkaHeaders = [
    'No.',
    'ID Aset',
    'Nama Sarana & Prasarana',
    'Satuan Pendidikan (Kampus)',
    'Bidang Sarpras',
    'Kondisi Awal',
    'Alokasi Biaya Disetujui (Rp)',
    'Status Rekomendasi RKA'
  ];

  const rkaHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '312E81' } }, // Indigo tua
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderThin
  };

  rkaHeaders.forEach((t, i) => {
    ws[XLSX.utils.encode_cell({ r: 10, c: i })] = createCell(t, rkaHeaderStyle);
  });

  let rkaRow = 11;
  fundedAssets.forEach((a, idx) => {
    const isEven = idx % 2 === 0;
    const bgRowColor = isEven ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10 }, border: borderThin, fill: { fgColor: { rgb: bgRowColor } } };

    const centerP1 = { ...base, alignment: { horizontal: 'center' } };
    const leftBold = { ...base, font: { ...base.font, bold: true }, alignment: { horizontal: 'left' } };
    const left = { ...base, alignment: { horizontal: 'left' } };
    const condStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '991B1B' } }, fill: { fgColor: { rgb: 'FEE2E2' } }, alignment: { horizontal: 'center' } };
    const currStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'right' }, numFmt: '#,##0' };
    const approvedStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '166534' } }, fill: { fgColor: { rgb: 'DCFCE7' } }, alignment: { horizontal: 'center' } };

    const cells = [
      createCell(idx + 1, centerP1),
      createCell(a.id, centerP1, 's'),
      createCell(a.name, leftBold),
      createCell(a.satdikName || '-', left),
      createCell(a.category || '-', left),
      createCell(a.condition || '-', condStyle),
      createCell(Number(a.fundedAmount || a.estimatedRepairCost) || 0, currStyle, 'n'),
      createCell('DISETUJUI (PRIORITAS 1)', approvedStyle)
    ];

    cells.forEach((cell, cIdx) => {
      ws[XLSX.utils.encode_cell({ r: rkaRow, c: cIdx })] = cell;
    });

    rkaRow++;
  });

  // Total Row RKA
  const rkaTotalLabel = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } },
    fill: { fgColor: { rgb: 'E2E8F0' } },
    alignment: { horizontal: 'right' },
    border: borderDoubleBottom
  };
  const rkaTotalVal = {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } },
    fill: { fgColor: { rgb: 'E2E8F0' } },
    alignment: { horizontal: 'right' },
    border: borderDoubleBottom,
    numFmt: '#,##0'
  };

  ws[XLSX.utils.encode_cell({ r: rkaRow, c: 0 })] = createCell(`TOTAL ANGGARAN USULAN RKA (${fundedAssets.length} ASET):`, rkaTotalLabel);
  for (let c = 1; c <= 5; c++) {
    ws[XLSX.utils.encode_cell({ r: rkaRow, c })] = createCell('', rkaTotalLabel);
  }
  ws[XLSX.utils.encode_cell({ r: rkaRow, c: 6 })] = createCell(simulation.totalFundedCost || 0, rkaTotalVal, 'n');
  ws[XLSX.utils.encode_cell({ r: rkaRow, c: 7 })] = createCell('100% TERVERIFIKASI', { ...rkaTotalLabel, alignment: { horizontal: 'center' } });

  // Signoff
  const rkaSignRow = rkaRow + 3;
  const signLabel = { font: { name: 'Calibri', sz: 10, color: { rgb: '475569' } }, alignment: { horizontal: 'center' } };
  const signBold = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '1E1B4B' } }, alignment: { horizontal: 'center' } };

  ws[XLSX.utils.encode_cell({ r: rkaSignRow, c: 2 })] = createCell('Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP),', signLabel);
  ws[XLSX.utils.encode_cell({ r: rkaSignRow + 1, c: 2 })] = createCell('Koordinator Kelompok Sarana dan Prasarana', signBold);
  ws[XLSX.utils.encode_cell({ r: rkaSignRow + 5, c: 2 })] = createCell('( Admin Sarpras Pusdik KP )', signBold);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
    // Metadata
    { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
    { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
    { s: { r: 5, c: 6 }, e: { r: 5, c: 7 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 3 } },
    { s: { r: 6, c: 4 }, e: { r: 6, c: 5 } },
    { s: { r: 6, c: 6 }, e: { r: 6, c: 7 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 3 } },
    { s: { r: 7, c: 4 }, e: { r: 7, c: 5 } },
    { s: { r: 7, c: 6 }, e: { r: 7, c: 7 } },
    // Total label
    { s: { r: rkaRow, c: 0 }, e: { r: rkaRow, c: 5 } },
    // Signoff
    { s: { r: rkaSignRow, c: 2 }, e: { r: rkaSignRow, c: 5 } },
    { s: { r: rkaSignRow + 1, c: 2 }, e: { r: rkaSignRow + 1, c: 5 } },
    { s: { r: rkaSignRow + 5, c: 2 }, e: { r: rkaSignRow + 5, c: 5 } },
  ];

  ws['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 38 },
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 22 },
    { wch: 24 }
  ];

  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rkaSignRow + 6, c: 7 }
  });

  XLSX.utils.book_append_sheet(wb, ws, 'RKA Prioritas Sarpras');

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}


/**
 * Ekspor Rekapitulasi & Detail Ketersediaan Asrama Taruna ke File Resmi Microsoft Excel (.xlsx)
 */
function exportAsramaToExcel(asramaData, satdikList = [], options = {}) {
  const {
    currentUser = null,
    filterSatdikName = 'Seluruh Satuan Pendidikan Terdata (16 Satdik)',
    filenamePrefix = 'SARPRAS_KKP_Kapasitas_Asrama'
  } = options;

  const summary = Array.isArray(asramaData?.summary) ? asramaData.summary : [];
  const buildings = Array.isArray(asramaData?.buildings) ? asramaData.buildings : [];

  if (summary.length === 0 && buildings.length === 0) {
    alert('Tidak ada data kapasitas asrama untuk diekspor ke Excel.');
    return;
  }

  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });

  const wb = XLSX.utils.book_new();
  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';
  const userRole = currentUser?.roleLabel || 'Pengelola Sarana dan Prasarana Satuan Pendidikan KP';

  const kopStyleKemen = { font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStyleBadan = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStylePusat = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const titleStyle = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0B3D60' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const tableHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0B3D60' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };

  // ================= SHEET 1: REKAP PER SATDIK =================
  const ws1 = {};
  ws1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws1['A5'] = createCell('LAPORAN REKAPITULASI KETERSEDIAAN & RASIO KETERCUKUPAN ASRAMA TARUNA (STANDAR 4 M²/ORANG)', titleStyle);

  const metaStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '334155' } } };
  const metaBold = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } } };
  ws1['A6'] = createCell('Cakupan Satuan Pendidikan:', metaStyle);
  ws1['C6'] = createCell(filterSatdikName, metaBold);
  ws1['H6'] = createCell('Waktu Cetak:', metaStyle);
  ws1['J6'] = createCell(printedAt, metaStyle);
  ws1['A7'] = createCell('Dicetak Oleh:', metaStyle);
  ws1['C7'] = createCell(userName + ' (' + userRole + ')', metaBold);
  ws1['H7'] = createCell('Sumber Data:', metaStyle);
  ws1['J7'] = createCell(asramaData?.meta?.sumber || 'Rekap Asrama Satdik KP', metaBold);

  const rekapHeaders = [
    'No.',
    'Satuan Pendidikan',
    'Provinsi / Wilayah',
    'Unit Asrama',
    'Kamar / Barak',
    'Luas Kamar (m²)',
    'Kapasitas 4 m² (Org)',
    'Kapasitas Aktif (Org)',
    'Jumlah Taruna',
    'Selisih (+/-)',
    'Rasio Ketercukupan',
    'Kapasitas Adj. (Org)',
    'Dokumen Google Drive'
  ];
  rekapHeaders.forEach((h, c) => {
    ws1[XLSX.utils.encode_cell({ r: 8, c })] = createCell(h, tableHeaderStyle);
  });

  let r1 = 9;
  let totUnit = 0, totKamar = 0, totLuas = 0, totKap = 0, totAktif = 0, totTaruna = 0, totAdj = 0;

  summary.forEach((s, idx) => {
    const sat = satdikMap[s.satdikId] || {};
    const taruna = Number(sat.tarunaCount) || 0;
    const kap = Math.round(Number(s.kapasitas) || 0);
    const aktif = Math.round(Number(s.kapasitasAktif ?? s.kapasitas) || 0);
    const diff = kap - taruna;
    const ratio = taruna > 0 ? Math.round((kap / taruna) * 1000) / 10 : 0;
    const adj = s.kapasitasAdjustment != null ? Math.round(Number(s.kapasitasAdjustment)) : '';

    totUnit += Number(s.jumlahAsrama) || 0;
    totKamar += Number(s.jumlahKamar) || 0;
    totLuas += Number(s.luasM2) || 0;
    totKap += kap;
    totAktif += aktif;
    totTaruna += taruna;
    if (typeof adj === 'number') totAdj += adj;

    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };
    const ratioStyle = {
      ...center,
      font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: ratio >= 100 ? '065F46' : ratio >= 70 ? '92400E' : '9F1239' } },
      fill: { fgColor: { rgb: ratio >= 100 ? 'D1FAE5' : ratio >= 70 ? 'FEF3C7' : 'FFE4E6' } }
    };

    const vals = [
      [idx + 1, center, 'n'],
      [sat.name || s.namaExcel || s.satdikId, leftBold, 's'],
      [sat.provinsi ? sat.provinsi + ' (' + (sat.region || '') + ')' : '-', left, 's'],
      [Number(s.jumlahAsrama) || 0, numInt, 'n'],
      [Number(s.jumlahKamar) || 0, numInt, 'n'],
      [Number(s.luasM2) || 0, numDec, 'n'],
      [kap, numInt, 'n'],
      [aktif, numInt, 'n'],
      [taruna, numInt, 'n'],
      [diff, numInt, 'n'],
      [ratio + '%', ratioStyle, 's'],
      [adj === '' ? '-' : adj, adj === '' ? center : numInt, adj === '' ? 's' : 'n'],
      [s.driveUrl || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      const cell = createCell(v, st, t);
      if (c === 12 && s.driveUrl) cell.l = { Target: s.driveUrl, Tooltip: 'Buka Dokumen Google Drive' };
      ws1[XLSX.utils.encode_cell({ r: r1, c })] = cell;
    });
    r1++;
  });

  const totStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0B3D60' } }, fill: { fgColor: { rgb: 'E0F2FE' } }, border: borderDoubleBottom, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const totDec = { ...totStyle, numFmt: '#,##0.00' };
  const totLabel = { ...totStyle, alignment: { horizontal: 'center', vertical: 'center' } };
  const totRatio = totTaruna > 0 ? (Math.round((totKap / totTaruna) * 1000) / 10) + '%' : '-';
  ws1[XLSX.utils.encode_cell({ r: r1, c: 0 })] = createCell('TOTAL', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 1 })] = createCell(summary.length + ' Satuan Pendidikan', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 2 })] = createCell('', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 3 })] = createCell(totUnit, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 4 })] = createCell(totKamar, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 5 })] = createCell(Math.round(totLuas * 100) / 100, totDec, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 6 })] = createCell(totKap, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 7 })] = createCell(totAktif, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 8 })] = createCell(totTaruna, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 9 })] = createCell(totKap - totTaruna, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 10 })] = createCell(totRatio, totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 11 })] = createCell(totAdj > 0 ? totAdj : '-', totAdj > 0 ? totStyle : totLabel, totAdj > 0 ? 'n' : 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 12 })] = createCell('', totLabel, 's');

  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 12 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 12 } }
  ];
  ws1['!cols'] = [
    { wch: 5 }, { wch: 36 }, { wch: 24 }, { wch: 12 }, { wch: 13 }, { wch: 16 },
    { wch: 17 }, { wch: 17 }, { wch: 14 }, { wch: 13 }, { wch: 17 }, { wch: 17 }, { wch: 44 }
  ];
  ws1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r1 + 1, c: 12 } });
  XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Kapasitas Asrama');

  // ================= SHEET 2: DETAIL GEDUNG ASRAMA =================
  if (buildings.length > 0) {
    const ws2 = {};
    ws2['A1'] = createCell('RINCIAN INVENTARIS GEDUNG & KAMAR ASRAMA TARUNA SATUAN PENDIDIKAN KKP', titleStyle);
    const gHeaders = [
      'No.', 'Kode Gedung', 'Satuan Pendidikan', 'Kampus / Lokasi', 'Nama Gedung Asrama',
      'Peruntukan', 'Kamar / Barak', 'Rincian Dimensi Kamar', 'Luas Total (m²)', 'Kapasitas (Org)', 'Status', 'Keterangan'
    ];
    gHeaders.forEach((h, c) => {
      ws2[XLSX.utils.encode_cell({ r: 2, c })] = createCell(h, tableHeaderStyle);
    });
    let r2 = 3;
    buildings.forEach((b, idx) => {
      const sat = satdikMap[b.satdikId] || {};
      const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
      const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
      const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
      const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
      const leftBold = { ...left, font: { ...base.font, bold: true } };
      const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
      const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };
      const dims = Array.isArray(b.rincian) && b.rincian.length > 0
        ? b.rincian.map(rc => (rc.label && rc.label !== b.nama ? rc.label + ': ' : '') + (rc.ukuran || '-') + ' (' + rc.jumlah + ' ruang)').join('; ')
        : '-';
      const vals = [
        [idx + 1, center, 'n'],
        [b.id, center, 's'],
        [sat.shortName || sat.name || b.satdikId, left, 's'],
        [b.kampus || 'Kampus Utama', left, 's'],
        [b.nama, leftBold, 's'],
        [b.peruntukan || '-', center, 's'],
        [Number(b.jumlahKamar) || 0, numInt, 'n'],
        [dims, left, 's'],
        [Number(b.luasM2) || 0, numDec, 'n'],
        [Math.round(Number(b.kapasitas) || 0), numInt, 'n'],
        [b.status || 'Digunakan', center, 's'],
        [b.keterangan || '-', left, 's']
      ];
      vals.forEach(([v, st, t], c) => {
        ws2[XLSX.utils.encode_cell({ r: r2, c })] = createCell(v, st, t);
      });
      r2++;
    });
    ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
    ws2['!cols'] = [
      { wch: 5 }, { wch: 14 }, { wch: 24 }, { wch: 18 }, { wch: 28 }, { wch: 13 },
      { wch: 13 }, { wch: 42 }, { wch: 15 }, { wch: 15 }, { wch: 16 }, { wch: 28 }
    ];
    ws2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r2, c: 11 } });
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Gedung Asrama');
  }

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Ekspor Rekapitulasi & Matriks Pemenuhan Standar Minimal Sarpras Prodi ke File Resmi Microsoft Excel (.xlsx)
 */
function exportStandarToExcel(standarData, satdikList = [], options = {}) {
  const {
    currentUser = null,
    filterScopeLabel = 'Seluruh Rumpun Prodi (12 Bidang) & 11 Satdik Pendidikan Tinggi',
    selectedSatdik = 'ALL',
    filenamePrefix = 'SARPRAS_KKP_Standar_Minimal_Prodi'
  } = options;

  const bidangList = Array.isArray(standarData?.bidang) ? standarData.bidang : [];
  const rekapList = Array.isArray(standarData?.rekap) ? standarData.rekap : [];
  const itemsList = Array.isArray(standarData?.items) ? standarData.items : [];

  if (rekapList.length === 0 && itemsList.length === 0) {
    alert('Tidak ada data standar sarpras prodi untuk diekspor ke Excel.');
    return;
  }

  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });
  const bidangMap = {};
  bidangList.forEach(b => { bidangMap[b.id] = b; });

  const wb = XLSX.utils.book_new();
  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';

  const kopStyleKemen = { font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStyleBadan = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStylePusat = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const titleStyle = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0B3D60' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const metaLabel = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '334155' } }, fill: { fgColor: { rgb: 'F1F5F9' } }, border: borderThin };
  const metaVal = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: 'FFFFFF' } }, border: borderThin };
  const tableHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0F172A' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };

  // ================= SHEET 1: REKAP PEMENUHAN STANDAR =================
  const ws1 = {};
  const colMax1 = 12;
  ws1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN — ANALITIK STANDAR MINIMAL SARPRAS PRODI', kopStylePusat);
  ws1['A5'] = createCell('LAPORAN REKAPITULASI PEMENUHAN STANDAR MINIMAL & GAP SARPRAS PROGRAM STUDI', titleStyle);

  ws1['A6'] = createCell('Cakupan Filter', metaLabel);
  ws1['C6'] = createCell(filterScopeLabel, metaVal);
  ws1['H6'] = createCell('Waktu Cetak', metaLabel);
  ws1['J6'] = createCell(printedAt, metaVal);

  ws1['A7'] = createCell('Sumber Data', metaLabel);
  ws1['C7'] = createCell(standarData?.meta?.sumber || 'Data Contoh.xlsx', metaVal);
  ws1['H7'] = createCell('Dicetak Oleh', metaLabel);
  ws1['J7'] = createCell(userName, metaVal);

  const headers1 = [
    'No.', 'Rumpun / Bidang Prodi', 'Satuan Pendidikan', 'Prasarana Standar',
    'Prasarana Terpenuhi', '% Prasarana', 'Sarana Standar', 'Sarana Terpenuhi',
    '% Sarana', 'Total Item Standar', 'Defisit / Belum Ada', '% Pemenuhan Total', 'Status Kesiapan'
  ];
  headers1.forEach((h, c) => {
    ws1[XLSX.utils.encode_cell({ r: 9, c })] = createCell(h, tableHeaderStyle);
  });

  let r1 = 10;
  rekapList.forEach((rk, idx) => {
    const bObj = bidangMap[rk.bidangId] || {};
    const sObj = satdikMap[rk.satdikId] || {};
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numPct = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '0.0"%"' };

    const pct = Number(rk.persenTotal) || 0;
    const statusLabel = pct >= 70 ? 'Memadai (≥70%)' : pct >= 40 ? 'Perlu Penguatan (40-69%)' : 'Defisit Prioritas (<40%)';
    const statusColor = pct >= 70 ? 'DCFCE7' : pct >= 40 ? 'FEF3C7' : 'FFE4E6';
    const statusText = pct >= 70 ? '166534' : pct >= 40 ? '92400E' : '9F1239';
    const statusCell = {
      font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: statusText } },
      fill: { fgColor: { rgb: statusColor } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderThin
    };

    const defisitCount = (Number(rk.totalSebagian) || 0) + (Number(rk.totalKosong) || 0);
    const rowVals = [
      [idx + 1, center, 'n'],
      [bObj.nama || rk.bidangId, leftBold, 's'],
      [sObj.shortName || sObj.name || rk.satdikId, left, 's'],
      [Number(rk.prasaranaTotal) || 0, numInt, 'n'],
      [Number(rk.prasaranaTerpenuhi) || 0, numInt, 'n'],
      [Number(rk.persenPrasarana) || 0, numPct, 'n'],
      [Number(rk.saranaTotal) || 0, numInt, 'n'],
      [Number(rk.saranaTerpenuhi) || 0, numInt, 'n'],
      [Number(rk.persenSarana) || 0, numPct, 'n'],
      [Number(rk.totalItems) || 0, numInt, 'n'],
      [defisitCount, numInt, 'n'],
      [pct, numPct, 'n'],
      [statusLabel, statusCell, 's']
    ];
    rowVals.forEach(([v, st, t], c) => {
      ws1[XLSX.utils.encode_cell({ r: r1, c })] = createCell(v, st, t);
    });
    r1++;
  });

  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colMax1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colMax1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: colMax1 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: colMax1 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    { s: { r: 5, c: 2 }, e: { r: 5, c: 6 } },
    { s: { r: 5, c: 7 }, e: { r: 5, c: 8 } },
    { s: { r: 5, c: 9 }, e: { r: 5, c: colMax1 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 6 } },
    { s: { r: 6, c: 7 }, e: { r: 6, c: 8 } },
    { s: { r: 6, c: 9 }, e: { r: 6, c: colMax1 } },
  ];
  ws1['!cols'] = [
    { wch: 5 }, { wch: 30 }, { wch: 24 }, { wch: 14 }, { wch: 15 },
    { wch: 13 }, { wch: 14 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
    { wch: 16 }, { wch: 16 }, { wch: 24 }
  ];
  ws1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r1, c: colMax1 } });
  XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Standar Prodi');

  // ================= SHEET 2: RINCIAN ITEM STANDAR =================
  if (itemsList.length > 0) {
    const ws2 = {};
    ws2['A1'] = createCell('RINCIAN KATALOG & REALISASI STANDAR MINIMAL SARANA PRASARANA PRODI KKP', titleStyle);
    const singleSat = selectedSatdik && selectedSatdik !== 'ALL' ? (satdikMap[selectedSatdik]?.shortName || selectedSatdik) : null;
    const iHeaders = [
      'No.', 'Kode Item', 'Rumpun Prodi', 'Seksi', 'Kode Grup', 'Fasilitas / Laboratorium / Workshop',
      'Sub-Ruang / Kategori', 'Nama Item Standar', 'Vol Standar', 'Satuan',
      singleSat ? `Realisasi (${singleSat})` : 'Ringkasan Realisasi Kampus',
      'Kondisi / Catatan Audit'
    ];
    iHeaders.forEach((h, c) => {
      ws2[XLSX.utils.encode_cell({ r: 2, c })] = createCell(h, tableHeaderStyle);
    });
    let r2 = 3;
    itemsList.forEach((it, idx) => {
      const bObj = bidangMap[it.bidangId] || {};
      const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
      const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
      const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
      const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
      const leftBold = { ...left, font: { ...base.font, bold: true } };
      const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };

      let realCellVal = '-';
      let realCellType = 's';
      let realCellStyle = left;
      if (singleSat && it.real && it.real[selectedSatdik] !== undefined) {
        realCellVal = Number(it.real[selectedSatdik]) || 0;
        realCellType = 'n';
        realCellStyle = numInt;
      } else if (it.real) {
        realCellVal = Object.entries(it.real)
          .map(([sid, v]) => `${satdikMap[sid]?.shortName?.replace('Politeknik KP ', '') || sid}: ${v}`)
          .join(' | ');
      }
      const noteCombined = [it.kondisi ? `Kondisi: ${it.kondisi}` : '', it.ket || ''].filter(Boolean).join(' — ') || '-';

      const vals = [
        [idx + 1, center, 'n'],
        [it.id, center, 's'],
        [bObj.nama || it.bidangId, left, 's'],
        [it.sec === 'A' ? 'A. Prasarana' : 'B. Sarana', center, 's'],
        [it.grpCode || '-', center, 's'],
        [it.grpName || '-', left, 's'],
        [it.subGrp || '-', left, 's'],
        [it.nama, leftBold, 's'],
        [Number(it.stdVol) || 0, numInt, 'n'],
        [it.satuan || 'Unit', center, 's'],
        [realCellVal, realCellStyle, realCellType],
        [noteCombined, left, 's']
      ];
      vals.forEach(([v, st, t], c) => {
        ws2[XLSX.utils.encode_cell({ r: r2, c })] = createCell(v, st, t);
      });
      r2++;
    });
    ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
    ws2['!cols'] = [
      { wch: 6 }, { wch: 13 }, { wch: 24 }, { wch: 13 }, { wch: 10 }, { wch: 32 },
      { wch: 24 }, { wch: 34 }, { wch: 12 }, { wch: 10 }, { wch: 34 }, { wch: 36 }
    ];
    ws2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r2, c: 11 } });
    XLSX.utils.book_append_sheet(wb, ws2, 'Rincian Item Standar');
  }

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

  
/**
 * Ekspor Dokumen Komprehensif Seluruh Data Sarana dan Prasarana Satuan Pendidikan KP (Multi-Sheet All-in-One)
 * Menyatukan:
 * - Sheet 1: Ringkasan & KPI Nasional (Executive Dashboard + Rekap 18 Satdik Komprehensif)
 * - Sheet 2: Kapasitas Asrama Taruna (Rekapitulasi rasio 4m²/orang per Satdik)
 * - Sheet 3: Detail Gedung Asrama (Daftar seluruh 104+ gedung fisik asrama)
 * - Sheet 4: Rekap Tambak & Kolam (Rekapitulasi luas lahan & unit tambak/kolam per Satdik)
 * - Sheet 5: Detail Unit Tambak & Kolam (Daftar seluruh petak/unit tambak, kolam, hatchery & sarana penunjang)
 * - Sheet 6: Rekap Standar Prodi (Matriks pemenuhan 12 bidang rumpun prodi x Satdik)
 * - Sheet 7: Rincian Item Standar (Katalog item kurikulum vokasi + realisasi kampus)
 */
function exportComprehensiveToExcel(params = {}) {
  const {
    assets = [],
    asramaData = {},
    tambakData = {},
    standarData = {},
    pembelajaranData = [],
    tanahData = [],
    satdikList = [],
    currentUser = null,
    options = {}
  } = params;

  const {
    filterSatdikName = 'Seluruh Satuan Pendidikan (18 Kampus Vokasi KKP)',
    filenamePrefix = 'Sarana_Prasarana_Satdik_KP_Laporan_Komprehensif_Nasional'
  } = options;

  const wb = XLSX.utils.book_new();
  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';
  const userRole = currentUser?.roleLabel || 'Pengelola Sarana dan Prasarana Satuan Pendidikan KP';

  // Memastikan data selalu lengkap dengan fallback ke master window data jika belum ter-fetch
  const effectiveSatdikList = (Array.isArray(satdikList) && satdikList.length > 0)
    ? satdikList
    : (window.SARPRAS_DATA?.SATDIK_LIST || []);
  const satdikMap = {};
  effectiveSatdikList.forEach(s => { satdikMap[s.id] = s; });

  const effectiveAssets = Array.isArray(assets) ? assets : [];

  const summaryAsrama = (Array.isArray(asramaData?.summary) && asramaData.summary.length > 0)
    ? asramaData.summary
    : (Array.isArray(window.SARPRAS_ASRAMA?.summary) ? window.SARPRAS_ASRAMA.summary : []);
  const buildingsAsrama = (Array.isArray(asramaData?.buildings) && asramaData.buildings.length > 0)
    ? asramaData.buildings
    : (Array.isArray(window.SARPRAS_ASRAMA?.buildings) ? window.SARPRAS_ASRAMA.buildings : []);
  const summaryTambak = (Array.isArray(tambakData?.summary) && tambakData.summary.length > 0)
    ? tambakData.summary
    : (Array.isArray(window.SARPRAS_TAMBAK?.summary) ? window.SARPRAS_TAMBAK.summary : []);
  const unitsTambak = (Array.isArray(tambakData?.units) && tambakData.units.length > 0)
    ? tambakData.units
    : (Array.isArray(window.SARPRAS_TAMBAK?.units) ? window.SARPRAS_TAMBAK.units : []);
  const bidangStandar = (Array.isArray(standarData?.bidang) && standarData.bidang.length > 0)
    ? standarData.bidang
    : (Array.isArray(window.SARPRAS_STANDAR?.bidang) ? window.SARPRAS_STANDAR.bidang : []);
  const rekapStandar = (Array.isArray(standarData?.rekap) && standarData.rekap.length > 0)
    ? standarData.rekap
    : (Array.isArray(window.SARPRAS_STANDAR?.rekap) ? window.SARPRAS_STANDAR.rekap : []);
  const itemsStandar = (Array.isArray(standarData?.items) && standarData.items.length > 0)
    ? standarData.items
    : (Array.isArray(window.SARPRAS_STANDAR?.items) ? window.SARPRAS_STANDAR.items : []);

  const effectivePembelajaran = (Array.isArray(params.pembelajaranData) && params.pembelajaranData.length > 0)
    ? params.pembelajaranData
    : (Array.isArray(window.SARPRAS_PEMBELAJARAN?.getAll ? window.SARPRAS_PEMBELAJARAN.getAll() : [])
       ? window.SARPRAS_PEMBELAJARAN.getAll()
       : (window.SARPRAS_PEMBELAJARAN?.initialData || []));

  const effectiveTanahData = Array.isArray(params.tanahData)
    ? params.tanahData
    : (window.SARPRAS_TANAH?.getAll ? window.SARPRAS_TANAH.getAll() : []);

  const bidangMap = {};
  bidangStandar.forEach(b => { bidangMap[b.id] = b; });

  // Styles KOP & Header
  const kopStyleKemen = { font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStyleBadan = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStylePusat = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStyleApp = { font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: '64748B' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const titleStyle = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0B3D60' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const sectionTitleStyle = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1E3A8A' } }, alignment: { horizontal: 'left', vertical: 'center' } };
  
  const tableHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0B3D60' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };

  const metaLabel = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '475569' } }, alignment: { horizontal: 'left', vertical: 'center' }, fill: { fgColor: { rgb: 'F8FAFC' } } };
  const metaVal = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, alignment: { horizontal: 'left', vertical: 'center' } };
  const metaValBold = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } }, alignment: { horizontal: 'left', vertical: 'center' } };

  // =========================================================================
  // SHEET 1: RINGKASAN EKSEKUTIF & KPI NASIONAL
  // =========================================================================
  const ws1 = {};
  ws1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws1['A4'] = createCell('Sistem Informasi & Analitik Sarana dan Prasarana Satuan Pendidikan KP', kopStyleApp);
  ws1['A6'] = createCell('LAPORAN KOMPREHENSIF EKSEKUTIF SARANA DAN PRASARANA SATUAN PENDIDIKAN KP', titleStyle);

  ws1['A7'] = createCell('Cakupan Laporan:', metaLabel);
  ws1['C7'] = createCell(filterSatdikName, metaValBold);
  ws1['I7'] = createCell('Waktu Ekspor:', metaLabel);
  ws1['K7'] = createCell(printedAt, metaVal);

  ws1['A8'] = createCell('Dicetak Oleh:', metaLabel);
  ws1['C8'] = createCell(userName + ' (' + userRole + ')', metaValBold);
  ws1['I8'] = createCell('Format Dokumen:', metaLabel);
  ws1['K8'] = createCell('Laporan Resmi Komprehensif Multi-Sheet OpenXML (.xlsx)', metaVal);

  // Perhitungan Agregat KPI Nasional
  const countBaik = assets.filter(a => a.condition === 'Baik').length;
  const countRusakRingan = assets.filter(a => a.condition === 'Rusak Ringan').length;
  const countRusakBerat = assets.filter(a => a.condition === 'Rusak Berat').length;
  const countUrgent = assets.filter(a => a.maintenanceUrgency === 'Kritis / Segera').length;

  let totAsramaGedung = buildingsAsrama.length;
  let totAsramaKamar = 0;
  let totAsramaLuas = 0;
  let totAsramaKap = 0;
  let totAsramaTaruna = 0;
  summaryAsrama.forEach(s => {
    totAsramaKamar += Number(s.jumlahKamar) || 0;
    totAsramaLuas += Number(s.luasM2) || 0;
    totAsramaKap += Math.round(Number(s.kapasitas) || 0);
    const sat = satdikMap[s.satdikId];
    if (sat) totAsramaTaruna += Number(sat.tarunaCount) || 0;
  });
  if (totAsramaGedung === 0) {
    summaryAsrama.forEach(s => { totAsramaGedung += Number(s.jumlahAsrama) || 0; });
  }

  let avgStandarPct = 0;
  if (rekapStandar.length > 0) {
    const sumPct = rekapStandar.reduce((acc, r) => acc + (Number(r.persenTotal) || 0), 0);
    avgStandarPct = Math.round((sumPct / rekapStandar.length) * 10) / 10;
  }

  // 4 KOTAK KPI EKSEKUTIF (Baris 10 - 13)
  const kpiBoxHeader = { font: { name: 'Calibri', sz: 9, bold: true, color: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
  const kpiBoxVal = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '0F172A' } }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { fgColor: { rgb: 'F1F5F9' } }, border: borderThin };
  const kpiBoxSub = { font: { name: 'Calibri', sz: 9, color: { rgb: '475569' } }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { fgColor: { rgb: 'F8FAFC' } }, border: borderThin };

  const totTambakUnitKPI = unitsTambak.length > 0 ? unitsTambak.length : summaryTambak.reduce((acc, s) => acc + (Number(s.jumlahUnit) || 0), 0);
  const totTambakHaKPI = (unitsTambak.reduce((acc, u) => acc + (Number(u.luasM2) || 0), 0) / 10000).toFixed(2);

  // Kotak 1: Tambak & Kolam Budidaya (Kolom A-C)
  ws1['A10'] = createCell('1. TAMBAK & KOLAM BUDIDAYA', { ...kpiBoxHeader, fill: { fgColor: { rgb: '0284C7' } } });
  ws1['A11'] = createCell(totTambakUnitKPI + ' Unit (' + totTambakHaKPI + ' Ha)', kpiBoxVal);
  ws1['A12'] = createCell('Baik: ' + countBaik + ' | Rusak Ringan: ' + countRusakRingan + ' | Rusak Berat: ' + countRusakBerat, kpiBoxSub);
  ws1['A13'] = createCell('Perbaikan Mendesak / Kritis: ' + countUrgent + ' Unit', { ...kpiBoxSub, font: { ...kpiBoxSub.font, bold: true, color: { rgb: 'B91C1C' } } });

  // Kotak 2: Kapasitas Asrama Taruna (Kolom D-F)
  ws1['D10'] = createCell('2. ASRAMA TARUNA (STANDAR 4 M²)', { ...kpiBoxHeader, fill: { fgColor: { rgb: '0D9488' } } });
  ws1['D11'] = createCell(totAsramaKap.toLocaleString('id-ID') + ' Kapasitas / ' + totAsramaTaruna.toLocaleString('id-ID') + ' Taruna', kpiBoxVal);
  ws1['D12'] = createCell('Total ' + totAsramaGedung + ' Gedung Fisik (' + totAsramaKamar + ' Kamar)', kpiBoxSub);
  const rasioNasional = totAsramaTaruna > 0 ? (totAsramaLuas / totAsramaTaruna).toFixed(2) : '0';
  ws1['D13'] = createCell('Rasio Rata-Rata: ' + rasioNasional + ' m²/taruna (Standar: ≥ 4.0 m²)', kpiBoxSub);

  // Kotak 3: Standar Sarpras Prodi (Kolom G-I)
  ws1['G10'] = createCell('3. STANDAR SARPRAS PRODI', { ...kpiBoxHeader, fill: { fgColor: { rgb: '4F46E5' } } });
  ws1['G11'] = createCell(avgStandarPct + '% Rata-Rata Pemenuhan', kpiBoxVal);
  ws1['G12'] = createCell('12 Rumpun Prodi Vokasi KKP', kpiBoxSub);
  ws1['G13'] = createCell(itemsStandar.length + ' Item Standar Sarpras Terakreditasi', kpiBoxSub);

  // Kotak 4: Satuan Pendidikan (Kolom J-N)
  ws1['J10'] = createCell('4. CAKUPAN SATDIK KKP', { ...kpiBoxHeader, fill: { fgColor: { rgb: '059669' } } });
  ws1['J11'] = createCell(effectiveSatdikList.length + ' Satuan Pendidikan', kpiBoxVal);
  ws1['J12'] = createCell('11 Politeknik KP & SUPM se-Indonesia', kpiBoxSub);
  ws1['J13'] = createCell('Terintegrasi Sabang sampai Merauke', kpiBoxSub);

  // TABEL REKAPITULASI KOMPREHENSIF PER SATDIK (Baris 15)
  ws1['A15'] = createCell('REKAPITULASI TERPADU TINGKAT SATUAN PENDIDIKAN VOKASI KP', sectionTitleStyle);

  const rekapHeaders1 = [
    'No.',
    'Kode Satdik',
    'Nama Satuan Pendidikan',
    'Kota / Provinsi',
    'Total Unit Sarpras',
    'Kondisi Baik',
    'Kondisi Rusak',
    'Gedung Asrama',
    'Kamar Asrama',
    'Luas Asrama (m²)',
    'Kapasitas (Org)',
    'Jml Taruna',
    'Rasio (m²/Org)',
    'Unit Tambak/Kolam',
    'Luas Tambak (Ha)',
    '% Standar Prodi'
  ];
  rekapHeaders1.forEach((h, c) => {
    ws1[XLSX.utils.encode_cell({ r: 16, c })] = createCell(h, tableHeaderStyle);
  });

  let row1 = 17;
  let sTotAset = 0, sTotBaik = 0, sTotRusak = 0, sTotGedung = 0, sTotKamar = 0, sTotLuas = 0, sTotKap = 0, sTotTaruna = 0, sTotTambakUnit = 0, sTotTambakHa = 0;

  effectiveSatdikList.forEach((s, idx) => {
    const sAssets = effectiveAssets.filter(a => a.satdikId === s.id || a.satdikName === s.name || (a.satdikName && s.shortName && a.satdikName.includes(s.shortName)));
    const sBaik = sAssets.filter(a => a.condition === 'Baik').length;
    const sRusak = sAssets.filter(a => a.condition === 'Rusak Ringan' || a.condition === 'Rusak Berat').length;

    const sAsr = summaryAsrama.find(sm => sm.satdikId === s.id);
    const sBldgs = buildingsAsrama.filter(b => b.satdikId === s.id);
    const jGedung = sBldgs.length > 0 ? sBldgs.length : (Number(sAsr?.jumlahAsrama) || 0);
    const jKamar = Number(sAsr?.jumlahKamar) || sBldgs.reduce((acc, b) => acc + (Number(b.jumlahKamar) || 0), 0);
    const jLuas = Number(sAsr?.luasM2) || sBldgs.reduce((acc, b) => acc + (Number(b.luasM2) || 0), 0);
    const jKap = Math.round(Number(sAsr?.kapasitas) || sBldgs.reduce((acc, b) => acc + (Number(b.kapasitas) || 0), 0));
    const jTaruna = Number(s.tarunaCount) || 0;
    const rasioM2 = jTaruna > 0 ? (jLuas / jTaruna).toFixed(2) : '-';

    const sTmbSum = summaryTambak.find(sm => sm.satdikId === s.id);
    const sTmbUnits = unitsTambak.filter(u => u.satdikId === s.id);
    const jTambakUnit = sTmbUnits.length > 0 ? sTmbUnits.length : (Number(sTmbSum?.totalUnit) || 0);
    const jTambakHa = Number(sTmbSum?.luasAktifHa) || (sTmbUnits.reduce((acc, u) => acc + (Number(u.luasM2) || 0), 0) / 10000);

    const sStdRekap = rekapStandar.filter(r => r.satdikId === s.id);
    let sStdPct = '-';
    if (sStdRekap.length > 0) {
      const sum = sStdRekap.reduce((acc, r) => acc + (Number(r.persenTotal) || 0), 0);
      sStdPct = (Math.round((sum / sStdRekap.length) * 10) / 10).toFixed(1) + '%';
    }

    sTotAset += sAssets.length;
    sTotBaik += sBaik;
    sTotRusak += sRusak;
    sTotGedung += jGedung;
    sTotKamar += jKamar;
    sTotLuas += jLuas;
    sTotKap += jKap;
    sTotTaruna += jTaruna;
    sTotTambakUnit += jTambakUnit;
    sTotTambakHa += jTambakHa;

    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

    const vals = [
      [idx + 1, center, 'n'],
      [s.id, center, 's'],
      [s.name, leftBold, 's'],
      [s.kota || '-', left, 's'],
      [sAssets.length, numInt, 'n'],
      [sBaik, numInt, 'n'],
      [sRusak, numInt, 'n'],
      [jGedung, numInt, 'n'],
      [jKamar, numInt, 'n'],
      [jLuas, numDec, 'n'],
      [jKap, numInt, 'n'],
      [jTaruna, numInt, 'n'],
      [rasioM2, center, 's'],
      [jTambakUnit, numInt, 'n'],
      [jTambakHa, numDec, 'n'],
      [sStdPct, center, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws1[XLSX.utils.encode_cell({ r: row1, c })] = createCell(v, st, t);
    });
    row1++;
  });

  // Baris Total Sheet 1
  const totStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: 'E2E8F0' } }, border: borderDoubleBottom };
  const totCenter = { ...totStyle, alignment: { horizontal: 'center', vertical: 'center' } };
  const totRight = { ...totStyle, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const totDec = { ...totStyle, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

  ws1[XLSX.utils.encode_cell({ r: row1, c: 0 })] = createCell('TOTAL NASIONAL', totCenter);
  ws1[XLSX.utils.encode_cell({ r: row1, c: 1 })] = createCell('', totCenter);
  ws1[XLSX.utils.encode_cell({ r: row1, c: 2 })] = createCell(effectiveSatdikList.length + ' Satuan Pendidikan', totStyle);
  ws1[XLSX.utils.encode_cell({ r: row1, c: 3 })] = createCell('-', totCenter);
  ws1[XLSX.utils.encode_cell({ r: row1, c: 4 })] = createCell(sTotAset, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 5 })] = createCell(sTotBaik, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 6 })] = createCell(sTotRusak, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 7 })] = createCell(sTotGedung, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 8 })] = createCell(sTotKamar, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 9 })] = createCell(sTotLuas, totDec, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 10 })] = createCell(sTotKap, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 11 })] = createCell(sTotTaruna, totRight, 'n');
  const rasioNasTotal = sTotTaruna > 0 ? (sTotLuas / sTotTaruna).toFixed(2) : '-';
  ws1[XLSX.utils.encode_cell({ r: row1, c: 12 })] = createCell(rasioNasTotal, totCenter, 's');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 13 })] = createCell(sTotTambakUnit, totRight, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 14 })] = createCell(sTotTambakHa, totDec, 'n');
  ws1[XLSX.utils.encode_cell({ r: row1, c: 15 })] = createCell(avgStandarPct + '%', totCenter, 's');

  // Lembar Pengesahan Sheet 1
  const signRow1 = row1 + 3;
  const signLabelStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '475569' } }, alignment: { horizontal: 'center' } };
  const signTitleStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } }, alignment: { horizontal: 'center' } };
  const signNameStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '003366' }, underline: true }, alignment: { horizontal: 'center' } };

  ws1[XLSX.utils.encode_cell({ r: signRow1, c: 2 })] = createCell('Mengetahui,', signLabelStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 1, c: 2 })] = createCell('Koordinator Sarana & Prasarana', signTitleStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 2, c: 2 })] = createCell('Pusat Pendidikan Kelautan dan Perikanan', signLabelStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 6, c: 2 })] = createCell('( Admin Sarpras Pusdik KP )', signNameStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 7, c: 2 })] = createCell('Pusdik KP — BPPSDM Kelautan dan Perikanan', signLabelStyle);

  ws1[XLSX.utils.encode_cell({ r: signRow1, c: 10 })] = createCell('Dicetak melalui Sarana dan Prasarana Satuan Pendidikan KP,', signLabelStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 1, c: 10 })] = createCell('Petugas Operator Sistem:', signTitleStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 2, c: 10 })] = createCell('Pada: ' + printedAt, signLabelStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 6, c: 10 })] = createCell('( ' + userName + ' )', signNameStyle);
  ws1[XLSX.utils.encode_cell({ r: signRow1 + 7, c: 10 })] = createCell(userRole, signLabelStyle);

  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 15 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 15 } },
    // Metadata
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 7 } },
    { s: { r: 6, c: 8 }, e: { r: 6, c: 9 } },
    { s: { r: 6, c: 10 }, e: { r: 6, c: 15 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 7 } },
    { s: { r: 7, c: 8 }, e: { r: 7, c: 9 } },
    { s: { r: 7, c: 10 }, e: { r: 7, c: 15 } },
    // KPI Boxes
    { s: { r: 9, c: 0 }, e: { r: 9, c: 2 } }, { s: { r: 10, c: 0 }, e: { r: 10, c: 2 } }, { s: { r: 11, c: 0 }, e: { r: 11, c: 2 } }, { s: { r: 12, c: 0 }, e: { r: 12, c: 2 } },
    { s: { r: 9, c: 3 }, e: { r: 9, c: 5 } }, { s: { r: 10, c: 3 }, e: { r: 10, c: 5 } }, { s: { r: 11, c: 3 }, e: { r: 11, c: 5 } }, { s: { r: 12, c: 3 }, e: { r: 12, c: 5 } },
    { s: { r: 9, c: 6 }, e: { r: 9, c: 8 } }, { s: { r: 10, c: 6 }, e: { r: 10, c: 8 } }, { s: { r: 11, c: 6 }, e: { r: 11, c: 8 } }, { s: { r: 12, c: 6 }, e: { r: 12, c: 8 } },
    { s: { r: 9, c: 9 }, e: { r: 9, c: 15 } }, { s: { r: 10, c: 9 }, e: { r: 10, c: 15 } }, { s: { r: 11, c: 9 }, e: { r: 11, c: 15 } }, { s: { r: 12, c: 9 }, e: { r: 12, c: 15 } },
    // Section Title
    { s: { r: 14, c: 0 }, e: { r: 14, c: 15 } },
    // Signoff
    { s: { r: signRow1, c: 2 }, e: { r: signRow1, c: 4 } },
    { s: { r: signRow1 + 1, c: 2 }, e: { r: signRow1 + 1, c: 4 } },
    { s: { r: signRow1 + 2, c: 2 }, e: { r: signRow1 + 2, c: 4 } },
    { s: { r: signRow1 + 6, c: 2 }, e: { r: signRow1 + 6, c: 4 } },
    { s: { r: signRow1 + 7, c: 2 }, e: { r: signRow1 + 7, c: 4 } },
    { s: { r: signRow1, c: 10 }, e: { r: signRow1, c: 15 } },
    { s: { r: signRow1 + 1, c: 10 }, e: { r: signRow1 + 1, c: 15 } },
    { s: { r: signRow1 + 2, c: 10 }, e: { r: signRow1 + 2, c: 15 } },
    { s: { r: signRow1 + 6, c: 10 }, e: { r: signRow1 + 6, c: 15 } },
    { s: { r: signRow1 + 7, c: 10 }, e: { r: signRow1 + 7, c: 15 } }
  ];

  ws1['!cols'] = [
    { wch: 5 },  // No
    { wch: 14 }, // Kode
    { wch: 32 }, // Nama Satdik
    { wch: 20 }, // Kota
    { wch: 13 }, // Jml Aset
    { wch: 13 }, // Baik
    { wch: 13 }, // Rusak
    { wch: 14 }, // Gedung Asrama
    { wch: 14 }, // Kamar
    { wch: 16 }, // Luas
    { wch: 15 }, // Kapasitas
    { wch: 13 }, // Taruna
    { wch: 14 }, // Rasio
    { wch: 16 }, // Unit Tambak/Kolam
    { wch: 16 }, // Luas Tambak (Ha)
    { wch: 16 }  // Standar Prodi
  ];
  ws1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: signRow1 + 8, c: 15 } });
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan & KPI');

  // =========================================================================
  // SHEET 2: KAPASITAS ASRAMA TARUNA (REKAP SATDIK)
  // =========================================================================
  const ws3 = {};
  ws3['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws3['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws3['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws3['A5'] = createCell('LAPORAN REKAPITULASI KETERSEDIAAN & RASIO KETERCUKUPAN ASRAMA TARUNA (STANDAR 4 M²/ORANG)', titleStyle);

  const rekapHeadersAsr = [
    'No.', 'Satuan Pendidikan', 'Provinsi / Wilayah', 'Unit Asrama', 'Kamar / Barak',
    'Luas Kamar (m²)', 'Kapasitas 4 m² (Org)', 'Kapasitas Aktif (Org)', 'Jumlah Taruna',
    'Selisih (+/-)', 'Rasio Ketercukupan', 'Kapasitas Adj. (Org)', 'Dokumen Google Drive'
  ];
  rekapHeadersAsr.forEach((h, c) => {
    ws3[XLSX.utils.encode_cell({ r: 6, c })] = createCell(h, tableHeaderStyle);
  });

  let row3 = 7;
  summaryAsrama.forEach((s, idx) => {
    const sat = satdikMap[s.satdikId] || {};
    const taruna = Number(sat.tarunaCount) || 0;
    const kap = Math.round(Number(s.kapasitas) || 0);
    const aktif = Math.round(Number(s.kapasitasAktif ?? s.kapasitas) || 0);
    const diff = kap - taruna;
    const ratio = taruna > 0 ? Math.round((kap / taruna) * 1000) / 10 : 0;
    const adj = s.kapasitasAdjustment != null ? Math.round(Number(s.kapasitasAdjustment)) : '';

    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };
    const ratioStyle = {
      ...center,
      font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: ratio >= 100 ? '065F46' : ratio >= 70 ? '92400E' : '9F1239' } },
      fill: { fgColor: { rgb: ratio >= 100 ? 'D1FAE5' : ratio >= 70 ? 'FEF3C7' : 'FFE4E6' } }
    };

    const vals = [
      [idx + 1, center, 'n'],
      [sat.name || s.namaExcel || s.satdikId, leftBold, 's'],
      [sat.provinsi || sat.kota || '-', left, 's'],
      [Number(s.jumlahAsrama) || 0, numInt, 'n'],
      [Number(s.jumlahKamar) || 0, numInt, 'n'],
      [Number(s.luasM2) || 0, numDec, 'n'],
      [kap, numInt, 'n'],
      [aktif, numInt, 'n'],
      [taruna, numInt, 'n'],
      [diff, numInt, 'n'],
      [ratio + '%', ratioStyle, 's'],
      [adj !== '' ? adj : '-', adj !== '' ? numInt : center, adj !== '' ? 'n' : 's'],
      [s.driveFolderUrl || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws3[XLSX.utils.encode_cell({ r: row3, c })] = createCell(v, st, t);
    });
    row3++;
  });

  ws3['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 12 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 12 } }
  ];
  ws3['!cols'] = [
    { wch: 5 }, { wch: 32 }, { wch: 20 }, { wch: 12 }, { wch: 13 }, { wch: 16 },
    { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 13 }, { wch: 16 }, { wch: 16 }, { wch: 36 }
  ];
  ws3['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row3, c: 12 } });
  XLSX.utils.book_append_sheet(wb, ws3, 'Kapasitas Asrama');

  // =========================================================================
  // SHEET 4: DETAIL GEDUNG ASRAMA
  // =========================================================================
  const ws4 = {};
  ws4['A1'] = createCell('DAFTAR RINCIAN FISIK GEDUNG ASRAMA TARUNA SATUAN PENDIDIKAN KP', titleStyle);
  const detailHeadersAsr = [
    'No.', 'ID Gedung', 'Satuan Pendidikan', 'Kampus', 'Nama Gedung Asrama',
    'Peruntukan', 'Jumlah Kamar', 'Dimensi Ruang (P x L)', 'Luas Total (m²)',
    'Kapasitas (Org)', 'Status Bangunan', 'Keterangan Fasilitas'
  ];
  detailHeadersAsr.forEach((h, c) => {
    ws4[XLSX.utils.encode_cell({ r: 1, c })] = createCell(h, tableHeaderStyle);
  });

  let row4 = 2;
  buildingsAsrama.forEach((b, idx) => {
    const sat = satdikMap[b.satdikId] || {};
    const dims = (b.panjangM && b.lebarM) ? (b.panjangM + ' m x ' + b.lebarM + ' m') : '-';
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

    const vals = [
      [idx + 1, center, 'n'],
      [b.id, center, 's'],
      [sat.name || b.satdikId, left, 's'],
      [b.kampus || 'Kampus Utama', left, 's'],
      [b.nama, leftBold, 's'],
      [b.peruntukan || '-', center, 's'],
      [Number(b.jumlahKamar) || 0, numInt, 'n'],
      [dims, left, 's'],
      [Number(b.luasM2) || 0, numDec, 'n'],
      [Math.round(Number(b.kapasitas) || 0), numInt, 'n'],
      [b.status || 'Digunakan', center, 's'],
      [b.keterangan || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws4[XLSX.utils.encode_cell({ r: row4, c })] = createCell(v, st, t);
    });
    row4++;
  });

  ws4['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
  ws4['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 28 }, { wch: 14 },
    { wch: 13 }, { wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 16 }, { wch: 32 }
  ];
  ws4['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row4, c: 11 } });
  XLSX.utils.book_append_sheet(wb, ws4, 'Detail Gedung Asrama');

  // =========================================================================
  // SHEET 5: REKAP TAMBAK & KOLAM BUDIDAYA
  // =========================================================================
  const wsTmb1 = {};
  wsTmb1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  wsTmb1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  wsTmb1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  wsTmb1['A5'] = createCell('LAPORAN REKAPITULASI PRASARANA DAN SARANA TAMBAK & KOLAM BUDIDAYA SATDIK KP', titleStyle);

  const rekapHeadersTmb = [
    'No.', 'Satuan Pendidikan', 'Kampus / Lokasi', 'Status Kepemilikan', 'Total Lahan (Ha)',
    'Lahan Aktif (Ha)', 'Total Unit', 'Petak Tambak', 'Kolam / Bak', 'Hatchery / Lab',
    'Kondisi Baik', 'Kondisi Rusak', 'Status Operasional', 'Komoditas & Catatan'
  ];
  rekapHeadersTmb.forEach((h, c) => {
    wsTmb1[XLSX.utils.encode_cell({ r: 6, c })] = createCell(h, tableHeaderStyle);
  });

  let rowTmb1 = 7;
  summaryTambak.forEach((s, idx) => {
    const sat = satdikMap[s.satdikId] || {};
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

    const vals = [
      [idx + 1, center, 'n'],
      [sat.name || s.satdikName || s.satdikId, leftBold, 's'],
      [s.kampusLokasi || sat.kota || '-', left, 's'],
      [s.statusKepemilikan || 'Milik KKP', left, 's'],
      [Number(s.luasTotalLahanHa) || 0, numDec, 'n'],
      [Number(s.luasAktifHa) || 0, numDec, 'n'],
      [Number(s.totalUnit) || 0, numInt, 'n'],
      [Number(s.jumlahPetakTambak) || 0, numInt, 'n'],
      [Number(s.jumlahKolam) || 0, numInt, 'n'],
      [Number(s.jumlahHatchery) || 0, numInt, 'n'],
      [Number(s.kondisiBaik) || 0, numInt, 'n'],
      [Number(s.kondisiRusak) || 0, numInt, 'n'],
      [s.statusOperasional || 'Operasional', center, 's'],
      [[s.komoditasUtama ? ('Komoditas: ' + s.komoditasUtama) : '', s.catatanRingkas || ''].filter(Boolean).join(' — ') || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      wsTmb1[XLSX.utils.encode_cell({ r: rowTmb1, c })] = createCell(v, st, t);
    });
    rowTmb1++;
  });

  wsTmb1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 13 } }
  ];
  wsTmb1['!cols'] = [
    { wch: 5 }, { wch: 30 }, { wch: 24 }, { wch: 24 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 13 }, { wch: 13 }, { wch: 14 }, { wch: 13 }, { wch: 13 }, { wch: 18 }, { wch: 42 }
  ];
  wsTmb1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowTmb1, c: 13 } });
  XLSX.utils.book_append_sheet(wb, wsTmb1, 'Rekap Tambak & Kolam');

  // =========================================================================
  // SHEET 6: DETAIL UNIT TAMBAK & KOLAM BUDIDAYA
  // =========================================================================
  const wsTmb2 = {};
  wsTmb2['A1'] = createCell('RINCIAN UNIT PRASARANA & SARANA TAMBAK, KOLAM, DAN HATCHERY BUDIDAYA SATDIK KP', titleStyle);
  const detailHeadersTmb = [
    'No.', 'ID Unit', 'Satuan Pendidikan', 'Lokasi / Kampus', 'Nama Prasarana / Petak',
    'Jenis Prasarana', 'Luas (m²)', 'Kondisi Fisik', 'Status Operasional', 'Fungsi / Komoditas',
    'Pelataran / Konstruksi', 'Listrik', 'Sarana Kincir / Aerator', 'Jml Kincir', 'Keterangan Teknis'
  ];
  detailHeadersTmb.forEach((h, c) => {
    wsTmb2[XLSX.utils.encode_cell({ r: 1, c })] = createCell(h, tableHeaderStyle);
  });

  let rowTmb2 = 2;
  unitsTambak.forEach((u, idx) => {
    const sat = satdikMap[u.satdikId] || {};
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

    const vals = [
      [idx + 1, center, 'n'],
      [u.id || '-', center, 's'],
      [sat.name || u.satdikName || u.satdikId, left, 's'],
      [u.kampusLokasi || '-', left, 's'],
      [u.nama || '-', leftBold, 's'],
      [u.jenis || 'Tambak', center, 's'],
      [Number(u.luasM2) || 0, numDec, 'n'],
      [u.kondisi || 'Baik', center, 's'],
      [u.statusOperasional || 'Aktif', center, 's'],
      [u.fungsi || '-', left, 's'],
      [u.pelataran || '-', left, 's'],
      [u.listrik || '-', left, 's'],
      [u.kincir || '-', left, 's'],
      [Number(u.jumlahKincir) || 0, numInt, 'n'],
      [u.keterangan || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      wsTmb2[XLSX.utils.encode_cell({ r: rowTmb2, c })] = createCell(v, st, t);
    });
    rowTmb2++;
  });

  wsTmb2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }];
  wsTmb2['!cols'] = [
    { wch: 5 }, { wch: 13 }, { wch: 28 }, { wch: 22 }, { wch: 30 }, { wch: 16 }, { wch: 14 },
    { wch: 14 }, { wch: 16 }, { wch: 26 }, { wch: 24 }, { wch: 18 }, { wch: 24 }, { wch: 12 }, { wch: 36 }
  ];
  wsTmb2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowTmb2, c: 14 } });
  XLSX.utils.book_append_sheet(wb, wsTmb2, 'Detail Unit Tambak & Kolam');

  // =========================================================================
  // SHEET 5: REKAP STANDAR SARPRAS PRODI
  // =========================================================================
  const ws5 = {};
  ws5['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws5['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws5['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws5['A5'] = createCell('LAPORAN MATRIKS PEMENUHAN STANDAR MINIMAL SARANA PRASARANA PRODI VOKASI KP', titleStyle);

  const rekapHeadersStd = [
    'No.', 'ID Bidang', 'Rumpun Program Studi', 'Satuan Pendidikan', 'Target Prasarana',
    'Target Sarana', 'Total Item Standar', '% Pemenuhan Prasarana', '% Pemenuhan Sarana',
    '% Total Pemenuhan', 'Kategori Kepatuhan'
  ];
  rekapHeadersStd.forEach((h, c) => {
    ws5[XLSX.utils.encode_cell({ r: 6, c })] = createCell(h, tableHeaderStyle);
  });

  let row5 = 7;
  rekapStandar.forEach((r, idx) => {
    const sat = satdikMap[r.satdikId] || {};
    const bObj = bidangMap[r.bidangId] || {};
    const pctTot = Number(r.persenTotal) || 0;
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const pctStyle = {
      ...center,
      font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: pctTot >= 80 ? '065F46' : pctTot >= 50 ? '92400E' : '9F1239' } },
      fill: { fgColor: { rgb: pctTot >= 80 ? 'D1FAE5' : pctTot >= 50 ? 'FEF3C7' : 'FFE4E6' } }
    };

    const katText = pctTot >= 80 ? 'Memenuhi Standar' : pctTot >= 50 ? 'Cukup Memenuhi' : 'Belum Memenuhi';

    const vals = [
      [idx + 1, center, 'n'],
      [r.bidangId, center, 's'],
      [bObj.nama || r.bidangId, leftBold, 's'],
      [sat.name || r.satdikId, left, 's'],
      [Number(r.targetPrasarana) || 0, numInt, 'n'],
      [Number(r.targetSarana) || 0, numInt, 'n'],
      [Number(r.targetTotal) || 0, numInt, 'n'],
      [(Number(r.persenPrasarana) || 0).toFixed(1) + '%', center, 's'],
      [(Number(r.persenSarana) || 0).toFixed(1) + '%', center, 's'],
      [pctTot.toFixed(1) + '%', pctStyle, 's'],
      [katText, center, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws5[XLSX.utils.encode_cell({ r: row5, c })] = createCell(v, st, t);
    });
    row5++;
  });

  ws5['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } }
  ];
  ws5['!cols'] = [
    { wch: 5 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 16 }, { wch: 14 },
    { wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 20 }
  ];
  ws5['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row5, c: 10 } });
  XLSX.utils.book_append_sheet(wb, ws5, 'Rekap Standar Prodi');

  // =========================================================================
  // SHEET 6: RINCIAN ITEM STANDAR MINIMAL PRODI
  // =========================================================================
  const ws6 = {};
  ws6['A1'] = createCell('KATALOG & RINCIAN ITEM STANDAR MINIMAL SARPRAS PRODI SERTA REALISASI KAMPUS', titleStyle);
  const detailHeadersStd = [
    'No.', 'ID Item', 'Rumpun Program Studi', 'Klasifikasi', 'Kode Kelompok',
    'Nama Kelompok', 'Sub-Kelompok', 'Nama Item Standar', 'Volume Std', 'Satuan',
    'Realisasi Kuantitas Kampus', 'Keterangan & Kondisi'
  ];
  detailHeadersStd.forEach((h, c) => {
    ws6[XLSX.utils.encode_cell({ r: 1, c })] = createCell(h, tableHeaderStyle);
  });

  let row6 = 2;
  itemsStandar.forEach((it, idx) => {
    const bObj = bidangMap[it.bidangId] || {};
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };

    let realCellVal = '-';
    if (it.real) {
      realCellVal = Object.entries(it.real)
        .map(([sid, v]) => (satdikMap[sid]?.shortName?.replace('Politeknik KP ', '') || sid) + ': ' + v)
        .join(' | ') || '-';
    }
    const noteCombined = [it.kondisi ? ('Kondisi: ' + it.kondisi) : '', it.ket || ''].filter(Boolean).join(' — ') || '-';

    const vals = [
      [idx + 1, center, 'n'],
      [it.id, center, 's'],
      [bObj.nama || it.bidangId, left, 's'],
      [it.sec === 'A' ? 'A. Prasarana' : 'B. Sarana', center, 's'],
      [it.grpCode || '-', center, 's'],
      [it.grpName || '-', left, 's'],
      [it.subGrp || '-', left, 's'],
      [it.nama, leftBold, 's'],
      [Number(it.stdVol) || 0, numInt, 'n'],
      [it.satuan || 'Unit', center, 's'],
      [realCellVal, left, 's'],
      [noteCombined, left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws6[XLSX.utils.encode_cell({ r: row6, c })] = createCell(v, st, t);
    });
    row6++;
  });

  ws6['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
  ws6['!cols'] = [
    { wch: 6 }, { wch: 13 }, { wch: 24 }, { wch: 13 }, { wch: 10 }, { wch: 32 },
    { wch: 24 }, { wch: 34 }, { wch: 12 }, { wch: 10 }, { wch: 36 }, { wch: 36 }
  ];
  ws6['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row6, c: 11 } });
  XLSX.utils.book_append_sheet(wb, ws6, 'Rincian Item Standar');

  // =========================================================================
  // SHEET 8: REKAPITULASI SARPRAS PEMBELAJARAN (18 SATDIK)
  // =========================================================================
  const wsPemb1 = {};
  wsPemb1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  wsPemb1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  wsPemb1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  wsPemb1['A4'] = createCell('Sistem Informasi & Analitik Sarana dan Prasarana Satuan Pendidikan KP', kopStyleApp);
  wsPemb1['A6'] = createCell('REKAPITULASI SARPRAS PEMBELAJARAN (RUANG KELAS, PERPUSTAKAAN, TEFA & SIMULATOR)', titleStyle);
  wsPemb1['A7'] = createCell(`Cakupan: ${filterSatdikName} | Waktu Ekspor: ${printedAt} WIB | Pengguna: ${userName} (${userRole})`, kopStyleApp);

  const pembRekapHeaders = [
    'No', 'Kode Satdik', 'Nama Satuan Pendidikan', 'Jenjang', 'Kota / Lokasi',
    'R. Kelas (Unit)', 'Kapasitas Kelas (Kursi)', 'Perpustakaan (Unit)', 'Kapasitas Perpus (Orang)',
    'TEFA (Unit)', 'Simulator (Unit)', 'Total Fasilitas', 'Total Luas (m²)', 'Kondisi Baik', 'Rusak Ringan', 'Rusak Berat'
  ];

  pembRekapHeaders.forEach((h, c) => {
    wsPemb1[XLSX.utils.encode_cell({ r: 8, c })] = createCell(h, tableHeaderStyle);
  });

  const baseP1 = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, alignment: { vertical: 'center' } };
  const centerP1 = { ...baseP1, alignment: { horizontal: 'center', vertical: 'center' } };
  const leftP1 = { ...baseP1, alignment: { horizontal: 'left', vertical: 'center' } };
  const leftBoldP1 = { ...leftP1, font: { ...baseP1.font, bold: true } };
  const numIntP1 = { ...baseP1, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const numDecP1 = { ...baseP1, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

  let rowPemb1 = 9;
  let totKelasU = 0, totKelasK = 0, totLibU = 0, totLibK = 0, totTefaU = 0, totSimU = 0, totAllU = 0, totAllL = 0, totB = 0, totRR = 0, totRB = 0;

  effectiveSatdikList.forEach((sat, idx) => {
    const satFac = effectivePembelajaran.filter(f => f.satdikId === sat.id);
    const kelasList = satFac.filter(f => f.category === 'kelas');
    const libList = satFac.filter(f => f.category === 'perpustakaan');
    const tefaList = satFac.filter(f => f.category === 'tefa');
    const simList = satFac.filter(f => f.category === 'simulator');

    const kU = kelasList.length;
    const kK = kelasList.reduce((s, f) => s + (Number(f.kapasitas) || 0), 0);
    const lU = libList.length;
    const lK = libList.reduce((s, f) => s + (Number(f.kapasitas) || 0), 0);
    const tU = tefaList.length;
    const sU = simList.length;
    const totalU = satFac.length;
    const totalL = satFac.reduce((s, f) => s + (Number(f.luasM2) || 0), 0);
    const bCount = satFac.filter(f => f.kondisi === 'Baik').length;
    const rrCount = satFac.filter(f => f.kondisi === 'Rusak Ringan').length;
    const rbCount = satFac.filter(f => f.kondisi === 'Rusak Berat').length;

    totKelasU += kU; totKelasK += kK; totLibU += lU; totLibK += lK;
    totTefaU += tU; totSimU += sU; totAllU += totalU; totAllL += totalL;
    totB += bCount; totRR += rrCount; totRB += rbCount;

    const rowVals = [
      [idx + 1, centerP1, 'n'],
      [sat.id, centerP1, 's'],
      [sat.name, leftBoldP1, 's'],
      [sat.type || 'Politeknik', centerP1, 's'],
      [sat.kota || sat.province || '-', leftP1, 's'],
      [kU, numIntP1, 'n'],
      [kK, numIntP1, 'n'],
      [lU, numIntP1, 'n'],
      [lK, numIntP1, 'n'],
      [tU, numIntP1, 'n'],
      [sU, numIntP1, 'n'],
      [totalU, numIntP1, 'n'],
      [totalL, numDecP1, 'n'],
      [bCount, centerP1, 'n'],
      [rrCount, centerP1, 'n'],
      [rbCount, centerP1, 'n']
    ];

    rowVals.forEach(([v, st, t], c) => {
      wsPemb1[XLSX.utils.encode_cell({ r: rowPemb1, c })] = createCell(v, st, t);
    });
    rowPemb1++;
  });

  // Baris Total Rekap Pembelajaran
  const totalPembRow = [
    ['TOTAL NASIONAL', { ...leftBoldP1, fill: { fgColor: { rgb: 'E2E8F0' } } }, 's'],
    ['', null, 's'], ['', null, 's'], ['', null, 's'], ['', null, 's'],
    [totKelasU, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totKelasK, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totLibU, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totLibK, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totTefaU, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totSimU, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totAllU, { ...numIntP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totAllL, { ...numDecP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totB, { ...centerP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totRR, { ...centerP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n'],
    [totRB, { ...centerP1, font: { bold: true }, fill: { fgColor: { rgb: 'E2E8F0' } } }, 'n']
  ];
  totalPembRow.forEach(([v, st, t], c) => {
    if (st) wsPemb1[XLSX.utils.encode_cell({ r: rowPemb1, c })] = createCell(v, st, t);
  });

  wsPemb1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 15 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 15 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 15 } },
    { s: { r: rowPemb1, c: 0 }, e: { r: rowPemb1, c: 4 } }
  ];
  wsPemb1['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 34 }, { wch: 12 }, { wch: 20 },
    { wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 22 },
    { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 13 }, { wch: 13 }, { wch: 13 }
  ];
  wsPemb1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowPemb1 + 1, c: 15 } });
  XLSX.utils.book_append_sheet(wb, wsPemb1, 'Rekap Pembelajaran');

  // =========================================================================
  // SHEET 9: DETAIL SARPRAS PEMBELAJARAN (KELAS, PERPUS, TEFA, SIMULATOR)
  // =========================================================================
  const wsPemb2 = {};
  wsPemb2['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  wsPemb2['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  wsPemb2['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  wsPemb2['A4'] = createCell('Sistem Informasi & Analitik Sarana dan Prasarana Satuan Pendidikan KP', kopStyleApp);
  wsPemb2['A6'] = createCell('DETAIL INVENTARIS FASILITAS PEMBELAJARAN SATUAN PENDIDIKAN KP', titleStyle);
  wsPemb2['A7'] = createCell(`Cakupan: ${filterSatdikName} | Waktu Ekspor: ${printedAt} WIB | Pengguna: ${userName} (${userRole})`, kopStyleApp);

  const pembDetailHeaders = [
    'No', 'ID Fasilitas', 'Satuan Pendidikan', 'Kategori', 'Nama Fasilitas',
    'Gedung / Lokasi', 'Luas (m²)', 'Kapasitas (Taruna)', 'Kondisi Fisik',
    'Status Operasional', 'Sertifikasi / Akreditasi', 'Tahun', 'Spesifikasi & Fasilitas Penunjang', 'Keterangan'
  ];

  pembDetailHeaders.forEach((h, c) => {
    wsPemb2[XLSX.utils.encode_cell({ r: 8, c })] = createCell(h, tableHeaderStyle);
  });

  const categoryNameMap = {
    kelas: 'Ruang Kelas',
    perpustakaan: 'Perpustakaan',
    tefa: 'Teaching Factory (TEFA)',
    simulator: 'Simulator Maritim'
  };

  const baseP2 = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, alignment: { vertical: 'center' } };
  const centerP2 = { ...baseP2, alignment: { horizontal: 'center', vertical: 'center' } };
  const leftP2 = { ...baseP2, alignment: { horizontal: 'left', vertical: 'center' } };
  const leftBoldP2 = { ...leftP2, font: { ...baseP2.font, bold: true } };
  const numIntP2 = { ...baseP2, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const numDecP2 = { ...baseP2, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

  let rowPemb2 = 9;
  effectivePembelajaran.forEach((f, idx) => {
    const sat = satdikMap[f.satdikId] || {};
    const satName = sat.name || f.satdikName || f.satdikId;
    const catLabel = categoryNameMap[f.category] || f.category;

    const rowVals = [
      [idx + 1, centerP2, 'n'],
      [f.id || '-', centerP2, 's'],
      [satName, leftBoldP2, 's'],
      [catLabel, centerP2, 's'],
      [f.name || '-', leftBoldP2, 's'],
      [f.gedung || '-', leftP2, 's'],
      [Number(f.luasM2) || 0, numDecP2, 'n'],
      [Number(f.kapasitas) || 0, numIntP2, 'n'],
      [f.kondisi || 'Baik', centerP2, 's'],
      [f.statusOp || 'Aktif Digunakan', centerP2, 's'],
      [f.sertifikasi || '-', leftP2, 's'],
      [f.tahunPengadaan ? String(f.tahunPengadaan) : '-', centerP2, 's'],
      [f.spesifikasi || '-', leftP2, 's'],
      [f.keterangan || '-', leftP2, 's']
    ];

    rowVals.forEach(([v, st, t], c) => {
      wsPemb2[XLSX.utils.encode_cell({ r: rowPemb2, c })] = createCell(v, st, t);
    });
    rowPemb2++;
  });

  wsPemb2['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 13 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 13 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 13 } }
  ];
  wsPemb2['!cols'] = [
    { wch: 6 }, { wch: 18 }, { wch: 34 }, { wch: 22 }, { wch: 36 },
    { wch: 26 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 18 },
    { wch: 30 }, { wch: 10 }, { wch: 40 }, { wch: 32 }
  ];
  wsPemb2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowPemb2, c: 13 } });
  XLSX.utils.book_append_sheet(wb, wsPemb2, 'Detail Sarpras Pembelajaran');

  // =========================================================================
  // SHEET 10: REKAPITULASI DATA TANAH & LAHAN PER SATDIK (KIB A BMN)
  // =========================================================================
  const wsTanah1 = {};
  wsTanah1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  wsTanah1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  wsTanah1['A3'] = createCell('REKAPITULASI INVENTARIS ASET TANAH DAN LAHAN SATUAN PENDIDIKAN KP (KIB A BMN)', titleStyle);
  wsTanah1['A4'] = createCell('Cakupan Data: Seluruh 18 Satuan Pendidikan Vokasi KKP | Dicetak: ' + printedAt, kopStyleApp);

  const tnhHeaders1 = [
    'No', 'Kode Satdik', 'Nama Satuan Pendidikan', 'Jenjang', 'Kota / Wilayah',
    'Jumlah Bidang', 'Total Luas (m²)', 'Total Luas (Ha)', 'Bidang Bersertifikat (SHP)',
    '% Bersertifikat'
  ];
  tnhHeaders1.forEach((h, c) => {
    wsTanah1[XLSX.utils.encode_cell({ r: 5, c })] = createCell(h, tableHeaderStyle);
  });

  let rowTnh1 = 6;
  let totBidangAll = 0;
  let totLuasM2All = 0;
  let totShpAll = 0;

  effectiveSatdikList.forEach((sat, idx) => {
    const parcels = effectiveTanahData.filter(p => p.satdikId === sat.id);
    const countBidang = parcels.length;
    const luasM2 = parcels.reduce((s, p) => s + (Number(p.luasM2) || 0), 0);
    const luasHa = Number((luasM2 / 10000).toFixed(2));
    const shpCount = parcels.filter(p => (p.statusSertifikat || '').includes('SHP') || (p.statusSertifikat || '').includes('Sertifikat')).length;
    const shpPct = countBidang > 0 ? Number(((shpCount / countBidang) * 100).toFixed(1)) : 0;

    totBidangAll += countBidang;
    totLuasM2All += luasM2;
    totShpAll += shpCount;

    const rowData = [
      [idx + 1, centerP1, 'n'],
      [sat.id, centerP1, 's'],
      [sat.name, leftBoldP1, 's'],
      [sat.jenjang || sat.type, centerP1, 's'],
      [sat.kota || '-', leftP1, 's'],
      [countBidang, numIntP1, 'n'],
      [luasM2, numIntP1, 'n'],
      [luasHa, numDecP1, 'n'],
      [shpCount, numIntP1, 'n'],
      [shpPct / 100, numDecP1, 'n']
    ];

    rowData.forEach(([val, st, type], col) => {
      wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: col })] = createCell(val, st, type);
    });
    rowTnh1++;
  });

  // Total Row
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 0 })] = createCell('TOTAL NASIONAL', leftBoldP1);
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 5 })] = createCell(totBidangAll, numIntP1, 'n');
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 6 })] = createCell(totLuasM2All, numIntP1, 'n');
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 7 })] = createCell(Number((totLuasM2All / 10000).toFixed(2)), numDecP1, 'n');
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 8 })] = createCell(totShpAll, numIntP1, 'n');
  wsTanah1[XLSX.utils.encode_cell({ r: rowTnh1, c: 9 })] = createCell(totBidangAll > 0 ? (totShpAll / totBidangAll) : 0, numDecP1, 'n');

  wsTanah1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 9 } },
    { s: { r: rowTnh1, c: 0 }, e: { r: rowTnh1, c: 4 } }
  ];
  wsTanah1['!cols'] = [
    { wch: 6 }, { wch: 18 }, { wch: 38 }, { wch: 18 }, { wch: 22 },
    { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 14 }
  ];
  wsTanah1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowTnh1, c: 9 } });
  XLSX.utils.book_append_sheet(wb, wsTanah1, 'Rekapitulasi Tanah');

  // =========================================================================
  // SHEET 11: KIB A - DETAIL INVENTARIS TANAH BMN SATDIK KP
  // =========================================================================
  const wsTanah2 = {};
  wsTanah2['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  wsTanah2['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  wsTanah2['A3'] = createCell('KARTU INVENTARIS BARANG (KIB A) — RINCIAN TANAH BMN SATUAN PENDIDIKAN KP', titleStyle);
  wsTanah2['A4'] = createCell('Cakupan Data: Seluruh Bidang Tanah BMN Satdik | Dicetak: ' + printedAt, kopStyleApp);

  const tnhHeaders2 = [
    'No', 'ID Bidang', 'Kode BMN', 'NUP', 'Satuan Pendidikan', 'Nama Bidang / Lokasi',
    'Luas (m²)', 'Luas (Ha)', 'Status Hak / Sertifikat', 'Nomor Sertifikat', 'Tanggal Terbit',
    'Atas Nama', 'Peruntukan Utama', 'Status Pemanfaatan',
    'Alamat Lengkap', 'Kota / Kab', 'Provinsi', 'Tahun Perolehan', 'Asal Perolehan', 'Keterangan'
  ];
  tnhHeaders2.forEach((h, c) => {
    wsTanah2[XLSX.utils.encode_cell({ r: 5, c })] = createCell(h, tableHeaderStyle);
  });

  let rowTnh2 = 6;
  effectiveTanahData.forEach((p, idx) => {
    const sat = satdikMap[p.satdikId] || {};
    const satName = sat.shortName || sat.name || p.satdikName || p.satdikId;

    const rowData = [
      [idx + 1, centerP1, 'n'],
      [p.id, centerP1, 's'],
      [p.kodeBmn || '-', centerP1, 's'],
      [p.nup || 1, centerP1, 'n'],
      [satName, leftP1, 's'],
      [p.namaBidang, leftBoldP1, 's'],
      [Number(p.luasM2) || 0, numIntP1, 'n'],
      [Number(p.luasHa) || Number(((Number(p.luasM2) || 0) / 10000).toFixed(2)), numDecP1, 'n'],
      [p.statusSertifikat || 'Sertifikat Hak Pakai (SHP)', centerP1, 's'],
      [p.noSertifikat || '-', leftP1, 's'],
      [p.tanggalSertifikat || '-', centerP1, 's'],
      [p.atasNama || 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan', leftP1, 's'],
      [p.peruntukan || 'Kampus & Fasilitas Akademik', leftP1, 's'],
      [p.statusPemanfaatan || 'Digunakan Sendiri (Operasional)', centerP1, 's'],
      [p.alamat || '-', leftP1, 's'],
      [p.kota || '-', leftP1, 's'],
      [p.provinsi || '-', leftP1, 's'],
      [p.tahunPerolehan || '-', centerP1, 's'],
      [p.asalPerolehan || 'APBN', centerP1, 's'],
      [p.keterangan || '-', leftP1, 's']
    ];

    rowData.forEach(([val, st, type], col) => {
      wsTanah2[XLSX.utils.encode_cell({ r: rowTnh2, c: col })] = createCell(val, st, type);
    });
    rowTnh2++;
  });

  wsTanah2['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 19 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 19 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 19 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 19 } }
  ];
  wsTanah2['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 20 }, { wch: 8 }, { wch: 28 }, { wch: 34 },
    { wch: 14 }, { wch: 12 }, { wch: 24 }, { wch: 30 }, { wch: 14 },
    { wch: 36 }, { wch: 28 }, { wch: 26 },
    { wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 35 }
  ];
  wsTanah2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowTnh2, c: 19 } });
  XLSX.utils.book_append_sheet(wb, wsTanah2, 'KIB A - Detail Tanah BMN');

  // SIMPAN FILE WORKBOOK
  const filename = filenamePrefix + '_' + new Date().toISOString().slice(0, 10) + '.xlsx';
  XLSX.writeFile(wb, filename);
}

/**
 * ============================================================================
 * GENERATOR TEMPLATE IMPORT EXCEL RESMI (.XLSX) & SMART PARSER
 * Mendukung 3 Kategori Data: Aset BMN, Gedung Asrama, Standar Minimal Prodi
 * ============================================================================
 */
function getImportMasterReferences(customSatdikList, customBidangList) {
  const defaultSatdik = [
    { id: 'poltek-aup', shortName: 'Politeknik AUP', name: 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta', kota: 'Jakarta Selatan', provinsi: 'DKI Jakarta', type: 'Politeknik' },
    { id: 'poltek-kp-sidoarjo', shortName: 'Politeknik KP Sidoarjo', name: 'Politeknik Kelautan dan Perikanan Sidoarjo', kota: 'Kab. Sidoarjo', provinsi: 'Jawa Timur', type: 'Politeknik' },
    { id: 'poltek-kp-bitung', shortName: 'Politeknik KP Bitung', name: 'Politeknik Kelautan dan Perikanan Bitung', kota: 'Kota Bitung', provinsi: 'Sulawesi Utara', type: 'Politeknik' },
    { id: 'poltek-kp-sorong', shortName: 'Politeknik KP Sorong', name: 'Politeknik Kelautan dan Perikanan Sorong', kota: 'Kota Sorong', provinsi: 'Papua Barat Daya', type: 'Politeknik' },
    { id: 'poltek-kp-karawang', shortName: 'Politeknik KP Karawang', name: 'Politeknik Kelautan dan Perikanan Karawang', kota: 'Kab. Karawang', provinsi: 'Jawa Barat', type: 'Politeknik' },
    { id: 'poltek-kp-bone', shortName: 'Politeknik KP Bone', name: 'Politeknik Kelautan dan Perikanan Bone', kota: 'Kab. Bone', provinsi: 'Sulawesi Selatan', type: 'Politeknik' },
    { id: 'poltek-kp-kupang', shortName: 'Politeknik KP Kupang', name: 'Politeknik Kelautan dan Perikanan Kupang', kota: 'Kab. Kupang', provinsi: 'Nusa Tenggara Timur', type: 'Politeknik' },
    { id: 'poltek-kp-dumai', shortName: 'Politeknik KP Dumai', name: 'Politeknik Kelautan dan Perikanan Dumai', kota: 'Kota Dumai', provinsi: 'Riau', type: 'Politeknik' },
    { id: 'poltek-kp-pangandaran', shortName: 'Politeknik KP Pangandaran', name: 'Politeknik Kelautan dan Perikanan Pangandaran', kota: 'Kab. Pangandaran', provinsi: 'Jawa Barat', type: 'Politeknik' },
    { id: 'poltek-kp-jembrana', shortName: 'Politeknik KP Jembrana', name: 'Politeknik Kelautan dan Perikanan Jembrana', kota: 'Kab. Jembrana', provinsi: 'Bali', type: 'Politeknik' },
    { id: 'akkp-wakatobi', shortName: 'AK-KP Wakatobi', name: 'Akademi Komunitas KP Wakatobi', kota: 'Kab. Wakatobi', provinsi: 'Sulawesi Tenggara', type: 'Akademi' },
    { id: 'supm-ladong', shortName: 'SUPM Ladong', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Ladong', kota: 'Kab. Aceh Besar', provinsi: 'Aceh', type: 'SUPM' },
    { id: 'supm-pariaman', shortName: 'SUPM Pariaman', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Pariaman', kota: 'Kota Pariaman', provinsi: 'Sumatera Barat', type: 'SUPM' },
    { id: 'supm-kotaagung', shortName: 'SUPM Kotaagung', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Kotaagung', kota: 'Kab. Tanggamus', provinsi: 'Lampung', type: 'SUPM' },
    { id: 'supm-tegal', shortName: 'SUPM Tegal', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Tegal', kota: 'Kota Tegal', provinsi: 'Jawa Tengah', type: 'SUPM' },
    { id: 'supm-pontianak', shortName: 'SUPM Pontianak', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Pontianak', kota: 'Kab. Kubu Raya', provinsi: 'Kalimantan Barat', type: 'SUPM' },
    { id: 'supm-sorong', shortName: 'SUPM Sorong', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Sorong', kota: 'Kota Sorong', provinsi: 'Papua Barat Daya', type: 'SUPM' },
    { id: 'supm-waiheru', shortName: 'SUPM Waiheru', name: 'Sekolah Usaha Perikanan Menengah (SUPM) Waiheru Ambon', kota: 'Kota Ambon', provinsi: 'Maluku', type: 'SUPM' }
  ];

  const satdikList = (Array.isArray(customSatdikList) && customSatdikList.length > 0)
    ? customSatdikList
    : (window.SARPRAS_DATA?.SATDIK_LIST || defaultSatdik);

  const categories = window.SARPRAS_DATA?.SARPRAS_CATEGORIES || [
    { id: 'penangkapan_ikan', name: 'Penangkapan Ikan' },
    { id: 'permesinan_mekanisasi', name: 'Permesinan dan Mekanisasi' },
    { id: 'budidaya_perikanan', name: 'Budidaya Perikanan' },
    { id: 'pengolahan_hasil', name: 'Pengolahan Hasil Perikanan/Laut' },
    { id: 'agribisnis_perikanan', name: 'Agribisnis Perikanan' },
    { id: 'kelautan_konservasi', name: 'Kelautan, Konservasi, dan Pengolahan Lingkungan' },
    { id: 'sosial_pemberdayaan', name: 'Sosial & Pemberdayaan Masyarakat' },
    { id: 'administrasi_umum', name: 'Administrasi & Umum' }
  ];

  const defaultBidang = [
    { id: 'pasca_aup', code: 'PSC', nama: 'Pascasarjana (Magister Terapan AUP)' },
    { id: 'penangkapan_ikan', code: 'PIK', nama: 'Penangkapan Ikan' },
    { id: 'permesinan_kapal', code: 'PMK', nama: 'Permesinan Kapal' },
    { id: 'budidaya', code: 'BDP', nama: 'Budidaya Perikanan' },
    { id: 'mekanisasi_kp', code: 'MKN', nama: 'Mekanisasi Perikanan' },
    { id: 'pengolahan', code: 'PGH', nama: 'Pengolahan Hasil Perikanan' },
    { id: 'pengelolaan_sdp', code: 'SDP', nama: 'Pengelolaan Sumber Daya Perairan' },
    { id: 'patologi', code: 'PTL', nama: 'Patologi Perairan / Kesehatan Ikan' },
    { id: 'penyuluhan', code: 'PNY', nama: 'Penyuluhan Perikanan' },
    { id: 'agribisnis', code: 'AGR', nama: 'Agribisnis Perikanan' },
    { id: 'kelautan', code: 'KLT', nama: 'Kelautan' },
    { id: 'konservasi_ekowisata', code: 'KSV', nama: 'Konservasi & Ekowisata Bahari' }
  ];

  const bidangList = (Array.isArray(customBidangList) && customBidangList.length > 0)
    ? customBidangList
    : (window.SARPRAS_STANDAR?.bidang || defaultBidang);

  return { satdikList, categories, bidangList };
}

function buildImportTemplateWorkbook(options = {}) {
  const {
    templateType = 'all',
    satdikList: customSatdik,
    standarBidangList: customBidang,
    currentUser = null
  } = options;

  const { satdikList, categories, bidangList } = getImportMasterReferences(customSatdik, customBidang);
  const lockedSatdik = (currentUser?.accessibleSatdik && currentUser.accessibleSatdik !== 'ALL')
    ? currentUser.accessibleSatdik
    : null;
  const sampleSatdik1 = lockedSatdik || 'poltek-aup';
  const sampleSatdik2 = lockedSatdik || 'poltek-kp-sidoarjo';

  const wb = XLSX.utils.book_new();

  const kopKemen = { font: { name: 'Calibri', sz: 13, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopBadan = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const bannerStyle = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0B3D60' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const subBannerStyle = { font: { name: 'Calibri', sz: 9, italic: true, color: { rgb: '1E3A8A' } }, fill: { fgColor: { rgb: 'E0F2FE' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
  const reqHeaderStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0F172A' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borderThin };
  const optHeaderStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borderThin };
  const guideStyle = { font: { name: 'Calibri', sz: 9, italic: true, color: { rgb: '854D0E' } }, fill: { fgColor: { rgb: 'FEF9C3' } }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: borderThin };
  const guideTagStyle = { font: { name: 'Calibri', sz: 9, bold: true, color: { rgb: '854D0E' } }, fill: { fgColor: { rgb: 'FEF08A' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
  const sampleTagStyle = { font: { name: 'Calibri', sz: 9, bold: true, color: { rgb: '1E40AF' } }, fill: { fgColor: { rgb: 'DBEAFE' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
  const sampleTextStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '334155' } }, fill: { fgColor: { rgb: 'EFF6FF' } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
  const sampleNumStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '334155' } }, fill: { fgColor: { rgb: 'EFF6FF' } }, alignment: { horizontal: 'right', vertical: 'center' }, border: borderThin };
  const inputCellStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: 'FFFFFF' } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
  const inputCenterStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '64748B' } }, fill: { fgColor: { rgb: 'F8FAFC' } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };

  // ================= SHEET 1: PETUNJUK_PENGISIAN =================
  const wsGuide = {};
  wsGuide['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopKemen);
  wsGuide['A2'] = createCell('BPPSDM KP — PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (Sarana dan Prasarana Satuan Pendidikan KP)', kopBadan);
  wsGuide['A4'] = createCell('PANDUAN RESMI PENGISIAN TEMPLATE IMPORT DATA EXCEL SARANA DAN PRASARANA SATUAN PENDIDIKAN KP', bannerStyle);

  const steps = [
    ['No.', 'Tahapan / Aturan Pengisian', 'Penjelasan Lengkap'],
    ['1', 'Pilih Sheet Sesuai Jenis Data', 'Template ini memuat 5 lembar kerja input: INPUT_GEDUNG_ASRAMA (Asrama Taruna), INPUT_TAMBAK_KOLAM (Tambak & Kolam Budidaya), INPUT_SARPRAS_PEMBELAJARAN (Kelas, Perpustakaan, TEFA, Simulator), INPUT_DATA_TANAH (Data Tanah & Lahan KIB A), dan INPUT_STANDAR_PRODI (Standar Minimal Prodi). Anda dapat mengisi salah satu saja atau seluruhnya sekaligus dalam satu kali unggah.'],
    ['2', 'Mulai Mengisi di Baris ke-9', 'Isi data baru Anda mulai pada Baris ke-9 (sel berwarna putih bergaris). Baris ke-6 [PETUNJUK] dan Baris ke-7 s.d. ke-8 [CONTOH] akan otomatis dilewati oleh sistem saat proses import sehingga tidak perlu dihapus.'],
    ['3', 'Kolom Bertanda Bintang (*)', 'Kolom dengan tanda (*) pada judul tabel adalah KOLOM WAJIB. Jika dikosongkan pada baris yang terisi, sistem akan menampilkan peringatan validasi sebelum data disimpan.'],
    ['4', 'Kemudahan Penulisan Kode Satdik', 'Pada kolom Satdik, Anda bebas mengetik Kode Satdik (contoh: poltek-aup, supm-tegal) ATAU Nama Kampus / Kota (contoh: Politeknik AUP, Poltek KP Sidoarjo, Sorong, Tegal). Daftar resmi tersedia di sheet REFERENSI_KODE.'],
    ['5', 'Kalkulasi Otomatis Asrama', 'Pada sheet INPUT_GEDUNG_ASRAMA, apabila kolom Total Luas (m²) atau Kapasitas (Orang) dikosongkan/diisi 0, sistem otomatis menghitung Luas = Jumlah Kamar × Panjang × Lebar serta Kapasitas = Luas ÷ 4 m²/orang.'],
    ['6', 'Pencatatan Realisasi Standar Prodi', 'Pada sheet INPUT_STANDAR_PRODI, Anda dapat menuliskan kode rumpun (misal PIK, PMK, BDP, PGH) atau nama rumpun prodi, serta langsung mencantumkan Satdik Realisasi dan Volume Riil jika ingin memetakan capaian kampus secara langsung.'],
    ['7', 'Unggah ke Aplikasi', 'Simpan file Excel ini (.xlsx), buka aplikasi Sarana dan Prasarana Satuan Pendidikan KP, klik tombol "+ Tambah Sarpras" di bilah navigasi atas, pilih tab "4. Import Excel (.xlsx)", lalu pilih/tarik file ini untuk meninjau pratinjau dan menyimpan ke database MySQL.']
  ];

  steps[0].forEach((h, c) => {
    wsGuide[XLSX.utils.encode_cell({ r: 5, c })] = createCell(h, reqHeaderStyle);
  });
  for (let i = 1; i < steps.length; i++) {
    const r = 5 + i;
    const bg = i % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    const stC = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0B3D60' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
    const stB = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: borderThin };
    const stN = { font: { name: 'Calibri', sz: 10, color: { rgb: '334155' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: borderThin };
    wsGuide[XLSX.utils.encode_cell({ r, c: 0 })] = createCell(steps[i][0], stC);
    wsGuide[XLSX.utils.encode_cell({ r, c: 1 })] = createCell(steps[i][1], stB);
    wsGuide[XLSX.utils.encode_cell({ r, c: 2 })] = createCell(steps[i][2], stN);
  }
  wsGuide['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }
  ];
  wsGuide['!cols'] = [{ wch: 8 }, { wch: 32 }, { wch: 95 }];
  wsGuide['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 13, c: 2 } });
  XLSX.utils.book_append_sheet(wb, wsGuide, 'PETUNJUK_PENGISIAN');

  const appendInputSheet = (sheetName, bannerTitle, headers, reqIndices, guideRow, sampleRows, colWidths) => {
    const ws = {};
    const maxCol = headers.length - 1;
    ws['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN — FORMULIR IMPORT DATA SIM-SARPRAS', kopKemen);
    ws['A2'] = createCell(bannerTitle, bannerStyle);
    ws['A3'] = createCell('Isi data baru mulai Baris ke-9 (area putih). Baris bertanda [PETUNJUK] dan [CONTOH] otomatis diabaikan saat proses import.', subBannerStyle);

    headers.forEach((h, c) => {
      const isReq = reqIndices.includes(c);
      ws[XLSX.utils.encode_cell({ r: 4, c })] = createCell(h, isReq ? reqHeaderStyle : optHeaderStyle);
    });

    guideRow.forEach((g, c) => {
      ws[XLSX.utils.encode_cell({ r: 5, c })] = createCell(g, c === 0 ? guideTagStyle : guideStyle);
    });

    sampleRows.forEach((sRow, idx) => {
      const r = 6 + idx;
      sRow.forEach((cellVal, c) => {
        const isNum = typeof cellVal === 'number';
        const st = c === 0 ? sampleTagStyle : (isNum ? sampleNumStyle : sampleTextStyle);
        ws[XLSX.utils.encode_cell({ r, c })] = createCell(cellVal, st, isNum ? 'n' : 's');
      });
    });

    const startInputRow = 6 + sampleRows.length;
    const emptyRowsCount = 30;
    for (let i = 0; i < emptyRowsCount; i++) {
      const r = startInputRow + i;
      for (let c = 0; c <= maxCol; c++) {
        ws[XLSX.utils.encode_cell({ r, c })] = createCell('', c === 0 ? inputCenterStyle : inputCellStyle);
      }
    }

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: maxCol } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: maxCol } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: maxCol } }
    ];
    ws['!cols'] = colWidths.map(w => ({ wch: w }));
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: startInputRow + emptyRowsCount - 1, c: maxCol } });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  };

  // ================= SHEET 2: INPUT_GEDUNG_ASRAMA =================
  if (templateType === 'all' || templateType === 'asrama') {
    appendInputSheet(
      'INPUT_GEDUNG_ASRAMA',
      '1. TABEL INPUT DATA GEDUNG & KAMAR ASRAMA TARUNA (STANDAR 4 M²/ORANG)',
      [
        'Status Baris',
        'Kode / Nama Satdik *',
        'Kampus / Lokasi Fisik',
        'Nama Gedung Asrama *',
        'Peruntukan Penghuni',
        'Jumlah Kamar',
        'Panjang Kamar (m)',
        'Lebar Kamar (m)',
        'Total Luas (m²)',
        'Kapasitas (Orang)',
        'Status Bangunan',
        'Keterangan Fasilitas'
      ],
      [1, 3],
      [
        '[PETUNJUK]',
        'Wajib. Contoh: poltek-aup atau SUPM Tegal',
        'Contoh: Kampus Utama / Kampus II',
        'Wajib. Nama gedung / barak asrama',
        'Taruna Putra / Taruni Putri / Campuran',
        'Angka jumlah kamar/ruang tidur',
        'Opsional. Panjang rata-rata ruang (m)',
        'Opsional. Lebar rata-rata ruang (m)',
        'Luas lantai m² (otomatis jika P & L diisi)',
        'Daya tampung (otomatis Luas ÷ 4 jika kosong)',
        'Digunakan / Perlu Renovasi / Tidak Digunakan',
        'Fasilitas kamar mandi, ranjang susun, lemari, dll.'
      ],
      [
        [
          '[CONTOH]',
          sampleSatdik1,
          'Kampus Utama Pasar Minggu',
          'Gedung Asrama Taruna Barracuda',
          'Taruna Putra',
          20,
          6,
          4,
          480,
          120,
          'Digunakan',
          'Ranjang susun besi, lemari taruna, kamar mandi komunal bersih'
        ],
        [
          '[CONTOH]',
          sampleSatdik2,
          'Kampus Utama Buncitan',
          'Gedung Asrama Taruni Srikandi B',
          'Taruni Putri',
          14,
          5,
          4,
          280,
          70,
          'Perlu Renovasi',
          'Perlu pengecatan ulang plafon dan perbaikan instalasi sanitasi'
        ]
      ],
      [14, 24, 22, 30, 18, 14, 16, 16, 16, 16, 18, 36]
    );
  }

  // ================= SHEET 3: INPUT_TAMBAK_KOLAM =================
  if (templateType === 'all' || templateType === 'tambak') {
    appendInputSheet(
      'INPUT_TAMBAK_KOLAM',
      '2. TABEL INPUT DATA PRASARANA & SARANA TAMBAK, KOLAM, DAN HATCHERY BUDIDAYA',
      [
        'Status Baris',
        'Kode / Nama Satdik *',
        'Kampus / Lokasi Instalasi',
        'Nama Prasarana / Petak / Unit *',
        'Jenis Prasarana',
        'Luas (m²)',
        'Kondisi Fisik',
        'Status Operasional',
        'Fungsi / Komoditas Budidaya',
        'Pelataran / Konstruksi',
        'Listrik',
        'Sarana Kincir / Aerator',
        'Jumlah Kincir',
        'Keterangan Teknis'
      ],
      [1, 3],
      [
        '[PETUNJUK]',
        'Wajib. Contoh: poltek-aup atau Poltek KP Sidoarjo',
        'Contoh: Instalasi Tambak Serang / Kampus Pulokerto',
        'Wajib. Nama petak tambak, kolam, atau hatchery',
        'Tambak / Kolam / Hatchery / Karamba / Pendukung',
        'Luas petak/unit dalam meter persegi (m²)',
        'Baik / Rusak Ringan / Rusak Berat',
        'Aktif / Idle / Tidak Aktif / KSO',
        'Contoh: Pembesaran Udang Vaname / Pembenihan Ikan',
        'Contoh: Plastik Mulsa HDPE / Beton / Tanah',
        'Contoh: PLN 66 kVA + Genset / Ada / Tidak Ada',
        'Contoh: Kincir 1 HP 3 Phase / Blower Root',
        'Angka jumlah kincir air (0 jika tidak ada)',
        'Catatan konstruksi tanggul, pintu air, pompa, dll.'
      ],
      [
        [
          '[CONTOH]',
          sampleSatdik1,
          'Instalasi Tambak Kampus Karangantu Serang',
          'Petak Tambak Millennial B1 (Intensif HDPE)',
          'Tambak',
          1000,
          'Baik',
          'Aktif',
          'Pembesaran Udang Vaname (Litopenaeus vannamei)',
          'Full Lining Geomembran HDPE 500 Mikron',
          'PLN 66 kVA + Genset Backup 50 kVA',
          'Kincir Air 1 HP 3 Phase & Auto-Feeder',
          4,
          'Digunakan untuk praktik Teaching Factory (TeFa) taruna'
        ],
        [
          '[CONTOH]',
          sampleSatdik2,
          'Kampus Pulokerto Pasuruan',
          'Indoor Hatchery & Bak Larva Udang Vaname',
          'Hatchery',
          240,
          'Baik',
          'Aktif',
          'Pembenihan & Kultur Pakan Alami',
          'Bak Beton Finishes Epoxy Food Grade',
          'PLN 33 kVA',
          'Hi-Blow Aerator & Root Blower 3 HP',
          0,
          '12 Bak Fiberglass dan 6 Bak Beton pendederan'
        ]
      ],
      [14, 24, 26, 32, 16, 14, 16, 16, 28, 24, 20, 24, 14, 36]
    );
  }

  // ================= SHEET: INPUT_SARPRAS_PEMBELAJARAN =================
  if (templateType === 'all' || templateType === 'pembelajaran') {
    appendInputSheet(
      'INPUT_SARPRAS_PEMBELAJARAN',
      '3. TABEL INPUT DATA FASILITAS SARPRAS PEMBELAJARAN (KELAS, PERPUSTAKAAN, TEFA & SIMULATOR)',
      [
        'Status Baris',
        'Kode / Nama Satdik *',
        'Kategori Fasilitas *',
        'Nama Fasilitas / Ruang *',
        'Gedung / Lokasi Penempatan',
        'Luas (m²)',
        'Daya Tampung / Kapasitas (Orang)',
        'Kondisi Fisik',
        'Status Operasional',
        'Spesifikasi Teknis / Alat Utama',
        'Sertifikasi / Lisensi',
        'Tahun Pengadaan',
        'Keterangan Tambahan'
      ],
      [1, 2, 3],
      [
        '[PETUNJUK]',
        'Wajib. Contoh: poltek-aup atau SUPM Tegal',
        'Wajib. Pilih: kelas / perpustakaan / tefa / simulator',
        'Wajib. Nama ruang kelas / lab / perpustakaan / simulator',
        'Contoh: Gedung Kuliah Terpadu Lt. 2 / Hanggar TEFA',
        'Luas ruangan/bangunan dalam meter persegi (m²)',
        'Daya tampung taruna/mahasiswa dalam satu sesi',
        'Baik / Rusak Ringan / Rusak Berat',
        'Aktif Digunakan / Pemeliharaan Terjadwal / Perlu Perbaikan',
        'Contoh: Interactive Smartboard 75 inch, Sound System, AC',
        'Contoh: Approval STCW-F Ditjen Hubla, Sertifikasi ISO',
        'Angka tahun pengadaan (contoh: 2022)',
        'Catatan pemanfaatan atau jadwal praktikum taruna'
      ],
      [
        [
          '[CONTOH]',
          sampleSatdik1,
          'simulator',
          'Full Mission Bridge Simulator Navigasi Laut',
          'Gedung Simulator & Lab Bahari Lt. 2',
          140,
          25,
          'Baik',
          'Aktif Digunakan',
          'Visual 240 derajat, konsol kemudi ARPA radar, ECDIS',
          'Approval STCW-F Ditjen Hubla & DNV-GL',
          2022,
          'Simulator uji kompetensi pelaut ANKPIN-I taruna tingkat akhir'
        ],
        [
          '[CONTOH]',
          sampleSatdik2,
          'tefa',
          'Teaching Factory Pengolahan Surimi & Fish Jelly',
          'Gedung Workshop TEFA Pengolahan',
          350,
          60,
          'Baik',
          'Aktif Digunakan',
          'Silent cutter, meat separator, blast freezer, packaging line',
          'Sertifikasi Kelayakan Pengolahan (SKP) & Halal',
          2021,
          'Unit produksi produk olahan perikanan komersial taruna'
        ],
        [
          '[CONTOH]',
          sampleSatdik1,
          'kelas',
          'Ruang Kuliah Teori Smart Class A-101',
          'Gedung Kuliah Bersama Lt. 1',
          72,
          36,
          'Baik',
          'Aktif Digunakan',
          'Interactive display 75 inch, meja taruna ergonomis, AC 2 PK',
          '-',
          2023,
          'Digunakan untuk perkuliahan multimedia prodi vokasi'
        ],
        [
          '[CONTOH]',
          sampleSatdik2,
          'perpustakaan',
          'Perpustakaan Maritim & E-Library Center',
          'Gedung Rektorat Sayap Timur Lt. 2',
          220,
          75,
          'Baik',
          'Aktif Digunakan',
          '15 PC e-library, koleksi 4.500 buku kelautan, barcode scanner',
          'Akreditasi Perpustakaan Nasional RI',
          2020,
          'Ruang baca digital dan referensi taruna serta dosen'
        ]
      ],
      [14, 24, 22, 36, 30, 14, 16, 16, 22, 36, 26, 16, 36]
    );
  }

  // ================= SHEET 4: INPUT_DATA_TANAH =================
  if (templateType === 'all' || templateType === 'tanah') {
    appendInputSheet(
      'INPUT_DATA_TANAH',
      '4. TABEL INPUT DATA TANAH & LAHAN SATDIK KP (KIB A BMN)',
      [
        'Status Baris',
        'Kode / Nama Satdik *',
        'Nama Bidang / Peruntukan Lahan *',
        'Kode BMN',
        'NUP',
        'Luas Tanah (m²) *',
        'Status Sertifikat *',
        'Nomor Sertifikat',
        'Tanggal Terbit (YYYY-MM-DD)',
        'Atas Nama',
        'Peruntukan Utama',
        'Status Pemanfaatan',
        'Alamat Lengkap Lahan',
        'Kota / Kabupaten',
        'Provinsi',
        'Nilai Aset BMN (Rp)',
        'Tahun Perolehan',
        'Asal Perolehan',
        'Keterangan Tambahan'
      ],
      [1, 2, 5, 6],
      [
        '[PETUNJUK]',
        'Wajib. Contoh: poltek-aup atau SUPM Tegal',
        'Wajib. Contoh: Kampus Utama Sedati / Tambak Pesisir',
        'Kode BMN KIB A (contoh: 2.01.01.01.001.0001)',
        'Nomor Urut Pendaftaran BMN (contoh: 1)',
        'Wajib. Luas tanah dalam meter persegi (m²)',
        'Wajib. Sertifikat Hak Pakai (SHP) / Dalam Proses BPN / Hibah Pemda',
        'Nomor register SHP dari BPN',
        'Format tanggal: YYYY-MM-DD (contoh: 2018-05-20)',
        'Default: Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
        'Kampus & Fasilitas Akademik / Tambak & Budidaya Praktik / Workshop / Lahan Cadangan',
        'Digunakan Sendiri (Operasional) / KSP / Pinjam Pakai',
        'Alamat fisik lokasi bidang tanah',
        'Kota atau Kabupaten lokasi tanah',
        'Provinsi lokasi tanah',
        'Nilai perolehan / estimasi aset BMN dalam Rupiah',
        'Tahun perolehan tanah (contoh: 2012)',
        'APBN / Hibah Pemda / Pemberian Hak',
        'Catatan batas tanah, riwayat perolehan, atau rencana pemanfaatan'
      ],
      [
        [
          '[CONTOH]',
          sampleSatdik1,
          'Kampus Utama & Kompleks Akademik',
          '2.01.01.01.001.0001',
          1,
          120000,
          'Sertifikat Hak Pakai (SHP)',
          'SHP No. 00014/Pasar Minggu 2012',
          '2012-07-18',
          'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
          'Kampus & Fasilitas Akademik',
          'Digunakan Sendiri (Operasional)',
          'Jl. AUP No. 1, Pasar Minggu',
          'Jakarta Selatan',
          'DKI Jakarta',
          420000000000,
          1962,
          'APBN',
          'Kawasan kampus terpadu, rektorat, dan asrama taruna'
        ],
        [
          '[CONTOH]',
          sampleSatdik2,
          'Kawasan Tambak Percobaan Budidaya',
          '2.01.01.01.002.0002',
          2,
          120000,
          'Sertifikat Hak Pakai (SHP)',
          'SHP No. 00089/Sedati 2010',
          '2010-09-15',
          'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
          'Tambak & Budidaya Praktik',
          'Digunakan Sendiri (Operasional)',
          'Desa Buncitan, Sedati',
          'Kab. Sidoarjo',
          'Jawa Timur',
          96000000000,
          1982,
          'APBN',
          '46 petak tambak pembesaran bandeng dan udang'
        ]
      ],
      [14, 24, 32, 22, 8, 16, 26, 30, 16, 36, 28, 24, 30, 32, 18, 18, 22, 14, 16, 36]
    );
  }

  // ================= SHEET 5: INPUT_STANDAR_PRODI =================
  if (templateType === 'all' || templateType === 'standar') {
    appendInputSheet(
      'INPUT_STANDAR_PRODI',
      '4. TABEL INPUT ITEM STANDAR MINIMAL & REALISASI SARPRAS PROGRAM STUDI',
      [
        'Status Baris',
        'Kode / Nama Rumpun Prodi *',
        'Klasifikasi (A/B) *',
        'Kode Kelompok',
        'Nama Kelompok Lab / Workshop',
        'Sub-Kelompok',
        'Nama Item Standar Minimal *',
        'Volume Standar Minimal *',
        'Satuan',
        'Kode / Nama Satdik Realisasi',
        'Volume Realisasi Riil',
        'Kondisi Fisik',
        'Keterangan Kurikulum / Spesifikasi'
      ],
      [1, 2, 6, 7],
      [
        '[PETUNJUK]',
        'Wajib. Contoh: penangkapan_ikan atau PIK / BDP',
        'Wajib. Ketik A (Prasarana) atau B (Sarana)',
        'Contoh: A.1 atau B.2',
        'Nama ruang lab / bengkel kerja induk',
        'Sub-kategori peralatan (opsional)',
        'Wajib. Nama ruang atau alat standar minimal',
        'Wajib. Angka kebutuhan minimal standar',
        'Unit / Ruang / Set / Paket / m² / Buah',
        'Opsional. Kode/Nama kampus pemilik realisasi',
        'Opsional. Angka jumlah riil yang dimiliki kampus',
        'Baik / Rusak Ringan / Rusak Berat',
        'Catatan spesifikasi standar kurikulum vokasi'
      ],
      [
        [
          '[CONTOH]',
          'penangkapan_ikan',
          'A',
          'A.1',
          'Laboratorium Navigasi & Pelayaran',
          'Ruang Simulator',
          'Ruang Simulator Navigasi & Penangkapan Ikan Terpadu',
          1,
          'Ruang',
          sampleSatdik1,
          1,
          'Baik',
          'Standar minimal STCW-F & Kepmen KP Kurikulum Vokasi'
        ],
        [
          '[CONTOH]',
          'budidaya',
          'B',
          'B.1',
          'Laboratorium Kualitas Air & Kesehatan Ikan',
          'Instrumen Uji Air',
          'Multiparameter Water Quality Checker Digital (DO, pH, Salinitas, Suhu)',
          4,
          'Set',
          sampleSatdik2,
          3,
          'Baik',
          'Akurasi sensor optik untuk praktikum kualitas air tambak'
        ]
      ],
      [14, 26, 16, 14, 28, 22, 38, 20, 12, 24, 18, 16, 36]
    );
  }

  // ================= SHEET 5: REFERENSI_KODE =================
  const wsRef = {};
  wsRef['A1'] = createCell('DAFTAR KODE REFERENSI RESMI SARANA DAN PRASARANA SATUAN PENDIDIKAN KP (ACUAN PENGISIAN EXCEL)', bannerStyle);

  const satHeaders = ['Kode Satdik (ID)', 'Nama Singkat', 'Nama Resmi Satuan Pendidikan', 'Kota & Provinsi'];
  satHeaders.forEach((h, c) => {
    wsRef[XLSX.utils.encode_cell({ r: 2, c })] = createCell(h, reqHeaderStyle);
  });
  satdikList.forEach((s, idx) => {
    const r = 3 + idx;
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const codeSt = { font: { name: 'Consolas', sz: 10, bold: true, color: { rgb: '0F766E' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
    const txtSt = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
    wsRef[XLSX.utils.encode_cell({ r, c: 0 })] = createCell(s.id, codeSt);
    wsRef[XLSX.utils.encode_cell({ r, c: 1 })] = createCell(s.shortName || s.name, txtSt);
    wsRef[XLSX.utils.encode_cell({ r, c: 2 })] = createCell(s.name || s.shortName, txtSt);
    wsRef[XLSX.utils.encode_cell({ r, c: 3 })] = createCell((s.kota || '-') + (s.provinsi ? ', ' + s.provinsi : ''), txtSt);
  });

  wsRef[XLSX.utils.encode_cell({ r: 2, c: 5 })] = createCell('Kode Rumpun Prodi', reqHeaderStyle);
  wsRef[XLSX.utils.encode_cell({ r: 2, c: 6 })] = createCell('Nama Rumpun Standar Prodi (12 Bidang)', reqHeaderStyle);
  wsRef[XLSX.utils.encode_cell({ r: 2, c: 7 })] = createCell('Singkatan', reqHeaderStyle);
  bidangList.forEach((b, idx) => {
    const r = 3 + idx;
    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const codeSt = { font: { name: 'Consolas', sz: 10, bold: true, color: { rgb: '0B3D60' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
    const txtSt = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'left', vertical: 'center' }, border: borderThin };
    const centerSt = { font: { name: 'Consolas', sz: 10, bold: true, color: { rgb: '0F766E' } }, fill: { fgColor: { rgb: bg } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin };
    wsRef[XLSX.utils.encode_cell({ r, c: 5 })] = createCell(b.id, codeSt);
    wsRef[XLSX.utils.encode_cell({ r, c: 6 })] = createCell(b.nama || b.id, txtSt);
    wsRef[XLSX.utils.encode_cell({ r, c: 7 })] = createCell(b.code || '-', centerSt);
  });

  const maxRefRow = Math.max(3 + satdikList.length, 3 + bidangList.length);
  wsRef['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];
  wsRef['!cols'] = [
    { wch: 22 }, { wch: 24 }, { wch: 46 }, { wch: 30 },
    { wch: 4 },
    { wch: 24 }, { wch: 44 }, { wch: 12 }
  ];
  wsRef['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxRefRow, c: 7 } });
  XLSX.utils.book_append_sheet(wb, wsRef, 'REFERENSI_KODE');

  return wb;
}

function downloadImportTemplateExcel(options = {}) {
  const wb = buildImportTemplateWorkbook(options);
  const typeMap = {
    all: 'Template_Import_Lengkap_SARPRAS_KKP',
    asrama: 'Template_Import_Gedung_Asrama_SARPRAS_KKP',
    tambak: 'Template_Import_Tambak_Kolam_SARPRAS_KKP',
    pembelajaran: 'Template_Import_Sarpras_Pembelajaran_SARPRAS_KKP',
    standar: 'Template_Import_Standar_Prodi_SARPRAS_KKP'
  };
  const prefix = options.filenamePrefix || typeMap[options.templateType || 'all'] || typeMap.all;
  XLSX.writeFile(wb, prefix + '.xlsx');
}

/**
 * Membaca & Memvalidasi File Workbook Excel (.xlsx / .xls / .csv) untuk Batch Import
 */
function parseImportExcelWorkbook(arrayBuffer, context = {}) {
  const { satdikList, categories, bidangList } = getImportMasterReferences(context.satdikList, context.standarBidangList);
  const lockedSatdik = (context.currentUser?.accessibleSatdik && context.currentUser.accessibleSatdik !== 'ALL')
    ? context.currentUser.accessibleSatdik
    : null;

  const cleanStr = (v) => String(v === null || v === undefined ? '' : v).trim();
  const normKey = (v) => cleanStr(v).toLowerCase().replace(/[^a-z0-9]/g, '');

  const resolveSatdik = (rawVal) => {
    if (lockedSatdik) {
      return satdikList.find(s => s.id === lockedSatdik) || { id: lockedSatdik, name: lockedSatdik, shortName: lockedSatdik };
    }
    const raw = cleanStr(rawVal);
    if (!raw) return null;
    const nk = normKey(raw);

    for (let i = 0; i < satdikList.length; i++) {
      const s = satdikList[i];
      if (
        normKey(s.id) === nk ||
        normKey(s.shortName) === nk ||
        normKey(s.name) === nk ||
        (s.kota && normKey(s.kota) === nk)
      ) {
        return s;
      }
    }
    const aliasPairs = [
      ['supmsorong', 'supm-sorong'],
      ['aup', 'poltek-aup'], ['jakarta', 'poltek-aup'], ['pasarminggu', 'poltek-aup'],
      ['sidoarjo', 'poltek-kp-sidoarjo'], ['bitung', 'poltek-kp-bitung'], ['sorong', 'poltek-kp-sorong'],
      ['karawang', 'poltek-kp-karawang'], ['bone', 'poltek-kp-bone'], ['watampone', 'poltek-kp-bone'],
      ['kupang', 'poltek-kp-kupang'], ['dumai', 'poltek-kp-dumai'], ['pangandaran', 'poltek-kp-pangandaran'],
      ['jembrana', 'poltek-kp-jembrana'], ['wakatobi', 'akkp-wakatobi'],
      ['ladong', 'supm-ladong'], ['aceh', 'supm-ladong'], ['pariaman', 'supm-pariaman'],
      ['kotaagung', 'supm-kotaagung'], ['lampung', 'supm-kotaagung'], ['tegal', 'supm-tegal'],
      ['pontianak', 'supm-pontianak'], ['kuburaya', 'supm-pontianak'],
      ['waiheru', 'supm-waiheru'], ['ambon', 'supm-waiheru']
    ];
    for (let i = 0; i < aliasPairs.length; i++) {
      if (nk.indexOf(aliasPairs[i][0]) !== -1) {
        const found = satdikList.find(s => s.id === aliasPairs[i][1]);
        if (found) return found;
      }
    }
    for (let i = 0; i < satdikList.length; i++) {
      const s = satdikList[i];
      if (normKey(s.name).indexOf(nk) !== -1 || nk.indexOf(normKey(s.shortName)) !== -1) {
        return s;
      }
    }
    return null;
  };

  const resolveCategory = (rawVal, prodiVal) => {
    const raw = cleanStr(rawVal);
    const nk = normKey(raw);
    if (nk) {
      for (let i = 0; i < categories.length; i++) {
        if (normKey(categories[i].id) === nk || normKey(categories[i].name) === nk) {
          return categories[i].id;
        }
      }
      if (nk.indexOf('tangkap') !== -1 || nk.indexOf('kapal') !== -1 || nk.indexOf('navigasi') !== -1) return 'penangkapan_ikan';
      if (nk.indexOf('mesin') !== -1 || nk.indexOf('mekanisasi') !== -1 || nk.indexOf('bengkel') !== -1) return 'permesinan_mekanisasi';
      if (nk.indexOf('budidaya') !== -1 || nk.indexOf('akuakultur') !== -1 || nk.indexOf('tambak') !== -1 || nk.indexOf('kolam') !== -1) return 'budidaya_perikanan';
      if (nk.indexOf('olah') !== -1 || nk.indexOf('mutu') !== -1 || nk.indexOf('coldstorage') !== -1) return 'pengolahan_hasil';
      if (nk.indexOf('agribisnis') !== -1 || nk.indexOf('bisnis') !== -1 || nk.indexOf('ekonomi') !== -1) return 'agribisnis_perikanan';
      if (nk.indexOf('kelautan') !== -1 || nk.indexOf('konservasi') !== -1 || nk.indexOf('ekowisata') !== -1) return 'kelautan_konservasi';
      if (nk.indexOf('sosial') !== -1 || nk.indexOf('penyuluhan') !== -1 || nk.indexOf('pemberdayaan') !== -1) return 'sosial_pemberdayaan';
      if (nk.indexOf('umum') !== -1 || nk.indexOf('administrasi') !== -1 || nk.indexOf('gedung') !== -1) return 'administrasi_umum';
    }
    if (prodiVal && typeof window.SARPRAS_DATA?.getCategoryForProdi === 'function') {
      const byProdi = window.SARPRAS_DATA.getCategoryForProdi(prodiVal);
      if (byProdi) return byProdi;
    }
    return 'administrasi_umum';
  };

  const resolveBidang = (rawVal) => {
    const raw = cleanStr(rawVal);
    if (!raw) return null;
    const nk = normKey(raw);
    for (let i = 0; i < bidangList.length; i++) {
      const b = bidangList[i];
      if (normKey(b.id) === nk || normKey(b.code) === nk || normKey(b.nama) === nk) {
        return b;
      }
    }
    const kwMap = [
      ['pasca', 'pasca_aup'], ['magister', 'pasca_aup'],
      ['tangkap', 'penangkapan_ikan'], ['tpi', 'penangkapan_ikan'],
      ['permesinankapal', 'permesinan_kapal'], ['mesinkapal', 'permesinan_kapal'], ['tmp', 'permesinan_kapal'], ['permesinan', 'permesinan_kapal'],
      ['budidaya', 'budidaya'], ['akuakultur', 'budidaya'], ['tbp', 'budidaya'],
      ['mekanisasi', 'mekanisasi_kp'], ['mp', 'mekanisasi_kp'],
      ['olah', 'pengolahan'], ['tph', 'pengolahan'],
      ['sdp', 'pengelolaan_sdp'], ['sumberdaya', 'pengelolaan_sdp'], ['psp', 'pengelolaan_sdp'],
      ['patologi', 'patologi'], ['penyakit', 'patologi'], ['kesehatanikan', 'patologi'],
      ['penyuluhan', 'penyuluhan'], ['agribisnis', 'agribisnis'],
      ['konservasi', 'konservasi_ekowisata'], ['ekowisata', 'konservasi_ekowisata'],
      ['kelautan', 'kelautan']
    ];
    for (let i = 0; i < kwMap.length; i++) {
      if (nk.indexOf(kwMap[i][0]) !== -1) {
        const found = bidangList.find(b => b.id === kwMap[i][1]);
        if (found) return found;
      }
    }
    return null;
  };

  const normalizeCondition = (rawVal) => {
    const s = cleanStr(rawVal).toLowerCase();
    if (s.indexOf('berat') !== -1 || s.indexOf('kritis') !== -1 || s.indexOf('mati') !== -1) return 'Rusak Berat';
    if (s.indexOf('ringan') !== -1 || s.indexOf('sedang') !== -1 || s.indexOf('kurang') !== -1) return 'Rusak Ringan';
    return 'Baik';
  };

  const normalizeAsramaStatus = (rawVal) => {
    const s = cleanStr(rawVal).toLowerCase();
    if (s.indexOf('tidak') !== -1 || s.indexOf('kosong') !== -1 || s.indexOf('berat') !== -1) return 'Tidak Digunakan';
    if (s.indexOf('renov') !== -1 || s.indexOf('ringan') !== -1 || s.indexOf('perlu') !== -1 || s.indexOf('perbaik') !== -1) return 'Perlu Renovasi';
    return 'Digunakan';
  };

  const parseNum = (v, fallback = 0) => {
    if (typeof v === 'number' && !isNaN(v)) return v;
    const s = cleanStr(v).replace(/%/g, '').replace(/s+/g, '');
    if (!s) return fallback;
    const normalized = (s.indexOf(',') !== -1 && s.indexOf('.') === -1) ? s.replace(',', '.') : s.replace(/,/g, '');
    const n = Number(normalized);
    return isNaN(n) ? fallback : n;
  };

  const findCol = (headerLower, keywords, defaultIdx) => {
    for (let k = 0; k < keywords.length; k++) {
      const kw = keywords[k];
      const idx = headerLower.findIndex(h => h.indexOf(kw) !== -1);
      if (idx !== -1) return idx;
    }
    return defaultIdx;
  };

  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const buildings = [];
  const tambakUnits = [];
  const pembelajaranFacilities = [];
  const standarItems = [];
  const tanahParcels = [];
  const warnings = [];

  (wb.SheetNames || []).forEach((sheetName) => {
    const upperName = sheetName.toUpperCase();
    if (
      upperName.indexOf('PETUNJUK') !== -1 ||
      upperName.indexOf('PANDUAN') !== -1 ||
      upperName.indexOf('REFERENSI') !== -1 ||
      upperName.indexOf('RINGKASAN') !== -1
    ) {
      return;
    }

    const ws = wb.Sheets[sheetName];
    if (!ws) return;
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (!Array.isArray(rows) || rows.length === 0) return;

    let headerRowIdx = -1;
    let sheetCategory = null;

    if (upperName.indexOf('INPUT_GEDUNG') !== -1 || upperName.indexOf('INPUT_ASRAMA') !== -1) sheetCategory = 'asrama';
    else if (upperName.indexOf('INPUT_TAMBAK') !== -1 || upperName.indexOf('INPUT_KOLAM') !== -1) sheetCategory = 'tambak';
    else if (upperName.indexOf('INPUT_PEMBELAJARAN') !== -1 || upperName.indexOf('SARPRAS_PEMBELAJARAN') !== -1) sheetCategory = 'pembelajaran';
    else if (upperName.indexOf('INPUT_STANDAR') !== -1) sheetCategory = 'standar';
    else if (upperName.indexOf('INPUT_DATA_TANAH') !== -1 || upperName.indexOf('INPUT_TANAH') !== -1 || upperName.indexOf('DATA_TANAH') !== -1 || upperName.indexOf('TANAH') !== -1 || upperName.indexOf('KIB A') !== -1 || upperName.indexOf('KIB_A') !== -1) sheetCategory = 'tanah';

    for (let r = 0; r < Math.min(rows.length, 15); r++) {
      const rowStrs = (rows[r] || []).map(c => cleanStr(c).toLowerCase());
      const nonEmpty = rowStrs.filter(Boolean);
      if (nonEmpty.length < 2) continue;
      const joined = nonEmpty.join(' | ');

      if (joined.indexOf('nama gedung') !== -1 || (joined.indexOf('asrama') !== -1 && joined.indexOf('kamar') !== -1)) {
        headerRowIdx = r;
        if (!sheetCategory) sheetCategory = 'asrama';
        break;
      }
      if (joined.indexOf('petak') !== -1 || joined.indexOf('jenis prasarana') !== -1 || joined.indexOf('kincir') !== -1) {
        headerRowIdx = r;
        if (!sheetCategory) sheetCategory = 'tambak';
        break;
      }
      if (joined.indexOf('rumpun prodi') !== -1 || joined.indexOf('item standar') !== -1 || joined.indexOf('volume standar') !== -1) {
        headerRowIdx = r;
        if (!sheetCategory) sheetCategory = 'standar';
        break;
      }
      if (joined.indexOf('fasilitas') !== -1 && (joined.indexOf('kategori') !== -1 || joined.indexOf('simulator') !== -1 || joined.indexOf('ruang kelas') !== -1 || joined.indexOf('perpustakaan') !== -1 || joined.indexOf('tefa') !== -1)) {
        headerRowIdx = r;
        if (!sheetCategory) sheetCategory = 'pembelajaran';
        break;
      }
      if (joined.indexOf('bidang tanah') !== -1 || joined.indexOf('nama bidang') !== -1 || joined.indexOf('luas tanah') !== -1 || (joined.indexOf('tanah') !== -1 && joined.indexOf('sertifikat') !== -1)) {
        headerRowIdx = r;
        if (!sheetCategory) sheetCategory = 'tanah';
        break;
      }
    }

    if (headerRowIdx === -1 || !sheetCategory) {
      return;
    }

    const headerLower = (rows[headerRowIdx] || []).map(c => cleanStr(c).toLowerCase());

    const isSkippableRow = (rowArr) => {
      if (!Array.isArray(rowArr)) return true;
      const cells = rowArr.map(cleanStr);
      if (cells.every(c => c === '')) return true;
      const firstTwo = (cells[0] + ' ' + (cells[1] || '')).toUpperCase();
      if (firstTwo.indexOf('[PETUNJUK]') !== -1 || firstTwo.indexOf('[CONTOH]') !== -1) return true;
      return false;
    };

    if (sheetCategory === 'asrama') {
      const cSatdik = findCol(headerLower, ['satdik', 'satuan pendidikan'], 1);
      const cKampus = findCol(headerLower, ['kampus', 'lokasi'], 2);
      const cNama = findCol(headerLower, ['nama gedung', 'gedung asrama', 'nama asrama'], 3);
      const cPeruntukan = findCol(headerLower, ['peruntukan', 'penghuni'], 4);
      const cKamar = findCol(headerLower, ['jumlah kamar', 'kamar / barak', 'kamar'], 5);
      const cPanjang = findCol(headerLower, ['panjang'], 6);
      const cLebar = findCol(headerLower, ['lebar'], 7);
      const cLuas = findCol(headerLower, ['total luas', 'luas total', 'luas'], 8);
      const cKap = findCol(headerLower, ['kapasitas'], 9);
      const cStatus = findCol(headerLower, ['status'], 10);
      const cKet = findCol(headerLower, ['keterangan', 'fasilitas'], 11);

      for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (isSkippableRow(row)) continue;
        const excelRow = r + 1;

        const rawSatdik = cleanStr(row[cSatdik]);
        const nama = cleanStr(row[cNama]);
        if (!rawSatdik && !nama) continue;

        if (!nama) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Nama Gedung Asrama kosong — baris dilewati.' });
          continue;
        }
        const satObj = resolveSatdik(rawSatdik);
        if (!satObj) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Kode/Nama Satdik "' + (rawSatdik || '-') + '" tidak dikenali untuk gedung "' + nama + '".' });
          continue;
        }

        const jumlahKamar = Math.max(0, Math.round(parseNum(row[cKamar], 0)));
        const panjangM = parseNum(row[cPanjang], 0);
        const lebarM = parseNum(row[cLebar], 0);
        let luasM2 = parseNum(row[cLuas], 0);
        if (luasM2 <= 0 && jumlahKamar > 0 && panjangM > 0 && lebarM > 0) {
          luasM2 = Math.round(jumlahKamar * panjangM * lebarM * 100) / 100;
        }
        let kapasitas = parseNum(row[cKap], 0);
        if (kapasitas <= 0 && luasM2 > 0) {
          kapasitas = Math.floor(luasM2 / 4);
        }

        const rincian = (panjangM > 0 && lebarM > 0 && jumlahKamar > 0)
          ? [{ label: nama, ukuran: panjangM + 'm x ' + lebarM + 'm', jumlah: jumlahKamar }]
          : [];

        buildings.push({
          satdikId: satObj.id,
          satdikName: satObj.shortName || satObj.name,
          kampus: cleanStr(row[cKampus]) || 'Kampus Utama',
          nama,
          peruntukan: cleanStr(row[cPeruntukan]) || 'Taruna Putra',
          jumlahKamar,
          luasM2,
          kapasitas,
          status: normalizeAsramaStatus(row[cStatus]),
          keterangan: cleanStr(row[cKet]),
          rincian
        });
      }
    } else if (sheetCategory === 'tambak') {
      const cSatdik = findCol(headerLower, ['satdik', 'satuan pendidikan'], 1);
      const cKampus = findCol(headerLower, ['kampus', 'lokasi'], 2);
      const cNama = findCol(headerLower, ['nama prasarana', 'petak', 'nama unit', 'nama'], 3);
      const cJenis = findCol(headerLower, ['jenis prasarana', 'jenis'], 4);
      const cLuas = findCol(headerLower, ['luas'], 5);
      const cKondisi = findCol(headerLower, ['kondisi'], 6);
      const cStatus = findCol(headerLower, ['status operasional', 'status'], 7);
      const cFungsi = findCol(headerLower, ['fungsi', 'komoditas'], 8);
      const cPelataran = findCol(headerLower, ['pelataran', 'konstruksi'], 9);
      const cListrik = findCol(headerLower, ['listrik'], 10);
      const cKincir = findCol(headerLower, ['sarana kincir', 'aerator', 'kincir'], 11);
      const cJmlKincir = findCol(headerLower, ['jumlah kincir', 'jml kincir'], 12);
      const cKet = findCol(headerLower, ['keterangan', 'catatan'], 13);

      for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (isSkippableRow(row)) continue;
        const excelRow = r + 1;

        const rawSatdik = cleanStr(row[cSatdik]);
        const nama = cleanStr(row[cNama]);
        if (!rawSatdik && !nama) continue;

        if (!nama) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Nama Prasarana/Petak Tambak kosong — baris dilewati.' });
          continue;
        }
        const satObj = resolveSatdik(rawSatdik);
        if (!satObj) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Kode/Nama Satdik "' + (rawSatdik || '-') + '" tidak dikenali untuk petak/unit "' + nama + '".' });
          continue;
        }

        const rawJenis = cleanStr(row[cJenis]).toLowerCase();
        let jenis = 'Tambak';
        if (rawJenis.indexOf('kolam') !== -1 || rawJenis.indexOf('bak') !== -1) jenis = 'Kolam';
        else if (rawJenis.indexOf('hatchery') !== -1 || rawJenis.indexOf('pembenih') !== -1 || rawJenis.indexOf('lab') !== -1) jenis = 'Hatchery';
        else if (rawJenis.indexOf('karamba') !== -1 || rawJenis.indexOf('kja') !== -1) jenis = 'Karamba';
        else if (rawJenis.indexOf('pendukung') !== -1 || rawJenis.indexOf('tandon') !== -1 || rawJenis.indexOf('saluran') !== -1) jenis = 'Pendukung';

        tambakUnits.push({
          satdikId: satObj.id,
          satdikName: satObj.shortName || satObj.name,
          kampusLokasi: cleanStr(row[cKampus]) || satObj.kota || 'Kampus Utama',
          nama,
          jenis,
          luasM2: Math.max(0, parseNum(row[cLuas], 0)),
          kondisi: normalizeCondition(row[cKondisi]),
          statusOperasional: cleanStr(row[cStatus]) || 'Aktif',
          fungsi: cleanStr(row[cFungsi]) || 'Praktikum & Budidaya Taruna',
          pelataran: cleanStr(row[cPelataran]),
          listrik: cleanStr(row[cListrik]),
          kincir: cleanStr(row[cKincir]),
          jumlahKincir: Math.max(0, Math.round(parseNum(row[cJmlKincir], 0))),
          keterangan: cleanStr(row[cKet])
        });
      }
    } else if (sheetCategory === 'pembelajaran') {
      const cSatdik = findCol(headerLower, ['satdik', 'satuan pendidikan', 'kampus'], 1);
      const cCat = findCol(headerLower, ['kategori fasilitas', 'kategori', 'jenis'], 2);
      const cNama = findCol(headerLower, ['nama fasilitas', 'nama ruang', 'nama sarpras', 'nama'], 3);
      const cGedung = findCol(headerLower, ['gedung', 'lokasi penempatan', 'lokasi'], 4);
      const cLuas = findCol(headerLower, ['luas', 'luas ruangan'], 5);
      const cKap = findCol(headerLower, ['daya tampung', 'kapasitas', 'daya tampung / kapasitas'], 6);
      const cKondisi = findCol(headerLower, ['kondisi fisik', 'kondisi'], 7);
      const cStatus = findCol(headerLower, ['status operasional', 'status'], 8);
      const cSpesifikasi = findCol(headerLower, ['spesifikasi teknis', 'spesifikasi', 'alat utama'], 9);
      const cSertifikasi = findCol(headerLower, ['sertifikasi', 'lisensi'], 10);
      const cTahun = findCol(headerLower, ['tahun pengadaan', 'tahun'], 11);
      const cKet = findCol(headerLower, ['keterangan tambahan', 'keterangan', 'catatan'], 12);

      const resolvePembCategory = (rawVal, nameVal) => {
        const s = (cleanStr(rawVal) + ' ' + cleanStr(nameVal)).toLowerCase();
        if (s.indexOf('simulat') !== -1 || s.indexOf('bridge') !== -1 || s.indexOf('engine room') !== -1 || s.indexOf('ecdis') !== -1 || s.indexOf('gmdss') !== -1) return 'simulator';
        if (s.indexOf('tefa') !== -1 || s.indexOf('factory') !== -1 || s.indexOf('pabrik') !== -1 || s.indexOf('surimi') !== -1) return 'tefa';
        if (s.indexOf('perpus') !== -1 || s.indexOf('library') !== -1 || s.indexOf('baca') !== -1 || s.indexOf('pustaka') !== -1) return 'perpustakaan';
        return 'kelas';
      };

      for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (isSkippableRow(row)) continue;
        const excelRow = r + 1;

        const rawSatdik = cleanStr(row[cSatdik]);
        const nama = cleanStr(row[cNama]);
        if (!rawSatdik && !nama) continue;

        if (!nama) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Nama Fasilitas Pembelajaran kosong — baris dilewati.' });
          continue;
        }
        const satObj = resolveSatdik(rawSatdik);
        if (!satObj) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Kode/Nama Satdik "' + (rawSatdik || '-') + '" tidak dikenali untuk fasilitas "' + nama + '".' });
          continue;
        }

        const category = resolvePembCategory(row[cCat], nama);
        const luasM2 = Math.max(0, parseNum(row[cLuas], 0));
        const kapasitas = Math.max(0, Math.round(parseNum(row[cKap], 0)));
        const tahunPengadaan = Math.max(1980, Math.round(parseNum(row[cTahun], new Date().getFullYear())));

        pembelajaranFacilities.push({
          satdikId: satObj.id,
          satdikName: satObj.shortName || satObj.name,
          category,
          name: nama,
          gedung: cleanStr(row[cGedung]) || 'Gedung Kuliah & Praktik Bersama',
          luasM2,
          kapasitas,
          kondisi: normalizeCondition(row[cKondisi]),
          statusOp: cleanStr(row[cStatus]) || 'Aktif Digunakan',
          spesifikasi: cleanStr(row[cSpesifikasi]),
          sertifikasi: cleanStr(row[cSertifikasi]),
          tahunPengadaan,
          keterangan: cleanStr(row[cKet])
        });
      }
    } else if (sheetCategory === 'tanah') {
      const cSatdik = findCol(headerLower, ['satdik', 'kampus', 'unit kerja'], 1);
      const cNama = findCol(headerLower, ['nama bidang', 'nama tanah', 'bidang tanah', 'peruntukan'], 2);
      const cKodeBmn = findCol(headerLower, ['kode bmn', 'bmn'], 3);
      const cNup = findCol(headerLower, ['nup', 'no urut'], 4);
      const cLuas = findCol(headerLower, ['luas', 'luas tanah', 'luas (m2)', 'luas m2'], 5);
      const cStatusSertifikat = findCol(headerLower, ['status sertifikat', 'sertifikat', 'status hak'], 6);
      const cNoSertifikat = findCol(headerLower, ['nomor sertifikat', 'no sertifikat', 'no. sertifikat'], 7);
      const cTglSertifikat = findCol(headerLower, ['tanggal terbit', 'tanggal', 'tgl sertifikat'], 8);
      const cAtasNama = findCol(headerLower, ['atas nama', 'pemegang hak'], 9);
      const cPeruntukan = findCol(headerLower, ['peruntukan', 'penggunaan utama'], 10);
      const cStatusManfaat = findCol(headerLower, ['status pemanfaatan', 'pemanfaatan'], 11);
      const cKeamanan = findCol(headerLower, ['keamanan', 'kondisi keamanan', 'patok'], 12);
      const cAlamat = findCol(headerLower, ['alamat', 'lokasi'], 13);
      const cKota = findCol(headerLower, ['kota', 'kabupaten'], 14);
      const cProv = findCol(headerLower, ['provinsi'], 15);
      const cNilai = findCol(headerLower, ['nilai aset', 'nilai bmn', 'nilai'], 16);
      const cTahun = findCol(headerLower, ['tahun', 'tahun perolehan'], 17);
      const cAsal = findCol(headerLower, ['asal', 'asal perolehan'], 18);
      const cKet = findCol(headerLower, ['keterangan', 'catatan'], 19);

      for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (isSkippableRow(row)) continue;
        const excelRow = r + 1;

        const rawSatdik = cleanStr(row[cSatdik]);
        const nama = cleanStr(row[cNama]);
        if (!rawSatdik && !nama) continue;

        if (!nama) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Nama Bidang Tanah kosong — baris dilewati.' });
          continue;
        }
        const satObj = resolveSatdik(rawSatdik);
        if (!satObj) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Kode/Nama Satdik "' + (rawSatdik || '-') + '" tidak dikenali untuk bidang tanah "' + nama + '".' });
          continue;
        }

        const luasM2 = Math.max(0, parseNum(row[cLuas], 0));
        const luasHa = Number((luasM2 / 10000).toFixed(2));
        const nup = Math.max(1, Math.round(parseNum(row[cNup], 1)));
        const nilaiAsetRp = Math.max(0, parseNum(row[cNilai], 0));
        const tahunPerolehan = Math.max(1950, Math.round(parseNum(row[cTahun], new Date().getFullYear())));

        tanahParcels.push({
          satdikId: satObj.id,
          satdikName: satObj.shortName || satObj.name,
          namaBidang: nama,
          kodeBmn: cleanStr(row[cKodeBmn]) || '2.01.01.01.001.0001',
          nup,
          luasM2,
          luasHa,
          statusSertifikat: cleanStr(row[cStatusSertifikat]) || 'Sertifikat Hak Pakai (SHP)',
          noSertifikat: cleanStr(row[cNoSertifikat]) || '-',
          tanggalSertifikat: cleanStr(row[cTglSertifikat]) || '-',
          atasNama: cleanStr(row[cAtasNama]) || 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
          peruntukan: cleanStr(row[cPeruntukan]) || 'Kampus & Fasilitas Akademik',
          statusPemanfaatan: cleanStr(row[cStatusManfaat]) || 'Digunakan Sendiri (Operasional)',
          kondisiKeamanan: cleanStr(row[cKeamanan]) || 'Aman (Patok & Plang BMN Terpasang)',
          alamat: cleanStr(row[cAlamat]) || satObj.alamat || '',
          kota: cleanStr(row[cKota]) || satObj.kota || '',
          provinsi: cleanStr(row[cProv]) || satObj.provinsi || '',
          nilaiAsetRp,
          tahunPerolehan,
          asalPerolehan: cleanStr(row[cAsal]) || 'APBN',
          keterangan: cleanStr(row[cKet])
        });
      }
    } else if (sheetCategory === 'standar') {
      const cBidang = findCol(headerLower, ['rumpun', 'bidang prodi'], 1);
      const cSec = findCol(headerLower, ['klasifikasi', 'kategori (a/b)'], 2);
      const cGrpCode = findCol(headerLower, ['kode kelompok'], 3);
      const cGrpName = findCol(headerLower, ['nama kelompok', 'kelompok lab'], 4);
      const cSubGrp = findCol(headerLower, ['sub-kelompok', 'sub kelompok'], 5);
      const cNama = findCol(headerLower, ['nama item', 'item standar', 'sarana / prasarana standar'], 6);
      const cStdVol = findCol(headerLower, ['volume standar', 'standar minimal *'], 7);
      const cSatuan = findCol(headerLower, ['satuan'], 8);
      const cRealSat = findCol(headerLower, ['satdik realisasi', 'kampus pemilik'], 9);
      const cRealVol = findCol(headerLower, ['volume realisasi', 'realisasi riil'], 10);
      const cKondisi = findCol(headerLower, ['kondisi'], 11);
      const cKet = findCol(headerLower, ['keterangan', 'spesifikasi', 'kurikulum'], 12);

      for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        if (isSkippableRow(row)) continue;
        const excelRow = r + 1;

        const rawBidang = cleanStr(row[cBidang]);
        const nama = cleanStr(row[cNama]);
        if (!rawBidang && !nama) continue;

        if (!nama) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Nama Item Standar Minimal kosong — baris dilewati.' });
          continue;
        }
        const bidObj = resolveBidang(rawBidang);
        if (!bidObj) {
          warnings.push({ sheet: sheetName, row: excelRow, message: 'Kode/Nama Rumpun Prodi "' + (rawBidang || '-') + '" tidak dikenali untuk item "' + nama + '".' });
          continue;
        }

        const rawSec = cleanStr(row[cSec]).toUpperCase();
        const sec = (rawSec.indexOf('A') === 0 || rawSec.indexOf('PRASARANA') !== -1) ? 'A' : 'B';
        const stdVol = Math.max(1, parseNum(row[cStdVol], 1));

        const realMap = {};
        let realSatdikLabel = '';
        const rawRealSat = cleanStr(row[cRealSat]);
        const rawRealVol = cleanStr(row[cRealVol]);
        if (rawRealSat && rawRealVol !== '') {
          const satRealObj = resolveSatdik(rawRealSat);
          if (satRealObj) {
            realMap[satRealObj.id] = Math.max(0, parseNum(rawRealVol, 0));
            realSatdikLabel = (satRealObj.shortName || satRealObj.id) + ': ' + realMap[satRealObj.id];
          } else {
            warnings.push({ sheet: sheetName, row: excelRow, message: 'Satdik Realisasi "' + rawRealSat + '" tidak dikenali (item tetap diimpor tanpa realisasi kampus).' });
          }
        }

        standarItems.push({
          bidangId: bidObj.id,
          bidangNama: bidObj.nama,
          sec,
          grpCode: cleanStr(row[cGrpCode]) || (sec + '.1'),
          grpName: cleanStr(row[cGrpName]) || (sec === 'A' ? 'Prasarana Standar' : 'Sarana Praktikum'),
          subGrp: cleanStr(row[cSubGrp]),
          nama,
          stdVol,
          satuan: cleanStr(row[cSatuan]) || 'Unit',
          real: realMap,
          realPreview: realSatdikLabel,
          kondisi: cleanStr(row[cKondisi]) ? normalizeCondition(row[cKondisi]) : 'Baik',
          ket: cleanStr(row[cKet])
        });
      }
    }
  });

  return {
    buildings,
    tambakUnits,
    pembelajaranFacilities,
    standarItems,
    tanahParcels,
    warnings,
    totalValid: buildings.length + tambakUnits.length + pembelajaranFacilities.length + standarItems.length + tanahParcels.length
  };
}

/**
 * Ekspor Rekapitulasi & Detail Prasarana/Sarana Tambak dan Kolam ke File Resmi Microsoft Excel (.xlsx)
 */
function exportTambakToExcel(tambakData, satdikList = [], options = {}) {
  const {
    currentUser = null,
    filterSatdikName = 'Seluruh Satuan Pendidikan KKP (18 Satdik)',
    filenamePrefix = 'SARPRAS_KKP_Tambak_dan_Kolam'
  } = options;

  const summary = Array.isArray(tambakData?.summary) ? tambakData.summary : [];
  const units = Array.isArray(tambakData?.units) ? tambakData.units : [];

  if (summary.length === 0 && units.length === 0) {
    alert('Tidak ada data tambak dan kolam untuk diekspor ke Excel.');
    return;
  }

  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });

  const wb = XLSX.utils.book_new();
  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';
  const userRole = currentUser?.roleLabel || 'Pengelola Sarana dan Prasarana Satuan Pendidikan KP';

  const kopStyleKemen = { font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: '003366' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStyleBadan = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const kopStylePusat = { font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const titleStyle = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0B3D60' } }, alignment: { horizontal: 'center', vertical: 'center' } };
  const tableHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0B3D60' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };

  // ================= SHEET 1: REKAP TAMBAK & KOLAM PER SATDIK =================
  const ws1 = {};
  ws1['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws1['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws1['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws1['A5'] = createCell('REKAPITULASI PRASARANA DAN SARANA TAMBAK & KOLAM SATUAN PENDIDIKAN KKP (TAHUN 2025)', titleStyle);

  const metaStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '334155' } } };
  const metaBold = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } } };
  ws1['A6'] = createCell('Cakupan Satuan Pendidikan:', metaStyle);
  ws1['C6'] = createCell(filterSatdikName, metaBold);
  ws1['I6'] = createCell('Waktu Cetak:', metaStyle);
  ws1['K6'] = createCell(printedAt, metaStyle);
  ws1['A7'] = createCell('Dicetak Oleh:', metaStyle);
  ws1['C7'] = createCell(userName + ' (' + userRole + ')', metaBold);
  ws1['I7'] = createCell('Sumber Data:', metaStyle);
  ws1['K7'] = createCell(tambakData?.meta?.source || '1c-Data Tambak dan Kolam Satuan Pendidikan.pdf', metaBold);

  const rekapHeaders = [
    'No.',
    'Satuan Pendidikan',
    'Jenjang',
    'Total Unit',
    'Unit Tambak',
    'Unit Kolam',
    'Tandon / Bak',
    'Total Luas (m²)',
    'Total Luas (Ha)',
    'Kondisi Baik',
    'Rusak Ringan',
    'Rusak Berat',
    'Total Kincir',
    'Daya Listrik & Instalasi',
    'Lokasi Utama'
  ];
  rekapHeaders.forEach((h, c) => {
    ws1[XLSX.utils.encode_cell({ r: 8, c })] = createCell(h, tableHeaderStyle);
  });

  let r1 = 9;
  let totUnit = 0, totTambak = 0, totKolam = 0, totTandon = 0, totLuas = 0, totBaik = 0, totRR = 0, totRB = 0, totKincir = 0;

  summary.forEach((s, idx) => {
    const sat = satdikMap[s.satdikId] || {};
    const jUnit = Number(s.jumlahUnit) || 0;
    const jTambak = Number(s.jumlahTambak) || 0;
    const jKolam = Number(s.jumlahKolam) || 0;
    const jTandon = Number(s.jumlahTandon) || 0;
    const luas = Number(s.luasTotalM2) || 0;
    const luasHa = luas / 10000;
    const baik = Number(s.kondisiBaik) || 0;
    const rr = Number(s.kondisiRusakRingan) || 0;
    const rb = Number(s.kondisiRusakBerat) || 0;
    const kincir = Number(s.totalKincir) || 0;

    totUnit += jUnit;
    totTambak += jTambak;
    totKolam += jKolam;
    totTandon += jTandon;
    totLuas += luas;
    totBaik += baik;
    totRR += rr;
    totRB += rb;
    totKincir += kincir;

    const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
    const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
    const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...left, font: { ...base.font, bold: true } };
    const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

    const vals = [
      [idx + 1, center, 'n'],
      [sat.name || s.namaSatdik || s.satdikId, leftBold, 's'],
      [s.jenjang || sat.type || 'Politeknik', center, 's'],
      [jUnit, numInt, 'n'],
      [jTambak, numInt, 'n'],
      [jKolam, numInt, 'n'],
      [jTandon, numInt, 'n'],
      [luas, numDec, 'n'],
      [luasHa, numDec, 'n'],
      [baik, numInt, 'n'],
      [rr, numInt, 'n'],
      [rb, numInt, 'n'],
      [kincir, numInt, 'n'],
      [s.dayaListrik || '-', left, 's'],
      [s.lokasiUtama || '-', left, 's']
    ];
    vals.forEach(([v, st, t], c) => {
      ws1[XLSX.utils.encode_cell({ r: r1, c })] = createCell(v, st, t);
    });
    r1++;
  });

  const totStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0B3D60' } }, fill: { fgColor: { rgb: 'E0F2FE' } }, border: borderDoubleBottom, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const totDec = { ...totStyle, numFmt: '#,##0.00' };
  const totLabel = { ...totStyle, alignment: { horizontal: 'center', vertical: 'center' } };
  ws1[XLSX.utils.encode_cell({ r: r1, c: 0 })] = createCell('TOTAL', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 1 })] = createCell(summary.length + ' Satuan Pendidikan', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 2 })] = createCell('', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 3 })] = createCell(totUnit, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 4 })] = createCell(totTambak, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 5 })] = createCell(totKolam, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 6 })] = createCell(totTandon, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 7 })] = createCell(Math.round(totLuas * 100) / 100, totDec, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 8 })] = createCell(Math.round((totLuas / 10000) * 100) / 100, totDec, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 9 })] = createCell(totBaik, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 10 })] = createCell(totRR, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 11 })] = createCell(totRB, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 12 })] = createCell(totKincir, totStyle, 'n');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 13 })] = createCell('', totLabel, 's');
  ws1[XLSX.utils.encode_cell({ r: r1, c: 14 })] = createCell('', totLabel, 's');

  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 14 } }
  ];
  ws1['!cols'] = [
    { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 11 }, { wch: 12 }, { wch: 12 }, { wch: 13 },
    { wch: 16 }, { wch: 14 }, { wch: 13 }, { wch: 13 }, { wch: 13 }, { wch: 12 }, { wch: 36 }, { wch: 36 }
  ];
  ws1['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r1 + 1, c: 14 } });
  XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Tambak & Kolam');

  // ================= SHEET 2: DETAIL UNIT TAMBAK & KOLAM =================
  if (units.length > 0) {
    const ws2 = {};
    ws2['A1'] = createCell('RINCIAN INVENTARIS PRASARANA DAN SARANA TAMBAK & KOLAM SATUAN PENDIDIKAN KKP', titleStyle);
    const uHeaders = [
      'No.', 'ID Unit', 'Satuan Pendidikan', 'No. Urut', 'Nama Tambak / Kolam',
      'Jenis', 'Luas (m²)', 'Kondisi', 'Fungsi / Komoditas Budidaya',
      'Status Operasional', 'Pelataran / Konstruksi', 'Instalasi Listrik',
      'Sarana Kincir / Aerasi', 'Jml Kincir', 'Koordinat / Link Google Maps', 'Keterangan Lokasi'
    ];
    uHeaders.forEach((h, c) => {
      ws2[XLSX.utils.encode_cell({ r: 2, c })] = createCell(h, tableHeaderStyle);
    });
    let r2 = 3;
    units.forEach((u, idx) => {
      const sat = satdikMap[u.satdikId] || {};
      const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
      const base = { font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } }, border: borderThin, fill: { fgColor: { rgb: bg } } };
      const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
      const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
      const leftBold = { ...left, font: { ...base.font, bold: true } };
      const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
      const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

      const vals = [
        [idx + 1, center, 'n'],
        [u.id, center, 's'],
        [sat.shortName || sat.name || u.namaSatdik || u.satdikId, left, 's'],
        [Number(u.noUrut) || idx + 1, center, 'n'],
        [u.nama, leftBold, 's'],
        [u.jenis || 'Tambak', center, 's'],
        [Number(u.luasM2) || 0, numDec, 'n'],
        [u.kondisi || 'Baik', center, 's'],
        [u.fungsi || '-', left, 's'],
        [u.statusOperasional || '-', center, 's'],
        [u.pelataran || '-', center, 's'],
        [u.listrik || '-', left, 's'],
        [u.kincir || '-', left, 's'],
        [Number(u.jumlahKincir) || 0, numInt, 'n'],
        [u.mapUrl || u.lokasiLabel || '-', left, 's'],
        [u.keterangan || u.kampusLokasi || '-', left, 's']
      ];
      vals.forEach(([v, st, t], c) => {
        const cell = createCell(v, st, t);
        if (c === 14 && u.mapUrl && (u.mapUrl.startsWith('http://') || u.mapUrl.startsWith('https://'))) {
          cell.l = { Target: u.mapUrl, Tooltip: 'Buka Lokasi di Google Maps / Earth' };
        }
        ws2[XLSX.utils.encode_cell({ r: r2, c })] = cell;
      });
      r2++;
    });
    ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 15 } }];
    ws2['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 24 }, { wch: 8 }, { wch: 32 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 20 }, { wch: 20 }, { wch: 26 },
      { wch: 28 }, { wch: 11 }, { wch: 36 }, { wch: 34 }
    ];
    ws2['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: r2, c: 15 } });
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Unit Tambak & Kolam');
  }

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Ekspor Laporan Fasilitas Pembelajaran (Ruang Kelas, Perpustakaan, TEFA, Simulator) ke Excel
 */
function exportPembelajaranToExcel(facilities, satdikList, options = {}) {
  const {
    currentUser = null,
    filterScopeLabel = 'Seluruh Satuan Pendidikan (18 Satdik)',
    filenamePrefix = 'Sarana_Prasarana_Satdik_KP_Fasilitas_Pembelajaran'
  } = options;

  const wb = XLSX.utils.book_new();
  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });

  const items = Array.isArray(facilities) ? facilities : [];

  const ws = {};
  const fontTitle = { name: 'Arial', sz: 12, bold: true, color: { rgb: '0F172A' } };
  const fontHeader = { name: 'Arial', sz: 10, bold: true, color: { rgb: 'FFFFFF' } };
  const headerStyle = {
    fill: { fgColor: { rgb: '0B3D60' } },
    font: fontHeader,
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };
  const base = { font: { name: 'Arial', sz: 9 }, border: borderThin, alignment: { vertical: 'center' } };
  const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
  const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
  const leftBold = { ...left, font: { ...base.font, bold: true } };
  const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

  // Kop Dinas
  ws['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', { font: fontTitle });
  ws['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', { font: { name: 'Arial', sz: 10, bold: true } });
  ws['A3'] = createCell('LAPORAN INVENTARIS SARPRAS PEMBELAJARAN (KELAS, PERPUSTAKAAN, TEFA & SIMULATOR)', { font: { name: 'Arial', sz: 11, bold: true, color: { rgb: '0284C7' } } });
  ws['A4'] = createCell(`Cakupan Data: ${filterScopeLabel} | Dicetak: ${getFormattedDateTime()}`, { font: { name: 'Arial', sz: 9, italic: true } });

  const headers = [
    'No', 'ID Fasilitas', 'Satuan Pendidikan', 'Kategori', 'Nama Fasilitas',
    'Gedung / Lokasi', 'Luas (m²)', 'Kapasitas Taruna', 'Kondisi Fisik',
    'Status Operasional', 'Sertifikasi / Akreditasi', 'Tahun', 'Spesifikasi & Fasilitas Penunjang', 'Keterangan'
  ];

  const categoryLabels = {
    kelas: 'Ruang Kelas',
    perpustakaan: 'Perpustakaan',
    tefa: 'Teaching Factory (TEFA)',
    simulator: 'Simulator'
  };

  headers.forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 5, c })] = createCell(h, headerStyle);
  });

  let row = 6;
  items.forEach((item, idx) => {
    const sat = satdikMap[item.satdikId] || {};
    const satName = sat.shortName || sat.name || item.satdikName || item.satdikId;
    const catLabel = categoryLabels[item.category] || item.category;

    const rowData = [
      [idx + 1, center, 'n'],
      [item.id, center, 's'],
      [satName, left, 's'],
      [catLabel, center, 's'],
      [item.name, leftBold, 's'],
      [item.gedung || '-', left, 's'],
      [Number(item.luasM2) || 0, numDec, 'n'],
      [Number(item.kapasitas) || 0, numInt, 'n'],
      [item.kondisi || 'Baik', center, 's'],
      [item.statusOp || 'Aktif Digunakan', center, 's'],
      [item.sertifikasi || '-', left, 's'],
      [item.tahunPengadaan || '-', center, 's'],
      [item.spesifikasi || '-', left, 's'],
      [item.keterangan || '-', left, 's']
    ];

    rowData.forEach(([val, st, type], col) => {
      ws[XLSX.utils.encode_cell({ r: row, c: col })] = createCell(val, st, type);
    });
    row++;
  });

  ws['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 25 }, { wch: 22 }, { wch: 36 },
    { wch: 26 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
    { wch: 20 }, { wch: 28 }, { wch: 10 }, { wch: 45 }, { wch: 35 }
  ];
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row, c: 13 } });
  XLSX.utils.book_append_sheet(wb, ws, 'Fasilitas Pembelajaran');

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}


function exportTanahToExcel(parcels, satdikList, options = {}) {
  const {
    currentUser = null,
    filterScopeLabel = 'Seluruh Satuan Pendidikan Vokasi KKP (18 Satdik)',
    filenamePrefix = 'Sarana_Prasarana_Satdik_KP_KIB_A_Tanah_BMN'
  } = options;

  const wb = XLSX.utils.book_new();
  const satdikMap = {};
  (satdikList || []).forEach(s => { satdikMap[s.id] = s; });

  const items = Array.isArray(parcels) ? parcels : [];

  const ws = {};
  const fontTitle = { name: 'Arial', sz: 12, bold: true, color: { rgb: '0F172A' } };
  const fontHeader = { name: 'Arial', sz: 10, bold: true, color: { rgb: 'FFFFFF' } };
  const headerStyle = {
    fill: { fgColor: { rgb: '0B3D60' } },
    font: fontHeader,
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderThin
  };
  const base = { font: { name: 'Arial', sz: 9 }, border: borderThin, alignment: { vertical: 'center' } };
  const center = { ...base, alignment: { horizontal: 'center', vertical: 'center' } };
  const left = { ...base, alignment: { horizontal: 'left', vertical: 'center' } };
  const leftBold = { ...left, font: { ...base.font, bold: true } };
  const numInt = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
  const numDec = { ...base, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0.00' };

  ws['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', { font: fontTitle });
  ws['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', { font: { name: 'Arial', sz: 10, bold: true } });
  ws['A3'] = createCell('KARTU INVENTARIS BARANG (KIB A) — TANAH DAN LAHAN SATUAN PENDIDIKAN KP', { font: { name: 'Arial', sz: 11, bold: true, color: { rgb: '0284C7' } } });
  ws['A4'] = createCell('Cakupan Data: ' + filterScopeLabel + ' | Dicetak: ' + getFormattedDateTime(), { font: { name: 'Arial', sz: 9, italic: true } });

  const headers = [
    'No', 'ID Bidang', 'Kode BMN', 'NUP', 'Satuan Pendidikan', 'Nama Bidang / Peruntukan',
    'Luas (m²)', 'Luas (Ha)', 'Status Hak / Sertifikat', 'Nomor Sertifikat', 'Tanggal Terbit',
    'Atas Nama', 'Peruntukan Utama', 'Status Pemanfaatan',
    'Alamat Lengkap', 'Kota / Kab', 'Provinsi', 'Tahun Perolehan', 'Asal Perolehan', 'Keterangan'
  ];

  headers.forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 5, c })] = createCell(h, headerStyle);
  });

  let row = 6;
  items.forEach((item, idx) => {
    const sat = satdikMap[item.satdikId] || {};
    const satName = sat.shortName || sat.name || item.satdikName || item.satdikId;

    const rowData = [
      [idx + 1, center, 'n'],
      [item.id, center, 's'],
      [item.kodeBmn || '-', center, 's'],
      [item.nup || 1, center, 'n'],
      [satName, left, 's'],
      [item.namaBidang, leftBold, 's'],
      [Number(item.luasM2) || 0, numInt, 'n'],
      [Number(item.luasHa) || Number(((Number(item.luasM2) || 0) / 10000).toFixed(2)), numDec, 'n'],
      [item.statusSertifikat || 'Sertifikat Hak Pakai (SHP)', center, 's'],
      [item.noSertifikat || '-', left, 's'],
      [item.tanggalSertifikat || '-', center, 's'],
      [item.atasNama || 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan', left, 's'],
      [item.peruntukan || 'Kampus & Fasilitas Akademik', left, 's'],
      [item.statusPemanfaatan || 'Digunakan Sendiri (Operasional)', center, 's'],
      [item.alamat || '-', left, 's'],
      [item.kota || '-', left, 's'],
      [item.provinsi || '-', left, 's'],
      [item.tahunPerolehan || '-', center, 's'],
      [item.asalPerolehan || 'APBN', center, 's'],
      [item.keterangan || '-', left, 's']
    ];

    rowData.forEach(([val, st, type], col) => {
      ws[XLSX.utils.encode_cell({ r: row, c: col })] = createCell(val, st, type);
    });
    row++;
  });

  ws['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 20 }, { wch: 8 }, { wch: 28 }, { wch: 34 },
    { wch: 14 }, { wch: 12 }, { wch: 24 }, { wch: 30 }, { wch: 14 },
    { wch: 36 }, { wch: 28 }, { wch: 26 },
    { wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 35 }
  ];
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row, c: 19 } });
  XLSX.utils.book_append_sheet(wb, ws, 'KIB A - Tanah BMN');

  const filename = filenamePrefix + '_' + new Date().toISOString().slice(0, 10) + '.xlsx';
  XLSX.writeFile(wb, filename);
}

  window.SARPRAS_EXCEL = {
    exportRKAToExcel: exportRKAToExcel,
    exportAsramaToExcel: exportAsramaToExcel,
    exportStandarToExcel: exportStandarToExcel,
    exportTambakToExcel: exportTambakToExcel,
    exportPembelajaranToExcel: exportPembelajaranToExcel,
    exportTanahToExcel: exportTanahToExcel,
    exportComprehensiveToExcel: exportComprehensiveToExcel,
    buildImportTemplateWorkbook: buildImportTemplateWorkbook,
    downloadImportTemplateExcel: downloadImportTemplateExcel,
    parseImportExcelWorkbook: parseImportExcelWorkbook
  };
})(window);
