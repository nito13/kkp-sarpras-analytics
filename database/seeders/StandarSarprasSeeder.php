<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StandarSarprasSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('data/standar_data.json');
        if (!file_exists($file)) {
            $this->command?->warn("File {$file} tidak ditemukan, melewati StandarSarprasSeeder.");
            return;
        }

        $standar = json_decode(file_get_contents($file), true);
        if (!$standar) {
            return;
        }
        $meta = $standar['meta'] ?? [];

        DB::transaction(function () use ($standar, $meta) {
            foreach (($standar['bidang'] ?? []) as $idx => $b) {
                DB::table('standar_bidang')->updateOrInsert(
                    ['id' => $b['id']],
                    [
                        'code' => $b['code'],
                        'sheet_name' => $b['sheetName'],
                        'nama' => $b['nama'],
                        'category_id' => $b['categoryId'] ?? null,
                        'prodi_json' => json_encode($b['prodi'] ?? [], JSON_UNESCAPED_UNICODE),
                        'satdik_ids_json' => json_encode($b['satdikIds'] ?? [], JSON_UNESCAPED_UNICODE),
                        'prasarana_count' => $b['prasaranaCount'] ?? 0,
                        'sarana_count' => $b['saranaCount'] ?? 0,
                        'total_items' => $b['totalItems'] ?? 0,
                        'group_notes_json' => json_encode($b['groupNotes'] ?? [], JSON_UNESCAPED_UNICODE),
                        'sumber' => $meta['sumber'] ?? 'Data Contoh.xlsx',
                        'tanggal_data' => $meta['tanggalData'] ?? null,
                        'sort_order' => $idx + 1,
                    ]
                );
            }

            foreach (($standar['rekap'] ?? []) as $rk) {
                DB::table('standar_rekap')->updateOrInsert(
                    ['id' => $rk['id']],
                    [
                        'bidang_id' => $rk['bidangId'],
                        'satdik_id' => $rk['satdikId'],
                        'prasarana_total' => $rk['prasaranaTotal'] ?? 0,
                        'prasarana_terpenuhi' => $rk['prasaranaTerpenuhi'] ?? 0,
                        'prasarana_sebagian' => $rk['prasaranaSebagian'] ?? 0,
                        'prasarana_kosong' => $rk['prasaranaKosong'] ?? 0,
                        'sarana_total' => $rk['saranaTotal'] ?? 0,
                        'sarana_terpenuhi' => $rk['saranaTerpenuhi'] ?? 0,
                        'sarana_sebagian' => $rk['saranaSebagian'] ?? 0,
                        'sarana_kosong' => $rk['saranaKosong'] ?? 0,
                        'total_items' => $rk['totalItems'] ?? 0,
                        'total_terpenuhi' => $rk['totalTerpenuhi'] ?? 0,
                        'total_sebagian' => $rk['totalSebagian'] ?? 0,
                        'total_kosong' => $rk['totalKosong'] ?? 0,
                        'persen_prasarana' => $rk['persenPrasarana'] ?? 0,
                        'persen_sarana' => $rk['persenSarana'] ?? 0,
                        'persen_total' => $rk['persenTotal'] ?? 0,
                        'std_vol_sum' => $rk['stdVolSum'] ?? 0,
                        'real_vol_sum' => $rk['realVolSum'] ?? 0,
                    ]
                );
            }

            // Batch upsert 4.369 item standar per 200 baris
            $allItems = $standar['items'] ?? [];
            $globalOrder = 0;
            foreach (array_chunk($allItems, 200) as $chunk) {
                $rows = [];
                foreach ($chunk as $it) {
                    $globalOrder++;
                    $rows[] = [
                        'id' => $it['id'],
                        'bidang_id' => $it['bidangId'],
                        'sec' => $it['sec'],
                        'sub_sec' => $it['subSec'] ?? null,
                        'grp_code' => $it['grpCode'] ?? null,
                        'grp_name' => mb_substr($it['grpName'] ?? '', 0, 250),
                        'sub_grp' => !empty($it['subGrp']) ? mb_substr($it['subGrp'], 0, 250) : null,
                        'item_no' => $it['no'] ?? null,
                        'nama' => $it['nama'],
                        'std_vol' => $it['stdVol'] ?? 1,
                        'satuan' => $it['satuan'] ?? 'Unit',
                        'realisasi_json' => json_encode($it['real'] ?? [], JSON_UNESCAPED_UNICODE),
                        'kondisi' => $it['kondisi'] ?? null,
                        'keterangan' => $it['ket'] ?? null,
                        'sort_order' => $globalOrder,
                    ];
                }
                DB::table('standar_item')->upsert(
                    $rows,
                    ['id'],
                    ['bidang_id', 'sec', 'sub_sec', 'grp_code', 'grp_name', 'sub_grp', 'item_no', 'nama', 'std_vol', 'satuan', 'realisasi_json', 'kondisi', 'keterangan', 'sort_order']
                );
            }
        });

        $this->command?->info('StandarSarprasSeeder: ' . count($standar['bidang'] ?? []) . ' bidang, ' . count($standar['rekap'] ?? []) . ' rekap, & ' . count($standar['items'] ?? []) . ' item disinkronkan.');
    }
}
