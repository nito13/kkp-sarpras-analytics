<?php
// backend/config/database.php
// Konfigurasi Database MySQL Laragon untuk SARPRAS KKP

// Header CORS agar dapat diakses dari Frontend React (port 5173 atau port lainnya)
if (php_sapi_name() !== 'cli') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Tangani HTTP preflight OPTIONS request
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Konfigurasi default Laragon
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'kkp_sarpras_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

/**
 * Mendapatkan koneksi PDO ke database MySQL Laragon
 * @param bool $selectDb Apakah langsung memilih database kkp_sarpras_db
 * @return PDO
 */
function getDbConnection($selectDb = true) {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
        if ($selectDb) {
            $dsn .= ";dbname=" . DB_NAME;
        }

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal terhubung ke MySQL Laragon: ' . $e->getMessage(),
            'hint' => 'Pastikan Laragon sudah dalam status Start All dan MySQL aktif di port 3306.'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

/**
 * Helper untuk response JSON seragam
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}
