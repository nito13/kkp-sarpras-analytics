<?php
/**
 * ============================================================================
 * REST API ENDPOINT: PRASARANA DAN SARANA TAMBAK & KOLAM SATDIK KKP
 * ============================================================================
 * Path: APIs/tambak_kolam.php
 *
 * Metode yang didukung:
 * - GET    /APIs/tambak_kolam.php               -> Ambil seluruh rekap satdik + detail unit tambak/kolam
 * - GET    /APIs/tambak_kolam.php?satdik_id=X   -> Ambil rekap & unit tambak/kolam untuk satdik tertentu
 * - POST   /APIs/tambak_kolam.php               -> Tambah unit tambak/kolam baru & sinkronisasi rekap
 * - PUT    /APIs/tambak_kolam.php               -> Perbarui unit tambak/kolam & sinkronisasi rekap
 * - DELETE /APIs/tambak_kolam.php?id=X          -> Hapus unit tambak/kolam & sinkronisasi rekap
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
 * Helper: Format baris tambak_rekap dari DB ke camelCase JSON untuk Frontend
 */
function formatTambakRekapRow(array $row): array {
    return [
        'satdikId' => $row['satdik_id'],
        'namaSatdik' => $row['nama_satdik'],
        'kodeSatdik' => $row['kode_satdik'] ?? '',
        'jenjang' => $row['jenjang'] ?? 'Politeknik',
        'jumlahUnit' => (int) ($row['jumlah_unit'] ?? 0),
        'jumlahTambak' => (int) ($row['jumlah_tambak'] ?? 0),
        'jumlahKolam' => (int) ($row['jumlah_kolam'] ?? 0),
        'jumlahTandon' => (int) ($row['jumlah_tandon'] ?? 0),
        'luasTotalM2' => (float) ($row['luas_total_m2'] ?? 0),
        'luasTambakM2' => (float) ($row['luas_tambak_m2'] ?? 0),
        'luasKolamM2' => (float) ($row['luas_kolam_m2'] ?? 0),
        'kondisiBaik' => (int) ($row['kondisi_baik'] ?? 0),
        'kondisiRusakRingan' => (int) ($row['kondisi_rusak_ringan'] ?? 0),
        'kondisiRusakBerat' => (int) ($row['kondisi_rusak_berat'] ?? 0),
        'unitAktif' => (int) ($row['unit_aktif'] ?? 0),
        'unitBelumDimanfaatkan' => (int) ($row['unit_belum_dimanfaatkan'] ?? 0),
        'totalKincir' => (int) ($row['total_kincir'] ?? 0),
        'dayaListrik' => $row['daya_listrik'] ?? '-',
        'lokasiUtama' => $row['lokasi_utama'] ?? '-',
        'mapUrl' => $row['map_url'] ?? '',
        'keterangan' => $row['keterangan'] ?? '',
    ];
}

/**
 * Helper: Format baris tambak_unit dari DB ke camelCase JSON untuk Frontend
 */
function formatTambakUnitRow(array $row, array $satdikMap = []): array {
    $sid = $row['satdik_id'];
    $sInfo = $satdikMap[$sid] ?? ['nama' => $sid, 'jenjang' => 'Politeknik'];
    return [
        'id' => $row['id'],
        'satdikId' => $sid,
        'namaSatdik' => $sInfo['nama'],
        'jenjang' => $sInfo['jenjang'],
        'noUrut' => (int) ($row['no_urut'] ?? 1),
        'nama' => $row['nama'],
        'jenis' => $row['jenis'] ?? 'Tambak',
        'kampusLokasi' => $row['kampus_lokasi'] ?? '-',
        'luasM2' => (float) ($row['luas_m2'] ?? 0),
        'luasLabel' => $row['luas_label'] ?? '-',
        'kondisi' => $row['kondisi'] ?? 'Baik',
        'fungsi' => $row['fungsi'] ?? '-',
        'statusOperasional' => $row['status_operasional'] ?? 'Aktif Budidaya',
        'pelataran' => $row['pelataran'] ?? 'Tanah',
        'pelataranKategori' => $row['pelataran_kategori'] ?? 'Tanah',
        'listrik' => $row['listrik'] ?? '-',
        'kincir' => $row['kincir'] ?? '-',
        'jumlahKincir' => (int) ($row['jumlah_kincir'] ?? 0),
        'lokasiLabel' => $row['lokasi_label'] ?? '-',
        'mapUrl' => $row['map_url'] ?? '',
        'keterangan' => $row['keterangan'] ?? '',
    ];
}

