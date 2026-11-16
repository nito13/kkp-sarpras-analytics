<?php
/**
 * ============================================================================
 * REST API ENDPOINT: INVENTARIS DATA KAPAL LATIH SATDIK KKP
 * ============================================================================
 * Path: APIs/kapal.php
 *
 * Metode yang didukung:
 * - GET    /APIs/kapal.php               -> Ambil seluruh daftar kapal latih
 * - GET    /APIs/kapal.php?satdik_id=X   -> Ambil kapal latih untuk satdik tertentu
 * - POST   /APIs/kapal.php               -> Tambah kapal latih baru
 * - PUT    /APIs/kapal.php               -> Perbarui data kapal latih
 * - DELETE /APIs/kapal.php?id=X          -> Hapus data kapal latih
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
 * Pastikan tabel kapal_latih tersedia di database MySQL
 */
function ensureKapalTable(PDO $pdo): void {
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `kapal_latih` (
                `id` VARCHAR(64) NOT NULL PRIMARY KEY,
                `satdik_id` VARCHAR(64) NOT NULL,
                `nama_kapal` VARCHAR(200) NOT NULL,
                `tahun_perolehan` INT DEFAULT 2020,
                `tonage_gt` DECIMAL(12,2) DEFAULT 0,
                `panjang_kapal` DECIMAL(12,2) DEFAULT 0,
                `jenis_kapal` VARCHAR(150) DEFAULT 'Kapal Latih Perikanan',
                `kapasitas_bbm` DECIMAL(14,2) DEFAULT 0,
                `jumlah_abk` INT DEFAULT 0,
                `alat_tangkap` VARCHAR(255) DEFAULT '-',
                `id_transmitter` VARCHAR(120) DEFAULT '-',
                `status_bmn` VARCHAR(150) DEFAULT 'Terdaftar BMN (Aktif Operasional)',
                `keterangan` TEXT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX `idx_kapal_satdik` (`satdik_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    } catch (PDOException $e) {
        // Abaikan jika gagal auto-create
    }
}

ensureKapalTable($pdo);

/**
 * Format baris kapal_latih dari DB ke camelCase JSON untuk Frontend
 */
function formatKapalRow(array $row, array $satdikMap = []): array {
    $sid = $row['satdik_id'];
    $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];

    return [
        'id' => $row['id'],
        'satdikId' => $sid,
        'satdikName' => $sInfo['name'] ?? $sid,
        'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
        'namaKapal' => $row['nama_kapal'] ?? '',
        'tahunPerolehan' => (int) ($row['tahun_perolehan'] ?? 2020),
        'tonageGt' => (float) ($row['tonage_gt'] ?? 0),
        'panjangKapal' => (float) ($row['panjang_kapal'] ?? 0),
        'jenisKapal' => $row['jenis_kapal'] ?? 'Kapal Latih Perikanan',
        'kapasitasBbm' => (float) ($row['kapasitas_bbm'] ?? 0),
        'jumlahAbk' => (int) ($row['jumlah_abk'] ?? 0),
        'alatTangkap' => $row['alat_tangkap'] ?? '-',
        'idTransmitter' => $row['id_transmitter'] ?? '-',
        'statusBmn' => $row['status_bmn'] ?? 'Terdaftar BMN (Aktif Operasional)',
        'keterangan' => $row['keterangan'] ?? '',
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
}

function getKapalSatdikMap(PDO $pdo): array {
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

            $sql = "SELECT * FROM `kapal_latih` WHERE 1=1";
            $params = [];

            if ($satdikId && $satdikId !== 'ALL') {
                $sql .= " AND `satdik_id` = :satdik_id";
                $params[':satdik_id'] = $satdikId;
            }

            if ($search) {
                $sql .= " AND (`nama_kapal` LIKE :q OR `jenis_kapal` LIKE :q OR `alat_tangkap` LIKE :q OR `id_transmitter` LIKE :q OR `status_bmn` LIKE :q)";
                $params[':q'] = "%{$search}%";
            }

            $sql .= " ORDER BY `satdik_id` ASC, `nama_kapal` ASC, `created_at` DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $satdikMap = getKapalSatdikMap($pdo);
            $vessels = array_map(fn($r) => formatKapalRow($r, $satdikMap), $rows);

            sendJsonResponse([
                'status' => 'success',
                'total' => count($vessels),
                'data' => $vessels,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal mengambil data kapal latih: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        if (!$body || empty($body['satdikId']) || empty($body['namaKapal'])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Field satdikId dan namaKapal wajib diisi.',
            ], 400);
        }

        $satdikId = trim($body['satdikId']);
        $namaKapal = trim($body['namaKapal']);
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim($body['id']) : ('KPL-' . $prefix . '-' . time() . '-' . rand(100, 999));

        $tahunPerolehan = isset($body['tahunPerolehan']) && (int)$body['tahunPerolehan'] > 0 ? (int)$body['tahunPerolehan'] : 2020;
        $tonageGt = isset($body['tonageGt']) ? max(0, (float)$body['tonageGt']) : 0;
        $panjangKapal = isset($body['panjangKapal']) ? max(0, (float)$body['panjangKapal']) : 0;
        $jenisKapal = !empty($body['jenisKapal']) ? trim($body['jenisKapal']) : 'Kapal Latih Perikanan';
        $kapasitasBbm = isset($body['kapasitasBbm']) ? max(0, (float)$body['kapasitasBbm']) : 0;
        $jumlahAbk = isset($body['jumlahAbk']) ? max(0, (int)$body['jumlahAbk']) : 0;
        $alatTangkap = !empty($body['alatTangkap']) ? trim($body['alatTangkap']) : '-';
        $idTransmitter = !empty($body['idTransmitter']) ? trim($body['idTransmitter']) : '-';
        $statusBmn = !empty($body['statusBmn']) ? trim($body['statusBmn']) : 'Terdaftar BMN (Aktif Operasional)';
        $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : '';

        try {
            $stmtIns = $pdo->prepare("
                INSERT INTO `kapal_latih` (
                    `id`, `satdik_id`, `nama_kapal`, `tahun_perolehan`, `tonage_gt`,
                    `panjang_kapal`, `jenis_kapal`, `kapasitas_bbm`, `jumlah_abk`,
                    `alat_tangkap`, `id_transmitter`, `status_bmn`, `keterangan`
                ) VALUES (
                    :id, :satdik_id, :nama_kapal, :tahun_perolehan, :tonage_gt,
                    :panjang_kapal, :jenis_kapal, :kapasitas_bbm, :jumlah_abk,
                    :alat_tangkap, :id_transmitter, :status_bmn, :keterangan
                )
            ");

            $stmtIns->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':nama_kapal' => $namaKapal,
                ':tahun_perolehan' => $tahunPerolehan,
                ':tonage_gt' => $tonageGt,
                ':panjang_kapal' => $panjangKapal,
                ':jenis_kapal' => $jenisKapal,
                ':kapasitas_bbm' => $kapasitasBbm,
                ':jumlah_abk' => $jumlahAbk,
                ':alat_tangkap' => $alatTangkap,
                ':id_transmitter' => $idTransmitter,
                ':status_bmn' => $statusBmn,
                ':keterangan' => $keterangan,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `kapal_latih` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $inserted = $stmtGet->fetch();

            $satdikMap = getKapalSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data kapal latih berhasil disimpan ke database.',
                'data' => formatKapalRow($inserted, $satdikMap),
            ], 201);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menyimpan kapal latih: ' . $e->getMessage(),
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
                'message' => 'ID kapal latih wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT * FROM `kapal_latih` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Kapal latih dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $satdikId = isset($body['satdikId']) ? trim($body['satdikId']) : $existing['satdik_id'];
            $namaKapal = isset($body['namaKapal']) ? trim($body['namaKapal']) : $existing['nama_kapal'];
            $tahunPerolehan = isset($body['tahunPerolehan']) ? (int)$body['tahunPerolehan'] : (int)$existing['tahun_perolehan'];
            $tonageGt = isset($body['tonageGt']) ? (float)$body['tonageGt'] : (float)$existing['tonage_gt'];
            $panjangKapal = isset($body['panjangKapal']) ? (float)$body['panjangKapal'] : (float)$existing['panjang_kapal'];
            $jenisKapal = isset($body['jenisKapal']) ? trim($body['jenisKapal']) : $existing['jenis_kapal'];
            $kapasitasBbm = isset($body['kapasitasBbm']) ? (float)$body['kapasitasBbm'] : (float)$existing['kapasitas_bbm'];
            $jumlahAbk = isset($body['jumlahAbk']) ? (int)$body['jumlahAbk'] : (int)$existing['jumlah_abk'];
            $alatTangkap = isset($body['alatTangkap']) ? trim($body['alatTangkap']) : $existing['alat_tangkap'];
            $idTransmitter = isset($body['idTransmitter']) ? trim($body['idTransmitter']) : $existing['id_transmitter'];
            $statusBmn = isset($body['statusBmn']) ? trim($body['statusBmn']) : $existing['status_bmn'];
            $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : $existing['keterangan'];

            $stmtUpd = $pdo->prepare("
                UPDATE `kapal_latih` SET
                    `satdik_id` = :satdik_id,
                    `nama_kapal` = :nama_kapal,
                    `tahun_perolehan` = :tahun_perolehan,
                    `tonage_gt` = :tonage_gt,
                    `panjang_kapal` = :panjang_kapal,
                    `jenis_kapal` = :jenis_kapal,
                    `kapasitas_bbm` = :kapasitas_bbm,
                    `jumlah_abk` = :jumlah_abk,
                    `alat_tangkap` = :alat_tangkap,
                    `id_transmitter` = :id_transmitter,
                    `status_bmn` = :status_bmn,
                    `keterangan` = :keterangan
                WHERE `id` = :id
            ");

            $stmtUpd->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':nama_kapal' => $namaKapal,
                ':tahun_perolehan' => $tahunPerolehan,
                ':tonage_gt' => $tonageGt,
                ':panjang_kapal' => $panjangKapal,
                ':jenis_kapal' => $jenisKapal,
                ':kapasitas_bbm' => $kapasitasBbm,
                ':jumlah_abk' => $jumlahAbk,
                ':alat_tangkap' => $alatTangkap,
                ':id_transmitter' => $idTransmitter,
                ':status_bmn' => $statusBmn,
                ':keterangan' => $keterangan,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `kapal_latih` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $updated = $stmtGet->fetch();

            $satdikMap = getKapalSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data kapal latih berhasil diperbarui.',
                'data' => formatKapalRow($updated, $satdikMap),
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal memperbarui kapal latih: ' . $e->getMessage(),
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
                'message' => 'ID kapal latih wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT `id`, `nama_kapal` FROM `kapal_latih` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Kapal latih dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $stmtDel = $pdo->prepare("DELETE FROM `kapal_latih` WHERE `id` = :id");
            $stmtDel->execute([':id' => $id]);

            sendJsonResponse([
                'status' => 'success',
                'message' => "Kapal latih \"{$existing['nama_kapal']}\" berhasil dihapus.",
                'id' => $id,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menghapus kapal latih: ' . $e->getMessage(),
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
