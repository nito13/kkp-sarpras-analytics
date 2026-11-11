<?php
// APIs/bulk_import.php
// REST API Batch Import Data Sarana dan Prasarana Satuan Pendidikan KP dari File Excel (.xlsx / .xls / .csv)
// Mendukung transaksi penuh (ACID) untuk:
//   1. Gedung Asrama Taruna (asrama_gedung + rekalkulasi asrama_rekap)
//   2. Item Standar Minimal Prodi (standar_item + rekalkulasi standar_bidang & standar_rekap)

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$toNullableFloat = function ($v) {
    return $v === null ? null : (float)$v;
};

$fmtNum = function ($v) {
    $f = (float)$v;
    $i = (int)round($f);
    return abs($f - $i) < 0.0001 ? $i : round($f, 2);
};

function formatBulkBuildingOutput(array $r): array {
    return [
        'id' => $r['id'],
        'satdikId' => $r['satdik_id'],
        'kampus' => $r['kampus'] ?? '',
        'nama' => $r['nama'],
        'peruntukan' => $r['peruntukan'] ?? '',
        'jumlahKamar' => (int)($r['jumlah_kamar'] ?? 0),
        'luasM2' => (float)($r['luas_m2'] ?? 0),
        'kapasitas' => (float)($r['kapasitas'] ?? 0),
        'status' => $r['status'] ?? 'Digunakan',
        'keterangan' => $r['keterangan'] ?? '',
        'rincian' => !empty($r['rincian_json']) ? json_decode($r['rincian_json'], true) : [],
    ];
}

function formatBulkAsramaRekapOutput(array $r, callable $toNullableFloat): array {
    return [
        'satdikId' => $r['satdik_id'],
        'namaExcel' => $r['nama_excel'] ?? '',
        'jumlahAsrama' => (int)($r['jumlah_asrama'] ?? 0),
        'jumlahKamar' => (int)($r['jumlah_kamar'] ?? 0),
        'luasM2' => (float)($r['luas_m2'] ?? 0),
        'kapasitas' => (float)($r['kapasitas'] ?? 0),
        'kapasitasAktif' => (float)($r['kapasitas_aktif'] ?? 0),
        'luasAdjustment' => $toNullableFloat($r['luas_adjustment'] ?? null),
        'kapasitasAdjustment' => $toNullableFloat($r['kapasitas_adjustment'] ?? null),
        'jumlahTidakDipakai' => (int)($r['jumlah_tidak_dipakai'] ?? 0),
        'jumlahPerluRenovasi' => (int)($r['jumlah_perlu_renovasi'] ?? 0),
        'keterangan' => $r['keterangan'] ?? '',
        'driveUrl' => $r['drive_url'] ?? '',
    ];
}

