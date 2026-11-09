<?php
// APIs/assets.php
// Modul Inventaris & Katalog Sarpras telah dihapus sesuai kebijakan penyederhanaan data.
// Endpoint ini dipertahankan hanya untuk backward-compatibility dengan respon kosong.

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    jsonResponse([
        'status' => 'success',
        'message' => 'Modul inventaris katalog telah dinonaktifkan.',
        'total' => 0,
        'data' => []
    ]);
}

jsonResponse([
    'status' => 'error',
    'message' => 'Modul inventaris sarpras telah dinonaktifkan.'
], 410);

