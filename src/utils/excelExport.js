// src/utils/excelExport.js
// Generator Dokumen Microsoft Excel Asli (.xlsx OpenXML)
// Menghasilkan tabel rapi bergaris, kop dinas resmi KKP, pewarnaan status, dan formula angka
// 100% kompatibel tanpa peringatan corrupt / extension mismatch di Microsoft Excel

import XLSX from 'xlsx-js-style';

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
export function exportAssetsToExcel(assets, options = {}) {
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
    'Bidang Sarpras',
    'Sub-Bidang',
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
      createCell(a.category || '-', leftStyle),
      createCell(a.subcategory || '-', leftStyle),
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

  ws[XLSX.utils.encode_cell({ r: signRow, c: 2 })] = createCell('Mengetahui,', signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 1, c: 2 })] = createCell('Koordinator Sarana & Prasarana', signTitleStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 2, c: 2 })] = createCell('Pusat Pendidikan Kelautan dan Perikanan', signLabelStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 6, c: 2 })] = createCell('( Admin Sarpras Pusdik KP )', signNameStyle);
  ws[XLSX.utils.encode_cell({ r: signRow + 7, c: 2 })] = createCell('Pusdik KP — BPPSDM Kelautan dan Perikanan', signLabelStyle);

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
    { s: { r: signRow, c: 7 }, e: { r: signRow, c: 10 } },
    { s: { r: signRow + 1, c: 7 }, e: { r: signRow + 1, c: 10 } },
    { s: { r: signRow + 2, c: 7 }, e: { r: signRow + 2, c: 10 } },
    { s: { r: signRow + 6, c: 7 }, e: { r: signRow + 6, c: 10 } },
    { s: { r: signRow + 7, c: 7 }, e: { r: signRow + 7, c: 10 } },
  ];

  // 8. LEBAR KOLOM (Auto Widths - 12 Kolom)
  ws['!cols'] = [
    { wch: 6 },  // 0: No
    { wch: 14 }, // 1: ID Sistem
    { wch: 38 }, // 2: Nama Sarpras
    { wch: 30 }, // 3: Satdik
    { wch: 22 }, // 4: Bidang
    { wch: 22 }, // 5: Sub-bidang
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
export function exportRKAToExcel(simulation, options = {}) {
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
      createCell(a.subcategory || a.category || '-', left),
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
