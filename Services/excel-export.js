/**
 * ============================================================================
 * SARPRAS KKP — Modul Ekspor Laporan Excel Resmi (.xlsx) Multi-Sheet
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
 * Ekspor Inventaris Aset Sarpras ke File Asli Microsoft Excel (.xlsx)
 */
  function exportAssetsToExcel(assets, options = {}) {
  const {
    currentUser = null,
    filterSatdikName = 'Seluruh Satuan Pendidikan (18 Kampus Vokasi KKP)',
    filterCategoryName = 'Semua Bidang Sarpras',
    filenamePrefix = 'SARPRAS_KKP_Inventaris_Aset'
  } = options;

  if (!Array.isArray(assets) || assets.length === 0) {
    alert('Tidak ada data aset untuk diekspor ke Excel.');
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = {};

  const countBaik = assets.filter(a => a.condition === 'Baik').length;
  const countRusakRingan = assets.filter(a => a.condition === 'Rusak Ringan').length;
  const countRusakBerat = assets.filter(a => a.condition === 'Rusak Berat').length;
  const countUrgent = assets.filter(a => a.maintenanceUrgency === 'Kritis / Segera').length;

  const printedAt = getFormattedDateTime();
  const userName = currentUser?.name || 'Admin Sarpras Pusdik KP';
  const userRole = currentUser?.roleLabel || 'Pengelola SARPRAS KKP';

  // 1. KOP SURAT RESMI KKP
  const kopStyleKemen = {
    font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: '003366' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  const kopStyleBadan = {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F766E' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  const kopStylePusat = {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
  const kopStyleApp = {
    font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: '64748B' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  ws['A1'] = createCell('KEMENTERIAN KELAUTAN DAN PERIKANAN REPUBLIK INDONESIA', kopStyleKemen);
  ws['A2'] = createCell('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN (BPPSDM KP)', kopStyleBadan);
  ws['A3'] = createCell('PUSAT PENDIDIKAN KELAUTAN DAN PERIKANAN (PUSDIK KP)', kopStylePusat);
  ws['A4'] = createCell('Sistem Informasi & Analitik Sarana Prasarana Pendidikan Vokasi KP (SARPRAS)', kopStyleApp);

  // 2. JUDUL DOKUMEN & METADATA
  const titleStyle = {
    font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '0F172A' } },
    fill: { fgColor: { rgb: 'F1F5F9' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderThin
  };
  ws['A6'] = createCell('DAFTAR INVENTARISASI & KELAYAKAN SARANA DAN PRASARANA SATUAN PENDIDIKAN VOKASI KP', titleStyle);

  const metaLabelStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '475569' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    fill: { fgColor: { rgb: 'F8FAFC' } }
  };
  const metaValStyle = {
    font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'left', vertical: 'center' }
  };
  const metaValBold = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'left', vertical: 'center' }
  };
  const metaValGreen = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F766E' } },
    alignment: { horizontal: 'left', vertical: 'center' }
  };
  const metaValRed = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'B91C1C' } },
    alignment: { horizontal: 'left', vertical: 'center' }
  };

  // Baris 7: Cakupan & Total Aset
  ws['A7'] = createCell('Cakupan Wilayah / Satdik:', metaLabelStyle);
  ws['C7'] = createCell(filterSatdikName, metaValStyle);
  ws['G7'] = createCell('Total Sarpras Terdata:', metaLabelStyle);
  ws['I7'] = createCell(`${assets.length} Unit Sarpras`, metaValBold);

  // Baris 8: Bidang & Urgensi Perbaikan
  ws['A8'] = createCell('Filter Bidang:', metaLabelStyle);
  ws['C8'] = createCell(filterCategoryName, metaValStyle);
  ws['G8'] = createCell('Prioritas Perbaikan:', metaLabelStyle);
  ws['I8'] = createCell(`${countUrgent} Unit Mendesak`, metaValRed);

  // Baris 9: Tanggal & Kondisi
  ws['A9'] = createCell('Waktu Ekspor Dokumen:', metaLabelStyle);
  ws['C9'] = createCell(printedAt, metaValStyle);
  ws['G9'] = createCell('Rincian Kondisi Fisik:', metaLabelStyle);
  ws['I9'] = createCell(`Baik: ${countBaik} | Rusak Ringan: ${countRusakRingan} | Rusak Berat: ${countRusakBerat}`, metaValBold);

  // Baris 10: Petugas & Status
  ws['A10'] = createCell('Petugas Administrator:', metaLabelStyle);
  ws['C10'] = createCell(`${userName} (${userRole})`, metaValBold);
  ws['G10'] = createCell('Status Inventarisasi:', metaLabelStyle);
  ws['I10'] = createCell('Lengkap & Tervalidasi', metaValGreen);

  // 3. HEADER TABEL UTAMA (Baris 12)
  const headerTitles = [
    'No.',
    'ID Sistem',
    'Nama Sarana & Prasarana',
    'Satuan Pendidikan (Kampus)',
    'Program Studi Terkait',
    'Bidang Sarpras',
    'Kondisi Fisik',
    'Skor Kelayakan',
    'Tingkat Utilisasi',
    'Tahun Perolehan',
    'Urgensi Pemeliharaan',
    'Catatan Teknis / Permasalahan'
  ];

  const tableHeaderStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '0B3D60' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: '07263D' } },
      bottom: { style: 'thin', color: { rgb: '07263D' } },
      left: { style: 'thin', color: { rgb: '07263D' } },
      right: { style: 'thin', color: { rgb: '07263D' } }
    }
  };

  headerTitles.forEach((title, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 11, c: colIdx });
    ws[cellRef] = createCell(title, tableHeaderStyle);
  });

  // 4. DATA ROWS
  let currentRow = 12;

  assets.forEach((a, index) => {
    const isEven = index % 2 === 0;
    const bgRowColor = isEven ? 'F8FAFC' : 'FFFFFF';

    // Cell styles per column
    const baseStyle = {
      font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
      border: borderThin,
      fill: { fgColor: { rgb: bgRowColor } }
    };

    const centerStyle = { ...baseStyle, alignment: { horizontal: 'center', vertical: 'center' } };
    const leftStyle = { ...baseStyle, alignment: { horizontal: 'left', vertical: 'center' } };
    const leftBold = { ...leftStyle, font: { ...baseStyle.font, bold: true } };
    const currencyStyle = { ...baseStyle, alignment: { horizontal: 'right', vertical: 'center' }, numFmt: '#,##0' };
    const percentStyle = { ...baseStyle, alignment: { horizontal: 'center', vertical: 'center' }, numFmt: '0"%"' };

    // Badge kondisi fisik
    let conditionStyle = {
      ...centerStyle,
      font: { ...baseStyle.font, bold: true, color: { rgb: '166534' } },
      fill: { fgColor: { rgb: 'DCFCE7' } } // Hijau
    };
    if (a.condition === 'Rusak Berat') {
      conditionStyle = {
        ...centerStyle,
        font: { ...baseStyle.font, bold: true, color: { rgb: '991B1B' } },
        fill: { fgColor: { rgb: 'FEE2E2' } } // Merah
      };
    } else if (a.condition === 'Rusak Ringan') {
      conditionStyle = {
        ...centerStyle,
        font: { ...baseStyle.font, bold: true, color: { rgb: '854D0E' } },
        fill: { fgColor: { rgb: 'FEF9C3' } } // Kuning
      };
    }

    // Urgensi style
    let urgencyStyle = centerStyle;
    if (a.maintenanceUrgency === 'Kritis / Segera') {
      urgencyStyle = {
        ...centerStyle,
        font: { ...baseStyle.font, bold: true, color: { rgb: 'BE123C' } },
        fill: { fgColor: { rgb: 'FFE4E6' } }
      };
    }

    const rowData = [
      createCell(index + 1, centerStyle),
      createCell(a.id || '-', centerStyle, 's'),
      createCell(a.name || '-', leftBold),
      createCell(a.satdikName || '-', leftStyle),
      createCell(a.prodi || 'Semua Program Studi (Umum)', leftStyle),
      createCell(a.category || '-', leftStyle),
      createCell(a.condition || '-', conditionStyle),
      createCell(Number(a.conditionScore) || 0, percentStyle, 'n'),
      createCell(Number(a.utilizationRate) || 0, percentStyle, 'n'),
      createCell(Number(a.acquisitionYear) || '-', centerStyle),
      createCell(a.maintenanceUrgency || 'Normal', urgencyStyle),
      createCell(a.issuesSummary || a.specs || '-', leftStyle)
    ];

    rowData.forEach((cell, colIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow, c: colIdx });
      ws[cellRef] = cell;
    });

    currentRow++;
  });

  // 5. BARIS TOTAL / REKAPITULASI DI BAWAH TABEL
  const totalRowStyle = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } },
    fill: { fgColor: { rgb: 'E2E8F0' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderDoubleBottom
  };

  ws[XLSX.utils.encode_cell({ r: currentRow, c: 0 })] = createCell(`TOTAL KESELURUHAN: ${assets.length} UNIT SARANA DAN PRASARANA`, totalRowStyle);
  for (let c = 1; c <= 11; c++) {
    ws[XLSX.utils.encode_cell({ r: currentRow, c })] = createCell('', totalRowStyle);
  }

  // 6. LEMBAR PENGESAHAN DOKUMEN (Sign-off)
  const signRow = currentRow + 3;
  const signLabelStyle = { font: { name: 'Calibri', sz: 10, color: { rgb: '475569' } }, alignment: { horizontal: 'center' } };
  const signTitleStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '0F172A' } }, alignment: { horizontal: 'center' } };
  const signNameStyle = { font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: '003366' }, underline: true }, alignment: { horizontal: 'center' } };

  ws[XLSX.utils.encode_cell({ r: signRow, c: 1 })] = createCell('Mengetahui,', signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 1, c: 1 })] = createCell('Koordinator Sarana & Prasarana', signTitleStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 2, c: 1 })] = createCell('Pusat Pendidikan Kelautan dan Perikanan', signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 6, c: 1 })] = createCell('( Admin Sarpras Pusdik KP )', signNameStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 7, c: 1 })] = createCell('Pusdik KP — BPPSDM Kelautan dan Perikanan', signLabelStyle);

  ws[XLSX.utils.encode_cell({ r: signRow, c: 8 })] = createCell('Dicetak melalui SARPRAS KKP,', signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 1, c: 8 })] = createCell('Petugas Operator Sistem:', signTitleStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 2, c: 8 })] = createCell(`Pada: ${printedAt}`, signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 6, c: 8 })] = createCell(`( ${userName} )`, signNameStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 7, c: 8 })] = createCell(userRole, signLabelStyle);

  // 7. CELL MERGES
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Kop Kemen
    { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } }, // Kop Badan
    { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } }, // Kop Pusat
    { s: { r: 3, c: 0 }, e: { r: 3, c: 11 } }, // Kop App
    { s: { r: 5, c: 0 }, e: { r: 5, c: 11 } }, // Title
    // Metadata Merges
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 5 } },
    { s: { r: 6, c: 6 }, e: { r: 6, c: 7 } },
    { s: { r: 6, c: 8 }, e: { r: 6, c: 11 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 5 } },
    { s: { r: 7, c: 6 }, e: { r: 7, c: 7 } },
    { s: { r: 7, c: 8 }, e: { r: 7, c: 11 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 8, c: 2 }, e: { r: 8, c: 5 } },
    { s: { r: 8, c: 6 }, e: { r: 8, c: 7 } },
    { s: { r: 8, c: 8 }, e: { r: 8, c: 11 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
    { s: { r: 9, c: 2 }, e: { r: 9, c: 5 } },
    { s: { r: 9, c: 6 }, e: { r: 9, c: 7 } },
    { s: { r: 9, c: 8 }, e: { r: 9, c: 11 } },
    // Total Row Label Merge
    { s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 11 } },
    // Signoff Merges
    { s: { r: signRow, c: 1 }, e: { r: signRow, c: 3 } },
    { s: { r: signRow + 1, c: 1 }, e: { r: signRow + 1, c: 3 } },
    { s: { r: signRow + 2, c: 1 }, e: { r: signRow + 2, c: 3 } },
    { s: { r: signRow + 6, c: 1 }, e: { r: signRow + 6, c: 3 } },
    { s: { r: signRow + 7, c: 1 }, e: { r: signRow + 7, c: 3 } },
    { s: { r: signRow, c: 8 }, e: { r: signRow, c: 11 } },
    { s: { r: signRow + 1, c: 8 }, e: { r: signRow + 1, c: 11 } },
    { s: { r: signRow + 2, c: 8 }, e: { r: signRow + 2, c: 11 } },
    { s: { r: signRow + 6, c: 8 }, e: { r: signRow + 6, c: 11 } },
    { s: { r: signRow + 7, c: 8 }, e: { r: signRow + 7, c: 11 } },
  ];

  // 8. LEBAR KOLOM (Auto Widths - 12 Kolom)
  ws['!cols'] = [
    { wch: 6 },  // 0: No
    { wch: 14 }, // 1: ID Sistem
    { wch: 38 }, // 2: Nama Sarpras
    { wch: 28 }, // 3: Satdik
    { wch: 32 }, // 4: Program Studi Terkait
    { wch: 26 }, // 5: Bidang Sarpras
    { wch: 16 }, // 6: Kondisi Fisik
    { wch: 14 }, // 7: Skor Kelayakan
    { wch: 14 }, // 8: Utilisasi
    { wch: 16 }, // 9: Tahun Perolehan
    { wch: 22 }, // 10: Urgensi
    { wch: 42 }  // 11: Catatan
  ];

  // Set range
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: signRow + 8, c: 11 }
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Inventaris Sarpras');

  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
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

    const centerStyle = { ...base, alignment: { horizontal: 'center' } };
    const leftBold = { ...base, font: { ...base.font, bold: true }, alignment: { horizontal: 'left' } };
    const left = { ...base, alignment: { horizontal: 'left' } };
    const condStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '991B1B' } }, fill: { fgColor: { rgb: 'FEE2E2' } }, alignment: { horizontal: 'center' } };
    const currStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'right' }, numFmt: '#,##0' };
    const approvedStyle = { ...base, font: { ...base.font, bold: true, color: { rgb: '166534' } }, fill: { fgColor: { rgb: 'DCFCE7' } }, alignment: { horizontal: 'center' } };

    const cells = [
      createCell(idx + 1, centerStyle),
      createCell(a.id, centerStyle, 's'),
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
  const userRole = currentUser?.roleLabel || 'Pengelola SARPRAS KKP';

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

  window.SARPRAS_EXCEL = {
    exportAssetsToExcel: exportAssetsToExcel,
    exportRKAToExcel: exportRKAToExcel,
    exportAsramaToExcel: exportAsramaToExcel,
    exportStandarToExcel: exportStandarToExcel
  };
})(window);
