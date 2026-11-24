<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminPerms = json_encode(['view_all', 'edit_all', 'delete', 'manage_users', 'view_audit_logs', 'manage_database', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports', 'full_control'], JSON_UNESCAPED_UNICODE);
        $pusdikPerms = json_encode(['view_all', 'edit_all', 'delete', 'approve_budget', 'request_maintenance', 'export_rka', 'export_reports'], JSON_UNESCAPED_UNICODE);
        $operatorPerms = json_encode(['view_all', 'edit_own', 'request_maintenance', 'export_reports'], JSON_UNESCAPED_UNICODE);

        $defaultAccounts = [
            ['USR-ADMIN', 'Super Administrator Sistem Sarpras KP', '198001012005011001', 'administrator@kkp.go.id', 'administrator', 'administrator', 'Administrator Utama (Full Control)', 'Super Administrator Sistem & Database Sarpras KP', 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP', 'ALL', 'Seluruh Satuan Pendidikan (18 Kampus KKP) — Kendali Penuh', $adminPerms],
            ['USR-001', 'Admin Sarpras Pusdik KP', '198503122009011002', 'admin.pusdik@kkp.go.id', 'pusdik', 'admin_pusdik', 'Admin Pusat (Pusdik KP)', 'Koordinator Kelompok Sarana dan Prasarana Pusdik KP', 'Pusat Pendidikan Kelautan dan Perikanan (Pusdik KP) - BPPSDM KP', 'ALL', 'Seluruh Satuan Pendidikan (18 Kampus KKP)', $pusdikPerms],
            ['USR-SAT-01', 'Admin Sarpras Politeknik AUP Jakarta', '198601012010011001', 'sarpras.aup@kkp.go.id', 'aup', 'operator_kampus', 'Operator Satdik — Politeknik AUP', 'Kepala Subbagian Umum & Sarpras Politeknik AUP', 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta', 'poltek-aup', 'Politeknik Ahli Usaha Perikanan (AUP) Jakarta', $operatorPerms],
            ['USR-SAT-02', 'Admin Sarpras Politeknik KP Sidoarjo', '198602012010011002', 'sarpras.sidoarjo@kkp.go.id', 'sidoarjo', 'operator_kampus', 'Operator Satdik — Poltek KP Sidoarjo', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Sidoarjo', 'poltek-kp-sidoarjo', 'Politeknik Kelautan dan Perikanan Sidoarjo', $operatorPerms],
            ['USR-SAT-03', 'Admin Sarpras Politeknik KP Bitung', '198603012010011003', 'sarpras.bitung@kkp.go.id', 'bitung', 'operator_kampus', 'Operator Satdik — Poltek KP Bitung', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Bitung', 'poltek-kp-bitung', 'Politeknik Kelautan dan Perikanan Bitung', $operatorPerms],
            ['USR-SAT-04', 'Admin Sarpras Politeknik KP Sorong', '198604012010011004', 'sarpras.polteksorong@kkp.go.id', 'polteksorong', 'operator_kampus', 'Operator Satdik — Poltek KP Sorong', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Sorong', 'poltek-kp-sorong', 'Politeknik Kelautan dan Perikanan Sorong', $operatorPerms],
            ['USR-SAT-05', 'Admin Sarpras Politeknik KP Karawang', '198605012010011005', 'sarpras.karawang@kkp.go.id', 'karawang', 'operator_kampus', 'Operator Satdik — Poltek KP Karawang', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Karawang', 'poltek-kp-karawang', 'Politeknik Kelautan dan Perikanan Karawang', $operatorPerms],
            ['USR-SAT-06', 'Admin Sarpras Politeknik KP Bone', '198606012010011006', 'sarpras.bone@kkp.go.id', 'bone', 'operator_kampus', 'Operator Satdik — Poltek KP Bone', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Bone', 'poltek-kp-bone', 'Politeknik Kelautan dan Perikanan Bone', $operatorPerms],
            ['USR-SAT-07', 'Admin Sarpras Politeknik KP Kupang', '198607012010011007', 'sarpras.kupang@kkp.go.id', 'kupang', 'operator_kampus', 'Operator Satdik — Poltek KP Kupang', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Kupang', 'poltek-kp-kupang', 'Politeknik Kelautan dan Perikanan Kupang', $operatorPerms],
            ['USR-SAT-08', 'Admin Sarpras Politeknik KP Dumai', '198608012010011008', 'sarpras.dumai@kkp.go.id', 'dumai', 'operator_kampus', 'Operator Satdik — Poltek KP Dumai', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Dumai', 'poltek-kp-dumai', 'Politeknik Kelautan dan Perikanan Dumai', $operatorPerms],
            ['USR-SAT-09', 'Admin Sarpras Politeknik KP Pangandaran', '198609012010011009', 'sarpras.pangandaran@kkp.go.id', 'pangandaran', 'operator_kampus', 'Operator Satdik — Poltek KP Pangandaran', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Pangandaran', 'poltek-kp-pangandaran', 'Politeknik Kelautan dan Perikanan Pangandaran', $operatorPerms],
            ['USR-SAT-10', 'Admin Sarpras Politeknik KP Jembrana', '198610012010011010', 'sarpras.jembrana@kkp.go.id', 'jembrana', 'operator_kampus', 'Operator Satdik — Poltek KP Jembrana', 'Pengelola Sarana dan Prasarana Kampus', 'Politeknik Kelautan dan Perikanan Jembrana', 'poltek-kp-jembrana', 'Politeknik Kelautan dan Perikanan Jembrana', $operatorPerms],
            ['USR-SAT-11', 'Admin Sarpras AK-KP Wakatobi', '198611012010011011', 'sarpras.wakatobi@kkp.go.id', 'wakatobi', 'operator_kampus', 'Operator Satdik — AK-KP Wakatobi', 'Pengelola Sarana dan Prasarana Kampus', 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', 'akkp-wakatobi', 'Akademi Komunitas Kelautan dan Perikanan Wakatobi', $operatorPerms],
            ['USR-SAT-12', 'Admin Sarpras SUPM Ladong', '198612012010011012', 'sarpras.ladong@kkp.go.id', 'ladong', 'operator_kampus', 'Operator Satdik — SUPM Ladong', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Ladong Aceh', 'supm-ladong', 'SUPM Negeri Ladong Aceh', $operatorPerms],
            ['USR-SAT-13', 'Admin Sarpras SUPM Pariaman', '198701012010011013', 'sarpras.pariaman@kkp.go.id', 'pariaman', 'operator_kampus', 'Operator Satdik — SUPM Pariaman', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Pariaman', 'supm-pariaman', 'SUPM Negeri Pariaman', $operatorPerms],
            ['USR-SAT-14', 'Admin Sarpras SUPM Kota Agung', '198702012010011014', 'sarpras.kotaagung@kkp.go.id', 'kotaagung', 'operator_kampus', 'Operator Satdik — SUPM Kota Agung', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Kota Agung', 'supm-kotaagung', 'SUPM Negeri Kota Agung', $operatorPerms],
            ['USR-SAT-15', 'Admin Sarpras SUPM Tegal', '198703012010011015', 'sarpras.tegal@kkp.go.id', 'tegal', 'operator_kampus', 'Operator Satdik — SUPM Tegal', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Tegal', 'supm-tegal', 'SUPM Negeri Tegal', $operatorPerms],
            ['USR-SAT-16', 'Admin Sarpras SUPM Pontianak', '198704012010011016', 'sarpras.pontianak@kkp.go.id', 'pontianak', 'operator_kampus', 'Operator Satdik — SUPM Pontianak', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Pontianak', 'supm-pontianak', 'SUPM Negeri Pontianak', $operatorPerms],
            ['USR-SAT-17', 'Admin Sarpras SUPM Waiheru Ambon', '198705012010011017', 'sarpras.waiheru@kkp.go.id', 'waiheru', 'operator_kampus', 'Operator Satdik — SUPM Waiheru', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Waiheru Ambon', 'supm-waiheru', 'SUPM Negeri Waiheru Ambon', $operatorPerms],
            ['USR-SAT-18', 'Admin Sarpras SUPM Sorong', '198706012010011018', 'sarpras.supmsorong@kkp.go.id', 'supmsorong', 'operator_kampus', 'Operator Satdik — SUPM Sorong', 'Pengelola Sarana dan Prasarana Sekolah', 'SUPM Negeri Sorong', 'supm-sorong', 'SUPM Negeri Sorong', $operatorPerms],
        ];

        foreach ($defaultAccounts as $acc) {
            $existing = DB::table('users')->where('id', $acc[0])->orWhere('email', $acc[3])->first();
            if ($existing) {
                DB::table('users')->where('id', $existing->id)->update([
                    'name' => $acc[1],
                    'role' => $acc[5],
                    'role_label' => $acc[6],
                    'jabatan' => $acc[7],
                    'accessible_satdik' => $acc[9],
                    'satdik_name' => $acc[10],
                    'permissions_json' => $acc[11],
                ]);
            } else {
                DB::table('users')->insert([
                    'id' => $acc[0],
                    'name' => $acc[1],
                    'nip' => $acc[2],
                    'email' => $acc[3],
                    'password' => Hash::make($acc[4]),
                    'role' => $acc[5],
                    'role_label' => $acc[6],
                    'jabatan' => $acc[7],
                    'unit_kerja' => $acc[8],
                    'accessible_satdik' => $acc[9],
                    'satdik_name' => $acc[10],
                    'permissions_json' => $acc[11],
                    'avatar_url' => '',
                    'created_at' => now(),
                ]);
            }
        }

        $this->command?->info('UserSeeder: ' . count($defaultAccounts) . ' akun kedinasan KKP (Bcrypt) berhasil disinkronkan.');
    }
}
