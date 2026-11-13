<?php
/**
 * ============================================================================
 * REST API ENDPOINT: INVENTARIS DATA TANAH & LAHAN SATDIK KKP
 * ============================================================================
 * Path: APIs/tanah.php
 *
 * Metode yang didukung:
 * - GET    /APIs/tanah.php               -> Ambil seluruh daftar bidang tanah
 * - GET    /APIs/tanah.php?satdik_id=X   -> Ambil bidang tanah untuk satdik tertentu
 * - POST   /APIs/tanah.php               -> Tambah bidang tanah baru
 * - PUT    /APIs/tanah.php               -> Perbarui data bidang tanah
 * - DELETE /APIs/tanah.php?id=X          -> Hapus data bidang tanah
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
 * Format baris tanah_bidang dari DB ke camelCase JSON untuk Frontend
 */
function formatTanahRow(array $row, array $satdikMap = []): array {
    $sid = $row['satdik_id'];
    $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];
    $luasM2 = (float) ($row['luas_m2'] ?? 0);
    $luasHa = !empty($row['luas_ha']) ? (float) $row['luas_ha'] : round($luasM2 / 10000, 4);

    return [
        'id' => $row['id'],
        'satdikId' => $sid,
        'satdikName' => $sInfo['name'] ?? $sid,
        'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
        'namaBidang' => $row['nama_bidang'],
        'kodeBmn' => $row['kode_bmn'] ?? '2.01.01.01.001.0001',
        'nup' => (int) ($row['nup'] ?? 1),
        'luasM2' => $luasM2,
        'luasHa' => $luasHa,
        'statusSertifikat' => $row['status_sertifikat'] ?? 'Sertifikat Hak Pakai (SHP)',
        'noSertifikat' => $row['no_sertifikat'] ?? '-',
        'tanggalSertifikat' => $row['tanggal_sertifikat'] ?? '-',
        'atasNama' => $row['atas_nama'] ?? 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
        'peruntukan' => $row['peruntukan'] ?? 'Kampus & Fasilitas Akademik',
        'statusPemanfaatan' => $row['status_pemanfaatan'] ?? 'Digunakan Sendiri (Operasional)',
        'alamat' => $row['alamat'] ?? '',
        'kota' => $row['kota'] ?? '',
        'provinsi' => $row['provinsi'] ?? '',
        'tahunPerolehan' => (int) ($row['tahun_perolehan'] ?? 2020),
        'asalPerolehan' => $row['asal_perolehan'] ?? 'APBN',
        'keterangan' => $row['keterangan'] ?? '',
        'fotoSatelit' => $row['foto_satelit'] ?? '',
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
}

/**
 * Peta Satuan Pendidikan
 */
function getSatdikMap(PDO $pdo): array {
    $map = [];
    try {
        $stmt = $pdo->query("SELECT id, name, short_name, type FROM satdik");
        while ($r = $stmt->fetch()) {
            $map[$r['id']] = $r;
        }
    } catch (PDOException $e) {
        // Fallback jika tabel satdik belum ada
    }
    return $map;
}

