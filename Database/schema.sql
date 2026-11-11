-- Skema Database Sarana dan Prasarana Satuan Pendidikan KP untuk MySQL Laragon
CREATE DATABASE IF NOT EXISTS `kkp_sarpras_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `kkp_sarpras_db`;

-- 1. Tabel Satuan Pendidikan (18 Kampus Vokasi KKP)
CREATE TABLE IF NOT EXISTS `satdik` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `short_name` VARCHAR(100) NULL,
    `jenjang` VARCHAR(50) NULL,
    `type` VARCHAR(50) NULL,
    `provinsi` VARCHAR(100) NULL,
    `kota` VARCHAR(100) NULL,
    `region` VARCHAR(50) NULL,
    `lat` DECIMAL(10, 6) NULL,
    `lng` DECIMAL(10, 6) NULL,
    `map_x` INT NULL,
    `map_y` INT NULL,
    `taruna_count` INT DEFAULT 0,
    `dosen_count` INT DEFAULT 0,
    `luas_lahan_ha` DECIMAL(8, 2) DEFAULT 0,
    `luas_bangunan_m2` DECIMAL(10, 2) DEFAULT 0,
    `akreditasi` VARCHAR(50) NULL,
    `established_year` INT NULL,
    `kampus_cabang_json` TEXT NULL,
    `rector` VARCHAR(255) NULL,
    `prodi_json` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Akun Pengguna & Hak Akses
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `nip` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `role_label` VARCHAR(100) NULL,
    `jabatan` VARCHAR(255) NULL,
    `unit_kerja` VARCHAR(255) NULL,
    `accessible_satdik` VARCHAR(50) DEFAULT 'ALL',
    `satdik_name` VARCHAR(255) NULL,
    `permissions_json` TEXT NULL,
    `avatar_url` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Aset Sarana & Prasarana
CREATE TABLE IF NOT EXISTS `assets` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `satdik_id` VARCHAR(50) NOT NULL,
    `satdik_name` VARCHAR(255) NOT NULL,
    `prodi` VARCHAR(150) NULL,
    `category` VARCHAR(100) NOT NULL,
    `condition` VARCHAR(50) NOT NULL,
    `condition_score` INT DEFAULT 80,
    `acquisition_year` INT NULL,
    `utilization_rate` INT DEFAULT 0,
    `capacity_desc` TEXT NULL,
    `specs` TEXT NULL,
    `cert_expiry_date` DATE NULL,
    `last_maintenance_date` DATE NULL,
    `next_maintenance_date` DATE NULL,
    `maintenance_urgency` VARCHAR(50) DEFAULT 'Normal',
    `issues_summary` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_satdik` (`satdik_id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_condition` (`condition`),
    CONSTRAINT `fk_asset_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Rekapitulasi Ketersediaan Asrama per Satdik (sumber: Excel Rekap Asrama, sheet "Rekap")
CREATE TABLE IF NOT EXISTS `asrama_rekap` (
    `satdik_id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nama_excel` VARCHAR(255) NULL,
    `jumlah_asrama` INT DEFAULT 0,
    `jumlah_kamar` INT DEFAULT 0,
    `luas_m2` DECIMAL(10, 2) DEFAULT 0,
    `kapasitas` DECIMAL(10, 2) DEFAULT 0,
    `kapasitas_aktif` DECIMAL(10, 2) DEFAULT 0,
    `luas_adjustment` DECIMAL(10, 2) NULL,
    `kapasitas_adjustment` DECIMAL(10, 2) NULL,
    `jumlah_tidak_dipakai` INT DEFAULT 0,
    `jumlah_perlu_renovasi` INT DEFAULT 0,
    `keterangan` TEXT NULL,
    `drive_url` TEXT NULL,
    `sumber` VARCHAR(255) NULL,
    `tanggal_data` DATE NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_asrama_rekap_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Detail Gedung Asrama per Satdik (sumber: Excel Rekap Asrama, sheet detail per kampus)
CREATE TABLE IF NOT EXISTS `asrama_gedung` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `satdik_id` VARCHAR(50) NOT NULL,
    `kampus` VARCHAR(150) NULL,
    `nama` VARCHAR(255) NOT NULL,
    `peruntukan` VARCHAR(50) NULL,
    `jumlah_kamar` INT DEFAULT 0,
    `luas_m2` DECIMAL(10, 2) DEFAULT 0,
    `kapasitas` DECIMAL(10, 2) DEFAULT 0,
    `status` VARCHAR(50) DEFAULT 'Digunakan',
    `keterangan` TEXT NULL,
    `rincian_json` TEXT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_asrama_satdik` (`satdik_id`),
    CONSTRAINT `fk_asrama_gedung_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. Master Bidang / Rumpun Standar Minimal Sarpras Prodi (sumber: Excel/Data Contoh.xlsx)
CREATE TABLE IF NOT EXISTS `standar_bidang` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `code` VARCHAR(10) NOT NULL,
    `sheet_name` VARCHAR(150) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `category_id` VARCHAR(100) NULL,
    `prodi_json` TEXT NULL,
    `satdik_ids_json` TEXT NULL,
    `prasarana_count` INT DEFAULT 0,
    `sarana_count` INT DEFAULT 0,
    `total_items` INT DEFAULT 0,
    `group_notes_json` LONGTEXT NULL,
    `sumber` VARCHAR(255) NULL,
    `tanggal_data` DATE NULL,
    `sort_order` INT DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Rekapitulasi Pemenuhan Standar Minimal per Bidang & Satdik
CREATE TABLE IF NOT EXISTS `standar_rekap` (
    `id` VARCHAR(80) NOT NULL PRIMARY KEY,
    `bidang_id` VARCHAR(50) NOT NULL,
    `satdik_id` VARCHAR(50) NOT NULL,
    `prasarana_total` INT DEFAULT 0,
    `prasarana_terpenuhi` INT DEFAULT 0,
    `prasarana_sebagian` INT DEFAULT 0,
    `prasarana_kosong` INT DEFAULT 0,
    `sarana_total` INT DEFAULT 0,
    `sarana_terpenuhi` INT DEFAULT 0,
    `sarana_sebagian` INT DEFAULT 0,
    `sarana_kosong` INT DEFAULT 0,
    `total_items` INT DEFAULT 0,
    `total_terpenuhi` INT DEFAULT 0,
    `total_sebagian` INT DEFAULT 0,
    `total_kosong` INT DEFAULT 0,
    `persen_prasarana` DECIMAL(5, 1) DEFAULT 0,
    `persen_sarana` DECIMAL(5, 1) DEFAULT 0,
    `persen_total` DECIMAL(5, 1) DEFAULT 0,
    `std_vol_sum` DECIMAL(12, 2) DEFAULT 0,
    `real_vol_sum` DECIMAL(12, 2) DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_std_rekap_bidang` (`bidang_id`),
    INDEX `idx_std_rekap_satdik` (`satdik_id`),
    CONSTRAINT `fk_std_rekap_bidang` FOREIGN KEY (`bidang_id`) REFERENCES `standar_bidang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_std_rekap_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Katalog & Realisasi Item Standar Minimal Sarpras Prodi (4.369 item standar)
CREATE TABLE IF NOT EXISTS `standar_item` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `bidang_id` VARCHAR(50) NOT NULL,
    `sec` CHAR(1) NOT NULL,
    `sub_sec` VARCHAR(10) NULL,
    `grp_code` VARCHAR(30) NULL,
    `grp_name` VARCHAR(255) NOT NULL,
    `sub_grp` VARCHAR(255) NULL,
    `item_no` VARCHAR(20) NULL,
    `nama` TEXT NOT NULL,
    `std_vol` DECIMAL(10, 2) DEFAULT 1,
    `satuan` VARCHAR(50) DEFAULT 'Unit',
    `realisasi_json` TEXT NOT NULL,
    `kondisi` VARCHAR(10) NULL,
    `keterangan` TEXT NULL,
    `sort_order` INT DEFAULT 0,
    INDEX `idx_std_item_bidang_sec` (`bidang_id`, `sec`, `sort_order`),
    CONSTRAINT `fk_std_item_bidang` FOREIGN KEY (`bidang_id`) REFERENCES `standar_bidang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Rekapitulasi Prasarana & Sarana Tambak dan Kolam per Satdik
CREATE TABLE IF NOT EXISTS `tambak_rekap` (
    `satdik_id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nama_satdik` VARCHAR(100) NOT NULL,
    `kode_satdik` VARCHAR(20) NOT NULL DEFAULT '',
    `jenjang` VARCHAR(50) NOT NULL DEFAULT 'Politeknik',
    `jumlah_unit` INT DEFAULT 0,
    `jumlah_tambak` INT DEFAULT 0,
    `jumlah_kolam` INT DEFAULT 0,
    `jumlah_tandon` INT DEFAULT 0,
    `luas_total_m2` DECIMAL(12, 2) DEFAULT 0,
    `luas_tambak_m2` DECIMAL(12, 2) DEFAULT 0,
    `luas_kolam_m2` DECIMAL(12, 2) DEFAULT 0,
    `kondisi_baik` INT DEFAULT 0,
    `kondisi_rusak_ringan` INT DEFAULT 0,
    `kondisi_rusak_berat` INT DEFAULT 0,
    `unit_aktif` INT DEFAULT 0,
    `unit_belum_dimanfaatkan` INT DEFAULT 0,
    `total_kincir` INT DEFAULT 0,
    `daya_listrik` VARCHAR(255) NULL,
    `lokasi_utama` VARCHAR(255) NULL,
    `map_url` TEXT NULL,
    `keterangan` TEXT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tambak_rekap_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Detail Unit Tambak dan Kolam Satuan Pendidikan (370 unit)
CREATE TABLE IF NOT EXISTS `tambak_unit` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `satdik_id` VARCHAR(50) NOT NULL,
    `no_urut` INT DEFAULT 1,
    `nama` VARCHAR(200) NOT NULL,
    `jenis` VARCHAR(50) NOT NULL DEFAULT 'Tambak',
    `kampus_lokasi` VARCHAR(200) NULL,
    `luas_m2` DECIMAL(12, 2) DEFAULT 0,
    `luas_label` VARCHAR(80) NULL,
    `kondisi` VARCHAR(50) NOT NULL DEFAULT 'Baik',
    `fungsi` VARCHAR(255) NULL,
    `status_operasional` VARCHAR(80) NOT NULL DEFAULT 'Aktif Budidaya',
    `pelataran` VARCHAR(120) NULL,
    `pelataran_kategori` VARCHAR(80) NULL,
    `listrik` VARCHAR(255) NULL,
    `kincir` VARCHAR(255) NULL,
    `jumlah_kincir` INT DEFAULT 0,
    `lokasi_label` VARCHAR(255) NULL,
    `map_url` TEXT NULL,
    `keterangan` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tambak_unit_satdik` (`satdik_id`),
    INDEX `idx_tambak_unit_jenis` (`jenis`),
    INDEX `idx_tambak_unit_kondisi` (`kondisi`),
    CONSTRAINT `fk_tambak_unit_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
