<?php
/**
 * ============================================================================
 * REST API ENDPOINT: LOG INPUT DATABASE & LOG PENGHAPUSAN DATA (KHUSUS ADMIN)
 * ============================================================================
 * Path: APIs/audit_logs.php
 *
 * Metode yang didukung:
 * - GET    /APIs/audit_logs.php                     -> Ambil seluruh daftar log input & hapus data + statistik
 * - GET    /APIs/audit_logs.php?action_type=INPUT   -> Filter log input database (CREATE, UPDATE, BULK_IMPORT)
 * - GET    /APIs/audit_logs.php?action_type=DELETE  -> Filter log penghapusan data (DELETE)
 * - POST   /APIs/audit_logs.php                     -> Catat log aktivitas input/penghapusan baru ke MySQL
 * - DELETE /APIs/audit_logs.php?id=X                -> Hapus 1 baris log tertentu
 * - DELETE /APIs/audit_logs.php?mode=clear          -> Bersihkan catatan log
 * ============================================================================
 */

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

ensureAuditLogTable($pdo);

/**
 * Format satu baris audit_logs ke struktur camelCase JSON untuk Frontend
 */
function formatAuditLogRow(array $row): array {
    $payload = null;
    if (!empty($row['payload_json'])) {
        $decoded = json_decode($row['payload_json'], true);
        $payload = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $row['payload_json'];
    }

    return [
        'id' => $row['id'],
        'actionType' => $row['action_type'] ?? 'INPUT',
        'operation' => $row['operation'] ?? 'CREATE',
        'module' => $row['module'] ?? 'umum',
        'tableName' => $row['table_name'] ?? '-',
        'recordId' => $row['record_id'] ?? '-',
        'recordName' => $row['record_name'] ?? '-',
        'satdikId' => $row['satdik_id'] ?? 'ALL',
        'satdikName' => $row['satdik_name'] ?? '-',
        'actorId' => $row['actor_id'] ?? 'USR-ADMIN',
        'actorName' => $row['actor_name'] ?? 'Administrator Sistem',
        'actorEmail' => $row['actor_email'] ?? 'administrator@kkp.go.id',
        'actorRole' => $row['actor_role'] ?? 'Administrator Utama',
        'summary' => $row['summary'] ?? '',
        'payload' => $payload,
        'ipAddress' => $row['ip_address'] ?? '127.0.0.1',
        'createdAt' => $row['created_at'] ?? date('Y-m-d H:i:s'),
    ];
}

/**
 * Inisialisasi data awal audit_logs apabila tabel baru pertama kali dibuat
 */
