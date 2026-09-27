<?php
// backend/database/seed.php
// Skrip Inisialisasi dan Seeder Database MySQL Laragon untuk SIM-SARPRAS KKP

require_once __DIR__ . '/../config/database.php';

echo "=== MEMULAI SETUP DATABASE SIM-SARPRAS KKP (LARAGON) ===\n\n";

try {
    // 1. Konek ke MySQL tanpa pilih database dulu untuk memastikan database kkp_sarpras_db dibuat
    $pdoRoot = getDbConnection(false);
    echo "[1/4] Membuat database '" . DB_NAME . "' jika belum ada...\n";
    $pdoRoot->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "  -> Database '" . DB_NAME . "' berhasil dipastikan aktif.\n";

    // 2. Konek ke database kkp_sarpras_db dan jalankan skema
    $pdo = getDbConnection(true);
    echo "[2/4] Mengeksekusi struktur tabel dari schema.sql...\n";
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("File schema.sql tidak ditemukan di $schemaFile");
    }
    $schemaSql = file_get_contents($schemaFile);
    $pdo->exec($schemaSql);
    echo "  -> Tabel satdik, users, dan assets berhasil dibuat/diverifikasi.\n";

    // 3. Baca data awal dari seed_data.json
    $jsonFile = __DIR__ . '/seed_data.json';
    if (!file_exists($jsonFile)) {
        throw new Exception("File seed_data.json tidak ditemukan di $jsonFile");
    }
    $data = json_decode(file_get_contents($jsonFile), true);
    if (!$data) {
        throw new Exception("Format seed_data.json tidak valid.");
    }

    // 4. Masukkan Satdik
    echo "[3/4] Mengisi master data 18 Satuan Pendidikan KKP...\n";
    $stmtSatdik = $pdo->prepare("
        INSERT INTO `satdik` (
            id, name, short_name, jenjang, type, provinsi, kota, region, 
            lat, lng, map_x, map_y, taruna_count, dosen_count, 
            luas_lahan_ha, luas_bangunan_m2, akreditasi, established_year, 
            kampus_cabang_json, rector, prodi_json
        ) VALUES (
            :id, :name, :short_name, :jenjang, :type, :provinsi, :kota, :region,
            :lat, :lng, :map_x, :map_y, :taruna_count, :dosen_count,
            :luas_lahan_ha, :luas_bangunan_m2, :akreditasi, :established_year,
            :kampus_cabang_json, :rector, :prodi_json
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name), short_name = VALUES(short_name),
            taruna_count = VALUES(taruna_count), akreditasi = VALUES(akreditasi);
    ");

    $satdikCount = 0;
    foreach ($data['satdik'] as $s) {
        $stmtSatdik->execute([
            ':id' => $s['id'],
            ':name' => $s['name'],
            ':short_name' => $s['shortName'] ?? null,
            ':jenjang' => $s['jenjang'] ?? null,
            ':type' => $s['type'] ?? null,
            ':provinsi' => $s['provinsi'] ?? null,
            ':kota' => $s['kota'] ?? null,
            ':region' => $s['region'] ?? null,
            ':lat' => $s['lat'] ?? null,
            ':lng' => $s['lng'] ?? null,
            ':map_x' => $s['mapX'] ?? null,
            ':map_y' => $s['mapY'] ?? null,
            ':taruna_count' => $s['tarunaCount'] ?? 0,
            ':dosen_count' => $s['dosenCount'] ?? 0,
            ':luas_lahan_ha' => $s['luasLahanHa'] ?? 0,
            ':luas_bangunan_m2' => $s['luasBangunanM2'] ?? 0,
            ':akreditasi' => $s['akreditasi'] ?? null,
            ':established_year' => $s['establishedYear'] ?? null,
            ':kampus_cabang_json' => isset($s['kampusCabang']) ? json_encode($s['kampusCabang'], JSON_UNESCAPED_UNICODE) : null,
            ':rector' => $s['rector'] ?? null,
            ':prodi_json' => isset($s['prodi']) ? json_encode($s['prodi'], JSON_UNESCAPED_UNICODE) : null,
        ]);
        $satdikCount++;
    }
    echo "  -> Berhasil menyimpan $satdikCount data Satdik.\n";

    // 5. Masukkan Users
    echo "[4/4] Mengisi akun pengguna kedinasan KKP...\n";
    $stmtUser = $pdo->prepare("
        INSERT INTO `users` (
            id, name, nip, email, password, role, role_label, 
            jabatan, unit_kerja, accessible_satdik, satdik_name, 
            permissions_json, avatar_url
        ) VALUES (
            :id, :name, :nip, :email, :password, :role, :role_label,
            :jabatan, :unit_kerja, :accessible_satdik, :satdik_name,
            :permissions_json, :avatar_url
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name), role = VALUES(role), permissions_json = VALUES(permissions_json);
    ");

    $userCount = 0;
    foreach ($data['users'] as $u) {
        $stmtUser->execute([
            ':id' => $u['id'],
            ':name' => $u['name'],
            ':nip' => $u['nip'],
            ':email' => $u['email'],
            ':password' => $u['password'], // Simpan sesuai password demo
            ':role' => $u['role'],
            ':role_label' => $u['roleLabel'] ?? null,
            ':jabatan' => $u['jabatan'] ?? null,
            ':unit_kerja' => $u['unitKerja'] ?? null,
            ':accessible_satdik' => $u['accessibleSatdik'] ?? 'ALL',
            ':satdik_name' => $u['satdikName'] ?? null,
            ':permissions_json' => isset($u['permissions']) ? json_encode($u['permissions'], JSON_UNESCAPED_UNICODE) : null,
            ':avatar_url' => $u['avatarUrl'] ?? null,
        ]);
        $userCount++;
    }
    echo "  -> Berhasil menyimpan $userCount data Akun Pengguna.\n";

    // 6. Masukkan Assets Sarpras
    echo "[5/5] Mengisi inventaris aset Sarpras BMN...\n";
    $stmtAsset = $pdo->prepare("
        INSERT INTO `assets` (
            id, bmn_code, name, satdik_id, satdik_name, category, subcategory,
            `condition`, condition_score, acquisition_year, valuation, utilization_rate,
            capacity_desc, specs, certification_status, certification_authority,
            cert_expiry_date, last_maintenance_date, next_maintenance_date,
            maintenance_urgency, estimated_repair_cost, issues_summary
        ) VALUES (
            :id, :bmn_code, :name, :satdik_id, :satdik_name, :category, :subcategory,
            :condition, :condition_score, :acquisition_year, :valuation, :utilization_rate,
            :capacity_desc, :specs, :certification_status, :certification_authority,
            :cert_expiry_date, :last_maintenance_date, :next_maintenance_date,
            :maintenance_urgency, :estimated_repair_cost, :issues_summary
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name), `condition` = VALUES(`condition`), 
            condition_score = VALUES(condition_score), valuation = VALUES(valuation),
            maintenance_urgency = VALUES(maintenance_urgency), issues_summary = VALUES(issues_summary);
    ");

    $assetCount = 0;
    foreach ($data['assets'] as $a) {
        $stmtAsset->execute([
            ':id' => $a['id'],
            ':bmn_code' => $a['bmnCode'] ?? null,
            ':name' => $a['name'],
            ':satdik_id' => $a['satdikId'],
            ':satdik_name' => $a['satdikName'],
            ':category' => $a['category'],
            ':subcategory' => $a['subcategory'] ?? null,
            ':condition' => $a['condition'],
            ':condition_score' => $a['conditionScore'] ?? 80,
            ':acquisition_year' => $a['acquisitionYear'] ?? null,
            ':valuation' => $a['valuation'] ?? 0,
            ':utilization_rate' => $a['utilizationRate'] ?? 0,
            ':capacity_desc' => $a['capacityDesc'] ?? null,
            ':specs' => $a['specs'] ?? null,
            ':certification_status' => $a['certificationStatus'] ?? null,
            ':certification_authority' => $a['certificationAuthority'] ?? null,
            ':cert_expiry_date' => !empty($a['certExpiryDate']) ? $a['certExpiryDate'] : null,
            ':last_maintenance_date' => !empty($a['lastMaintenanceDate']) ? $a['lastMaintenanceDate'] : null,
            ':next_maintenance_date' => !empty($a['nextMaintenanceDate']) ? $a['nextMaintenanceDate'] : null,
            ':maintenance_urgency' => $a['maintenanceUrgency'] ?? 'Normal',
            ':estimated_repair_cost' => $a['estimatedRepairCost'] ?? 0,
            ':issues_summary' => $a['issuesSummary'] ?? null,
        ]);
        $assetCount++;
    }
    echo "  -> Berhasil menyimpan $assetCount data Aset BMN.\n";

    echo "\n=== SEEDING BERHASIL! DATABASE KKP_SARPRAS_DB SIAP DIGUNAKAN ===\n";

} catch (Exception $e) {
    echo "\n[ERROR] Gagal saat inisialisasi: " . $e->getMessage() . "\n";
    exit(1);
}
