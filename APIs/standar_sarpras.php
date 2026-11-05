<?php
// APIs/standar_sarpras.php
// REST API CRUD Pemenuhan Standar Minimal & Gap Sarpras per Rumpun Prodi & Satdik
// GET    APIs/standar_sarpras.php                        -> seluruh bidang, rekap, & katalog item standar
// GET    APIs/standar_sarpras.php?mode=summary           -> hanya meta, bidang, & rekap (ringan)
// GET    APIs/standar_sarpras.php?bidang_id=xxx          -> filter item & rekap untuk 1 bidang
// GET    APIs/standar_sarpras.php?satdik_id=xxx          -> filter rekap & item yang relevan untuk 1 Satdik
// GET    APIs/standar_sarpras.php?id=xxx                 -> ambil detail 1 item standar
// POST   APIs/standar_sarpras.php                        -> Tambah item standar baru & rekalkulasi
// PUT    APIs/standar_sarpras.php?id=xxx                 -> Perbarui item standar / realisasi kampus & rekalkulasi
// DELETE APIs/standar_sarpras.php?id=xxx                 -> Hapus item standar & rekalkulasi

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$fmtNum = function ($v) {
    $f = (float)$v;
    $i = (int)round($f);
    return abs($f - $i) < 0.0001 ? $i : round($f, 2);
};