function seedInitialAuditLogsIfNeeded(PDO $pdo): void {
    try {
        $count = (int)$pdo->query("SELECT COUNT(*) FROM `audit_logs`")->fetchColumn();
        if ($count > 0) {
            return;
        }

        $initialLogs = [
            [
                'id' => 'LOG-INP-INIT-001',
                'action_type' => 'INPUT',
                'operation' => 'CREATE',
                'module' => 'tanah',
                'table_name' => 'tanah_bidang',
                'record_id' => 'TNH-AUP-001',
                'record_name' => 'Lahan Kampus Utama Pasar Minggu (Politeknik AUP)',
                'satdik_id' => 'poltek-aup',
                'satdik_name' => 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
                'actor_id' => 'USR-SAT-01',
                'actor_name' => 'Admin Sarpras Politeknik AUP Jakarta',
                'actor_email' => 'sarpras.aup@kkp.go.id',
                'actor_role' => 'Operator Satdik — Politeknik AUP',
                'summary' => 'Input data bidang tanah BMN baru: Lahan Kampus Utama Pasar Minggu seluas 78.500 m² (Sertifikat Hak Pakai).',
                'payload_json' => json_encode([
                    'id' => 'TNH-AUP-001',
                    'satdikId' => 'poltek-aup',
                    'satdikName' => 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta',
                    'namaBidang' => 'Lahan Kampus Utama Pasar Minggu (Politeknik AUP)',
                    'kodeBmn' => '2.01.01.01.001.0001',
                    'nup' => 1,
                    'luasM2' => 78500,
                    'luasHa' => 7.85,
                    'statusSertifikat' => 'Sertifikat Hak Pakai (SHP)',
                    'peruntukan' => 'Kampus & Fasilitas Akademik',
                    'statusPemanfaatan' => 'Digunakan Sendiri (Operasional)'
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 7200)
            ],
            [
                'id' => 'LOG-INP-INIT-002',
                'action_type' => 'INPUT',
                'operation' => 'CREATE',
                'module' => 'asrama',
                'table_name' => 'asrama_gedung',
                'record_id' => 'ASR-SDJ-001',
                'record_name' => 'Gedung Asrama Taruna Putra Blok A',
                'satdik_id' => 'poltek-kp-sidoarjo',
                'satdik_name' => 'Politeknik Kelautan dan Perikanan Sidoarjo',
                'actor_id' => 'USR-SAT-02',
                'actor_name' => 'Admin Sarpras Politeknik KP Sidoarjo',
                'actor_email' => 'sarpras.sidoarjo@kkp.go.id',
                'actor_role' => 'Operator Satdik — Poltek KP Sidoarjo',
                'summary' => 'Input data gedung asrama: Gedung Asrama Taruna Putra Blok A (24 kamar, luas 540 m², kapasitas 120 taruna).',
                'payload_json' => json_encode([
                    'id' => 'ASR-SDJ-001',
                    'satdikId' => 'poltek-kp-sidoarjo',
                    'kampus' => 'Kampus Utama',
                    'nama' => 'Gedung Asrama Taruna Putra Blok A',
                    'peruntukan' => 'Putra',
                    'jumlahKamar' => 24,
                    'luasM2' => 540,
                    'kapasitas' => 120,
                    'status' => 'Digunakan'
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 5400)
            ],
            [
                'id' => 'LOG-INP-INIT-003',
                'action_type' => 'INPUT',
                'operation' => 'UPDATE',
                'module' => 'kapal',
                'table_name' => 'kapal_latih',
                'record_id' => 'KPL-BTG-001',
                'record_name' => 'KM. Madidihang 03',
                'satdik_id' => 'poltek-kp-bitung',
                'satdik_name' => 'Politeknik Kelautan dan Perikanan Bitung',
                'actor_id' => 'USR-001',
                'actor_name' => 'Admin Sarpras Pusdik KP',
                'actor_email' => 'admin.pusdik@kkp.go.id',
                'actor_role' => 'Admin Pusat (Pusdik KP)',
                'summary' => 'Mengubah 3 bagian data pada Kapal Latih "KM. Madidihang 03": Tonase Kapal (118 GT → 125 GT), Jumlah ABK (16 Orang → 18 Orang), Status BMN (Dalam Pemeliharaan → Terdaftar BMN Aktif Operasional).',
                'payload_json' => json_encode([
                    'id' => 'KPL-BTG-001',
                    'satdikId' => 'poltek-kp-bitung',
                    'namaKapal' => 'KM. Madidihang 03',
                    'tahunPerolehan' => 2018,
                    'tonageGt' => 125,
                    'panjangKapal' => 28.5,
                    'jumlahAbk' => 18,
                    'jenisKapal' => 'Kapal Latih Purse Seine / Longline',
                    'statusBmn' => 'Terdaftar BMN (Aktif Operasional)',
                    '_before' => [
                        'id' => 'KPL-BTG-001',
                        'satdikId' => 'poltek-kp-bitung',
                        'namaKapal' => 'KM. Madidihang 03',
                        'tahunPerolehan' => 2018,
                        'tonageGt' => 118,
                        'panjangKapal' => 28.5,
                        'jumlahAbk' => 16,
                        'jenisKapal' => 'Kapal Latih Purse Seine / Longline',
                        'statusBmn' => 'Dalam Pemeliharaan / Docking'
                    ],
                    '_after' => [
                        'id' => 'KPL-BTG-001',
                        'satdikId' => 'poltek-kp-bitung',
                        'namaKapal' => 'KM. Madidihang 03',
                        'tahunPerolehan' => 2018,
                        'tonageGt' => 125,
                        'panjangKapal' => 28.5,
                        'jumlahAbk' => 18,
                        'jenisKapal' => 'Kapal Latih Purse Seine / Longline',
                        'statusBmn' => 'Terdaftar BMN (Aktif Operasional)'
                    ],
                    '_changes' => [
                        ['field' => 'tonageGt', 'label' => 'Tonase Kapal (GT)', 'before' => '118 GT', 'after' => '125 GT'],
                        ['field' => 'jumlahAbk', 'label' => 'Jumlah ABK / Awak', 'before' => '16 Orang', 'after' => '18 Orang'],
                        ['field' => 'statusBmn', 'label' => 'Status BMN', 'before' => 'Dalam Pemeliharaan / Docking', 'after' => 'Terdaftar BMN (Aktif Operasional)']
                    ]
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 3600)
            ],
            [
                'id' => 'LOG-DEL-INIT-001',
                'action_type' => 'DELETE',
                'operation' => 'DELETE',
                'module' => 'tambak',
                'table_name' => 'tambak_unit',
                'record_id' => 'TBK-KRW-OLD-99',
                'record_name' => 'Kolam Percobaan Air Tawar Lama Unit 99 (Duplikat)',
                'satdik_id' => 'poltek-kp-karawang',
                'satdik_name' => 'Politeknik Kelautan dan Perikanan Karawang',
                'actor_id' => 'USR-SAT-05',
                'actor_name' => 'Admin Sarpras Politeknik KP Karawang',
                'actor_email' => 'sarpras.karawang@kkp.go.id',
                'actor_role' => 'Operator Satdik — Poltek KP Karawang',
                'summary' => 'Menghapus data unit tambak/kolam duplikat: Kolam Percobaan Air Tawar Lama Unit 99 (Luas 250 m², Rusak Berat).',
                'payload_json' => json_encode([
                    'id' => 'TBK-KRW-OLD-99',
                    'satdikId' => 'poltek-kp-karawang',
                    'namaSatdik' => 'Politeknik Kelautan dan Perikanan Karawang',
                    'noUrut' => 99,
                    'nama' => 'Kolam Percobaan Air Tawar Lama Unit 99 (Duplikat)',
                    'jenis' => 'Kolam',
                    'kampusLokasi' => 'Kampus Utama Karawang',
                    'luasM2' => 250,
                    'kondisi' => 'Rusak Berat',
                    'fungsi' => 'Budidaya Ikan Air Tawar',
                    'statusOperasional' => 'Belum Dimanfaatkan',
                    'pelataran' => 'Tanah',
                    'pelataranKategori' => 'Tanah',
                    'jumlahKincir' => 0,
                    'keterangan' => 'Data duplikat hasil survei lama yang telah digabung'
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 2400)
            ],
            [
                'id' => 'LOG-DEL-INIT-002',
                'action_type' => 'DELETE',
                'operation' => 'DELETE',
                'module' => 'gedung',
                'table_name' => 'gedung_bangunan',
                'record_id' => 'GDG-DUM-OLD-04',
                'record_name' => 'Gudang Peralatan Praktik Lama (Eks Bangunan Sementara)',
                'satdik_id' => 'poltek-kp-dumai',
                'satdik_name' => 'Politeknik Kelautan dan Perikanan Dumai',
                'actor_id' => 'USR-001',
                'actor_name' => 'Admin Sarpras Pusdik KP',
                'actor_email' => 'admin.pusdik@kkp.go.id',
                'actor_role' => 'Admin Pusat (Pusdik KP)',
                'summary' => 'Menghapus data gedung lama karena telah dibongkar/direvitalisasi menjadi Workshop Permesinan Perikanan.',
                'payload_json' => json_encode([
                    'id' => 'GDG-DUM-OLD-04',
                    'satdikId' => 'poltek-kp-dumai',
                    'satdikName' => 'Politeknik Kelautan dan Perikanan Dumai',
                    'kampus' => 'Kampus Utama',
                    'jenisGedung' => 'Gedung Workshop / Bengkel Latih',
                    'jumlah' => 1,
                    'namaGedung' => 'Gudang Peralatan Praktik Lama (Eks Bangunan Sementara)',
                    'jumlahLantai' => 1,
                    'luasM2' => 180
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 1200)
            ],
            [
                'id' => 'LOG-INP-INIT-004',
                'action_type' => 'INPUT',
                'operation' => 'BULK_IMPORT',
                'module' => 'standar',
                'table_name' => 'standar_item',
                'record_id' => 'BATCH-STD-2026',
                'record_name' => 'Sinkronisasi Master Database Sarpras 18 Satdik KKP',
                'satdik_id' => 'ALL',
                'satdik_name' => 'Seluruh Satdik (Nasional)',
                'actor_id' => 'USR-ADMIN',
                'actor_name' => 'Super Administrator Sistem Sarpras KP',
                'actor_email' => 'administrator@kkp.go.id',
                'actor_role' => 'Administrator Utama (Full Control)',
                'summary' => 'Inisialisasi & verifikasi integritas database nasional (Tanah, Gedung, Asrama, Pembelajaran, Tambak, Kapal Latih, & Standar Prodi).',
                'payload_json' => json_encode([
                    'batchId' => 'BATCH-STD-2026',
                    'totalSatdik' => 18,
                    'modulesVerified' => ['tanah_bidang', 'gedung_bangunan', 'asrama_gedung', 'tambak_unit', 'kapal_latih', 'standar_item'],
                    'status' => 'Terverifikasi Normal (ACID)'
                ], JSON_UNESCAPED_UNICODE),
                'created_at' => date('Y-m-d H:i:s', time() - 600)
            ]
        ];

        $stmt = $pdo->prepare("
            INSERT IGNORE INTO `audit_logs` (
                `id`, `action_type`, `operation`, `module`, `table_name`,
                `record_id`, `record_name`, `satdik_id`, `satdik_name`,
                `actor_id`, `actor_name`, `actor_email`, `actor_role`,
                `summary`, `payload_json`, `ip_address`, `created_at`
            ) VALUES (
                :id, :action_type, :operation, :module, :table_name,
                :record_id, :record_name, :satdik_id, :satdik_name,
                :actor_id, :actor_name, :actor_email, :actor_role,
                :summary, :payload_json, '127.0.0.1', :created_at
            )
        ");

        foreach ($initialLogs as $row) {
            $stmt->execute([
                ':id' => $row['id'],
                ':action_type' => $row['action_type'],
                ':operation' => $row['operation'],
                ':module' => $row['module'],
                ':table_name' => $row['table_name'],
                ':record_id' => $row['record_id'],
                ':record_name' => $row['record_name'],
                ':satdik_id' => $row['satdik_id'],
                ':satdik_name' => $row['satdik_name'],
                ':actor_id' => $row['actor_id'],
                ':actor_name' => $row['actor_name'],
                ':actor_email' => $row['actor_email'],
                ':actor_role' => $row['actor_role'],
                ':summary' => $row['summary'],
                ':payload_json' => $row['payload_json'],
                ':created_at' => $row['created_at'],
            ]);
        }
    } catch (Throwable $e) {
        // Abaikan jika gagal seed awal
    }
}

seedInitialAuditLogsIfNeeded($pdo);

switch ($method) {
    case 'GET':
        try {
            $actionType = isset($_GET['action_type']) ? strtoupper(trim($_GET['action_type'])) : 'ALL';
            $operation = isset($_GET['operation']) ? strtoupper(trim($_GET['operation'])) : 'ALL';
            $module = isset($_GET['module']) ? strtolower(trim($_GET['module'])) : 'ALL';
            $satdikId = isset($_GET['satdik_id']) ? trim($_GET['satdik_id']) : 'ALL';
            $search = isset($_GET['q']) ? trim($_GET['q']) : '';
            $limit = isset($_GET['limit']) ? max(10, min(2000, (int)$_GET['limit'])) : 500;

            $sql = "SELECT * FROM `audit_logs` WHERE 1=1";
            $params = [];

            if ($actionType && $actionType !== 'ALL') {
                $sql .= " AND `action_type` = :action_type";
                $params[':action_type'] = $actionType;
            }
            if ($operation && $operation !== 'ALL') {
                $sql .= " AND `operation` = :operation";
                $params[':operation'] = $operation;
            }
            if ($module && $module !== 'ALL' && $module !== 'all') {
                $sql .= " AND `module` = :module";
                $params[':module'] = $module;
            }
            if ($satdikId && $satdikId !== 'ALL') {
                $sql .= " AND `satdik_id` = :satdik_id";
                $params[':satdik_id'] = $satdikId;
            }
            if ($search !== '') {
                $sql .= " AND (`record_name` LIKE :q OR `record_id` LIKE :q OR `summary` LIKE :q OR `actor_name` LIKE :q OR `actor_email` LIKE :q OR `table_name` LIKE :q OR `satdik_name` LIKE :q)";
                $params[':q'] = "%{$search}%";
            }

            $sql .= " ORDER BY `created_at` DESC, `id` DESC LIMIT " . (int)$limit;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $formatted = array_map('formatAuditLogRow', $rows);

            // Hitung ringkasan statistik menyeluruh dari tabel audit_logs
            $stmtAll = $pdo->query("
                SELECT 
                    COUNT(*) AS total,
                    COALESCE(SUM(CASE WHEN action_type = 'INPUT' THEN 1 ELSE 0 END), 0) AS input_count,
                    COALESCE(SUM(CASE WHEN action_type = 'DELETE' THEN 1 ELSE 0 END), 0) AS delete_count,
                    COALESCE(SUM(CASE WHEN operation = 'CREATE' THEN 1 ELSE 0 END), 0) AS create_count,
                    COALESCE(SUM(CASE WHEN operation = 'UPDATE' THEN 1 ELSE 0 END), 0) AS update_count,
                    COALESCE(SUM(CASE WHEN operation = 'BULK_IMPORT' THEN 1 ELSE 0 END), 0) AS bulk_import_count,
                    COALESCE(SUM(CASE WHEN operation = 'RESTORE' THEN 1 ELSE 0 END), 0) AS restore_count
                FROM `audit_logs`
            ");
            $agg = $stmtAll->fetch() ?: [];

            jsonResponse([
                'status' => 'success',
                'stats' => [
                    'total' => (int)($agg['total'] ?? count($formatted)),
                    'inputCount' => (int)($agg['input_count'] ?? 0),
                    'deleteCount' => (int)($agg['delete_count'] ?? 0),
                    'createCount' => (int)($agg['create_count'] ?? 0),
                    'updateCount' => (int)($agg['update_count'] ?? 0),
                    'bulkImportCount' => (int)($agg['bulk_import_count'] ?? 0),
                    'restoreCount' => (int)($agg['restore_count'] ?? 0),
                ],
                'total' => count($formatted),
                'data' => $formatted,
            ]);
        } catch (PDOException $e) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Gagal memuat log audit database: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);

        if (!is_array($body)) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Payload JSON tidak valid.',
            ], 400);
        }

        // Mendukung pengiriman batch log maupun single log
        if (isset($body['entries']) && is_array($body['entries'])) {
            $createdIds = [];
            foreach ($body['entries'] as $entry) {
                if (is_array($entry)) {
                    $lid = recordAuditLog($pdo, $entry);
                    if ($lid) $createdIds[] = $lid;
                }
            }
            jsonResponse([
                'status' => 'success',
                'message' => count($createdIds) . ' catatan log berhasil disimpan ke database.',
                'ids' => $createdIds,
            ], 201);
        }

        $logId = recordAuditLog($pdo, $body);
        if (!$logId) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Gagal mencatat log ke database.',
            ], 500);
        }

        $stmtGet = $pdo->prepare("SELECT * FROM `audit_logs` WHERE `id` = :id LIMIT 1");
        $stmtGet->execute([':id' => $logId]);
        $createdRow = $stmtGet->fetch();

        jsonResponse([
            'status' => 'success',
            'message' => 'Log aktivitas database berhasil dicatat.',
            'data' => $createdRow ? formatAuditLogRow($createdRow) : null,
        ], 201);
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        $mode = isset($_GET['mode']) ? trim($_GET['mode']) : null;
        $actionType = isset($_GET['action_type']) ? strtoupper(trim($_GET['action_type'])) : null;

        try {
            if ($mode === 'clear') {
                if ($actionType === 'INPUT' || $actionType === 'DELETE') {
                    $stmtDel = $pdo->prepare("DELETE FROM `audit_logs` WHERE `action_type` = :at");
                    $stmtDel->execute([':at' => $actionType]);
                } else {
                    $pdo->exec("DELETE FROM `audit_logs`");
                }
                jsonResponse([
                    'status' => 'success',
                    'message' => 'Catatan log berhasil dibersihkan.',
                ]);
            }

            if (!$id) {
                $rawInput = file_get_contents('php://input');
                $body = json_decode($rawInput, true);
                $id = $body['id'] ?? null;
            }

            if (!$id) {
                jsonResponse([
                    'status' => 'error',
                    'message' => 'Parameter ID log diperlukan untuk penghapusan.',
                ], 400);
            }

            $stmtDel = $pdo->prepare("DELETE FROM `audit_logs` WHERE `id` = :id");
            $stmtDel->execute([':id' => $id]);

            jsonResponse([
                'status' => 'success',
                'message' => 'Catatan log berhasil dihapus.',
                'deletedId' => $id,
            ]);
        } catch (PDOException $e) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Gagal menghapus catatan log: ' . $e->getMessage(),
            ], 500);
        }
        break;

    default:
        jsonResponse([
            'status' => 'error',
            'message' => 'Metode HTTP tidak didukung.',
        ], 405);
        break;
}
