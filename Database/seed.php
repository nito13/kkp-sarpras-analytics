<?php
// backend/database/seed.php
// Skrip Inisialisasi dan Seeder Database MySQL Laragon untuk Sarana dan Prasarana Satuan Pendidikan KP

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

echo "=== MEMULAI SETUP DATABASE SARANA DAN PRASARANA SATUAN PENDIDIKAN KP (LARAGON) ===\n\n";

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
    echo "[5/5] Mengisi inventaris aset Sarpras...\n";
    $stmtAsset = $pdo->prepare("
        INSERT INTO `assets` (
            id, name, satdik_id, satdik_name, category,
            `condition`, condition_score, acquisition_year, utilization_rate,
            capacity_desc, specs,
            cert_expiry_date, last_maintenance_date, next_maintenance_date,
            maintenance_urgency, issues_summary
        ) VALUES (
            :id, :name, :satdik_id, :satdik_name, :category,
            :condition, :condition_score, :acquisition_year, :utilization_rate,
            :capacity_desc, :specs,
            :cert_expiry_date, :last_maintenance_date, :next_maintenance_date,
            :maintenance_urgency, :issues_summary
        ) ON DUPLICATE KEY UPDATE
            name = VALUES(name), `condition` = VALUES(`condition`), 
            condition_score = VALUES(condition_score),
            maintenance_urgency = VALUES(maintenance_urgency), issues_summary = VALUES(issues_summary);
    ");

    $assetCount = 0;
    foreach ($data['assets'] as $a) {
        $stmtAsset->execute([
            ':id' => $a['id'],
            ':name' => $a['name'],
            ':satdik_id' => $a['satdikId'],
            ':satdik_name' => $a['satdikName'],
            ':category' => $a['category'],
            ':condition' => $a['condition'],
            ':condition_score' => $a['conditionScore'] ?? 80,
            ':acquisition_year' => $a['acquisitionYear'] ?? null,
            ':utilization_rate' => $a['utilizationRate'] ?? 0,
            ':capacity_desc' => $a['capacityDesc'] ?? null,
            ':specs' => $a['specs'] ?? null,
            ':cert_expiry_date' => !empty($a['certExpiryDate']) ? $a['certExpiryDate'] : null,
            ':last_maintenance_date' => !empty($a['lastMaintenanceDate']) ? $a['lastMaintenanceDate'] : null,
            ':next_maintenance_date' => !empty($a['nextMaintenanceDate']) ? $a['nextMaintenanceDate'] : null,
            ':maintenance_urgency' => $a['maintenanceUrgency'] ?? 'Normal',
            ':issues_summary' => $a['issuesSummary'] ?? null,
        ]);
        $assetCount++;
    }
    echo "  -> Berhasil menyimpan $assetCount data Aset Sarpras.\n";

    // 7. Hapus aset asrama dummy lama maupun baris ASR-* dari tabel assets (kini terpisah di asrama_rekap & asrama_gedung)
    $legacyAsramaIds = [
        'SAR-AUP-005', 'SAR-SDJ-004', 'SAR-KPG-002', 'SAR-LDG-002', 'SAR-SSO-002',
        'SAR-ADD-002', 'SAR-ADD-004', 'SAR-ADD-006', 'SAR-ADD-009', 'SAR-ADD-011',
        'SAR-ADD-012', 'SAR-ADD-015', 'SAR-ADD-016', 'SAR-ADD-017', 'SAR-ADD-018',
    ];
    $placeholders = implode(',', array_fill(0, count($legacyAsramaIds), '?'));
    $stmtDel = $pdo->prepare("DELETE FROM `assets` WHERE id LIKE 'ASR-%' OR id IN ($placeholders)");
    $stmtDel->execute($legacyAsramaIds);
    echo "  -> Membersihkan " . $stmtDel->rowCount() . " baris asrama dari tabel assets (dipindahkan ke tabel khusus asrama).\n";

    // 8. Data Ketersediaan Asrama (hasil konversi Excel oleh Database/import_asrama.py)
    $asramaFile = __DIR__ . '/asrama_data.json';
    if (file_exists($asramaFile)) {
        echo "[6/6] Mengisi data ketersediaan asrama taruna...\n";
        $asrama = json_decode(file_get_contents($asramaFile), true);
        if (!$asrama) {
            throw new Exception("Format asrama_data.json tidak valid.");
        }
        $meta = $asrama['meta'] ?? [];

        $pdo->beginTransaction();
        $pdo->exec("DELETE FROM `asrama_gedung`");
        $pdo->exec("DELETE FROM `asrama_rekap`");

        $stmtRekap = $pdo->prepare("
            INSERT INTO `asrama_rekap` (
                satdik_id, nama_excel, jumlah_asrama, jumlah_kamar, luas_m2, kapasitas, kapasitas_aktif,
                luas_adjustment, kapasitas_adjustment, jumlah_tidak_dipakai, jumlah_perlu_renovasi,
                keterangan, drive_url, sumber, tanggal_data
            ) VALUES (
                :satdik_id, :nama_excel, :jumlah_asrama, :jumlah_kamar, :luas_m2, :kapasitas, :kapasitas_aktif,
                :luas_adjustment, :kapasitas_adjustment, :jumlah_tidak_dipakai, :jumlah_perlu_renovasi,
                :keterangan, :drive_url, :sumber, :tanggal_data
            )
        ");
        foreach ($asrama['summary'] as $s) {
            $stmtRekap->execute([
                ':satdik_id' => $s['satdikId'],
                ':nama_excel' => $s['namaExcel'] ?? null,
                ':jumlah_asrama' => $s['jumlahAsrama'] ?? 0,
                ':jumlah_kamar' => $s['jumlahKamar'] ?? 0,
                ':luas_m2' => $s['luasM2'] ?? 0,
                ':kapasitas' => $s['kapasitas'] ?? 0,
                ':kapasitas_aktif' => $s['kapasitasAktif'] ?? 0,
                ':luas_adjustment' => $s['luasAdjustment'] ?? null,
                ':kapasitas_adjustment' => $s['kapasitasAdjustment'] ?? null,
                ':jumlah_tidak_dipakai' => $s['jumlahTidakDipakai'] ?? 0,
                ':jumlah_perlu_renovasi' => $s['jumlahPerluRenovasi'] ?? 0,
                ':keterangan' => $s['keterangan'] ?? null,
                ':drive_url' => $s['driveUrl'] ?? null,
                ':sumber' => $meta['sumber'] ?? null,
                ':tanggal_data' => $meta['tanggalData'] ?? null,
            ]);
        }

        $stmtGedung = $pdo->prepare("
            INSERT INTO `asrama_gedung` (
                id, satdik_id, kampus, nama, peruntukan, jumlah_kamar, luas_m2, kapasitas,
                status, keterangan, rincian_json
            ) VALUES (
                :id, :satdik_id, :kampus, :nama, :peruntukan, :jumlah_kamar, :luas_m2, :kapasitas,
                :status, :keterangan, :rincian_json
            )
        ");
        foreach ($asrama['buildings'] as $b) {
            $stmtGedung->execute([
                ':id' => $b['id'],
                ':satdik_id' => $b['satdikId'],
                ':kampus' => $b['kampus'] ?? null,
                ':nama' => $b['nama'],
                ':peruntukan' => $b['peruntukan'] ?? null,
                ':jumlah_kamar' => $b['jumlahKamar'] ?? 0,
                ':luas_m2' => $b['luasM2'] ?? 0,
                ':kapasitas' => $b['kapasitas'] ?? 0,
                ':status' => $b['status'] ?? 'Digunakan',
                ':keterangan' => $b['keterangan'] ?? null,
                ':rincian_json' => json_encode($b['rincian'] ?? [], JSON_UNESCAPED_UNICODE),
            ]);
        }
        $pdo->commit();
        echo "  -> Berhasil menyimpan " . count($asrama['summary']) . " rekap satdik dan " . count($asrama['buildings']) . " gedung asrama.\n";
    } else {
        echo "[6/7] Lewati data asrama (asrama_data.json belum ada — jalankan: python Database/import_asrama.py)\n";
    }

    // 9. Data Standar Minimal & Realisasi Sarpras Prodi (hasil konversi Excel/Data Contoh.xlsx)
    $standarFile = __DIR__ . '/standar_data.json';
    if (file_exists($standarFile)) {
        echo "[7/7] Mengisi data standar minimal & realisasi sarpras prodi...\n";
        $standar = json_decode(file_get_contents($standarFile), true);
        if (!$standar) {
            throw new Exception("Format standar_data.json tidak valid.");
        }
        $sMeta = $standar['meta'] ?? [];

        $pdo->beginTransaction();
        $pdo->exec("DELETE FROM `standar_item`");
        $pdo->exec("DELETE FROM `standar_rekap`");
        $pdo->exec("DELETE FROM `standar_bidang`");

        $stmtBidang = $pdo->prepare("
            INSERT INTO `standar_bidang` (
                id, code, sheet_name, nama, category_id, prodi_json, satdik_ids_json,
                prasarana_count, sarana_count, total_items, group_notes_json,
                sumber, tanggal_data, sort_order
            ) VALUES (
                :id, :code, :sheet_name, :nama, :category_id, :prodi_json, :satdik_ids_json,
                :prasarana_count, :sarana_count, :total_items, :group_notes_json,
                :sumber, :tanggal_data, :sort_order
            )
        ");
        foreach (($standar['bidang'] ?? []) as $idx => $b) {
            $stmtBidang->execute([
                ':id' => $b['id'],
                ':code' => $b['code'],
                ':sheet_name' => $b['sheetName'],
                ':nama' => $b['nama'],
                ':category_id' => $b['categoryId'] ?? null,
                ':prodi_json' => json_encode($b['prodi'] ?? [], JSON_UNESCAPED_UNICODE),
                ':satdik_ids_json' => json_encode($b['satdikIds'] ?? [], JSON_UNESCAPED_UNICODE),
                ':prasarana_count' => $b['prasaranaCount'] ?? 0,
                ':sarana_count' => $b['saranaCount'] ?? 0,
                ':total_items' => $b['totalItems'] ?? 0,
                ':group_notes_json' => json_encode($b['groupNotes'] ?? [], JSON_UNESCAPED_UNICODE),
                ':sumber' => $sMeta['sumber'] ?? 'Data Contoh.xlsx',
                ':tanggal_data' => $sMeta['tanggalData'] ?? null,
                ':sort_order' => $idx + 1,
            ]);
        }

        $stmtStdRekap = $pdo->prepare("
            INSERT INTO `standar_rekap` (
                id, bidang_id, satdik_id,
                prasarana_total, prasarana_terpenuhi, prasarana_sebagian, prasarana_kosong,
                sarana_total, sarana_terpenuhi, sarana_sebagian, sarana_kosong,
                total_items, total_terpenuhi, total_sebagian, total_kosong,
                persen_prasarana, persen_sarana, persen_total, std_vol_sum, real_vol_sum
            ) VALUES (
                :id, :bidang_id, :satdik_id,
                :prasarana_total, :prasarana_terpenuhi, :prasarana_sebagian, :prasarana_kosong,
                :sarana_total, :sarana_terpenuhi, :sarana_sebagian, :sarana_kosong,
                :total_items, :total_terpenuhi, :total_sebagian, :total_kosong,
                :persen_prasarana, :persen_sarana, :persen_total, :std_vol_sum, :real_vol_sum
            )
        ");
        foreach (($standar['rekap'] ?? []) as $rk) {
            $stmtStdRekap->execute([
                ':id' => $rk['id'],
                ':bidang_id' => $rk['bidangId'],
                ':satdik_id' => $rk['satdikId'],
                ':prasarana_total' => $rk['prasaranaTotal'] ?? 0,
                ':prasarana_terpenuhi' => $rk['prasaranaTerpenuhi'] ?? 0,
                ':prasarana_sebagian' => $rk['prasaranaSebagian'] ?? 0,
                ':prasarana_kosong' => $rk['prasaranaKosong'] ?? 0,
                ':sarana_total' => $rk['saranaTotal'] ?? 0,
                ':sarana_terpenuhi' => $rk['saranaTerpenuhi'] ?? 0,
                ':sarana_sebagian' => $rk['saranaSebagian'] ?? 0,
                ':sarana_kosong' => $rk['saranaKosong'] ?? 0,
                ':total_items' => $rk['totalItems'] ?? 0,
                ':total_terpenuhi' => $rk['totalTerpenuhi'] ?? 0,
                ':total_sebagian' => $rk['totalSebagian'] ?? 0,
                ':total_kosong' => $rk['totalKosong'] ?? 0,
                ':persen_prasarana' => $rk['persenPrasarana'] ?? 0,
                ':persen_sarana' => $rk['persenSarana'] ?? 0,
                ':persen_total' => $rk['persenTotal'] ?? 0,
                ':std_vol_sum' => $rk['stdVolSum'] ?? 0,
                ':real_vol_sum' => $rk['realVolSum'] ?? 0,
            ]);
        }

        // Batch insert 4.369 baris standar_item per 200 baris untuk kecepatan optimal
        $allItems = $standar['items'] ?? [];
        $chunks = array_chunk($allItems, 200);
        $globalOrder = 0;
        foreach ($chunks as $chunk) {
            $placeholders = [];
            $params = [];
            foreach ($chunk as $it) {
                $globalOrder++;
                $placeholders[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $params[] = $it['id'];
                $params[] = $it['bidangId'];
                $params[] = $it['sec'];
                $params[] = $it['subSec'] ?? null;
                $params[] = $it['grpCode'] ?? null;
                $params[] = mb_substr($it['grpName'] ?? '', 0, 250);
                $params[] = !empty($it['subGrp']) ? mb_substr($it['subGrp'], 0, 250) : null;
                $params[] = $it['no'] ?? null;
                $params[] = $it['nama'];
                $params[] = $it['stdVol'] ?? 1;
                $params[] = $it['satuan'] ?? 'Unit';
                $params[] = json_encode($it['real'] ?? [], JSON_UNESCAPED_UNICODE);
                $params[] = $it['kondisi'] ?? null;
                $params[] = $it['ket'] ?? null;
                $params[] = $globalOrder;
            }
            $sqlBatch = "INSERT INTO `standar_item` (
                id, bidang_id, sec, sub_sec, grp_code, grp_name, sub_grp, item_no,
                nama, std_vol, satuan, realisasi_json, kondisi, keterangan, sort_order
            ) VALUES " . implode(',', $placeholders);
            $stmtBatch = $pdo->prepare($sqlBatch);
            $stmtBatch->execute($params);
        }

        $pdo->commit();
        echo "  -> Berhasil menyimpan " . count($standar['bidang']) . " bidang, "
            . count($standar['rekap']) . " rekap kampus, dan "
            . count($allItems) . " item standar sarpras prodi.\n";
    } else {
        echo "[7/8] Lewati data standar sarpras prodi (standar_data.json belum ada — jalankan: python Database/import_standar_sarpras.py)\n";
    }

    // 10. Data Tambak dan Kolam Satuan Pendidikan (hasil ekstraksi PDF 1c-Data Tambak dan Kolam)
    $tambakFile = __DIR__ . '/tambak_data.json';
    if (file_exists($tambakFile)) {
        echo "[8/8] Mengisi data prasarana dan sarana tambak & kolam...\n";
        $tambak = json_decode(file_get_contents($tambakFile), true);
        if (!$tambak) {
            throw new Exception("Format tambak_data.json tidak valid.");
        }

        $pdo->beginTransaction();
        $pdo->exec("DELETE FROM `tambak_unit`");
        $pdo->exec("DELETE FROM `tambak_rekap`");

        $stmtTambakRekap = $pdo->prepare("
            INSERT INTO `tambak_rekap` (
                satdik_id, nama_satdik, kode_satdik, jenjang,
                jumlah_unit, jumlah_tambak, jumlah_kolam, jumlah_tandon,
                luas_total_m2, luas_tambak_m2, luas_kolam_m2,
                kondisi_baik, kondisi_rusak_ringan, kondisi_rusak_berat,
                unit_aktif, unit_belum_dimanfaatkan, total_kincir,
                daya_listrik, lokasi_utama, map_url, keterangan
            ) VALUES (
                :satdik_id, :nama_satdik, :kode_satdik, :jenjang,
                :jumlah_unit, :jumlah_tambak, :jumlah_kolam, :jumlah_tandon,
                :luas_total_m2, :luas_tambak_m2, :luas_kolam_m2,
                :kondisi_baik, :kondisi_rusak_ringan, :kondisi_rusak_berat,
                :unit_aktif, :unit_belum_dimanfaatkan, :total_kincir,
                :daya_listrik, :lokasi_utama, :map_url, :keterangan
            )
        ");

        foreach (($tambak['summary'] ?? []) as $s) {
            $stmtTambakRekap->execute([
                ':satdik_id' => $s['satdikId'],
                ':nama_satdik' => $s['namaSatdik'],
                ':kode_satdik' => $s['kodeSatdik'] ?? '',
                ':jenjang' => $s['jenjang'] ?? 'Politeknik',
                ':jumlah_unit' => $s['jumlahUnit'] ?? 0,
                ':jumlah_tambak' => $s['jumlahTambak'] ?? 0,
                ':jumlah_kolam' => $s['jumlahKolam'] ?? 0,
                ':jumlah_tandon' => $s['jumlahTandon'] ?? 0,
                ':luas_total_m2' => $s['luasTotalM2'] ?? 0,
                ':luas_tambak_m2' => $s['luasTambakM2'] ?? 0,
                ':luas_kolam_m2' => $s['luasKolamM2'] ?? 0,
                ':kondisi_baik' => $s['kondisiBaik'] ?? 0,
                ':kondisi_rusak_ringan' => $s['kondisiRusakRingan'] ?? 0,
                ':kondisi_rusak_berat' => $s['kondisiRusakBerat'] ?? 0,
                ':unit_aktif' => $s['unitAktif'] ?? 0,
                ':unit_belum_dimanfaatkan' => $s['unitBelumDimanfaatkan'] ?? 0,
                ':total_kincir' => $s['totalKincir'] ?? 0,
                ':daya_listrik' => $s['dayaListrik'] ?? null,
                ':lokasi_utama' => $s['lokasiUtama'] ?? null,
                ':map_url' => $s['mapUrl'] ?? null,
                ':keterangan' => $s['keterangan'] ?? null,
            ]);
        }

        $stmtTambakUnit = $pdo->prepare("
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

        foreach (($tambak['units'] ?? []) as $u) {
            $stmtTambakUnit->execute([
                ':id' => $u['id'],
                ':satdik_id' => $u['satdikId'],
                ':no_urut' => $u['noUrut'] ?? 1,
                ':nama' => $u['nama'],
                ':jenis' => $u['jenis'] ?? 'Tambak',
                ':kampus_lokasi' => $u['kampusLokasi'] ?? null,
                ':luas_m2' => $u['luasM2'] ?? 0,
                ':luas_label' => $u['luasLabel'] ?? null,
                ':kondisi' => $u['kondisi'] ?? 'Baik',
                ':fungsi' => $u['fungsi'] ?? null,
                ':status_operasional' => $u['statusOperasional'] ?? 'Aktif Budidaya',
                ':pelataran' => $u['pelataran'] ?? null,
                ':pelataran_kategori' => $u['pelataranKategori'] ?? 'Tanah',
                ':listrik' => $u['listrik'] ?? null,
                ':kincir' => $u['kincir'] ?? null,
                ':jumlah_kincir' => $u['jumlahKincir'] ?? 0,
                ':lokasi_label' => $u['lokasiLabel'] ?? null,
                ':map_url' => $u['mapUrl'] ?? null,
                ':keterangan' => $u['keterangan'] ?? null,
            ]);
        }

        $pdo->commit();
        echo "  -> Berhasil menyimpan " . count($tambak['summary'] ?? []) . " rekap satdik dan "
            . count($tambak['units'] ?? []) . " unit tambak & kolam.\n";
    } else {
        echo "[8/8] Lewati data tambak & kolam (tambak_data.json belum ada — jalankan: python Database/import_tambak_kolam.py)\n";
    }

    echo "\n=== SEEDING BERHASIL! DATABASE KKP_SARPRAS_DB SIAP DIGUNAKAN ===\n";

} catch (Exception $e) {
    echo "\n[ERROR] Gagal saat inisialisasi: " . $e->getMessage() . "\n";
    exit(1);
}
