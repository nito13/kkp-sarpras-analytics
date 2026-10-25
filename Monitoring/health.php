<?php
// Monitoring/health.php
// Endpoint pemeriksaan status koneksi ke MySQL Laragon & health telemetri

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

try {
    $pdo = getDbConnection(true);

    $stmtAssets = $pdo->query("SELECT COUNT(*) AS total FROM assets");
    $totalAssets = (int)$stmtAssets->fetch()['total'];

    $stmtSatdik = $pdo->query("SELECT COUNT(*) AS total FROM satdik");
    $totalSatdik = (int)$stmtSatdik->fetch()['total'];

    $stmtUsers = $pdo->query("SELECT COUNT(*) AS total FROM users");
    $totalUsers = (int)$stmtUsers->fetch()['total'];

    jsonResponse([
        'status' => 'connected',
        'success' => true,
        'database' => DB_NAME,
        'host' => DB_HOST . ':' . DB_PORT,
        'serverTime' => date('Y-m-d H:i:s'),
        'counts' => [
            'assets' => $totalAssets,
            'satdik' => $totalSatdik,
            'users' => $totalUsers,
        ]
    ]);
} catch (Exception $e) {
    jsonResponse([
        'status' => 'error',
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}
