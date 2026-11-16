<?php
/**
 * ============================================================================
 * REST API ENDPOINT: INVENTARIS DATA GEDUNG DAN BANGUNAN SATDIK KKP
 * ============================================================================
 * Path: APIs/gedung.php
 *
 * Metode yang didukung:
 * - GET    /APIs/gedung.php               -> Ambil seluruh daftar gedung & bangunan
 * - GET    /APIs/gedung.php?satdik_id=X   -> Ambil gedung & bangunan untuk satdik tertentu
 * - POST   /APIs/gedung.php               -> Tambah gedung & bangunan baru
 * - PUT    /APIs/gedung.php               -> Perbarui data gedung & bangunan
 * - DELETE /APIs/gedung.php?id=X          -> Hapus data gedung & bangunan
 * ============================================================================
 */

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (!function_exists('sendJsonResponse')) {
    function sendJsonResponse(array $payload, int $statusCode = 200): void {
        jsonResponse($payload, $statusCode);
    }
}

/**
 * Pastikan tabel gedung_bangunan tersedia di database MySQL
 */
function ensureGedungTable(PDO $pdo): void {
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `gedung_bangunan` (
                `id` VARCHAR(64) NOT NULL PRIMARY KEY,
                `satdik_id` VARCHAR(64) NOT NULL,
                `kampus` VARCHAR(100) DEFAULT 'Kampus Utama',
                `jenis_gedung` VARCHAR(500) NOT NULL DEFAULT 'Gedung Perkuliahan / Kelas',
                `jumlah` INT DEFAULT 1,
                `nama_gedung` TEXT NOT NULL,
                `jumlah_lantai` INT DEFAULT 0,
                `luas_m2` DECIMAL(14,2) DEFAULT 0,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX `idx_gedung_satdik` (`satdik_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        // Pastikan kolom kampus ada jika tabel sudah terlanjur dibuat sebelumnya
        $stmtCol = $pdo->query("SHOW COLUMNS FROM `gedung_bangunan` LIKE 'kampus'");
        if (!$stmtCol->fetch()) {
            $pdo->exec("ALTER TABLE `gedung_bangunan` ADD COLUMN `kampus` VARCHAR(100) DEFAULT 'Kampus Utama' AFTER `satdik_id`");
        }
        // Pastikan nama_gedung bertipe TEXT agar rincian lantai yang panjang tidak gagal disimpan
        $pdo->exec("ALTER TABLE `gedung_bangunan` MODIFY COLUMN `nama_gedung` TEXT NOT NULL, MODIFY COLUMN `jenis_gedung` VARCHAR(500) NOT NULL DEFAULT 'Gedung Perkuliahan / Kelas', MODIFY COLUMN `jumlah_lantai` INT DEFAULT 0");
    } catch (PDOException $e) {
        // Abaikan jika gagal auto-create
    }
}

ensureGedungTable($pdo);

/**
 * Format baris gedung_bangunan dari DB ke camelCase JSON untuk Frontend
 */
function formatGedungRow(array $row, array $satdikMap = []): array {
    $sid = $row['satdik_id'];
    $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];

    return [
        'id' => $row['id'],
        'satdikId' => $sid,
        'satdikName' => $sInfo['name'] ?? $sid,
        'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
        'kampus' => $row['kampus'] ?? ($sid === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama'),
        'jenisGedung' => $row['jenis_gedung'] ?? 'Gedung Perkuliahan / Kelas',
        'jumlah' => (int) ($row['jumlah'] ?? 1),
        'namaGedung' => $row['nama_gedung'] ?? '',
        'jumlahLantai' => (int) ($row['jumlah_lantai'] ?? 0),
        'luasM2' => (float) ($row['luas_m2'] ?? 0),
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
}

function getGedungSatdikMap(PDO $pdo): array {
    $map = [];
    try {
        $stmt = $pdo->query("SELECT id, name, short_name, type FROM satdik");
        while ($r = $stmt->fetch()) {
            $map[$r['id']] = $r;
        }
    } catch (PDOException $e) {
    }
    return $map;
}

switch ($method) {
    case 'GET':
        try {
            $satdikId = isset($_GET['satdik_id']) ? trim($_GET['satdik_id']) : null;
            $search = isset($_GET['q']) ? trim($_GET['q']) : null;

            $sql = "SELECT * FROM `gedung_bangunan` WHERE 1=1";
            $params = [];

            if ($satdikId && $satdikId !== 'ALL') {
                $sql .= " AND `satdik_id` = :satdik_id";
                $params[':satdik_id'] = $satdikId;
            }

            if ($search) {
                $sql .= " AND (`jenis_gedung` LIKE :q OR `nama_gedung` LIKE :q)";
                $params[':q'] = "%{$search}%";
            }

            $sql .= " ORDER BY `satdik_id` ASC, `jenis_gedung` ASC, `nama_gedung` ASC, `created_at` DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $satdikMap = getGedungSatdikMap($pdo);
            $items = array_map(fn($r) => formatGedungRow($r, $satdikMap), $rows);

            sendJsonResponse([
                'status' => 'success',
                'total' => count($items),
                'data' => $items,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal mengambil data gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        if (!$body || empty($body['satdikId']) || empty($body['namaGedung'])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Field satdikId dan namaGedung wajib diisi.',
            ], 400);
        }

        $satdikId = trim($body['satdikId']);
        $defaultKampus = $satdikId === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama';
        $kampus = !empty($body['kampus']) ? trim($body['kampus']) : $defaultKampus;
        $jenisGedung = !empty($body['jenisGedung']) ? trim($body['jenisGedung']) : 'Gedung Perkuliahan / Kelas';
        $jumlah = isset($body['jumlah']) && (int)$body['jumlah'] > 0 ? (int)$body['jumlah'] : 1;
        $namaGedung = trim($body['namaGedung']);
        $jumlahLantai = isset($body['jumlahLantai']) ? max(0, (int)$body['jumlahLantai']) : 0;
        $luasM2 = isset($body['luasM2']) ? max(0, (float)$body['luasM2']) : 0;

        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim($body['id']) : ('GDG-' . $prefix . '-' . time() . '-' . rand(100, 999));

        try {
            $stmtIns = $pdo->prepare("
                INSERT INTO `gedung_bangunan` (
                    `id`, `satdik_id`, `kampus`, `jenis_gedung`, `jumlah`,
                    `nama_gedung`, `jumlah_lantai`, `luas_m2`
                ) VALUES (
                    :id, :satdik_id, :kampus, :jenis_gedung, :jumlah,
                    :nama_gedung, :jumlah_lantai, :luas_m2
                )
            ");

            $stmtIns->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':kampus' => $kampus,
                ':jenis_gedung' => $jenisGedung,
                ':jumlah' => $jumlah,
                ':nama_gedung' => $namaGedung,
                ':jumlah_lantai' => $jumlahLantai,
                ':luas_m2' => $luasM2,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `gedung_bangunan` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $inserted = $stmtGet->fetch();

            $satdikMap = getGedungSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data gedung dan bangunan berhasil disimpan ke database.',
                'data' => formatGedungRow($inserted, $satdikMap),
            ], 201);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menyimpan gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'PUT':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        $id = $body['id'] ?? ($_GET['id'] ?? null);
        if (!$id) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'ID gedung dan bangunan wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT * FROM `gedung_bangunan` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Data gedung dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $satdikId = isset($body['satdikId']) ? trim($body['satdikId']) : $existing['satdik_id'];
            $kampus = isset($body['kampus']) ? trim($body['kampus']) : ($existing['kampus'] ?? ($satdikId === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama'));
            $jenisGedung = isset($body['jenisGedung']) ? trim($body['jenisGedung']) : $existing['jenis_gedung'];
            $jumlah = isset($body['jumlah']) ? max(1, (int)$body['jumlah']) : (int)$existing['jumlah'];
            $namaGedung = isset($body['namaGedung']) ? trim($body['namaGedung']) : $existing['nama_gedung'];
            $jumlahLantai = isset($body['jumlahLantai']) ? max(0, (int)$body['jumlahLantai']) : (int)$existing['jumlah_lantai'];
            $luasM2 = isset($body['luasM2']) ? max(0, (float)$body['luasM2']) : (float)$existing['luas_m2'];

            $stmtUpd = $pdo->prepare("
                UPDATE `gedung_bangunan` SET
                    `satdik_id` = :satdik_id,
                    `kampus` = :kampus,
                    `jenis_gedung` = :jenis_gedung,
                    `jumlah` = :jumlah,
                    `nama_gedung` = :nama_gedung,
                    `jumlah_lantai` = :jumlah_lantai,
                    `luas_m2` = :luas_m2
                WHERE `id` = :id
            ");

            $stmtUpd->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':kampus' => $kampus,
                ':jenis_gedung' => $jenisGedung,
                ':jumlah' => $jumlah,
                ':nama_gedung' => $namaGedung,
                ':jumlah_lantai' => $jumlahLantai,
                ':luas_m2' => $luasM2,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `gedung_bangunan` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $updated = $stmtGet->fetch();

            $satdikMap = getGedungSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data gedung dan bangunan berhasil diperbarui.',
                'data' => formatGedungRow($updated, $satdikMap),
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal memperbarui gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $rawInput = file_get_contents('php://input');
            $body = json_decode($rawInput, true);
            $id = $body['id'] ?? null;
        }

        if (!$id) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'ID gedung dan bangunan wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT `id`, `nama_gedung` FROM `gedung_bangunan` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Gedung dan bangunan dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $stmtDel = $pdo->prepare("DELETE FROM `gedung_bangunan` WHERE `id` = :id");
            $stmtDel->execute([':id' => $id]);

            sendJsonResponse([
                'status' => 'success',
                'message' => "Gedung \"{$existing['nama_gedung']}\" berhasil dihapus.",
                'id' => $id,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menghapus gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
        break;

    default:
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Metode HTTP tidak didukung: ' . $method,
        ], 405);
        break;
}
