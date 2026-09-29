<?php
// backend/index.php
// Index Gateway SARPRAS KKP API

require_once __DIR__ . '/config/database.php';

jsonResponse([
    'title' => 'SARPRAS KKP Backend API',
    'version' => '1.0.0',
    'status' => 'online',
    'environment' => 'Laragon MySQL',
    'endpoints' => [
        'health' => '/api/health.php',
        'assets' => '/api/assets.php (GET, POST, PUT, DELETE)',
        'satdik' => '/api/satdik.php (GET)',
        'auth'   => '/api/auth.php (POST, GET)',
    ],
    'timestamp' => date('Y-m-d H:i:s')
]);
