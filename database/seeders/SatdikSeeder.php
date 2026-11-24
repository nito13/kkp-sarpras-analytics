<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SatdikSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = database_path('data/seed_data.json');
        if (!file_exists($jsonFile)) {
            $this->command?->warn("File {$jsonFile} tidak ditemukan, melewati SatdikSeeder.");
            return;
        }

        $data = json_decode(file_get_contents($jsonFile), true);
        $satdiks = $data['satdik'] ?? [];

        foreach ($satdiks as $s) {
            DB::table('satdik')->updateOrInsert(
                ['id' => $s['id']],
                [
                    'name' => $s['name'],
                    'short_name' => $s['shortName'] ?? null,
                    'jenjang' => $s['jenjang'] ?? null,
                    'type' => $s['type'] ?? null,
                    'provinsi' => $s['provinsi'] ?? null,
                    'kota' => $s['kota'] ?? null,
                    'region' => $s['region'] ?? null,
                    'lat' => $s['lat'] ?? null,
                    'lng' => $s['lng'] ?? null,
                    'map_x' => $s['mapX'] ?? null,
                    'map_y' => $s['mapY'] ?? null,
                    'taruna_count' => $s['tarunaCount'] ?? 0,
                    'dosen_count' => $s['dosenCount'] ?? 0,
                    'luas_lahan_ha' => $s['luasLahanHa'] ?? 0,
                    'luas_bangunan_m2' => $s['luasBangunanM2'] ?? 0,
                    'akreditasi' => $s['akreditasi'] ?? null,
                    'established_year' => $s['establishedYear'] ?? null,
                    'kampus_cabang_json' => isset($s['kampusCabang']) ? json_encode($s['kampusCabang'], JSON_UNESCAPED_UNICODE) : null,
                    'rector' => $s['rector'] ?? null,
                    'prodi_json' => isset($s['prodi']) ? json_encode($s['prodi'], JSON_UNESCAPED_UNICODE) : null,
                ]
            );
        }

        $this->command?->info('SatdikSeeder: ' . count($satdiks) . ' Satuan Pendidikan KKP berhasil disinkronkan.');
    }
}
