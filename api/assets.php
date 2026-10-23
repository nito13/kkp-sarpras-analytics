<?php
// backend/api/assets.php
// REST API CRUD Sarpras KKP

require_once __DIR__ . '/../config/database.php';

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/**
 * Format baris tabel MySQL menjadi camelCase untuk kecocokan penuh dengan React
 */
function formatAssetOutput($row) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'satdikId' => $row['satdik_id'],
        'satdikName' => $row['satdik_name'],
        'prodi' => $row['prodi'] ?? '',
        'category' => $row['category'],
        'condition' => $row['condition'],
        'conditionScore' => (int)($row['condition_score'] ?? 80),
        'acquisitionYear' => (int)($row['acquisition_year'] ?? date('Y')),
        'utilizationRate' => (int)($row['utilization_rate'] ?? 0),
        'capacityDesc' => $row['capacity_desc'] ?? '',
        'specs' => $row['specs'] ?? '',
        'certExpiryDate' => $row['cert_expiry_date'] ?? '',
        'lastMaintenanceDate' => $row['last_maintenance_date'] ?? '',
        'nextMaintenanceDate' => $row['next_maintenance_date'] ?? '',
        'maintenanceUrgency' => $row['maintenance_urgency'] ?? 'Normal',
        'issuesSummary' => $row['issues_summary'] ?? '',
    ];
}

