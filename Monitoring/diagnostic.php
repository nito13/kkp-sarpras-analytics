<?php
// Monitoring/diagnostic.php
// Skrip Diagnosa Kesehatan Lingkungan & Infrastruktur SIM-SARPRAS KKP

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$startTime = microtime(true);

$report = [
    'system' => [
        'phpVersion' => PHP_VERSION,
        'phpSapi' => php_sapi_name(),
        'os' => PHP_OS_FAMILY,
        'serverSoftware' => $_SERVER['SERVER_SOFTWARE'] ?? 'CLI / Standalone',
        'serverTime' => date('Y-m-d H:i:s T'),
        'memoryUsage' => round(memory_get_usage() / 1024 / 1024, 2) . ' MB',
        'memoryPeak' => round(memory_get_peak_usage() / 1024 / 1024, 2) . ' MB',
    ],
    'extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'json' => extension_loaded('json'),
        'mbstring' => extension_loaded('mbstring'),
    ],
    'directories' => [
        'Frontend' => is_dir(__DIR__ . '/../Frontend'),
        'Backend' => is_dir(__DIR__ . '/../Backend'),
        'Database' => is_dir(__DIR__ . '/../Database'),
        'APIs' => is_dir(__DIR__ . '/../APIs'),
        'Services' => is_dir(__DIR__ . '/../Services'),
        'Monitoring' => is_dir(__DIR__ . '/../Monitoring'),
    ],
    'database' => [
        'status' => 'untested',
        'host' => DB_HOST . ':' . DB_PORT,
        'database' => DB_NAME,
        'user' => DB_USER,
        'latencyMs' => null,
        'tables' => [],
    ]
];

try {
    $dbStart = microtime(true);
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 2,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    $report['database']['latencyMs'] = round((microtime(true) - $dbStart) * 1000, 2);
    $report['database']['status'] = 'connected';

    foreach (['satdik', 'users', 'assets'] as $tbl) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) AS total FROM `$tbl`");
            $report['database']['tables'][$tbl] = (int)$stmt->fetch()['total'];
        } catch (Exception $ex) {
            $report['database']['tables'][$tbl] = 'Error: ' . $ex->getMessage();
        }
    }
} catch (Exception $e) {
    $report['database']['status'] = 'disconnected';
    $report['database']['message'] = 'MySQL offline atau belum dijalankan di Laragon (' . $e->getMessage() . ')';
    $report['database']['hint'] = 'Jalankan Apache & MySQL dari Laragon control panel.';
}

$report['executionTimeMs'] = round((microtime(true) - $startTime) * 1000, 2);

jsonResponse($report);
