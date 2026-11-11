<?php
// APIs/asrama.php
// REST API CRUD Ketersediaan Ruang Asrama Taruna per Satdik
// GET    APIs/asrama.php                 -> { status: 'success', meta, summary: [...], buildings: [...] }
// GET    APIs/asrama.php?satdik_id=xxx    -> difilter untuk satu Satdik
// GET    APIs/asrama.php?id=xxx           -> detail satu gedung asrama
// POST   APIs/asrama.php                 -> Tambah gedung asrama baru
// PUT    APIs/asrama.php?id=xxx          -> Perbarui data gedung asrama
// DELETE APIs/asrama.php?id=xxx          -> Hapus gedung asrama

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$toNullableFloat = function ($v) {
    return $v === null ? null : (float)$v;
};

/**
 * Format satu baris gedung asrama
 */
function formatBuildingOutput(array $r): array {
    return [
        'id' => $r['id'],
        'satdikId' => $r['satdik_id'],
        'kampus' => $r['kampus'] ?? '',
        'nama' => $r['nama'],
        'peruntukan' => $r['peruntukan'] ?? '',
        'jumlahKamar' => (int)($r['jumlah_kamar'] ?? 0),
        'luasM2' => (float)($r['luas_m2'] ?? 0),
        'kapasitas' => (float)($r['kapasitas'] ?? 0),
        'status' => $r['status'] ?? 'Digunakan',
        'keterangan' => $r['keterangan'] ?? '',
        'rincian' => !empty($r['rincian_json']) ? json_decode($r['rincian_json'], true) : [],
    ];
}

/**
 * Format satu baris summary / rekap asrama
 */
function formatRekapOutput(array $r, callable $toNullableFloat): array {
    return [
        'satdikId' => $r['satdik_id'],
        'namaExcel' => $r['nama_excel'] ?? '',
        'jumlahAsrama' => (int)($r['jumlah_asrama'] ?? 0),
        'jumlahKamar' => (int)($r['jumlah_kamar'] ?? 0),
        'luasM2' => (float)($r['luas_m2'] ?? 0),
        'kapasitas' => (float)($r['kapasitas'] ?? 0),
        'kapasitasAktif' => (float)($r['kapasitas_aktif'] ?? 0),
        'luasAdjustment' => $toNullableFloat($r['luas_adjustment'] ?? null),
        'kapasitasAdjustment' => $toNullableFloat($r['kapasitas_adjustment'] ?? null),
        'jumlahTidakDipakai' => (int)($r['jumlah_tidak_dipakai'] ?? 0),
        'jumlahPerluRenovasi' => (int)($r['jumlah_perlu_renovasi'] ?? 0),
        'keterangan' => $r['keterangan'] ?? '',
        'driveUrl' => $r['drive_url'] ?? '',
    ];
}

/**
 * Rekalkulasi otomatis asrama_rekap berdasarkan agregasi asrama_gedung
 */