switch ($method) {
    case 'GET':
        $satdikFilter = $_GET['satdik_id'] ?? null;
        $categoryFilter = $_GET['category'] ?? null;
        $id = $_GET['id'] ?? null;

        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                jsonResponse(['status' => 'error', 'message' => 'Aset tidak ditemukan'], 404);
            }
            jsonResponse(['status' => 'success', 'data' => formatAssetOutput($row)]);
        }

        $query = "SELECT * FROM assets WHERE 1=1";
        $params = [];

        if ($satdikFilter && $satdikFilter !== 'ALL') {
            $query .= " AND satdik_id = :satdik_id";
            $params[':satdik_id'] = $satdikFilter;
        }

        if ($categoryFilter && $categoryFilter !== 'ALL') {
            $query .= " AND category = :category";
            $params[':category'] = $categoryFilter;
        }

        $query .= " ORDER BY created_at DESC, id ASC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $formatted = array_map('formatAssetOutput', $rows);
        jsonResponse(['status' => 'success', 'total' => count($formatted), 'data' => $formatted]);
        break;

    case 'POST':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        if (!$input || empty($input['name']) || empty($input['satdikId'])) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Data tidak lengkap. Field name dan satdikId wajib diisi.'
            ], 400);
        }

        // Generate ID jika belum ada
        $id = !empty($input['id']) ? $input['id'] : 'SAR-' . strtoupper(substr($input['satdikId'], 0, 8)) . '-' . rand(100, 999);

        $stmt = $pdo->prepare("
            INSERT INTO assets (
                id, name, satdik_id, satdik_name, prodi, category,
                `condition`, condition_score, acquisition_year, utilization_rate,
                capacity_desc, specs,
                cert_expiry_date, last_maintenance_date, next_maintenance_date,
                maintenance_urgency, issues_summary
            ) VALUES (
                :id, :name, :satdik_id, :satdik_name, :prodi, :category,
                :condition, :condition_score, :acquisition_year, :utilization_rate,
                :capacity_desc, :specs,
                :cert_expiry_date, :last_maintenance_date, :next_maintenance_date,
                :maintenance_urgency, :issues_summary
            )
        ");

        $stmt->execute([
            ':id' => $id,
            ':name' => $input['name'],
            ':satdik_id' => $input['satdikId'],
            ':satdik_name' => $input['satdikName'] ?? '',
            ':prodi' => $input['prodi'] ?? 'Semua Program Studi (Umum)',
            ':category' => $input['category'] ?? 'sarana_pendidikan',
            ':condition' => $input['condition'] ?? 'Baik',
            ':condition_score' => $input['conditionScore'] ?? 90,
            ':acquisition_year' => $input['acquisitionYear'] ?? (int)date('Y'),
            ':utilization_rate' => $input['utilizationRate'] ?? 80,
            ':capacity_desc' => $input['capacityDesc'] ?? '',
            ':specs' => $input['specs'] ?? '',
            ':cert_expiry_date' => !empty($input['certExpiryDate']) ? $input['certExpiryDate'] : null,
            ':last_maintenance_date' => !empty($input['lastMaintenanceDate']) ? $input['lastMaintenanceDate'] : date('Y-m-d'),
            ':next_maintenance_date' => !empty($input['nextMaintenanceDate']) ? $input['nextMaintenanceDate'] : date('Y-m-d', strtotime('+6 months')),
            ':maintenance_urgency' => $input['maintenanceUrgency'] ?? 'Normal',
            ':issues_summary' => $input['issuesSummary'] ?? '',
        ]);

        // Ambil data yang baru dibuat
        $stmtGet = $pdo->prepare("SELECT * FROM assets WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $created = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Aset berhasil ditambahkan ke database MySQL',
            'data' => formatAssetOutput($created)
        ], 201);
        break;

    case 'PUT':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        $id = $_GET['id'] ?? ($input['id'] ?? null);

        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID aset diperlukan'], 400);
        }

        // Cek keberadaan aset
        $checkStmt = $pdo->prepare("SELECT * FROM assets WHERE id = :id");
        $checkStmt->execute([':id' => $id]);
        $existing = $checkStmt->fetch();

        if (!$existing) {
            jsonResponse(['status' => 'error', 'message' => 'Aset tidak ditemukan'], 404);
        }

        // Siapkan field update
        $fields = [];
        $params = [':id' => $id];

        $allowedKeys = [
            'name' => 'name',
            'satdikId' => 'satdik_id',
            'satdikName' => 'satdik_name',
            'prodi' => 'prodi',
            'category' => 'category',
            'condition' => 'condition',
            'conditionScore' => 'condition_score',
            'acquisitionYear' => 'acquisition_year',
            'utilizationRate' => 'utilization_rate',
            'capacityDesc' => 'capacity_desc',
            'specs' => 'specs',
            'certExpiryDate' => 'cert_expiry_date',
            'lastMaintenanceDate' => 'last_maintenance_date',
            'nextMaintenanceDate' => 'next_maintenance_date',
            'maintenanceUrgency' => 'maintenance_urgency',
            'issuesSummary' => 'issues_summary',
        ];

        foreach ($allowedKeys as $jsonKey => $dbCol) {
            if (isset($input[$jsonKey])) {
                $fields[] = "`$dbCol` = :$dbCol";
                $val = $input[$jsonKey];
                // Penyesuaian nilai kosong untuk tanggal
                if (str_ends_with($dbCol, '_date') && empty($val)) {
                    $val = null;
                }
                $params[":$dbCol"] = $val;
            }
        }

        if (empty($fields)) {
            jsonResponse(['status' => 'error', 'message' => 'Tidak ada field yang diperbarui'], 400);
        }

        $sql = "UPDATE assets SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmtUpdate = $pdo->prepare($sql);
        $stmtUpdate->execute($params);

        // Ambil data terbaru
        $stmtGet = $pdo->prepare("SELECT * FROM assets WHERE id = :id");
        $stmtGet->execute([':id' => $id]);
        $updated = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Aset berhasil diperbarui di database MySQL',
            'data' => formatAssetOutput($updated)
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            jsonResponse(['status' => 'error', 'message' => 'Parameter ID aset diperlukan'], 400);
        }

        $stmtDelete = $pdo->prepare("DELETE FROM assets WHERE id = :id");
        $stmtDelete->execute([':id' => $id]);

        if ($stmtDelete->rowCount() > 0) {
            jsonResponse(['status' => 'success', 'message' => 'Aset berhasil dihapus dari database MySQL']);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Aset tidak ditemukan atau sudah terhapus'], 404);
        }
        break;

    default:
        jsonResponse(['status' => 'error', 'message' => 'Metode HTTP tidak didukung'], 405);
        break;
}
