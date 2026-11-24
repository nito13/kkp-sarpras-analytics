<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TambakSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('data/tambak_data.json');
        if (!file_exists($file)) {
            $this->command?->warn("File {$file} tidak ditemukan, melewati TambakSeeder.");
            return;
        }

        $tambak = json_decode(file_get_contents($file), true);
        if (!$tambak) {
            return;
        }

        DB::transaction(function () use ($tambak) {
            foreach (($tambak['summary'] ?? []) as $s) {
                DB::table('tambak_rekap')->updateOrInsert(
                    ['satdik_id' => $s['satdikId']],
                    [
                        'nama_satdik' => $s['namaSatdik'],
                        'kode_satdik' => $s['kodeSatdik'] ?? '',
                        'jenjang' => $s['jenjang'] ?? 'Politeknik',
                        'jumlah_unit' => $s['jumlahUnit'] ?? 0,
                        'jumlah_tambak' => $s['jumlahTambak'] ?? 0,
                        'jumlah_kolam' => $s['jumlahKolam'] ?? 0,
                        'jumlah_tandon' => $s['jumlahTandon'] ?? 0,
                        'luas_total_m2' => $s['luasTotalM2'] ?? 0,
                        'luas_tambak_m2' => $s['luasTambakM2'] ?? 0,
                        'luas_kolam_m2' => $s['luasKolamM2'] ?? 0,
                        'kondisi_baik' => $s['kondisiBaik'] ?? 0,
                        'kondisi_rusak_ringan' => $s['kondisiRusakRingan'] ?? 0,
                        'kondisi_rusak_berat' => $s['kondisiRusakBerat'] ?? 0,
                        'unit_aktif' => $s['unitAktif'] ?? 0,
                        'unit_belum_dimanfaatkan' => $s['unitBelumDimanfaatkan'] ?? 0,
                        'total_kincir' => $s['totalKincir'] ?? 0,
                        'daya_listrik' => $s['dayaListrik'] ?? null,
                        'lokasi_utama' => $s['lokasiUtama'] ?? null,
                        'map_url' => $s['mapUrl'] ?? null,
                        'keterangan' => $s['keterangan'] ?? null,
                    ]
                );
            }

            foreach (array_chunk($tambak['units'] ?? [], 100) as $chunk) {
                $rows = [];
                foreach ($chunk as $u) {
                    $rows[] = [
                        'id' => $u['id'],
                        'satdik_id' => $u['satdikId'],
                        'no_urut' => $u['noUrut'] ?? 1,
                        'nama' => $u['nama'],
                        'jenis' => $u['jenis'] ?? 'Tambak',
                        'kampus_lokasi' => $u['kampusLokasi'] ?? null,
                        'luas_m2' => $u['luasM2'] ?? 0,
                        'luas_label' => $u['luasLabel'] ?? null,
                        'kondisi' => $u['kondisi'] ?? 'Baik',
                        'fungsi' => $u['fungsi'] ?? null,
                        'status_operasional' => $u['statusOperasional'] ?? 'Aktif Budidaya',
                        'pelataran' => $u['pelataran'] ?? null,
                        'pelataran_kategori' => $u['pelataranKategori'] ?? 'Tanah',
                        'listrik' => $u['listrik'] ?? null,
                        'kincir' => $u['kincir'] ?? null,
                        'jumlah_kincir' => $u['jumlahKincir'] ?? 0,
                        'lokasi_label' => $u['lokasiLabel'] ?? null,
                        'map_url' => $u['mapUrl'] ?? null,
                        'keterangan' => $u['keterangan'] ?? null,
                    ];
                }
                DB::table('tambak_unit')->upsert(
                    $rows,
                    ['id'],
                    ['satdik_id', 'no_urut', 'nama', 'jenis', 'kampus_lokasi', 'luas_m2', 'luas_label', 'kondisi', 'fungsi', 'status_operasional', 'pelataran', 'pelataran_kategori', 'listrik', 'kincir', 'jumlah_kincir', 'lokasi_label', 'map_url', 'keterangan']
                );
            }
        });

        $this->command?->info('TambakSeeder: ' . count($tambak['summary'] ?? []) . ' rekap & ' . count($tambak['units'] ?? []) . ' unit tambak/kolam disinkronkan.');
    }
}
