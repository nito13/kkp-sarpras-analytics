<?php
// backend/config/database.php
// Konfigurasi Database MySQL Laragon untuk Sarana dan Prasarana Satuan Pendidikan KP

// Header CORS agar dapat diakses dari Frontend React (port 5173 atau port lainnya)
if (php_sapi_name() !== 'cli') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Actor-Id, X-Actor-Name, X-Actor-Email, X-Actor-Role');

    // Tangani HTTP preflight OPTIONS request
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Baca file .env jika ada di root proyek (opsional, untuk fleksibilitas Docker & Lokal)
$envFile = dirname(__DIR__, 2) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($envKey, $envVal) = explode('=', $line, 2);
            $envKey = trim($envKey);
            $envVal = trim($envVal, " \t\n\r\0\x0B\"'");
            if (getenv($envKey) === false) {
                putenv("{$envKey}={$envVal}");
                $_ENV[$envKey] = $envVal;
            }
        }
    }
}

// Konfigurasi default Laragon / Docker
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

/**
 * Pastikan tabel audit_logs tersedia di database MySQL
 */
function ensureAuditLogTable(PDO $pdo): void {
    static $checked = false;
    if ($checked) return;
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `audit_logs` (
                `id` VARCHAR(64) NOT NULL PRIMARY KEY,
                `action_type` VARCHAR(32) NOT NULL DEFAULT 'INPUT',
                `operation` VARCHAR(32) NOT NULL DEFAULT 'CREATE',
                `module` VARCHAR(64) NOT NULL DEFAULT 'umum',
                `table_name` VARCHAR(64) NOT NULL DEFAULT '-',
                `record_id` VARCHAR(100) NOT NULL DEFAULT '-',
                `record_name` VARCHAR(255) NOT NULL DEFAULT '-',
                `satdik_id` VARCHAR(64) DEFAULT 'ALL',
                `satdik_name` VARCHAR(255) DEFAULT '-',
                `actor_id` VARCHAR(64) DEFAULT 'USR-ADMIN',
                `actor_name` VARCHAR(255) DEFAULT 'Administrator Sistem',
                `actor_email` VARCHAR(150) DEFAULT 'administrator@kkp.go.id',
                `actor_role` VARCHAR(100) DEFAULT 'administrator',
                `summary` TEXT NULL,
                `payload_json` LONGTEXT NULL,
                `ip_address` VARCHAR(64) DEFAULT '127.0.0.1',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_audit_action` (`action_type`),
                INDEX `idx_audit_module` (`module`),
                INDEX `idx_audit_satdik` (`satdik_id`),
                INDEX `idx_audit_created` (`created_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        $checked = true;
    } catch (Throwable $e) {
        // Abaikan jika gagal auto-create
    }
}

/**
 * Ekstrak informasi pengguna/aktor dari body request atau HTTP header
 */
function extractActorFromRequest(?array $body = null): array {
    $actor = [];
    if (is_array($body) && isset($body['_actor']) && is_array($body['_actor'])) {
        $actor = $body['_actor'];
    }
    $id = $actor['id'] ?? ($_SERVER['HTTP_X_ACTOR_ID'] ?? ($_GET['actor_id'] ?? 'USR-ADMIN'));
    $name = $actor['name'] ?? ($_SERVER['HTTP_X_ACTOR_NAME'] ?? ($_GET['actor_name'] ?? 'Administrator / Operator Sistem'));
    $email = $actor['email'] ?? ($_SERVER['HTTP_X_ACTOR_EMAIL'] ?? ($_GET['actor_email'] ?? 'administrator@kkp.go.id'));
    $role = $actor['roleLabel'] ?? ($actor['role'] ?? ($_SERVER['HTTP_X_ACTOR_ROLE'] ?? ($_GET['actor_role'] ?? 'Administrator Utama')));

    return [
        'id' => trim((string)$id) ?: 'USR-ADMIN',
        'name' => trim((string)$name) ?: 'Administrator / Operator Sistem',
        'email' => trim((string)$email) ?: 'administrator@kkp.go.id',
        'role' => trim((string)$role) ?: 'Administrator Utama',
    ];
}

/**
 * Catat aktivitas Input Database (CREATE/UPDATE/BULK_IMPORT) atau Penghapusan Data (DELETE) ke tabel audit_logs
 */