/**
 * Helper: Hitung ulang & sinkronkan tambak_rekap berdasarkan unit aktual di tambak_unit
 */
function recalculateTambakRekap(PDO $pdo, string $satdikId): ?array {
    $stmtUnits = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `satdik_id` = :sid");
    $stmtUnits->execute([':sid' => $satdikId]);
    $rows = $stmtUnits->fetchAll();

    $jmlUnit = count($rows);
    $jmlTambak = 0;
    $jmlKolam = 0;
    $jmlTandon = 0;
    $luasTotal = 0.0;
    $luasTambak = 0.0;
    $luasKolam = 0.0;
    $kBaik = 0;
    $kRr = 0;
    $kRb = 0;
    $uAktif = 0;
    $uBelum = 0;
    $totalKincir = 0;

    foreach ($rows as $r) {
        $jenis = $r['jenis'] ?? 'Tambak';
        $luas = (float) ($r['luas_m2'] ?? 0);
        $kondisi = $r['kondisi'] ?? 'Baik';
        $statusOp = $r['status_operasional'] ?? 'Aktif Budidaya';

        $luasTotal += $luas;
        if ($jenis === 'Tambak') {
            $jmlTambak++;
            $luasTambak += $luas;
        } elseif ($jenis === 'Kolam') {
            $jmlKolam++;
            $luasKolam += $luas;
        } else {
            $jmlTandon++;
            $luasKolam += $luas;
        }

        if ($kondisi === 'Baik') {
            $kBaik++;
        } elseif ($kondisi === 'Rusak Ringan') {
            $kRr++;
        } else {
            $kRb++;
        }

        if (in_array($statusOp, ['Aktif Budidaya', 'Koperasi / Sewa', 'Tandon / Pendukung'], true)) {
            $uAktif++;
        } else {
            $uBelum++;
        }

        $totalKincir += (int) ($r['jumlah_kincir'] ?? 0);
    }

    $stmtCheck = $pdo->prepare("SELECT * FROM `tambak_rekap` WHERE `satdik_id` = :sid LIMIT 1");
    $stmtCheck->execute([':sid' => $satdikId]);
    $existing = $stmtCheck->fetch();

    if ($existing) {
        $stmtUpd = $pdo->prepare("
            UPDATE `tambak_rekap`
            SET `jumlah_unit` = :ju,
                `jumlah_tambak` = :jt,
                `jumlah_kolam` = :jk,
                `jumlah_tandon` = :jtd,
                `luas_total_m2` = :lt,
                `luas_tambak_m2` = :ltb,
                `luas_kolam_m2` = :lkl,
                `kondisi_baik` = :kb,
                `kondisi_rusak_ringan` = :krr,
                `kondisi_rusak_berat` = :krb,
                `unit_aktif` = :ua,
                `unit_belum_dimanfaatkan` = :ub,
                `total_kincir` = :tk
            WHERE `satdik_id` = :sid
        ");
        $stmtUpd->execute([
            ':ju' => $jmlUnit,
            ':jt' => $jmlTambak,
            ':jk' => $jmlKolam,
            ':jtd' => $jmlTandon,
            ':lt' => round($luasTotal, 2),
            ':ltb' => round($luasTambak, 2),
            ':lkl' => round($luasKolam, 2),
            ':kb' => $kBaik,
            ':krr' => $kRr,
            ':krb' => $kRb,
            ':ua' => $uAktif,
            ':ub' => $uBelum,
            ':tk' => $totalKincir,
            ':sid' => $satdikId,
        ]);
    } else {
        $stmtSat = $pdo->prepare("SELECT `name`, `code`, `type` FROM `satdik` WHERE `id` = :sid LIMIT 1");
        $stmtSat->execute([':sid' => $satdikId]);
        $satRow = $stmtSat->fetch();
        $namaSatdik = $satRow ? $satRow['name'] : $satdikId;
        $kodeSatdik = $satRow ? $satRow['code'] : strtoupper(substr($satdikId, 0, 3));
        $jenjang = $satRow ? $satRow['type'] : 'Politeknik';

        $stmtIns = $pdo->prepare("
            INSERT INTO `tambak_rekap` (
                satdik_id, nama_satdik, kode_satdik, jenjang,
                jumlah_unit, jumlah_tambak, jumlah_kolam, jumlah_tandon,
                luas_total_m2, luas_tambak_m2, luas_kolam_m2,
                kondisi_baik, kondisi_rusak_ringan, kondisi_rusak_berat,
                unit_aktif, unit_belum_dimanfaatkan, total_kincir
            ) VALUES (
                :sid, :nama, :kode, :jenjang,
                :ju, :jt, :jk, :jtd,
                :lt, :ltb, :lkl,
                :kb, :krr, :krb,
                :ua, :ub, :tk
            )
        ");
        $stmtIns->execute([
            ':sid' => $satdikId,
            ':nama' => $namaSatdik,
            ':kode' => $kodeSatdik,
            ':jenjang' => $jenjang,
            ':ju' => $jmlUnit,
            ':jt' => $jmlTambak,
            ':jk' => $jmlKolam,
            ':jtd' => $jmlTandon,
            ':lt' => round($luasTotal, 2),
            ':ltb' => round($luasTambak, 2),
            ':lkl' => round($luasKolam, 2),
            ':kb' => $kBaik,
            ':krr' => $kRr,
            ':krb' => $kRb,
            ':ua' => $uAktif,
            ':ub' => $uBelum,
            ':tk' => $totalKincir,
        ]);
    }

    $stmtFetch = $pdo->prepare("SELECT * FROM `tambak_rekap` WHERE `satdik_id` = :sid LIMIT 1");
    $stmtFetch->execute([':sid' => $satdikId]);
    $updated = $stmtFetch->fetch();
    return $updated ? formatTambakRekapRow($updated) : null;
}

/**
 * Helper: Tentukan kategori pelataran dari string pelataran
 */
function resolvePelataranKategori(string $pelataran): string {
    $u = strtoupper($pelataran);
    if (strpos($u, 'HDPE') !== false || strpos($u, 'HDFE') !== false || strpos($u, 'GEOMEMBRAN') !== false) {
        return 'HDPE / Geomembran';
    }
    if (strpos($u, 'BETON') !== false || strpos($u, 'SEMEN') !== false || strpos($u, 'RABATAN') !== false) {
        return 'Beton / Semen';
    }
    if (strpos($u, 'FIBER') !== false || strpos($u, 'TERPAL') !== false) {
        return 'Fiber / Terpal';
    }
    return 'Tanah';
}

switch ($method) {
    case 'GET':
        $satdikFilter = isset($_GET['satdik_id']) ? trim($_GET['satdik_id']) : null;

        try {
            if ($satdikFilter && $satdikFilter !== 'ALL') {
                $stmtRekap = $pdo->prepare("SELECT * FROM `tambak_rekap` WHERE `satdik_id` = :sid ORDER BY `nama_satdik` ASC");
                $stmtRekap->execute([':sid' => $satdikFilter]);

                $stmtUnits = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `satdik_id` = :sid ORDER BY `no_urut` ASC, `id` ASC");
                $stmtUnits->execute([':sid' => $satdikFilter]);
            } else {
                $stmtRekap = $pdo->query("SELECT * FROM `tambak_rekap` ORDER BY `jenjang` ASC, `nama_satdik` ASC");
                $stmtUnits = $pdo->query("SELECT * FROM `tambak_unit` ORDER BY `satdik_id` ASC, `no_urut` ASC, `id` ASC");
            }

            $rekapRows = $stmtRekap->fetchAll();
            $unitRows = $stmtUnits->fetchAll();

            $satdikMap = [];
            foreach ($rekapRows as $r) {
                $satdikMap[$r['satdik_id']] = [
                    'nama' => $r['nama_satdik'],
                    'jenjang' => $r['jenjang'] ?? 'Politeknik',
                ];
            }

            $summary = array_map('formatTambakRekapRow', $rekapRows);
            $units = array_map(function ($u) use ($satdikMap) {
                return formatTambakUnitRow($u, $satdikMap);
            }, $unitRows);

            sendJsonResponse([
                'status' => 'success',
                'meta' => [
                    'title' => 'Prasarana dan Sarana Tambak dan Kolam Satuan Pendidikan KKP',
                    'source' => '1c-Data Tambak dan Kolam Satuan Pendidikan.pdf',
                    'tahun' => 2025,
                    'totalSatdik' => count($summary),
                    'satdikMemilikiUnit' => count(array_filter($summary, fn($s) => $s['jumlahUnit'] > 0)),
                    'totalUnit' => count($units),
                    'totalLuasM2' => round(array_sum(array_column($units, 'luasM2')), 2),
                    'totalKincir' => array_sum(array_column($units, 'jumlahKincir')),
                ],
                'summary' => $summary,
                'units' => $units,
            ]);
        } catch (PDOException $e) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Tabel tambak & kolam belum diinisialisasi. Jalankan Database/seed.php terlebih dahulu.',
                'detail' => $e->getMessage(),
            ], 500);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);
        if (!$body || empty($body['satdikId']) || empty($body['nama'])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Field satdikId dan nama unit tambak/kolam wajib diisi.',
            ], 400);
        }

        $id = !empty($body['id']) ? trim($body['id']) : ('TBK-' . strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $body['satdikId']), -3)) . '-' . rand(100, 999));
        $satdikId = trim($body['satdikId']);
        $noUrut = isset($body['noUrut']) ? (int) $body['noUrut'] : 99;
        $nama = trim($body['nama']);
        $jenis = !empty($body['jenis']) ? trim($body['jenis']) : 'Tambak';
        $kampusLokasi = isset($body['kampusLokasi']) ? trim($body['kampusLokasi']) : '-';
        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : 0;
        $luasLabel = !empty($body['luasLabel']) ? trim($body['luasLabel']) : ($luasM2 > 0 ? number_format($luasM2, 0, ',', '.') . ' m2' : '-');
        $kondisi = !empty($body['kondisi']) ? trim($body['kondisi']) : 'Baik';
        $fungsi = isset($body['fungsi']) ? trim($body['fungsi']) : 'Budidaya Perikanan';
        $statusOp = !empty($body['statusOperasional']) ? trim($body['statusOperasional']) : 'Aktif Budidaya';
        $pelataran = !empty($body['pelataran']) ? trim($body['pelataran']) : 'HDPE';
        $pelataranKat = !empty($body['pelataranKategori']) ? trim($body['pelataranKategori']) : resolvePelataranKategori($pelataran);
        $listrik = isset($body['listrik']) ? trim($body['listrik']) : '-';
        $kincir = isset($body['kincir']) ? trim($body['kincir']) : '-';
        $jumlahKincir = isset($body['jumlahKincir']) ? max(0, (int) $body['jumlahKincir']) : 0;
        $lokasiLabel = isset($body['lokasiLabel']) ? trim($body['lokasiLabel']) : $kampusLokasi;
        $mapUrl = isset($body['mapUrl']) ? trim($body['mapUrl']) : '';
        $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : '';

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("
                INSERT INTO `tambak_unit` (
                    id, satdik_id, no_urut, nama, jenis, kampus_lokasi,
                    luas_m2, luas_label, kondisi, fungsi, status_operasional,
                    pelataran, pelataran_kategori, listrik, kincir, jumlah_kincir,
                    lokasi_label, map_url, keterangan
                ) VALUES (
                    :id, :satdik_id, :no_urut, :nama, :jenis, :kampus_lokasi,
                    :luas_m2, :luas_label, :kondisi, :fungsi, :status_operasional,
                    :pelataran, :pelataran_kategori, :listrik, :kincir, :jumlah_kincir,
                    :lokasi_label, :map_url, :keterangan
                )
            ");
            $stmt->execute([
                ':id' => $id,
                ':satdik_id' => $satdikId,
                ':no_urut' => $noUrut,
                ':nama' => $nama,
                ':jenis' => $jenis,
                ':kampus_lokasi' => $kampusLokasi,
                ':luas_m2' => $luasM2,
                ':luas_label' => $luasLabel,
                ':kondisi' => $kondisi,
                ':fungsi' => $fungsi,
                ':status_operasional' => $statusOp,
                ':pelataran' => $pelataran,
                ':pelataran_kategori' => $pelataranKat,
                ':listrik' => $listrik,
                ':kincir' => $kincir,
                ':jumlah_kincir' => $jumlahKincir,
                ':lokasi_label' => $lokasiLabel,
                ':map_url' => $mapUrl,
                ':keterangan' => $keterangan,
            ]);

            $updatedSummary = recalculateTambakRekap($pdo, $satdikId);

            $stmtRow = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `id` = :id LIMIT 1");
            $stmtRow->execute([':id' => $id]);
            $createdRow = $stmtRow->fetch();

            $pdo->commit();

            $satMap = $updatedSummary ? [$satdikId => ['nama' => $updatedSummary['namaSatdik'], 'jenjang' => $updatedSummary['jenjang']]] : [];

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Unit tambak/kolam berhasil ditambahkan ke database MySQL.',
                'data' => [
                    'unit' => formatTambakUnitRow($createdRow, $satMap),
                    'summary' => $updatedSummary,
                ],
            ], 201);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menyimpan unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'PUT':
        $rawInput = file_get_contents('php://input');
        $body = json_decode($rawInput, true);
        if (!$body || empty($body['id'])) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'ID unit tambak/kolam wajib disertakan untuk pembaruan.',
            ], 400);
        }

        $id = trim($body['id']);
        $stmtOld = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `id` = :id LIMIT 1");
        $stmtOld->execute([':id' => $id]);
        $oldRow = $stmtOld->fetch();

        if (!$oldRow) {
            sendJsonResponse([
                'status' => 'error',
                'message' => "Unit tambak/kolam dengan ID '$id' tidak ditemukan.",
            ], 404);
        }

        $oldSatdikId = $oldRow['satdik_id'];
        $satdikId = !empty($body['satdikId']) ? trim($body['satdikId']) : $oldSatdikId;
        $noUrut = isset($body['noUrut']) ? (int) $body['noUrut'] : (int) $oldRow['no_urut'];
        $nama = !empty($body['nama']) ? trim($body['nama']) : $oldRow['nama'];
        $jenis = !empty($body['jenis']) ? trim($body['jenis']) : $oldRow['jenis'];
        $kampusLokasi = isset($body['kampusLokasi']) ? trim($body['kampusLokasi']) : $oldRow['kampus_lokasi'];
        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : (float) $oldRow['luas_m2'];
        $luasLabel = isset($body['luasLabel']) ? trim($body['luasLabel']) : ($luasM2 > 0 ? number_format($luasM2, 0, ',', '.') . ' m2' : '-');
        $kondisi = !empty($body['kondisi']) ? trim($body['kondisi']) : $oldRow['kondisi'];
        $fungsi = isset($body['fungsi']) ? trim($body['fungsi']) : $oldRow['fungsi'];
        $statusOp = !empty($body['statusOperasional']) ? trim($body['statusOperasional']) : $oldRow['status_operasional'];
        $pelataran = !empty($body['pelataran']) ? trim($body['pelataran']) : $oldRow['pelataran'];
        $pelataranKat = !empty($body['pelataranKategori']) ? trim($body['pelataranKategori']) : resolvePelataranKategori($pelataran);
        $listrik = isset($body['listrik']) ? trim($body['listrik']) : $oldRow['listrik'];
        $kincir = isset($body['kincir']) ? trim($body['kincir']) : $oldRow['kincir'];
        $jumlahKincir = isset($body['jumlahKincir']) ? max(0, (int) $body['jumlahKincir']) : (int) $oldRow['jumlah_kincir'];
        $lokasiLabel = isset($body['lokasiLabel']) ? trim($body['lokasiLabel']) : $oldRow['lokasi_label'];
        $mapUrl = isset($body['mapUrl']) ? trim($body['mapUrl']) : $oldRow['map_url'];
        $keterangan = isset($body['keterangan']) ? trim($body['keterangan']) : $oldRow['keterangan'];

        try {
            $pdo->beginTransaction();
            $stmtUpd = $pdo->prepare("
                UPDATE `tambak_unit`
                SET `satdik_id` = :satdik_id,
                    `no_urut` = :no_urut,
                    `nama` = :nama,
                    `jenis` = :jenis,
                    `kampus_lokasi` = :kampus_lokasi,
                    `luas_m2` = :luas_m2,
                    `luas_label` = :luas_label,
                    `kondisi` = :kondisi,
                    `fungsi` = :fungsi,
                    `status_operasional` = :status_operasional,
                    `pelataran` = :pelataran,
                    `pelataran_kategori` = :pelataran_kategori,
                    `listrik` = :listrik,
                    `kincir` = :kincir,
                    `jumlah_kincir` = :jumlah_kincir,
                    `lokasi_label` = :lokasi_label,
                    `map_url` = :map_url,
                    `keterangan` = :keterangan
                WHERE `id` = :id
            ");
            $stmtUpd->execute([
                ':satdik_id' => $satdikId,
                ':no_urut' => $noUrut,
                ':nama' => $nama,
                ':jenis' => $jenis,
                ':kampus_lokasi' => $kampusLokasi,
                ':luas_m2' => $luasM2,
                ':luas_label' => $luasLabel,
                ':kondisi' => $kondisi,
                ':fungsi' => $fungsi,
                ':status_operasional' => $statusOp,
                ':pelataran' => $pelataran,
                ':pelataran_kategori' => $pelataranKat,
                ':listrik' => $listrik,
                ':kincir' => $kincir,
                ':jumlah_kincir' => $jumlahKincir,
                ':lokasi_label' => $lokasiLabel,
                ':map_url' => $mapUrl,
                ':keterangan' => $keterangan,
                ':id' => $id,
            ]);

            $updatedSummary = recalculateTambakRekap($pdo, $satdikId);
            if ($oldSatdikId !== $satdikId) {
                recalculateTambakRekap($pdo, $oldSatdikId);
            }

            $stmtRow = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `id` = :id LIMIT 1");
            $stmtRow->execute([':id' => $id]);
            $updatedRow = $stmtRow->fetch();

            $pdo->commit();

            $satMap = $updatedSummary ? [$satdikId => ['nama' => $updatedSummary['namaSatdik'], 'jenjang' => $updatedSummary['jenjang']]] : [];

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Data unit tambak/kolam berhasil diperbarui.',
                'data' => [
                    'unit' => formatTambakUnitRow($updatedRow, $satMap),
                    'summary' => $updatedSummary,
                ],
            ]);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal memperbarui unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if (!$id) {
            $rawInput = file_get_contents('php://input');
            $body = json_decode($rawInput, true);
            $id = $body['id'] ?? null;
        }

        if (!$id) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Parameter ID unit tambak/kolam wajib diberikan untuk penghapusan.',
            ], 400);
        }

        $stmtOld = $pdo->prepare("SELECT * FROM `tambak_unit` WHERE `id` = :id LIMIT 1");
        $stmtOld->execute([':id' => $id]);
        $oldRow = $stmtOld->fetch();

        if (!$oldRow) {
            sendJsonResponse([
                'status' => 'error',
                'message' => "Unit tambak/kolam dengan ID '$id' tidak ditemukan.",
            ], 404);
        }

        $satdikId = $oldRow['satdik_id'];

        try {
            $pdo->beginTransaction();
            $stmtDel = $pdo->prepare("DELETE FROM `tambak_unit` WHERE `id` = :id");
            $stmtDel->execute([':id' => $id]);

            $updatedSummary = recalculateTambakRekap($pdo, $satdikId);
            $pdo->commit();

            sendJsonResponse([
                'status' => 'success',
                'message' => 'Unit tambak/kolam berhasil dihapus.',
                'data' => [
                    'deletedId' => $id,
                    'satdikId' => $satdikId,
                    'summary' => $updatedSummary,
                ],
            ]);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendJsonResponse([
                'status' => 'error',
                'message' => 'Gagal menghapus unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
        break;

    default:
        sendJsonResponse([
            'status' => 'error',
            'message' => "Metode HTTP '$method' tidak didukung pada endpoint ini.",
        ], 405);
}
