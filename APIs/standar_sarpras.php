<?php
// APIs/standar_sarpras.php
// REST API Pemenuhan Standar Minimal & Gap Sarpras per Rumpun Prodi & Satdik
// GET APIs/standar_sarpras.php                        -> seluruh bidang, rekap, & katalog item standar
// GET APIs/standar_sarpras.php?mode=summary           -> hanya meta, bidang, & rekap (ringan)
// GET APIs/standar_sarpras.php?bidang_id=xxx          -> filter item & rekap untuk 1 bidang
// GET APIs/standar_sarpras.php?satdik_id=xxx          -> filter rekap & item yang relevan untuk 1 Satdik

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

try {
    $pdo = getDbConnection(true);
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
} catch (Throwable $e) {
    jsonResponse([
        'status' => 'error',
        'message' => 'Tabel standar sarpras prodi belum diinisialisasi di MySQL. Jalankan php -f Database/seed.php.',
    ], 503);
}

$fmtNum = function ($v) {
    $f = (float)$v;
    $i = (int)round($f);
    return abs($f - $i) < 0.0001 ? $i : round($f, 2);
};

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
        'realVolSum' => $fmtNum($r['real_vol_sum']),
    ];
}, $rekapRows);

$items = [];
foreach ($itemRows as $r) {
    if (!isset($allowedSet[$r['bidang_id']])) {
        continue;
    }
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
    $items[] = $obj;
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