function recordAuditLog(PDO $pdo, array $entry): ?string {
    try {
        ensureAuditLogTable($pdo);

        $actionType = strtoupper(trim((string)($entry['actionType'] ?? ($entry['action_type'] ?? 'INPUT'))));
        if (!in_array($actionType, ['INPUT', 'DELETE'], true)) {
            $actionType = ($actionType === 'HAPUS' || $actionType === 'REMOVE') ? 'DELETE' : 'INPUT';
        }

        $operation = strtoupper(trim((string)($entry['operation'] ?? ($actionType === 'DELETE' ? 'DELETE' : 'CREATE'))));
        $module = strtolower(trim((string)($entry['module'] ?? 'umum')));
        $tableName = trim((string)($entry['tableName'] ?? ($entry['table_name'] ?? '-')));
        $recordId = trim((string)($entry['recordId'] ?? ($entry['record_id'] ?? '-')));
        $recordName = trim((string)($entry['recordName'] ?? ($entry['record_name'] ?? $recordId)));
        $satdikId = trim((string)($entry['satdikId'] ?? ($entry['satdik_id'] ?? 'ALL'))) ?: 'ALL';
        $satdikName = trim((string)($entry['satdikName'] ?? ($entry['satdik_name'] ?? '')));

        if ($satdikName === '' && $satdikId !== '' && $satdikId !== 'ALL') {
            try {
                $stmtSat = $pdo->prepare("SELECT name, short_name FROM satdik WHERE id = :sid LIMIT 1");
                $stmtSat->execute([':sid' => $satdikId]);
                $sRow = $stmtSat->fetch();
                if ($sRow) {
                    $satdikName = $sRow['name'] ?: ($sRow['short_name'] ?: $satdikId);
                }
            } catch (Throwable $e) {}
        }
        if ($satdikName === '') {
            $satdikName = $satdikId === 'ALL' ? 'Seluruh Satdik (Nasional)' : $satdikId;
        }

        $actor = $entry['actor'] ?? extractActorFromRequest(is_array($entry['requestBody'] ?? null) ? $entry['requestBody'] : null);
        $actorId = trim((string)($entry['actorId'] ?? ($actor['id'] ?? 'USR-ADMIN')));
        $actorName = trim((string)($entry['actorName'] ?? ($actor['name'] ?? 'Administrator Sistem')));
        $actorEmail = trim((string)($entry['actorEmail'] ?? ($actor['email'] ?? 'administrator@kkp.go.id')));
        $actorRole = trim((string)($entry['actorRole'] ?? ($actor['role'] ?? 'Administrator Utama')));

        $summary = trim((string)($entry['summary'] ?? ''));
        $payload = $entry['payload'] ?? ($entry['data'] ?? null);
        $payloadJson = is_string($payload) ? $payload : ($payload !== null ? json_encode($payload, JSON_UNESCAPED_UNICODE) : null);

        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $logId = !empty($entry['id']) ? trim((string)$entry['id']) : ('LOG-' . strtoupper(substr($actionType, 0, 3)) . '-' . date('YmdHis') . '-' . rand(1000, 9999));

        $stmt = $pdo->prepare("
            INSERT INTO `audit_logs` (
                `id`, `action_type`, `operation`, `module`, `table_name`,
                `record_id`, `record_name`, `satdik_id`, `satdik_name`,
                `actor_id`, `actor_name`, `actor_email`, `actor_role`,
                `summary`, `payload_json`, `ip_address`
            ) VALUES (
                :id, :action_type, :operation, :module, :table_name,
                :record_id, :record_name, :satdik_id, :satdik_name,
                :actor_id, :actor_name, :actor_email, :actor_role,
                :summary, :payload_json, :ip_address
            ) ON DUPLICATE KEY UPDATE
                `summary` = VALUES(`summary`),
                `payload_json` = COALESCE(VALUES(`payload_json`), `payload_json`),
                `actor_id` = VALUES(`actor_id`),
                `actor_name` = VALUES(`actor_name`),
                `actor_email` = VALUES(`actor_email`),
                `actor_role` = VALUES(`actor_role`)
        ");

        $stmt->execute([
            ':id' => $logId,
            ':action_type' => $actionType,
            ':operation' => $operation,
            ':module' => $module,
            ':table_name' => $tableName,
            ':record_id' => mb_substr($recordId, 0, 100),
            ':record_name' => mb_substr($recordName, 0, 250),
            ':satdik_id' => mb_substr($satdikId, 0, 64),
            ':satdik_name' => mb_substr($satdikName, 0, 250),
            ':actor_id' => mb_substr($actorId, 0, 64),
            ':actor_name' => mb_substr($actorName, 0, 250),
            ':actor_email' => mb_substr($actorEmail, 0, 150),
            ':actor_role' => mb_substr($actorRole, 0, 100),
            ':summary' => $summary,
            ':payload_json' => $payloadJson,
            ':ip_address' => mb_substr((string)$ipAddress, 0, 64),
        ]);

        return $logId;
    } catch (Throwable $e) {
        return null;
    }
}
