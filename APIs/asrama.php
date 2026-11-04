<?php
// APIs/asrama.php
// REST API (read-only) Ketersediaan Ruang Asrama Taruna per Satdik
// GET  APIs/asrama.php                 -> { status: 'success', meta, summary: [...], buildings: [...] }
// GET  APIs/asrama.php?satdik_id=xxx    -> difilter untuk satu Satdik

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

try {
    $pdo = getDbConnection(true);
    $satdikFilter = $_GET['satdik_id'] ?? null;
    $hasFilter = $satdikFilter && $satdikFilter !== 'ALL';

    $sqlRekap = "SELECT * FROM asrama_rekap" . ($hasFilter ? " WHERE satdik_id = :sid" : "") . " ORDER BY satdik_id";
    $sqlGedung = "SELECT * FROM asrama_gedung" . ($hasFilter ? " WHERE satdik_id = :sid" : "") . " ORDER BY satdik_id, id";
    $params = $hasFilter ? [':sid' => $satdikFilter] : [];

    $stmt = $pdo->prepare($sqlRekap);
    $stmt->execute($params);
    $rekapRows = $stmt->fetchAll();

    $stmt = $pdo->prepare($sqlGedung);
    $stmt->execute($params);
    $gedungRows = $stmt->fetchAll();
} catch (Throwable $e) {
    jsonResponse([
        'status' => 'error',
        'message' => 'Tabel asrama belum diinisialisasi di MySQL. Jalankan php -f Database/seed.php atau gunakan dataset bawaan.',
    ], 503);
}

$toNullableFloat = function ($v) {
    return $v === null ? null : (float)$v;
};

$summary = array_map(function ($r) use ($toNullableFloat) {
    return [
        'satdikId' => $r['satdik_id'],
        'namaExcel' => $r['nama_excel'] ?? '',
        'jumlahAsrama' => (int)$r['jumlah_asrama'],
        'jumlahKamar' => (int)$r['jumlah_kamar'],
        'luasM2' => (float)$r['luas_m2'],
        'kapasitas' => (float)$r['kapasitas'],
        'kapasitasAktif' => (float)$r['kapasitas_aktif'],
        'luasAdjustment' => $toNullableFloat($r['luas_adjustment']),
        'kapasitasAdjustment' => $toNullableFloat($r['kapasitas_adjustment']),
        'jumlahTidakDipakai' => (int)$r['jumlah_tidak_dipakai'],
        'jumlahPerluRenovasi' => (int)$r['jumlah_perlu_renovasi'],
        'keterangan' => $r['keterangan'] ?? '',
        'driveUrl' => $r['drive_url'] ?? '',
    ];
}, $rekapRows);

$buildings = array_map(function ($r) {
    return [
        'id' => $r['id'],
        'satdikId' => $r['satdik_id'],
        'kampus' => $r['kampus'],
        'nama' => $r['nama'],
        'peruntukan' => $r['peruntukan'] ?? '',
        'jumlahKamar' => (int)$r['jumlah_kamar'],
        'luasM2' => (float)$r['luas_m2'],
        'kapasitas' => (float)$r['kapasitas'],
        'status' => $r['status'] ?? 'Digunakan',
        'keterangan' => $r['keterangan'] ?? '',
        'rincian' => !empty($r['rincian_json']) ? json_decode($r['rincian_json'], true) : [],
    ];
}, $gedungRows);

$meta = null;
if (!empty($rekapRows)) {
    $meta = [
        'sumber' => $rekapRows[0]['sumber'] ?? '',
        'tanggalData' => $rekapRows[0]['tanggal_data'] ?? '',
        'standarRuang' => '4 m² per orang',
        'jumlahSatdik' => count($summary),
        'jumlahGedung' => count($buildings),
    ];
}

jsonResponse([
    'status' => 'success',
    'meta' => $meta,
    'summary' => $summary,
    'buildings' => $buildings,
]);