switch ($method) {
    case 'GET':
        try {
            $satdikId = isset($_GET['satdik_id']) ? trim($_GET['satdik_id']) : null;
            $search = isset($_GET['q']) ? trim($_GET['q']) : null;

            $sql = "SELECT * FROM `tanah_bidang` WHERE 1=1";
            $params = [];

            if ($satdikId && $satdikId !== 'ALL') {
                $sql .= " AND `satdik_id` = :satdik_id";
                $params[':satdik_id'] = $satdikId;
            }

            if ($search) {
                $sql .= " AND (`nama_bidang` LIKE :q OR `no_sertifikat` LIKE :q OR `kode_bmn` LIKE :q OR `alamat` LIKE :q)";
                $params[':q'] = "%{$search}%";
            }

            $sql .= " ORDER BY `satdik_id` ASC, `nup` ASC, `created_at` DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $satdikMap = getSatdikMap($pdo);
            $parcels = array_map(fn($r) => formatTanahRow($r, $satdikMap), $rows);

            sendJsonResponse([
                'status' => 'success',
                'total' => count($parcels),
                'data' => $parcels,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal mengambil data bidang tanah: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        if (!$body || empty($body['satdikId']) || empty($body['namaBidang'])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Field satdikId dan namaBidang wajib diisi.',
            ], 400);
        }

        $satdikId = trim($body['satdikId']);
        $namaBidang = trim($body['namaBidang']);
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim($body['id']) : ('TNH-' . $prefix . '-' . time() . '-' . rand(100, 999));

        $kodeBmn = !empty($body['kodeBmn']) ? trim($body['kodeBmn']) : '2.01.01.01.001.0001';
        $nup = isset($body['nup']) ? max(1, (int) $body['nup']) : 1;
        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : 0;
        $luasHa = isset($body['luasHa']) && $body['luasHa'] > 0 ? (float) $body['luasHa'] : round($luasM2 / 10000, 4);
        $statusSertifikat = !empty($body['statusSertifikat']) ? trim($body['statusSertifikat']) : 'Sertifikat Hak Pakai (SHP)';
        $noSertifikat = isset($body['noSertifikat']) ? trim($body['noSertifikat']) : '-';
        $tanggalSertifikat = isset($body['tanggalSertifikat']) ? trim($body['tanggalSertifikat']) : '-';
        $atasNama = !empty($body['atasNama']) ? trim($body['atasNama']) : 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan';
        $peruntukan = !empty($body['peruntukan']) ? trim($body['peruntukan']) : 'Kampus & Fasilitas Akademik';
        $statusPemanfaatan = !empty($body['statusPemanfaatan']) ? trim($body['statusPemanfaatan']) : 'Digunakan Sendiri (Operasional)';
        $alamat = isset($body['alamat']) ? trim($body['alamat']) : '';
        $kota = isset($body['kota']) ? trim($body['kota']) : '';
        $provinsi = isset($body['provinsi']) ? trim($body['provinsi']) : '';
        $tahunPerolehan = isset($body['tahunPerolehan']) ? max(1950, (int) $body['tahunPerolehan']) : 2020;
        $asalPerolehan = !empty($body['asalPerolehan']) ? trim($body['asalPerolehan']) : 'APBN';
        $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : '';
        $fotoSatelit = isset($body['fotoSatelit']) ? trim($body['fotoSatelit']) : '';

        try {
            $stmtIns = $pdo->prepare("
                INSERT INTO `tanah_bidang` (
                    `id`, `satdik_id`, `nama_bidang`, `kode_bmn`, `nup`,
                    `luas_m2`, `luas_ha`, `status_sertifikat`, `no_sertifikat`,
                    `tanggal_sertifikat`, `atas_nama`, `peruntukan`, `status_pemanfaatan`,
                    `alamat`, `kota`, `provinsi`, `tahun_perolehan`, `asal_perolehan`, `keterangan`, `foto_satelit`
                ) VALUES (
                    :id, :satdik_id, :nama_bidang, :kode_bmn, :nup,
                    :luas_m2, :luas_ha, :status_sertifikat, :no_sertifikat,
                    :tanggal_sertifikat, :atas_nama, :peruntukan, :status_pemanfaatan,
                    :alamat, :kota, :provinsi, :tahun_perolehan, :asal_perolehan, :keterangan, :foto_satelit
                )
            ");

            $stmtIns->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':nama_bidang' => $namaBidang,
                ':kode_bmn' => $kodeBmn,
                ':nup' => $nup,
                ':luas_m2' => $luasM2,
                ':luas_ha' => $luasHa,
                ':status_sertifikat' => $statusSertifikat,
                ':no_sertifikat' => $noSertifikat,
                ':tanggal_sertifikat' => $tanggalSertifikat,
                ':atas_nama' => $atasNama,
                ':peruntukan' => $peruntukan,
                ':status_pemanfaatan' => $statusPemanfaatan,
                ':alamat' => $alamat,
                ':kota' => $kota,
                ':provinsi' => $provinsi,
                ':tahun_perolehan' => $tahunPerolehan,
                ':asal_perolehan' => $asalPerolehan,
                ':keterangan' => $keterangan,
                ':foto_satelit' => $fotoSatelit,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `tanah_bidang` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $inserted = $stmtGet->fetch();

            $satdikMap = getSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Bidang tanah berhasil disimpan ke database.',
                'data' => formatTanahRow($inserted, $satdikMap),
            ], 201);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menyimpan bidang tanah: ' . $e->getMessage(),
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
                'message' => 'ID bidang tanah wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT * FROM `tanah_bidang` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Bidang tanah dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $satdikId = isset($body['satdikId']) ? trim($body['satdikId']) : $existing['satdik_id'];
            $namaBidang = isset($body['namaBidang']) ? trim($body['namaBidang']) : $existing['nama_bidang'];
            $kodeBmn = isset($body['kodeBmn']) ? trim($body['kodeBmn']) : $existing['kode_bmn'];
            $nup = isset($body['nup']) ? (int) $body['nup'] : $existing['nup'];
            $luasM2 = isset($body['luasM2']) ? (float) $body['luasM2'] : (float) $existing['luas_m2'];
            $luasHa = isset($body['luasHa']) ? (float) $body['luasHa'] : round($luasM2 / 10000, 4);
            $statusSertifikat = isset($body['statusSertifikat']) ? trim($body['statusSertifikat']) : $existing['status_sertifikat'];
            $noSertifikat = isset($body['noSertifikat']) ? trim($body['noSertifikat']) : $existing['no_sertifikat'];
            $tanggalSertifikat = isset($body['tanggalSertifikat']) ? trim($body['tanggalSertifikat']) : $existing['tanggal_sertifikat'];
            $atasNama = isset($body['atasNama']) ? trim($body['atasNama']) : $existing['atas_nama'];
            $peruntukan = isset($body['peruntukan']) ? trim($body['peruntukan']) : $existing['peruntukan'];
            $statusPemanfaatan = isset($body['statusPemanfaatan']) ? trim($body['statusPemanfaatan']) : $existing['status_pemanfaatan'];
            $alamat = isset($body['alamat']) ? trim($body['alamat']) : $existing['alamat'];
            $kota = isset($body['kota']) ? trim($body['kota']) : $existing['kota'];
            $provinsi = isset($body['provinsi']) ? trim($body['provinsi']) : $existing['provinsi'];
            $tahunPerolehan = isset($body['tahunPerolehan']) ? (int) $body['tahunPerolehan'] : $existing['tahun_perolehan'];
            $asalPerolehan = isset($body['asalPerolehan']) ? trim($body['asalPerolehan']) : $existing['asal_perolehan'];
            $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : $existing['keterangan'];
            $fotoSatelit = isset($body['fotoSatelit']) ? trim($body['fotoSatelit']) : ($existing['foto_satelit'] ?? '');

            $stmtUpd = $pdo->prepare("
                UPDATE `tanah_bidang` SET
                    `satdik_id` = :satdik_id,
                    `nama_bidang` = :nama_bidang,
                    `kode_bmn` = :kode_bmn,
                    `nup` = :nup,
                    `luas_m2` = :luas_m2,
                    `luas_ha` = :luas_ha,
                    `status_sertifikat` = :status_sertifikat,
                    `no_sertifikat` = :no_sertifikat,
                    `tanggal_sertifikat` = :tanggal_sertifikat,
                    `atas_nama` = :atas_nama,
                    `peruntukan` = :peruntukan,
                    `status_pemanfaatan` = :status_pemanfaatan,
                    `alamat` = :alamat,
                    `kota` = :kota,
                    `provinsi` = :provinsi,
                    `tahun_perolehan` = :tahun_perolehan,
                    `asal_perolehan` = :asal_perolehan,
                    `keterangan` = :keterangan,
                    `foto_satelit` = :foto_satelit
                WHERE `id` = :id
            ");

            $stmtUpd->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':nama_bidang' => $namaBidang,
                ':kode_bmn' => $kodeBmn,
                ':nup' => $nup,
                ':luas_m2' => $luasM2,
                ':luas_ha' => $luasHa,
                ':status_sertifikat' => $statusSertifikat,
                ':no_sertifikat' => $noSertifikat,
                ':tanggal_sertifikat' => $tanggalSertifikat,
                ':atas_nama' => $atasNama,
                ':peruntukan' => $peruntukan,
                ':status_pemanfaatan' => $statusPemanfaatan,
                ':alamat' => $alamat,
                ':kota' => $kota,
                ':provinsi' => $provinsi,
                ':tahun_perolehan' => $tahunPerolehan,
                ':asal_perolehan' => $asalPerolehan,
                ':keterangan' => $keterangan,
                ':foto_satelit' => $fotoSatelit,
            ]);

            $stmtGet = $pdo->prepare("SELECT * FROM `tanah_bidang` WHERE `id` = :id");
            $stmtGet->execute([':id' => $id]);
            $updated = $stmtGet->fetch();

            $satdikMap = getSatdikMap($pdo);

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data bidang tanah berhasil diperbarui.',
                'data' => formatTanahRow($updated, $satdikMap),
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal memperbarui bidang tanah: ' . $e->getMessage(),
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
                'message' => 'ID bidang tanah wajib disertakan.',
            ], 400);
        }

        try {
            $stmtCheck = $pdo->prepare("SELECT `id`, `nama_bidang` FROM `tanah_bidang` WHERE `id` = :id");
            $stmtCheck->execute([':id' => $id]);
            $existing = $stmtCheck->fetch();

            if (!$existing) {
                sendJsonResponse([
                    'status' => 'error',
                    'message' => "Bidang tanah dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            $stmtDel = $pdo->prepare("DELETE FROM `tanah_bidang` WHERE `id` = :id");
            $stmtDel->execute([':id' => $id]);

            sendJsonResponse([
                'status' => 'success',
                'message' => "Bidang tanah \"{$existing['nama_bidang']}\" berhasil dihapus.",
                'id' => $id,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menghapus bidang tanah: ' . $e->getMessage(),
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