function recalculateAsramaRekap(PDO $pdo, string $satdikId, callable $toNullableFloat): ?array {
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as jumlah_asrama,
            COALESCE(SUM(jumlah_kamar), 0) as jumlah_kamar,
            COALESCE(SUM(luas_m2), 0) as luas_m2,
            COALESCE(SUM(kapasitas), 0) as kapasitas,
            COALESCE(SUM(CASE WHEN status = 'Digunakan' THEN kapasitas ELSE 0 END), 0) as kapasitas_aktif,
            COALESCE(SUM(CASE WHEN status = 'Tidak Digunakan' THEN 1 ELSE 0 END), 0) as jumlah_tidak_dipakai,
            COALESCE(SUM(CASE WHEN status = 'Perlu Renovasi' THEN 1 ELSE 0 END), 0) as jumlah_perlu_renovasi
        FROM asrama_gedung
        WHERE satdik_id = :sid
    ");
    $stmt->execute([':sid' => $satdikId]);
    $agg = $stmt->fetch();

    if (!$agg) {
        return null;
    }

    $checkStmt = $pdo->prepare("SELECT * FROM asrama_rekap WHERE satdik_id = :sid");
    $checkStmt->execute([':sid' => $satdikId]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        $updateStmt = $pdo->prepare("
            UPDATE asrama_rekap
            SET jumlah_asrama = :ja,
                jumlah_kamar = :jk,
                luas_m2 = :luas,
                kapasitas = :kap,
                kapasitas_aktif = :ka,
                jumlah_tidak_dipakai = :jtd,
                jumlah_perlu_renovasi = :jpr
            WHERE satdik_id = :sid
        ");
        $updateStmt->execute([
            ':ja' => (int)$agg['jumlah_asrama'],
            ':jk' => (int)$agg['jumlah_kamar'],
            ':luas' => (float)$agg['luas_m2'],
            ':kap' => (float)$agg['kapasitas'],
            ':ka' => (float)$agg['kapasitas_aktif'],
            ':jtd' => (int)$agg['jumlah_tidak_dipakai'],
            ':jpr' => (int)$agg['jumlah_perlu_renovasi'],
            ':sid' => $satdikId,
        ]);
    } else {
        $nameStmt = $pdo->prepare("SELECT name, short_name FROM satdik WHERE id = :sid");
        $nameStmt->execute([':sid' => $satdikId]);
        $sRow = $nameStmt->fetch();
        $namaExcel = $sRow ? ($sRow['short_name'] ?: $sRow['name']) : $satdikId;

        $insertStmt = $pdo->prepare("
            INSERT INTO asrama_rekap (
                satdik_id, nama_excel, jumlah_asrama, jumlah_kamar, luas_m2, 
                kapasitas, kapasitas_aktif, jumlah_tidak_dipakai, jumlah_perlu_renovasi, 
                sumber, tanggal_data
            ) VALUES (
                :sid, :nama_excel, :ja, :jk, :luas, :kap, :ka, :jtd, :jpr, 'SIM-SARPRAS Input', CURRENT_DATE
            )
        ");
        $insertStmt->execute([
            ':sid' => $satdikId,
            ':nama_excel' => $namaExcel,
            ':ja' => (int)$agg['jumlah_asrama'],
            ':jk' => (int)$agg['jumlah_kamar'],
            ':luas' => (float)$agg['luas_m2'],
            ':kap' => (float)$agg['kapasitas'],
            ':ka' => (float)$agg['kapasitas_aktif'],
            ':jtd' => (int)$agg['jumlah_tidak_dipakai'],
            ':jpr' => (int)$agg['jumlah_perlu_renovasi'],
        ]);
    }

    $checkStmt->execute([':sid' => $satdikId]);
    $rekapRow = $checkStmt->fetch();

    return $rekapRow ? formatRekapOutput($rekapRow, $toNullableFloat) : null;
}

switch ($method) {
    case 'GET':
        $singleId = $_GET['id'] ?? null;
        if ($singleId) {
            $stmt = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $singleId]);
            $row = $stmt->fetch();
            if (!$row) {
                jsonResponse(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan'], 404);
            }
            jsonResponse(['status' => 'success', 'data' => formatBuildingOutput($row)]);
        }

        $satdikFilter = $_GET['satdik_id'] ?? null;
        $hasFilter = $satdikFilter && $satdikFilter !== 'ALL';

        $sqlRekap = "SELECT * FROM asrama_rekap" . ($hasFilter ? " WHERE satdik_id = :sid" : "") . " ORDER BY satdik_id";
        $sqlGedung = "SELECT * FROM asrama_gedung" . ($hasFilter ? " WHERE satdik_id = :sid" : "") . " ORDER BY satdik_id, id";
        $params = $hasFilter ? [':sid' => $satdikFilter] : [];

        $stmt = $pdo->prepare($sqlRekap);
        $stmt->execute($params);
        $rekapRows = $stmt->fetchAll();

        $stmt = $pdo->prepare($sqlGedung);
        $stmt->execute($params);
        $gedungRows = $stmt->fetchAll();

        $summary = array_map(function ($r) use ($toNullableFloat) {
            return formatRekapOutput($r, $toNullableFloat);
        }, $rekapRows);

        $buildings = array_map('formatBuildingOutput', $gedungRows);

        $meta = null;
        if (!empty($rekapRows)) {
            $meta = [
                'sumber' => $rekapRows[0]['sumber'] ?? '',
                'tanggalData' => $rekapRows[0]['tanggal_data'] ?? '',
                'standarRuang' => '4 m² per orang',
                'jumlahSatdik' => count($summary),
                'jumlahGedung' => count($buildings),
            ];
        }

        jsonResponse([
            'status' => 'success',
            'meta' => $meta,
            'summary' => $summary,
            'buildings' => $buildings,
        ]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['nama']) || empty($input['satdikId'])) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Data tidak lengkap. Field nama gedung dan satdikId wajib diisi.'
            ], 400);
        }

        $satdikId = trim($input['satdikId']);
        $nama = trim($input['nama']);
        $kampus = !empty($input['kampus']) ? trim($input['kampus']) : 'Kampus Utama';
        $peruntukan = !empty($input['peruntukan']) ? trim($input['peruntukan']) : 'Putra';
        $jumlahKamar = isset($input['jumlahKamar']) ? (int)$input['jumlahKamar'] : 0;
        $luasM2 = isset($input['luasM2']) ? (float)$input['luasM2'] : 0;
        
        // Estimasi kapasitas default jika 0: 1 orang per 4 m²
        $kapasitas = isset($input['kapasitas']) && (float)$input['kapasitas'] > 0
            ? (float)$input['kapasitas']
            : ($luasM2 > 0 ? floor($luasM2 / 4) : 0);
            
        $status = !empty($input['status']) ? trim($input['status']) : 'Digunakan';
        $keterangan = !empty($input['keterangan']) ? trim($input['keterangan']) : '';
        $cleanRincian = [];
        if (!empty($input['rincian']) && is_array($input['rincian'])) {
            foreach ($input['rincian'] as $rc) {
                $cleanRincian[] = [
                    'label' => trim($rc['label'] ?? ''),
                    'ukuran' => trim($rc['ukuran'] ?? '-'),
                    'jumlah' => (int)($rc['jumlah'] ?? 0),
                    'luasM2' => (float)($rc['luasM2'] ?? 0),
                    'kapasitas' => (float)($rc['kapasitas'] ?? 0),
                ];
            }
        }
        $rincianJson = !empty($cleanRincian) ? json_encode($cleanRincian, JSON_UNESCAPED_UNICODE) : null;

        // Generate ID jika belum ada
        if (!empty($input['id'])) {
            $id = trim($input['id']);
        } else {
            $cleanCode = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', str_replace(['poltek-', 'supm-', 'akkp-', 'kp-'], '', $satdikId)));
            $cleanCode = substr($cleanCode, 0, 4) ?: 'ASR';
            do {
                $id = 'ASR-' . $cleanCode . '-' . rand(100, 999);
                $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM asrama_gedung WHERE id = :id");
                $stmtCheck->execute([':id' => $id]);
            } while ((int)$stmtCheck->fetchColumn() > 0);
        }

        $stmtInsert = $pdo->prepare("
            INSERT INTO asrama_gedung (
                id, satdik_id, kampus, nama, peruntukan,
                jumlah_kamar, luas_m2, kapasitas, status,
                keterangan, rincian_json
            ) VALUES (
                :id, :satdik_id, :kampus, :nama, :peruntukan,
                :jumlah_kamar, :luas_m2, :kapasitas, :status,
                :keterangan, :rincian_json
            )
        ");

        $stmtInsert->execute([
            ':id' => $id,
            ':satdik_id' => $satdikId,
            ':kampus' => $kampus,
            ':nama' => $nama,
            ':peruntukan' => $peruntukan,
            ':jumlah_kamar' => $jumlahKamar,
            ':luas_m2' => $luasM2,
            ':kapasitas' => $kapasitas,
            ':status' => $status,
            ':keterangan' => $keterangan,
            ':rincian_json' => $rincianJson,
        ]);

        // Rekalkulasi rekap Satdik
        $updatedSummaryRow = recalculateAsramaRekap($pdo, $satdikId, $toNullableFloat);

        // Ambil data gedung yang baru dibuat
        $stmtGet = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $createdBuilding = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Gedung asrama berhasil ditambahkan.',
            'data' => formatBuildingOutput($createdBuilding),
            'summaryRow' => $updatedSummaryRow,
        ], 201);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID gedung asrama diperlukan.'], 400);
        }

        $stmtCheck = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id");
        $stmtCheck->execute([':id' => $id]);
        $existing = $stmtCheck->fetch();

        if (!$existing) {
            jsonResponse(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan.'], 404);
        }

        $oldSatdikId = $existing['satdik_id'];
        $newSatdikId = !empty($input['satdikId']) ? trim($input['satdikId']) : $oldSatdikId;

        $fields = [];
        $params = [':id' => $id];

        $mapping = [
            'satdikId' => ['col' => 'satdik_id', 'type' => 'string'],
            'kampus' => ['col' => 'kampus', 'type' => 'string'],
            'nama' => ['col' => 'nama', 'type' => 'string'],
            'peruntukan' => ['col' => 'peruntukan', 'type' => 'string'],
            'jumlahKamar' => ['col' => 'jumlah_kamar', 'type' => 'int'],
            'luasM2' => ['col' => 'luas_m2', 'type' => 'float'],
            'kapasitas' => ['col' => 'kapasitas', 'type' => 'float'],
            'status' => ['col' => 'status', 'type' => 'string'],
            'keterangan' => ['col' => 'keterangan', 'type' => 'string'],
        ];

        foreach ($mapping as $key => $meta) {
            if (isset($input[$key])) {
                $col = $meta['col'];
                $val = $input[$key];
                if ($meta['type'] === 'int') $val = (int)$val;
                elseif ($meta['type'] === 'float') $val = (float)$val;
                else $val = trim((string)$val);
                
                $fields[] = "`$col` = :$col";
                $params[":$col"] = $val;
            }
        }

        if (isset($input['rincian'])) {
            $cleanRincian = [];
            if (!empty($input['rincian']) && is_array($input['rincian'])) {
                foreach ($input['rincian'] as $rc) {
                    $cleanRincian[] = [
                        'label' => trim($rc['label'] ?? ''),
                        'ukuran' => trim($rc['ukuran'] ?? '-'),
                        'jumlah' => (int)($rc['jumlah'] ?? 0),
                        'luasM2' => (float)($rc['luasM2'] ?? 0),
                        'kapasitas' => (float)($rc['kapasitas'] ?? 0),
                    ];
                }
            }
            $fields[] = "`rincian_json` = :rincian_json";
            $params[':rincian_json'] = !empty($cleanRincian) ? json_encode($cleanRincian, JSON_UNESCAPED_UNICODE) : null;
        }

        if (empty($fields)) {
            jsonResponse(['status' => 'error', 'message' => 'Tidak ada field yang diperbarui.'], 400);
        }

        $sqlUpdate = "UPDATE asrama_gedung SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmtUpdate = $pdo->prepare($sqlUpdate);
        $stmtUpdate->execute($params);

        // Rekalkulasi rekap
        $updatedSummaryRow = recalculateAsramaRekap($pdo, $newSatdikId, $toNullableFloat);
        if ($oldSatdikId !== $newSatdikId) {
            recalculateAsramaRekap($pdo, $oldSatdikId, $toNullableFloat);
        }

        $stmtGet = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $updatedBuilding = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Data gedung asrama berhasil diperbarui.',
            'data' => formatBuildingOutput($updatedBuilding),
            'summaryRow' => $updatedSummaryRow,
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID gedung asrama diperlukan.'], 400);
        }

        $stmtCheck = $pdo->prepare("SELECT * FROM asrama_gedung WHERE id = :id");
        $stmtCheck->execute([':id' => $id]);
        $existing = $stmtCheck->fetch();

        if (!$existing) {
            jsonResponse(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan atau sudah terhapus.'], 404);
        }

        $satdikId = $existing['satdik_id'];

        $stmtDelete = $pdo->prepare("DELETE FROM asrama_gedung WHERE id = :id");
        $stmtDelete->execute([':id' => $id]);

        $updatedSummaryRow = recalculateAsramaRekap($pdo, $satdikId, $toNullableFloat);

        jsonResponse([
            'status' => 'success',
            'message' => 'Gedung asrama berhasil dihapus.',
            'deletedId' => $id,
            'summaryRow' => $updatedSummaryRow,
        ]);
        break;

    default:
        jsonResponse(['status' => 'error', 'message' => 'Metode HTTP tidak didukung.'], 405);
        break;
}