function formatStandarItemOutput(array $r, callable $fmtNum): array {
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

function recalculateStandarRekap(PDO $pdo, string $bidangId, callable $fmtNum): array {
    // 1. Ambil data bidang
    $stmtB = $pdo->prepare("SELECT * FROM standar_bidang WHERE id = :bid");
    $stmtB->execute([':bid' => $bidangId]);
    $bidRow = $stmtB->fetch();
    if (!$bidRow) {
        return ['bidang' => null, 'rekap' => []];
    }

    $satdikIds = !empty($bidRow['satdik_ids_json']) ? json_decode($bidRow['satdik_ids_json'], true) : [];
    $codePrefix = $bidRow['code'] ?? 'STD';

    // 2. Ambil seluruh item untuk bidang ini
    $stmtI = $pdo->prepare("SELECT * FROM standar_item WHERE bidang_id = :bid ORDER BY sort_order, id");
    $stmtI->execute([':bid' => $bidangId]);
    $items = $stmtI->fetchAll();

    $pTotBidang = 0;
    $sTotBidang = 0;
    foreach ($items as $it) {
        if ($it['sec'] === 'A') $pTotBidang++;
        else $sTotBidang++;
    }
    $totalItemsBidang = count($items);

    // Update standar_bidang
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

    // 3. Rekalkulasi per Satdik
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
            $sqlUpd = "
                UPDATE standar_rekap SET
                    prasarana_total = :pt, prasarana_terpenuhi = :pf, prasarana_sebagian = :pp, prasarana_kosong = :pz,
                    sarana_total = :st, sarana_terpenuhi = :sf, sarana_sebagian = :sp, sarana_kosong = :sz,
                    total_items = :ti, total_terpenuhi = :tf, total_sebagian = :tp, total_kosong = :tz,
                    persen_prasarana = :ppr, persen_sarana = :psr, persen_total = :pal,
                    std_vol_sum = :svs, real_vol_sum = :rvs
                WHERE bidang_id = :bid AND satdik_id = :sid
            ";
            $stmtUpdR = $pdo->prepare($sqlUpd);
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
            $sqlIns = "
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
            ";
            $stmtInsR = $pdo->prepare($sqlIns);
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

switch ($method) {
    case 'GET':
        $singleId = $_GET['id'] ?? null;
        if ($singleId) {
            $stmt = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $singleId]);
            $row = $stmt->fetch();
            if (!$row) {
                jsonResponse(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan.'], 404);
            }
            jsonResponse(['status' => 'success', 'data' => formatStandarItemOutput($row, $fmtNum)]);
        }

        $mode = $_GET['mode'] ?? 'all';
        $bidangFilter = $_GET['bidang_id'] ?? null;
        $satdikFilter = $_GET['satdik_id'] ?? null;

        $hasBidang = $bidangFilter && $bidangFilter !== 'ALL';
        $hasSatdik = $satdikFilter && $satdikFilter !== 'ALL';

        // 1. Ambil daftar bidang
        $sqlBidang = "SELECT * FROM standar_bidang" . ($hasBidang ? " WHERE id = :bid" : "") . " ORDER BY sort_order, id";
        $stmtB = $pdo->prepare($sqlBidang);
        $stmtB->execute($hasBidang ? [':bid' => $bidangFilter] : []);
        $bidangRows = $stmtB->fetchAll();

        // 2. Ambil rekap per (bidang, satdik)
        $whereRekap = [];
        $paramsRekap = [];
        if ($hasBidang) {
            $whereRekap[] = "bidang_id = :bid";
            $paramsRekap[':bid'] = $bidangFilter;
        }
        if ($hasSatdik) {
            $whereRekap[] = "satdik_id = :sid";
            $paramsRekap[':sid'] = $satdikFilter;
        }
        $sqlRekap = "SELECT * FROM standar_rekap"
            . (!empty($whereRekap) ? " WHERE " . implode(" AND ", $whereRekap) : "")
            . " ORDER BY bidang_id, satdik_id";
        $stmtR = $pdo->prepare($sqlRekap);
        $stmtR->execute($paramsRekap);
        $rekapRows = $stmtR->fetchAll();

        // 3. Ambil item standar (kecuali mode=summary)
        $itemRows = [];
        if ($mode !== 'summary') {
            $sqlItem = "SELECT * FROM standar_item";
            $paramsItem = [];
            if ($hasBidang) {
                $sqlItem .= " WHERE bidang_id = :bid";
                $paramsItem[':bid'] = $bidangFilter;
            }
            $sqlItem .= " ORDER BY sort_order, id";
            $stmtI = $pdo->prepare($sqlItem);
            $stmtI->execute($paramsItem);
            $itemRows = $stmtI->fetchAll();
        }

        $allSatdikIds = [];
        $totalP = 0;
        $totalS = 0;
        $totalCells = 0;

        $bidang = [];
        foreach ($bidangRows as $b) {
            $sids = !empty($b['satdik_ids_json']) ? json_decode($b['satdik_ids_json'], true) : [];
            if ($hasSatdik && !in_array($satdikFilter, $sids, true)) {
                continue;
            }
            foreach ($sids as $sid) {
                if (!in_array($sid, $allSatdikIds, true)) {
                    $allSatdikIds[] = $sid;
                }
            }
            $pCount = (int)$b['prasarana_count'];
            $sCount = (int)$b['sarana_count'];
            $tItems = (int)$b['total_items'];
            $totalP += $pCount;
            $totalS += $sCount;
            $totalCells += $tItems * count($sids);

            $bidang[] = [
                'id' => $b['id'],
                'code' => $b['code'],
                'sheetName' => $b['sheet_name'],
                'nama' => $b['nama'],
                'categoryId' => $b['category_id'] ?? '',
                'prodi' => !empty($b['prodi_json']) ? json_decode($b['prodi_json'], true) : [],
                'satdikIds' => $sids,
                'prasaranaCount' => $pCount,
                'saranaCount' => $sCount,
                'totalItems' => $tItems,
                'groupNotes' => !empty($b['group_notes_json']) ? json_decode($b['group_notes_json'], true) : [],
            ];
        }

        $allowedBidangIds = array_column($bidang, 'id');
        $allowedSet = array_flip($allowedBidangIds);

        $rekap = array_map(function ($r) use ($fmtNum) {
            return [
                'id' => $r['id'],
                'bidangId' => $r['bidang_id'],
                'satdikId' => $r['satdik_id'],
                'prasaranaTotal' => (int)$r['prasarana_total'],
                'prasaranaTerpenuhi' => (int)$r['prasarana_terpenuhi'],
                'prasaranaSebagian' => (int)$r['prasarana_sebagian'],
                'prasaranaKosong' => (int)$r['prasarana_kosong'],
                'saranaTotal' => (int)$r['sarana_total'],
                'saranaTerpenuhi' => (int)$r['sarana_terpenuhi'],
                'saranaSebagian' => (int)$r['sarana_sebagian'],
                'saranaKosong' => (int)$r['sarana_kosong'],
                'totalItems' => (int)$r['total_items'],
                'totalTerpenuhi' => (int)$r['total_terpenuhi'],
                'totalSebagian' => (int)$r['total_sebagian'],
                'totalKosong' => (int)$r['total_kosong'],
                'persenPrasarana' => (float)$r['persen_prasarana'],
                'persenSarana' => (float)$r['persen_sarana'],
                'persenTotal' => (float)$r['persen_total'],
                'stdVolSum' => $fmtNum($r['std_vol_sum']),
                'realVolSum' => $fmtNum($real_vol_sum = $r['real_vol_sum']),
            ];
        }, $rekapRows);

        $items = [];
        foreach ($itemRows as $r) {
            if (!isset($allowedSet[$r['bidang_id']])) {
                continue;
            }
            $items[] = formatStandarItemOutput($r, $fmtNum);
        }

        $meta = null;
        if (!empty($bidangRows)) {
            $meta = [
                'sumber' => $bidangRows[0]['sumber'] ?? 'Data Contoh.xlsx',
                'tanggalData' => $bidangRows[0]['tanggal_data'] ?? '',
                'jumlahBidang' => count($bidang),
                'jumlahSatdik' => count($allSatdikIds),
                'satdikIds' => $allSatdikIds,
                'totalPrasarana' => $totalP,
                'totalSarana' => $totalS,
                'totalItems' => $totalP + $totalS,
                'totalTitikRealisasi' => $totalCells,
            ];
        }

        jsonResponse([
            'status' => 'success',
            'meta' => $meta,
            'bidang' => $bidang,
            'rekap' => $rekap,
            'items' => $items,
        ]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['nama']) || empty($input['bidangId'])) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Data tidak lengkap. Field nama dan bidangId wajib diisi.'
            ], 400);
        }

        $bidangId = trim($input['bidangId']);
        $stmtCheckB = $pdo->prepare("SELECT * FROM standar_bidang WHERE id = :bid");
        $stmtCheckB->execute([':bid' => $bidangId]);
        $bidRow = $stmtCheckB->fetch();
        if (!$bidRow) {
            jsonResponse(['status' => 'error', 'message' => "Bidang '$bidangId' tidak ditemukan."], 404);
        }

        $sec = in_array(strtoupper($input['sec'] ?? 'A'), ['A', 'B']) ? strtoupper($input['sec']) : 'A';
        $subSec = !empty($input['subSec']) ? trim($input['subSec']) : $sec;
        $grpCode = !empty($input['grpCode']) ? trim($input['grpCode']) : ($sec . '.1');
        $grpName = !empty($input['grpName']) ? trim($input['grpName']) : 'FASILITAS STANDAR';
        $subGrp = !empty($input['subGrp']) ? trim($input['subGrp']) : null;
        $itemNo = !empty($input['no'] ?? ($input['itemNo'] ?? null)) ? trim((string)($input['no'] ?? $input['itemNo'])) : null;
        $nama = trim($input['nama']);
        $stdVol = isset($input['stdVol']) ? (float)$input['stdVol'] : 1.0;
        $satuan = !empty($input['satuan']) ? trim($input['satuan']) : 'Unit';
        $kondisi = !empty($input['kondisi']) ? trim($input['kondisi']) : null;
        $keterangan = !empty($input['ket'] ?? ($input['keterangan'] ?? null)) ? trim((string)($input['ket'] ?? $input['keterangan'])) : null;

        $realMap = [];
        if (!empty($input['real']) && is_array($input['real'])) {
            foreach ($input['real'] as $k => $v) {
                $realMap[$k] = (float)$v;
            }
        } elseif (!empty($input['realSatdikId']) && isset($input['realVol']) && $input['realVol'] !== '') {
            $realMap[trim((string)$input['realSatdikId'])] = (float)$input['realVol'];
        }
        $realisasiJson = json_encode($realMap, JSON_UNESCAPED_UNICODE);

        // Generate ID
        $codePrefix = $bidRow['code'] ?: 'STD';
        if (!empty($input['id'])) {
            $id = trim($input['id']);
        } else {
            do {
                $id = $codePrefix . '-' . $sec . '-' . rand(100, 999);
                $stmtCheckId = $pdo->prepare("SELECT COUNT(*) FROM standar_item WHERE id = :id");
                $stmtCheckId->execute([':id' => $id]);
            } while ((int)$stmtCheckId->fetchColumn() > 0);
        }

        // Cari max sort_order
        $stmtMax = $pdo->prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM standar_item WHERE bidang_id = :bid");
        $stmtMax->execute([':bid' => $bidangId]);
        $nextOrder = (int)$stmtMax->fetchColumn();

        $stmtInsert = $pdo->prepare("
            INSERT INTO standar_item (
                id, bidang_id, sec, sub_sec, grp_code, grp_name, sub_grp,
                item_no, nama, std_vol, satuan, realisasi_json, kondisi, keterangan, sort_order
            ) VALUES (
                :id, :bidang_id, :sec, :sub_sec, :grp_code, :grp_name, :sub_grp,
                :item_no, :nama, :std_vol, :satuan, :realisasi_json, :kondisi, :keterangan, :sort_order
            )
        ");

        $stmtInsert->execute([
            ':id' => $id,
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

        // Rekalkulasi rekap & bidang
        $calcResult = recalculateStandarRekap($pdo, $bidangId, $fmtNum);

        $stmtGet = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $createdItem = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Item standar sarpras berhasil ditambahkan.',
            'data' => formatStandarItemOutput($createdItem, $fmtNum),
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ], 201);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID item standar sarpras diperlukan.'], 400);
        }

        $stmtCheck = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id");
        $stmtCheck->execute([':id' => $id]);
        $existing = $stmtCheck->fetch();

        if (!$existing) {
            jsonResponse(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan.'], 404);
        }

        $bidangId = $existing['bidang_id'];
        $fields = [];
        $params = [':id' => $id];

        if (isset($input['nama'])) {
            $fields[] = "`nama` = :nama";
            $params[':nama'] = trim($input['nama']);
        }
        if (isset($input['sec']) && in_array(strtoupper($input['sec']), ['A', 'B'])) {
            $fields[] = "`sec` = :sec";
            $params[':sec'] = strtoupper($input['sec']);
        }
        if (isset($input['subSec'])) {
            $fields[] = "`sub_sec` = :sub_sec";
            $params[':sub_sec'] = trim($input['subSec']);
        }
        if (isset($input['grpCode'])) {
            $fields[] = "`grp_code` = :grp_code";
            $params[':grp_code'] = trim($input['grpCode']);
        }
        if (isset($input['grpName'])) {
            $fields[] = "`grp_name` = :grp_name";
            $params[':grp_name'] = trim($input['grpName']);
        }
        if (isset($input['subGrp'])) {
            $fields[] = "`sub_grp` = :sub_grp";
            $params[':sub_grp'] = trim($input['subGrp']);
        }
        if (isset($input['no']) || isset($input['itemNo'])) {
            $fields[] = "`item_no` = :item_no";
            $params[':item_no'] = trim((string)($input['no'] ?? $input['itemNo']));
        }
        if (isset($input['stdVol'])) {
            $fields[] = "`std_vol` = :std_vol";
            $params[':std_vol'] = (float)$input['stdVol'];
        }
        if (isset($input['satuan'])) {
            $fields[] = "`satuan` = :satuan";
            $params[':satuan'] = trim($input['satuan']);
        }
        if (isset($input['kondisi'])) {
            $fields[] = "`kondisi` = :kondisi";
            $params[':kondisi'] = !empty($input['kondisi']) ? trim($input['kondisi']) : null;
        }
        if (isset($input['ket']) || isset($input['keterangan'])) {
            $fields[] = "`keterangan` = :keterangan";
            $params[':keterangan'] = !empty($input['ket'] ?? $input['keterangan']) ? trim((string)($input['ket'] ?? $input['keterangan'])) : null;
        }

        // Perbarui Realisasi Kampus (bisa berupa seluruh object real, atau individual satdikId + realVol)
        $currentReal = !empty($existing['realisasi_json']) ? json_decode($existing['realisasi_json'], true) : [];
        $realChanged = false;

        if (isset($input['real']) && is_array($input['real'])) {
            foreach ($input['real'] as $sid => $vol) {
                $currentReal[$sid] = (float)$vol;
            }
            $realChanged = true;
        } elseif (isset($input['satdikId']) && isset($input['realVol'])) {
            $currentReal[$input['satdikId']] = (float)$input['realVol'];
            $realChanged = true;
        }

        if ($realChanged) {
            $fields[] = "`realisasi_json` = :realisasi_json";
            $params[':realisasi_json'] = json_encode($currentReal, JSON_UNESCAPED_UNICODE);
        }

        if (empty($fields)) {
            jsonResponse(['status' => 'error', 'message' => 'Tidak ada perubahan data yang dikirim.'], 400);
        }

        $sqlUpdate = "UPDATE standar_item SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmtUpd = $pdo->prepare($sqlUpdate);
        $stmtUpd->execute($params);

        // Rekalkulasi rekap & bidang
        $calcResult = recalculateStandarRekap($pdo, $bidangId, $fmtNum);

        $stmtGet = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $updatedItem = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Data item standar sarpras berhasil diperbarui.',
            'data' => formatStandarItemOutput($updatedItem, $fmtNum),
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID item standar sarpras diperlukan.'], 400);
        }

        $stmtCheck = $pdo->prepare("SELECT * FROM standar_item WHERE id = :id");
        $stmtCheck->execute([':id' => $id]);
        $existing = $stmtCheck->fetch();

        if (!$existing) {
            jsonResponse(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan atau sudah terhapus.'], 404);
        }

        $bidangId = $existing['bidang_id'];

        $stmtDel = $pdo->prepare("DELETE FROM standar_item WHERE id = :id");
        $stmtDel->execute([':id' => $id]);

        // Rekalkulasi rekap & bidang
        $calcResult = recalculateStandarRekap($pdo, $bidangId, $fmtNum);

        jsonResponse([
            'status' => 'success',
            'message' => 'Item standar sarpras berhasil dihapus.',
            'deletedId' => $id,
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ]);
        break;

    default:
        jsonResponse(['status' => 'error', 'message' => 'Metode HTTP tidak didukung.'], 405);
        break;
}
