<?php
// backend/api/satdik.php
// Master Data 18 Satuan Pendidikan Vokasi KKP

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);

function formatSatdikOutput($row) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'shortName' => $row['short_name'] ?? '',
        'jenjang' => $row['jenjang'] ?? '',
        'type' => $row['type'] ?? '',
        'provinsi' => $row['provinsi'] ?? '',
        'kota' => $row['kota'] ?? '',
        'region' => $row['region'] ?? '',
        'lat' => (float)$row['lat'],
        'lng' => (float)$row['lng'],
        'mapX' => (int)($row['map_x'] ?? 0),
        'mapY' => (int)($row['map_y'] ?? 0),
        'tarunaCount' => (int)$row['taruna_count'],
        'dosenCount' => (int)$row['dosen_count'],
        'luasLahanHa' => (float)$row['luas_lahan_ha'],
        'luasBangunanM2' => (float)$row['luas_bangunan_m2'],
        'akreditasi' => $row['akreditasi'] ?? '',
        'establishedYear' => (int)$row['established_year'],
        'kampusCabang' => !empty($row['kampus_cabang_json']) ? json_decode($row['kampus_cabang_json'], true) : [],
        'rector' => $row['rector'] ?? '',
        'prodi' => !empty($row['prodi_json']) ? json_decode($row['prodi_json'], true) : [],
    ];
}

$stmt = $pdo->query("SELECT * FROM satdik ORDER BY id ASC");
$rows = $stmt->fetchAll();

$formatted = array_map('formatSatdikOutput', $rows);
jsonResponse([
    'status' => 'success',
    'total' => count($formatted),
    'data' => $formatted
]);
