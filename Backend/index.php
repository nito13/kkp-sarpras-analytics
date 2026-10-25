<?php
// Backend/index.php
// Gateway & API Information Center SIM-SARPRAS KKP

require_once __DIR__ . '/config/database.php';

jsonResponse([
    'service' => 'SIM-SARPRAS KKP Backend Core',
    'status' => 'operational',
    'version' => '2.0.0',
    'endpoints' => [
        'APIs' => [
            'assets' => 'APIs/assets.php',
            'auth' => 'APIs/auth.php',
            'satdik' => 'APIs/satdik.php',
        ],
        'Monitoring' => [
            'health' => 'Monitoring/health.php',
            'diagnostic' => 'Monitoring/diagnostic.php',
        ],
    ],
    'documentation' => 'Lihat README.md di masing-masing direktori modul'
]);