function recalculateBulkAsramaRekap(PDO $pdo, string $satdikId, callable $toNullableFloat): ?array {
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as jumlah_asrama,
            COALESCE(SUM(jumlah_kamar), 0) as jumlah_kamar,
            COALESCE(SUM(luas_m2), 0) as luas_m2,
            COALESCE(SUM(kapasitas), 0) as kapasitas,
            COALESCE(SUM(CASE WHEN status = 'Digunakan' THEN kapasitas ELSE 0 END), 0) as kapasitas_aktif,
            COALESCE(SUM(CASE WHEN status = 'Tidak Digunakan' THEN 1 ELSE 0 END), 0) as jumlah_tidak_dipakai,
            COALESCE(SUM(CASE WHEN status = 'Perlu Renovasi' THEN 1 ELSE 0 END), 0) as jumlah_perlu_renovasi
        FROM asrama_gedung
        WHERE satdik_id = :sid
    ");
    $stmt->execute([':sid' => $satdikId]);
    $agg = $stmt->fetch();
    if (!$agg) {
        return null;
    }

    $checkStmt = $pdo->prepare("SELECT * FROM asrama_rekap WHERE satdik_id = :sid");
    $checkStmt->execute([':sid' => $satdikId]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        $updateStmt = $pdo->prepare("
            UPDATE asrama_rekap
            SET jumlah_asrama = :ja,
                jumlah_kamar = :jk,
                luas_m2 = :luas,
                kapasitas = :kap,
                kapasitas_aktif = :ka,
                jumlah_tidak_dipakai = :jtd,
                jumlah_perlu_renovasi = :jpr
            WHERE satdik_id = :sid
        ");
        $updateStmt->execute([
            ':ja' => (int)$agg['jumlah_asrama'],
            ':jk' => (int)$agg['jumlah_kamar'],
            ':luas' => (float)$agg['luas_m2'],
            ':kap' => (float)$agg['kapasitas'],
            ':ka' => (float)$agg['kapasitas_aktif'],
            ':jtd' => (int)$agg['jumlah_tidak_dipakai'],
            ':jpr' => (int)$agg['jumlah_perlu_renovasi'],
            ':sid' => $satdikId,
        ]);
    } else {
        $nameStmt = $pdo->prepare("SELECT name, short_name FROM satdik WHERE id = :sid");
        $nameStmt->execute([':sid' => $satdikId]);
        $sRow = $nameStmt->fetch();
        $namaExcel = $sRow ? ($sRow['short_name'] ?: $sRow['name']) : $satdikId;

        $insertStmt = $pdo->prepare("
            INSERT INTO asrama_rekap (
                satdik_id, nama_excel, jumlah_asrama, jumlah_kamar, luas_m2,
                kapasitas, kapasitas_aktif, jumlah_tidak_dipakai, jumlah_perlu_renovasi,
                sumber, tanggal_data
            ) VALUES (
                :sid, :nama_excel, :ja, :jk, :luas, :kap, :ka, :jtd, :jpr, 'Import Excel SIM-SARPRAS', CURRENT_DATE
            )
        ");
        $insertStmt->execute([
            ':sid' => $satdikId,
            ':nama_excel' => $namaExcel,
            ':ja' => (int)$agg['jumlah_asrama'],
            ':jk' => (int)$agg['jumlah_kamar'],
            ':luas' => (float)$agg['luas_m2'],
            ':kap' => (float)$agg['kapasitas'],
            ':ka' => (float)$agg['kapasitas_aktif'],
            ':jtd' => (int)$agg['jumlah_tidak_dipakai'],
            ':jpr' => (int)$agg['jumlah_perlu_renovasi'],
        ]);
    }

    $checkStmt->execute([':sid' => $satdikId]);
    $rekapRow = $checkStmt->fetch();
    return $rekapRow ? formatBulkAsramaRekapOutput($rekapRow, $toNullableFloat) : null;
}

function formatBulkStandarItemOutput(array $r, callable $fmtNum): array {
    $obj = [
        'id' => $r['id'],
        'bidangId' => $r['bidang_id'],
        'sec' => $r['sec'],
        'subSec' => $r['sub_sec'] ?? '',
        'grpCode' => $r['grp_code'] ?? '',
        'grpName' => $r['grp_name'],
        'subGrp' => $r['sub_grp'] ?? '',
        'no' => $r['item_no'] ?? '',
        'nama' => $r['nama'],
        'stdVol' => $fmtNum($r['std_vol']),
        'satuan' => $r['satuan'] ?? 'Unit',
        'real' => !empty($r['realisasi_json']) ? json_decode($r['realisasi_json'], true) : [],
    ];
    if (!empty($r['kondisi'])) {
        $obj['kondisi'] = $r['kondisi'];
    }
    if (!empty($r['keterangan'])) {
        $obj['ket'] = $r['keterangan'];
    }
    return $obj;
}

function recalculateBulkStandarRekap(PDO $pdo, string $bidangId, callable $fmtNum): array {
    $stmtB = $pdo->prepare("SELECT * FROM standar_bidang WHERE id = :bid");
    $stmtB->execute([':bid' => $bidangId]);
    $bidRow = $stmtB->fetch();
    if (!$bidRow) {
        return ['bidang' => null, 'rekap' => []];
    }

    $satdikIds = !empty($bidRow['satdik_ids_json']) ? json_decode($bidRow['satdik_ids_json'], true) : [];
    $codePrefix = $bidRow['code'] ?? 'STD';

    $stmtI = $pdo->prepare("SELECT * FROM standar_item WHERE bidang_id = :bid ORDER BY sort_order, id");
    $stmtI->execute([':bid' => $bidangId]);
    $items = $stmtI->fetchAll();

    $pTotBidang = 0;
    $sTotBidang = 0;
    foreach ($items as $it) {
        if ($it['sec'] === 'A') {
            $pTotBidang++;
        } else {
            $sTotBidang++;
        }
    }
    $totalItemsBidang = count($items);

    $stmtUpdBid = $pdo->prepare("
        UPDATE standar_bidang
        SET prasarana_count = :pc, sarana_count = :sc, total_items = :ti
        WHERE id = :bid
    ");
    $stmtUpdBid->execute([
        ':pc' => $pTotBidang,
        ':sc' => $sTotBidang,
        ':ti' => $totalItemsBidang,
        ':bid' => $bidangId,
    ]);

    $updatedRekap = [];
    foreach ($satdikIds as $sid) {
        $p_tot = $p_full = $p_part = $p_zero = 0;
        $s_tot = $s_full = $s_part = $s_zero = 0;
        $p_score_sum = 0.0;
        $s_score_sum = 0.0;
        $std_vol_sum = 0.0;
        $real_vol_sum = 0.0;

        foreach ($items as $it) {
            $sv = (float)($it['std_vol'] ?? 0);
            $realMap = !empty($it['realisasi_json']) ? json_decode($it['realisasi_json'], true) : [];
            $rv = isset($realMap[$sid]) ? (float)$realMap[$sid] : 0.0;

            $std_vol_sum += $sv;
            $real_vol_sum += $rv;
            $ratio_item = ($sv <= 0 && $rv > 0) ? 1.0 : (($sv > 0) ? min(1.0, $rv / $sv) : 0.0);

            if ($it['sec'] === 'A') {
                $p_tot++;
                $p_score_sum += $ratio_item;
                if ($sv > 0 && $rv >= $sv) {
                    $p_full++;
                } elseif ($rv > 0) {
                    $p_part++;
                } else {
                    $p_zero++;
                }
            } else {
                $s_tot++;
                $s_score_sum += $ratio_item;
                if ($sv > 0 && $rv >= $sv) {
                    $s_full++;
                } elseif ($rv > 0) {
                    $s_part++;
                } else {
                    $s_zero++;
                }
            }
        }

        $tot_items = $p_tot + $s_tot;
        $tot_full = $p_full + $s_full;
        $tot_part = $p_part + $s_part;
        $tot_zero = $p_zero + $s_zero;

        $persen_p = $p_tot > 0 ? round(($p_score_sum / $p_tot) * 100, 1) : 0.0;
        $persen_s = $s_tot > 0 ? round(($s_score_sum / $s_tot) * 100, 1) : 0.0;
        $persen_all = $tot_items > 0 ? round((($p_score_sum + $s_score_sum) / $tot_items) * 100, 1) : 0.0;

        $rekapId = $codePrefix . '-' . $sid;
        $checkR = $pdo->prepare("SELECT id FROM standar_rekap WHERE bidang_id = :bid AND satdik_id = :sid LIMIT 1");
        $checkR->execute([':bid' => $bidangId, ':sid' => $sid]);
        $existingR = $checkR->fetch();

        if ($existingR) {
            $stmtUpdR = $pdo->prepare("
                UPDATE standar_rekap SET
                    prasarana_total = :pt, prasarana_terpenuhi = :pf, prasarana_sebagian = :pp, prasarana_kosong = :pz,
                    sarana_total = :st, sarana_terpenuhi = :sf, sarana_sebagian = :sp, sarana_kosong = :sz,
                    total_items = :ti, total_terpenuhi = :tf, total_sebagian = :tp, total_kosong = :tz,
                    persen_prasarana = :ppr, persen_sarana = :psr, persen_total = :pal,
                    std_vol_sum = :svs, real_vol_sum = :rvs
                WHERE bidang_id = :bid AND satdik_id = :sid
            ");
            $stmtUpdR->execute([
                ':pt' => $p_tot, ':pf' => $p_full, ':pp' => $p_part, ':pz' => $p_zero,
                ':st' => $s_tot, ':sf' => $s_full, ':sp' => $s_part, ':sz' => $s_zero,
                ':ti' => $tot_items, ':tf' => $tot_full, ':tp' => $tot_part, ':tz' => $tot_zero,
                ':ppr' => $persen_p, ':psr' => $persen_s, ':pal' => $persen_all,
                ':svs' => $std_vol_sum, ':rvs' => $real_vol_sum,
                ':bid' => $bidangId, ':sid' => $sid,
            ]);
            $rekapId = $existingR['id'];
        } else {
            $stmtInsR = $pdo->prepare("
                INSERT INTO standar_rekap (
                    id, bidang_id, satdik_id,
                    prasarana_total, prasarana_terpenuhi, prasarana_sebagian, prasarana_kosong,
                    sarana_total, sarana_terpenuhi, sarana_sebagian, sarana_kosong,
                    total_items, total_terpenuhi, total_sebagian, total_kosong,
                    persen_prasarana, persen_sarana, persen_total,
                    std_vol_sum, real_vol_sum
                ) VALUES (
                    :id, :bid, :sid,
                    :pt, :pf, :pp, :pz,
                    :st, :sf, :sp, :sz,
                    :ti, :tf, :tp, :tz,
                    :ppr, :psr, :pal,
                    :svs, :rvs
                )
            ");
            $stmtInsR->execute([
                ':id' => $rekapId, ':bid' => $bidangId, ':sid' => $sid,
                ':pt' => $p_tot, ':pf' => $p_full, ':pp' => $p_part, ':pz' => $p_zero,
                ':st' => $s_tot, ':sf' => $s_full, ':sp' => $s_part, ':sz' => $s_zero,
                ':ti' => $tot_items, ':tf' => $tot_full, ':tp' => $tot_part, ':tz' => $tot_zero,
                ':ppr' => $persen_p, ':psr' => $persen_s, ':pal' => $persen_all,
                ':svs' => $std_vol_sum, ':rvs' => $real_vol_sum,
            ]);
        }

        $updatedRekap[] = [
            'id' => $rekapId,
            'bidangId' => $bidangId,
            'satdikId' => $sid,
            'prasaranaTotal' => $p_tot,
            'prasaranaTerpenuhi' => $p_full,
            'prasaranaSebagian' => $p_part,
            'prasaranaKosong' => $p_zero,
            'saranaTotal' => $s_tot,
            'saranaTerpenuhi' => $s_full,
            'saranaSebagian' => $s_part,
            'saranaKosong' => $s_zero,
            'totalItems' => $tot_items,
            'totalTerpenuhi' => $tot_full,
            'totalSebagian' => $tot_part,
            'totalKosong' => $tot_zero,
            'persenPrasarana' => $persen_p,
            'persenSarana' => $persen_s,
            'persenTotal' => $persen_all,
            'stdVolSum' => $fmtNum($std_vol_sum),
            'realVolSum' => $fmtNum($real_vol_sum),
        ];
    }

    $bidangUpdated = [
        'id' => $bidRow['id'],
        'code' => $bidRow['code'],
        'sheetName' => $bidRow['sheet_name'],
        'nama' => $bidRow['nama'],
        'categoryId' => $bidRow['category_id'] ?? '',
        'prodi' => !empty($bidRow['prodi_json']) ? json_decode($bidRow['prodi_json'], true) : [],
        'satdikIds' => $satdikIds,
        'prasaranaCount' => $pTotBidang,
        'saranaCount' => $sTotBidang,
        'totalItems' => $totalItemsBidang,
        'groupNotes' => !empty($bidRow['group_notes_json']) ? json_decode($bidRow['group_notes_json'], true) : [],
    ];

    return [
        'bidang' => $bidangUpdated,
        'rekap' => $updatedRekap,
    ];
}

if ($method === 'GET') {
    jsonResponse([
        'status' => 'success',
        'endpoint' => 'bulk_import',
        'ready' => true,
        'message' => 'Endpoint Batch Import Excel Sarana dan Prasarana Satuan Pendidikan KP siap menerima metode POST JSON.'
    ]);
}

if ($method !== 'POST') {
    jsonResponse([
        'status' => 'error',
        'message' => 'Metode HTTP tidak didukung. Gunakan POST dengan payload JSON.'
    ], 405);
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!is_array($payload)) {
    jsonResponse([
        'status' => 'error',
        'message' => 'Format JSON tidak valid.'
    ], 400);
}

$inBuildings = isset($payload['buildings']) && is_array($payload['buildings']) ? $payload['buildings'] : [];
$inStandar = isset($payload['standarItems']) && is_array($payload['standarItems']) ? $payload['standarItems'] : [];

if (empty($inBuildings) && empty($inStandar)) {
    jsonResponse([
        'status' => 'error',
        'message' => 'Tidak ada baris data valid untuk diimpor.'
    ], 400);
}

// Cache nama satdik untuk pengisian otomatis
$satdikNameMap = [];
try {
    $stmtSat = $pdo->query("SELECT id, name, short_name FROM satdik");
    foreach ($stmtSat->fetchAll() as $sr) {
        $satdikNameMap[$sr['id']] = $sr['name'] ?: $sr['short_name'];
    }
} catch (Throwable $e) {
    // Abaikan jika tabel satdik kosong
}

$createdBuildings = [];
$createdStandarItems = [];
$affectedAsramaSatdik = [];
$affectedStandarBidang = [];

try {
    $pdo->beginTransaction();

    // ---------------------------------------------------------
    // 1. BATCH INSERT: GEDUNG ASRAMA TARUNA
    // ---------------------------------------------------------
    if (!empty($inBuildings)) {
        $stmtCheckAsrId = $pdo->prepare("SELECT COUNT(*) FROM asrama_gedung WHERE id = :id");
        $stmtInsAsr = $pdo->prepare("
            INSERT INTO asrama_gedung (
                id, satdik_id, kampus, nama, peruntukan,
                jumlah_kamar, luas_m2, kapasitas, status,
                keterangan, rincian_json
            ) VALUES (
                :id, :satdik_id, :kampus, :nama, :peruntukan,
                :jumlah_kamar, :luas_m2, :kapasitas, :status,
                :keterangan, :rincian_json
            )
        ");
        $stmtGetAsr = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id");

        foreach ($inBuildings as $b) {
            if (empty($b['nama']) || empty($b['satdikId'])) {
                continue;
            }
            $satdikId = trim((string)$b['satdikId']);
            $nama = trim((string)$b['nama']);
            $kampus = !empty($b['kampus']) ? trim((string)$b['kampus']) : 'Kampus Utama';
            $peruntukan = !empty($b['peruntukan']) ? trim((string)$b['peruntukan']) : 'Taruna Putra';
            $jumlahKamar = isset($b['jumlahKamar']) ? max(0, (int)$b['jumlahKamar']) : 0;
            $luasM2 = isset($b['luasM2']) ? max(0.0, (float)$b['luasM2']) : 0.0;
            $kapasitas = isset($b['kapasitas']) && (float)$b['kapasitas'] > 0
                ? (float)$b['kapasitas']
                : ($luasM2 > 0 ? floor($luasM2 / 4) : 0.0);

            $rawStatus = !empty($b['status']) ? trim((string)$b['status']) : 'Digunakan';
            $statusLower = strtolower($rawStatus);
            if (strpos($statusLower, 'tidak') !== false || strpos($statusLower, 'berat') !== false || strpos($statusLower, 'kosong') !== false) {
                $status = 'Tidak Digunakan';
            } elseif (strpos($statusLower, 'renov') !== false || strpos($statusLower, 'ringan') !== false || strpos($statusLower, 'perlu') !== false) {
                $status = 'Perlu Renovasi';
            } else {
                $status = 'Digunakan';
            }

            $keterangan = isset($b['keterangan']) ? trim((string)$b['keterangan']) : '';
            $rincianJson = !empty($b['rincian']) && is_array($b['rincian'])
                ? json_encode($b['rincian'], JSON_UNESCAPED_UNICODE)
                : null;

            $cleanCode = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', str_replace(['poltek-', 'supm-', 'akkp-', 'kp-'], '', $satdikId)));
            $cleanCode = substr($cleanCode, 0, 4) ?: 'ASR';

            $candidateId = '';
            if (!empty($b['id'])) {
                $candidateId = trim((string)$b['id']);
                $stmtCheckAsrId->execute([':id' => $candidateId]);
                if ((int)$stmtCheckAsrId->fetchColumn() > 0) {
                    $candidateId = '';
                }
            }
            if ($candidateId === '') {
                do {
                    $candidateId = 'ASR-' . $cleanCode . '-' . rand(100, 9999);
                    $stmtCheckAsrId->execute([':id' => $candidateId]);
                } while ((int)$stmtCheckAsrId->fetchColumn() > 0);
            }

            $stmtInsAsr->execute([
                ':id' => $candidateId,
                ':satdik_id' => $satdikId,
                ':kampus' => $kampus,
                ':nama' => $nama,
                ':peruntukan' => $peruntukan,
                ':jumlah_kamar' => $jumlahKamar,
                ':luas_m2' => $luasM2,
                ':kapasitas' => $kapasitas,
                ':status' => $status,
                ':keterangan' => $keterangan,
                ':rincian_json' => $rincianJson,
            ]);

            $stmtGetAsr->execute([':id' => $candidateId]);
            $createdRow = $stmtGetAsr->fetch();
            if ($createdRow) {
                $createdBuildings[] = formatBulkBuildingOutput($createdRow);
            }
            $affectedAsramaSatdik[$satdikId] = true;
        }
    }

    $updatedAsramaSummary = [];
    foreach (array_keys($affectedAsramaSatdik) as $sid) {
        $sumRow = recalculateBulkAsramaRekap($pdo, $sid, $toNullableFloat);
        if ($sumRow) {
            $updatedAsramaSummary[] = $sumRow;
        }
    }

    // ---------------------------------------------------------
    // 3. BATCH INSERT: ITEM STANDAR MINIMAL PRODI
    // ---------------------------------------------------------
    if (!empty($inStandar)) {
        $stmtCheckBid = $pdo->prepare("SELECT * FROM standar_bidang WHERE id = :bid");
        $stmtCheckStdId = $pdo->prepare("SELECT COUNT(*) FROM standar_item WHERE id = :id");
        $stmtMaxOrder = $pdo->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM standar_item WHERE bidang_id = :bid");
        $stmtInsStd = $pdo->prepare("
            INSERT INTO standar_item (
                id, bidang_id, sec, sub_sec, grp_code, grp_name, sub_grp,
                item_no, nama, std_vol, satuan, realisasi_json, kondisi, keterangan, sort_order
            ) VALUES (
                :id, :bidang_id, :sec, :sub_sec, :grp_code, :grp_name, :sub_grp,
                :item_no, :nama, :std_vol, :satuan, :realisasi_json, :kondisi, :keterangan, :sort_order
            )
        ");
        $stmtGetStd = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id");
        $bidangCache = [];

        foreach ($inStandar as $st) {
            if (empty($st['nama']) || empty($st['bidangId'])) {
                continue;
            }
            $bidangId = trim((string)$st['bidangId']);
            if (!array_key_exists($bidangId, $bidangCache)) {
                $stmtCheckBid->execute([':bid' => $bidangId]);
                $bidangCache[$bidangId] = $stmtCheckBid->fetch() ?: null;
            }
            $bidRow = $bidangCache[$bidangId];
            if (!$bidRow) {
                continue;
            }

            $secRaw = strtoupper(trim((string)($st['sec'] ?? 'B')));
            $sec = (strpos($secRaw, 'A') === 0 || strpos($secRaw, 'PRASARANA') !== false) ? 'A' : 'B';
            $subSec = !empty($st['subSec']) ? trim((string)$st['subSec']) : $sec;
            $grpCode = !empty($st['grpCode']) ? trim((string)$st['grpCode']) : ($sec . '.1');
            $grpName = !empty($st['grpName']) ? trim((string)$st['grpName']) : 'FASILITAS STANDAR';
            $subGrp = !empty($st['subGrp']) ? trim((string)$st['subGrp']) : null;
            $itemNo = !empty($st['no']) ? trim((string)$st['no']) : null;
            $nama = trim((string)$st['nama']);
            $stdVol = isset($st['stdVol']) && (float)$st['stdVol'] > 0 ? (float)$st['stdVol'] : 1.0;
            $satuan = !empty($st['satuan']) ? trim((string)$st['satuan']) : 'Unit';
            $kondisi = !empty($st['kondisi']) ? trim((string)$st['kondisi']) : null;
            $keterangan = !empty($st['ket'] ?? ($st['keterangan'] ?? null))
                ? trim((string)($st['ket'] ?? $st['keterangan']))
                : null;

            $realMap = [];
            if (!empty($st['real']) && is_array($st['real'])) {
                foreach ($st['real'] as $rk => $rv) {
                    if ($rk !== '') {
                        $realMap[(string)$rk] = (float)$rv;
                    }
                }
            } elseif (!empty($st['realSatdikId']) && isset($st['realVol']) && $st['realVol'] !== '') {
                $realMap[trim((string)$st['realSatdikId'])] = (float)$st['realVol'];
            }
            $realisasiJson = json_encode($realMap, JSON_UNESCAPED_UNICODE);

            $codePrefix = !empty($bidRow['code']) ? $bidRow['code'] : 'STD';
            $candidateId = '';
            if (!empty($st['id'])) {
                $candidateId = trim((string)$st['id']);
                $stmtCheckStdId->execute([':id' => $candidateId]);
                if ((int)$stmtCheckStdId->fetchColumn() > 0) {
                    $candidateId = '';
                }
            }
            if ($candidateId === '') {
                do {
                    $candidateId = $codePrefix . '-' . $sec . '-' . rand(100, 9999);
                    $stmtCheckStdId->execute([':id' => $candidateId]);
                } while ((int)$stmtCheckStdId->fetchColumn() > 0);
            }

            $stmtMaxOrder->execute([':bid' => $bidangId]);
            $nextOrder = (int)$stmtMaxOrder->fetchColumn();

            $stmtInsStd->execute([
                ':id' => $candidateId,
                ':bidang_id' => $bidangId,
                ':sec' => $sec,
                ':sub_sec' => $subSec,
                ':grp_code' => $grpCode,
                ':grp_name' => $grpName,
                ':sub_grp' => $subGrp,
                ':item_no' => $itemNo,
                ':nama' => $nama,
                ':std_vol' => $stdVol,
                ':satuan' => $satuan,
                ':realisasi_json' => $realisasiJson,
                ':kondisi' => $kondisi,
                ':keterangan' => $keterangan,
                ':sort_order' => $nextOrder,
            ]);

            $stmtGetStd->execute([':id' => $candidateId]);
            $createdRow = $stmtGetStd->fetch();
            if ($createdRow) {
                $createdStandarItems[] = formatBulkStandarItemOutput($createdRow, $fmtNum);
            }
            $affectedStandarBidang[$bidangId] = true;
        }
    }

    $updatedStandarBidang = [];
    $updatedStandarRekap = [];
    foreach (array_keys($affectedStandarBidang) as $bid) {
        $calc = recalculateBulkStandarRekap($pdo, $bid, $fmtNum);
        if (!empty($calc['bidang'])) {
            $updatedStandarBidang[] = $calc['bidang'];
        }
        if (!empty($calc['rekap'])) {
            foreach ($calc['rekap'] as $rkRow) {
                $updatedStandarRekap[] = $rkRow;
            }
        }
    }

    $pdo->commit();

    $totalInserted = count($createdBuildings) + count($createdStandarItems);

    jsonResponse([
        'status' => 'success',
        'message' => "Berhasil mengimpor $totalInserted baris data ke database MySQL.",
        'counts' => [
            'buildings' => count($createdBuildings),
            'standarItems' => count($createdStandarItems),
            'total' => $totalInserted,
        ],
        'buildings' => $createdBuildings,
        'asramaSummary' => $updatedAsramaSummary,
        'standarItems' => $createdStandarItems,
        'standarBidang' => $updatedStandarBidang,
        'standarRekap' => $updatedStandarRekap,
    ], 201);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse([
        'status' => 'error',
        'message' => 'Transaksi import dibatalkan karena kesalahan database: ' . $e->getMessage(),
    ], 500);
}
