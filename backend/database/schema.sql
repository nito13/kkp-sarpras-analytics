-- Skema Database SARPRAS KKP untuk MySQL Laragon
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
    `category` VARCHAR(100) NOT NULL,
    `subcategory` VARCHAR(150) NULL,
    `condition` VARCHAR(50) NOT NULL,
    `condition_score` INT DEFAULT 80,
    `acquisition_year` INT NULL,
    `utilization_rate` INT DEFAULT 0,
    `capacity_desc` TEXT NULL,
    `specs` TEXT NULL,
    `certification_status` VARCHAR(100) NULL,
    `certification_authority` VARCHAR(255) NULL,
    `cert_expiry_date` DATE NULL,
    `last_maintenance_date` DATE NULL,
    `next_maintenance_date` DATE NULL,
    `maintenance_urgency` VARCHAR(50) DEFAULT 'Normal',
    `estimated_repair_cost` BIGINT DEFAULT 0,
    `issues_summary` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_satdik` (`satdik_id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_condition` (`condition`),
    CONSTRAINT `fk_asset_satdik` FOREIGN KEY (`satdik_id`) REFERENCES `satdik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
