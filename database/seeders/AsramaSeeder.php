<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsramaSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('data/asrama_data.json');
        if (!file_exists($file)) {
            $this->command?->warn("File {$file} tidak ditemukan, melewati AsramaSeeder.");
            return;
        }

        $asrama = json_decode(file_get_contents($file), true);
        if (!$asrama) {
            return;
        }
        $meta = $asrama['meta'] ?? [];

        DB::transaction(function () use ($asrama, $meta) {
            foreach (($asrama['summary'] ?? []) as $s) {
                DB::table('asrama_rekap')->updateOrInsert(
                    ['satdik_id' => $s['satdikId']],
                    [
                        'nama_excel' => $s['namaExcel'] ?? null,
                        'jumlah_asrama' => $s['jumlahAsrama'] ?? 0,
                        'jumlah_kamar' => $s['jumlahKamar'] ?? 0,
                        'luas_m2' => $s['luasM2'] ?? 0,
                        'kapasitas' => $s['kapasitas'] ?? 0,
                        'kapasitas_aktif' => $s['kapasitasAktif'] ?? 0,
                        'luas_adjustment' => $s['luasAdjustment'] ?? null,
                        'kapasitas_adjustment' => $s['kapasitasAdjustment'] ?? null,
                        'jumlah_tidak_dipakai' => $s['jumlahTidakDipakai'] ?? 0,
                        'jumlah_perlu_renovasi' => $s['jumlahPerluRenovasi'] ?? 0,
                        'keterangan' => $s['keterangan'] ?? null,
                        'drive_url' => $s['driveUrl'] ?? null,
                        'sumber' => $meta['sumber'] ?? null,
                        'tanggal_data' => $meta['tanggalData'] ?? null,
                    ]
                );
            }

            foreach (($asrama['buildings'] ?? []) as $b) {
                DB::table('asrama_gedung')->updateOrInsert(
                    ['id' => $b['id']],
                    [
                        'satdik_id' => $b['satdikId'],
                        'kampus' => $b['kampus'] ?? null,
                        'nama' => $b['nama'],
                        'peruntukan' => $b['peruntukan'] ?? null,
                        'jumlah_kamar' => $b['jumlahKamar'] ?? 0,
                        'luas_m2' => $b['luasM2'] ?? 0,
                        'kapasitas' => $b['kapasitas'] ?? 0,
                        'status' => $b['status'] ?? 'Digunakan',
                        'keterangan' => $b['keterangan'] ?? null,
                        'rincian_json' => json_encode($b['rincian'] ?? [], JSON_UNESCAPED_UNICODE),
                    ]
                );
            }
        });

        $this->command?->info('AsramaSeeder: ' . count($asrama['summary'] ?? []) . ' rekap & ' . count($asrama['buildings'] ?? []) . ' gedung asrama disinkronkan.');
    }
}
