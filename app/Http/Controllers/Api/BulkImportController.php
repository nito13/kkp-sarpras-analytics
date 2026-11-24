<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AsramaGedung;
use App\Models\GedungBangunan;
use App\Models\KapalLatih;
use App\Models\StandarBidang;
use App\Models\StandarItem;
use App\Models\TanahBidang;
use App\Services\AsramaService;
use App\Services\SatdikMapService;
use App\Services\StandarSarprasService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BulkImportController extends Controller
{
    public function __construct(
        private AsramaService $asramaService,
        private StandarSarprasService $standarService,
        private SatdikMapService $satdikMap
    ) {
    }

    public function status(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'endpoint' => 'bulk_import',
            'ready' => true,
            'message' => 'Endpoint Batch Import Excel Sarana dan Prasarana Satuan Pendidikan KP siap menerima metode POST JSON.',
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $payload = $request->all();
        if (!is_array($payload)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Format JSON tidak valid.',
            ], 400);
        }

        $inBuildings = isset($payload['buildings']) && is_array($payload['buildings']) ? $payload['buildings'] : [];
        $inStandar = isset($payload['standarItems']) && is_array($payload['standarItems']) ? $payload['standarItems'] : [];
        $inTanah = isset($payload['tanahParcels']) && is_array($payload['tanahParcels']) ? $payload['tanahParcels'] : [];
        $inKapal = isset($payload['kapalVessels']) && is_array($payload['kapalVessels']) ? $payload['kapalVessels'] : [];
        $inGedung = isset($payload['gedungItems']) && is_array($payload['gedungItems']) ? $payload['gedungItems'] : [];

        if (empty($inBuildings) && empty($inStandar) && empty($inTanah) && empty($inKapal) && empty($inGedung)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada baris data valid untuk diimpor.',
            ], 400);
        }

        $satdikNameMap = $this->satdikMap->getNameMap();

        try {
            $result = DB::transaction(function () use (
                $inBuildings,
                $inStandar,
                $inTanah,
                $inKapal,
                $inGedung,
                $satdikNameMap
            ) {
                $createdBuildings = [];
                $createdStandarItems = [];
                $createdTanahParcels = [];
                $createdKapalVessels = [];
                $createdGedungItems = [];
                $affectedAsramaSatdik = [];
                $affectedStandarBidang = [];

                // 1. Gedung Asrama
                foreach ($inBuildings as $b) {
                    if (empty($b['nama']) || empty($b['satdikId'])) {
                        continue;
                    }
                    $satdikId = trim((string) $b['satdikId']);
                    $luasM2 = isset($b['luasM2']) ? max(0.0, (float) $b['luasM2']) : 0.0;
                    $kapasitas = isset($b['kapasitas']) && (float) $b['kapasitas'] > 0
                        ? (float) $b['kapasitas']
                        : ($luasM2 > 0 ? floor($luasM2 / 4) : 0.0);

                    $rawStatus = !empty($b['status']) ? trim((string) $b['status']) : 'Digunakan';
                    $statusLower = strtolower($rawStatus);
                    if (str_contains($statusLower, 'tidak') || str_contains($statusLower, 'berat') || str_contains($statusLower, 'kosong')) {
                        $status = 'Tidak Digunakan';
                    } elseif (str_contains($statusLower, 'renov') || str_contains($statusLower, 'ringan') || str_contains($statusLower, 'perlu')) {
                        $status = 'Perlu Renovasi';
                    } else {
                        $status = 'Digunakan';
                    }

                    $cleanCode = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', str_replace(['poltek-', 'supm-', 'akkp-', 'kp-'], '', $satdikId)));
                    $cleanCode = substr($cleanCode, 0, 4) ?: 'ASR';

                    $candidateId = !empty($b['id']) ? trim((string) $b['id']) : '';
                    if ($candidateId !== '' && AsramaGedung::where('id', $candidateId)->exists()) {
                        $candidateId = '';
                    }
                    if ($candidateId === '') {
                        do {
                            $candidateId = 'ASR-' . $cleanCode . '-' . random_int(100, 9999);
                        } while (AsramaGedung::where('id', $candidateId)->exists());
                    }

                    $created = AsramaGedung::create([
                        'id' => $candidateId,
                        'satdik_id' => $satdikId,
                        'kampus' => !empty($b['kampus']) ? trim((string) $b['kampus']) : 'Kampus Utama',
                        'nama' => trim((string) $b['nama']),
                        'peruntukan' => !empty($b['peruntukan']) ? trim((string) $b['peruntukan']) : 'Taruna Putra',
                        'jumlah_kamar' => isset($b['jumlahKamar']) ? max(0, (int) $b['jumlahKamar']) : 0,
                        'luas_m2' => $luasM2,
                        'kapasitas' => $kapasitas,
                        'status' => $status,
                        'keterangan' => isset($b['keterangan']) ? trim((string) $b['keterangan']) : '',
                        'rincian_json' => !empty($b['rincian']) && is_array($b['rincian']) ? json_encode($b['rincian'], JSON_UNESCAPED_UNICODE) : null,
                    ]);

                    $createdBuildings[] = $this->asramaService->formatBuilding($created->fresh());
                    $affectedAsramaSatdik[$satdikId] = true;
                }

                $updatedAsramaSummary = [];
                foreach (array_keys($affectedAsramaSatdik) as $sid) {
                    $sumRow = $this->asramaService->recalculateRekap($sid, 'Import Excel SIM-SARPRAS');
                    if ($sumRow) {
                        $updatedAsramaSummary[] = $sumRow;
                    }
                }

                // 2. Item Standar Minimal Prodi
                $bidangCache = [];
                foreach ($inStandar as $st) {
                    if (empty($st['nama']) || empty($st['bidangId'])) {
                        continue;
                    }
                    $bidangId = trim((string) $st['bidangId']);
                    if (!array_key_exists($bidangId, $bidangCache)) {
                        $bidangCache[$bidangId] = StandarBidang::find($bidangId);
                    }
                    $bidRow = $bidangCache[$bidangId];
                    if (!$bidRow) {
                        continue;
                    }

                    $secRaw = strtoupper(trim((string) ($st['sec'] ?? 'B')));
                    $sec = (str_starts_with($secRaw, 'A') || str_contains($secRaw, 'PRASARANA')) ? 'A' : 'B';

                    $realMap = [];
                    if (!empty($st['real']) && is_array($st['real'])) {
                        foreach ($st['real'] as $rk => $rv) {
                            if ($rk !== '') {
                                $realMap[(string) $rk] = (float) $rv;
                            }
                        }
                    } elseif (!empty($st['realSatdikId']) && isset($st['realVol']) && $st['realVol'] !== '') {
                        $realMap[trim((string) $st['realSatdikId'])] = (float) $st['realVol'];
                    }

                    $codePrefix = !empty($bidRow->code) ? $bidRow->code : 'STD';
                    $candidateId = !empty($st['id']) ? trim((string) $st['id']) : '';
                    if ($candidateId !== '' && StandarItem::where('id', $candidateId)->exists()) {
                        $candidateId = '';
                    }
                    if ($candidateId === '') {
                        do {
                            $candidateId = $codePrefix . '-' . $sec . '-' . random_int(100, 9999);
                        } while (StandarItem::where('id', $candidateId)->exists());
                    }

                    $nextOrder = (int) (StandarItem::where('bidang_id', $bidangId)->max('sort_order') ?? 0) + 1;

                    $created = StandarItem::create([
                        'id' => $candidateId,
                        'bidang_id' => $bidangId,
                        'sec' => $sec,
                        'sub_sec' => !empty($st['subSec']) ? trim((string) $st['subSec']) : $sec,
                        'grp_code' => !empty($st['grpCode']) ? trim((string) $st['grpCode']) : ($sec . '.1'),
                        'grp_name' => !empty($st['grpName']) ? trim((string) $st['grpName']) : 'FASILITAS STANDAR',
                        'sub_grp' => !empty($st['subGrp']) ? trim((string) $st['subGrp']) : null,
                        'item_no' => !empty($st['no']) ? trim((string) $st['no']) : null,
                        'nama' => trim((string) $st['nama']),
                        'std_vol' => isset($st['stdVol']) && (float) $st['stdVol'] > 0 ? (float) $st['stdVol'] : 1.0,
                        'satuan' => !empty($st['satuan']) ? trim((string) $st['satuan']) : 'Unit',
                        'realisasi_json' => json_encode($realMap, JSON_UNESCAPED_UNICODE),
                        'kondisi' => !empty($st['kondisi']) ? trim((string) $st['kondisi']) : null,
                        'keterangan' => !empty($st['ket'] ?? ($st['keterangan'] ?? null)) ? trim((string) ($st['ket'] ?? $st['keterangan'])) : null,
                        'sort_order' => $nextOrder,
                    ]);

                    $createdStandarItems[] = $this->standarService->formatItem($created->fresh());
                    $affectedStandarBidang[$bidangId] = true;
                }

                $updatedStandarBidang = [];
                $updatedStandarRekap = [];
                foreach (array_keys($affectedStandarBidang) as $bid) {
                    $calc = $this->standarService->recalculateRekap($bid);
                    if (!empty($calc['bidang'])) {
                        $updatedStandarBidang[] = $calc['bidang'];
                    }
                    foreach (($calc['rekap'] ?? []) as $rkRow) {
                        $updatedStandarRekap[] = $rkRow;
                    }
                }

                // 3. Bidang Tanah
                foreach ($inTanah as $idx => $t) {
                    $sid = trim((string) ($t['satdikId'] ?? ''));
                    if ($sid === '') {
                        continue;
                    }
                    $noSertifikat = isset($t['noSertifikat']) ? trim((string) $t['noSertifikat']) : '-';
                    $nama = trim((string) ($t['namaBidang'] ?? ($t['nama'] ?? '')));
                    if ($nama === '') {
                        $sName = $satdikNameMap[$sid] ?? $sid;
                        $nama = 'Lahan ' . $sName . ($noSertifikat !== '-' ? " ({$noSertifikat})" : '');
                    }

                    $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $sid), -3));
                    $tId = !empty($t['id']) ? trim((string) $t['id']) : ('TNH-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(10, 99));
                    if (TanahBidang::where('id', $tId)->exists()) {
                        $tId = 'TNH-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(100, 999);
                    }

                    $luasM2 = isset($t['luasM2']) ? max(0, (float) $t['luasM2']) : 0;
                    $luasHa = isset($t['luasHa']) && (float) $t['luasHa'] > 0 ? (float) $t['luasHa'] : round($luasM2 / 10000, 4);

                    $created = TanahBidang::create([
                        'id' => $tId,
                        'satdik_id' => $sid,
                        'nama_bidang' => $nama,
                        'kode_bmn' => !empty($t['kodeBmn']) ? trim((string) $t['kodeBmn']) : '2.01.01.01.001.0001',
                        'nup' => isset($t['nup']) ? max(1, (int) $t['nup']) : ($idx + 1),
                        'luas_m2' => $luasM2,
                        'luas_ha' => $luasHa,
                        'status_sertifikat' => !empty($t['statusSertifikat']) ? trim((string) $t['statusSertifikat']) : ($noSertifikat !== '-' ? 'Sertifikat Hak Pakai (SHP)' : 'Dalam Proses BPN'),
                        'no_sertifikat' => $noSertifikat,
                        'tanggal_sertifikat' => isset($t['tanggalSertifikat']) ? trim((string) $t['tanggalSertifikat']) : '-',
                        'atas_nama' => !empty($t['atasNama']) ? trim((string) $t['atasNama']) : 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
                        'peruntukan' => !empty($t['peruntukan']) ? trim((string) $t['peruntukan']) : 'Kampus & Fasilitas Akademik',
                        'status_pemanfaatan' => !empty($t['statusPemanfaatan']) ? trim((string) $t['statusPemanfaatan']) : 'Digunakan Sendiri (Operasional)',
                        'alamat' => isset($t['alamat']) ? trim((string) $t['alamat']) : (isset($t['lokasi']) ? trim((string) $t['lokasi']) : ''),
                        'kota' => isset($t['kota']) ? trim((string) $t['kota']) : '',
                        'provinsi' => isset($t['provinsi']) ? trim((string) $t['provinsi']) : '',
                        'tahun_perolehan' => isset($t['tahunPerolehan']) ? max(1950, (int) $t['tahunPerolehan']) : 2020,
                        'asal_perolehan' => !empty($t['asalPerolehan']) ? trim((string) $t['asalPerolehan']) : 'APBN',
                        'keterangan' => isset($t['keterangan']) ? trim((string) $t['keterangan']) : '',
                        'foto_satelit' => isset($t['fotoSatelit']) ? trim((string) $t['fotoSatelit']) : (isset($t['foto']) ? trim((string) $t['foto']) : ''),
                    ]);

                    $sName = $satdikNameMap[$sid] ?? $sid;
                    $createdTanahParcels[] = [
                        'id' => $created->id,
                        'satdikId' => $sid,
                        'satdikName' => $sName,
                        'satdikShortName' => $sName,
                        'namaBidang' => $created->nama_bidang,
                        'kodeBmn' => $created->kode_bmn,
                        'nup' => (int) $created->nup,
                        'luasM2' => (float) $created->luas_m2,
                        'luasHa' => (float) $created->luas_ha,
                        'statusSertifikat' => $created->status_sertifikat,
                        'noSertifikat' => $created->no_sertifikat,
                        'tanggalSertifikat' => $created->tanggal_sertifikat,
                        'atasNama' => $created->atas_nama,
                        'peruntukan' => $created->peruntukan,
                        'statusPemanfaatan' => $created->status_pemanfaatan,
                        'alamat' => $created->alamat ?? '',
                        'kota' => $created->kota ?? '',
                        'provinsi' => $created->provinsi ?? '',
                        'tahunPerolehan' => (int) $created->tahun_perolehan,
                        'asalPerolehan' => $created->asal_perolehan,
                        'keterangan' => $created->keterangan ?? '',
                        'fotoSatelit' => $created->foto_satelit ?? '',
                    ];
                }

                // 4. Kapal Latih
                foreach ($inKapal as $idx => $k) {
                    $sid = trim((string) ($k['satdikId'] ?? ''));
                    $namaKapal = trim((string) ($k['namaKapal'] ?? ''));
                    if ($sid === '' || $namaKapal === '') {
                        continue;
                    }

                    $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $sid), -3));
                    $kId = !empty($k['id']) ? trim((string) $k['id']) : ('KPL-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(10, 99));
                    if (KapalLatih::where('id', $kId)->exists()) {
                        $kId = 'KPL-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(100, 999);
                    }

                    $created = KapalLatih::create([
                        'id' => $kId,
                        'satdik_id' => $sid,
                        'nama_kapal' => $namaKapal,
                        'tahun_perolehan' => isset($k['tahunPerolehan']) && (int) $k['tahunPerolehan'] > 0 ? (int) $k['tahunPerolehan'] : 2020,
                        'tonage_gt' => isset($k['tonageGt']) ? max(0, (float) $k['tonageGt']) : 0,
                        'panjang_kapal' => isset($k['panjangKapal']) ? max(0, (float) $k['panjangKapal']) : 0,
                        'jenis_kapal' => !empty($k['jenisKapal']) ? trim((string) $k['jenisKapal']) : 'Kapal Latih Perikanan',
                        'kapasitas_bbm' => isset($k['kapasitasBbm']) ? max(0, (float) $k['kapasitasBbm']) : 0,
                        'jumlah_abk' => isset($k['jumlahAbk']) ? max(0, (int) $k['jumlahAbk']) : 0,
                        'alat_tangkap' => !empty($k['alatTangkap']) ? trim((string) $k['alatTangkap']) : '-',
                        'id_transmitter' => !empty($k['idTransmitter']) ? trim((string) $k['idTransmitter']) : '-',
                        'status_bmn' => !empty($k['statusBmn']) ? trim((string) $k['statusBmn']) : 'Terdaftar BMN (Aktif Operasional)',
                        'keterangan' => isset($k['keterangan']) ? trim((string) $k['keterangan']) : '',
                    ]);

                    $sName = $satdikNameMap[$sid] ?? $sid;
                    $createdKapalVessels[] = [
                        'id' => $created->id,
                        'satdikId' => $sid,
                        'satdikName' => $sName,
                        'satdikShortName' => $sName,
                        'namaKapal' => $created->nama_kapal,
                        'tahunPerolehan' => (int) $created->tahun_perolehan,
                        'tonageGt' => (float) $created->tonage_gt,
                        'panjangKapal' => (float) $created->panjang_kapal,
                        'jenisKapal' => $created->jenis_kapal,
                        'kapasitasBbm' => (float) $created->kapasitas_bbm,
                        'jumlahAbk' => (int) $created->jumlah_abk,
                        'alatTangkap' => $created->alat_tangkap,
                        'idTransmitter' => $created->id_transmitter,
                        'statusBmn' => $created->status_bmn,
                        'keterangan' => $created->keterangan ?? '',
                    ];
                }

                // 5. Gedung dan Bangunan
                foreach ($inGedung as $idx => $g) {
                    $sid = trim((string) ($g['satdikId'] ?? ''));
                    $namaGedung = trim((string) ($g['namaGedung'] ?? ''));
                    if ($sid === '' || $namaGedung === '') {
                        continue;
                    }

                    $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $sid), -3));
                    $gId = !empty($g['id']) ? trim((string) $g['id']) : ('GDG-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(10, 99));
                    if (GedungBangunan::where('id', $gId)->exists()) {
                        $gId = 'GDG-' . $prefix . '-' . time() . '-' . ($idx + 1) . '-' . random_int(100, 999);
                    }

                    $defaultKampus = $sid === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama';
                    $created = GedungBangunan::create([
                        'id' => $gId,
                        'satdik_id' => $sid,
                        'kampus' => !empty($g['kampus']) ? trim((string) $g['kampus']) : $defaultKampus,
                        'jenis_gedung' => !empty($g['jenisGedung']) ? trim((string) $g['jenisGedung']) : 'Gedung Perkuliahan / Ruang Kelas',
                        'jumlah' => isset($g['jumlah']) && (int) $g['jumlah'] > 0 ? (int) $g['jumlah'] : 1,
                        'nama_gedung' => $namaGedung,
                        'jumlah_lantai' => isset($g['jumlahLantai']) ? max(0, (int) $g['jumlahLantai']) : 0,
                        'luas_m2' => isset($g['luasM2']) ? max(0, (float) $g['luasM2']) : 0,
                    ]);

                    $sName = $satdikNameMap[$sid] ?? $sid;
                    $createdGedungItems[] = [
                        'id' => $created->id,
                        'satdikId' => $sid,
                        'satdikName' => $sName,
                        'satdikShortName' => $sName,
                        'kampus' => $created->kampus,
                        'jenisGedung' => $created->jenis_gedung,
                        'jumlah' => (int) $created->jumlah,
                        'namaGedung' => $created->nama_gedung,
                        'jumlahLantai' => (int) $created->jumlah_lantai,
                        'luasM2' => (float) $created->luas_m2,
                    ];
                }

                return [
                    'buildings' => $createdBuildings,
                    'asramaSummary' => $updatedAsramaSummary,
                    'standarItems' => $createdStandarItems,
                    'standarBidang' => $updatedStandarBidang,
                    'standarRekap' => $updatedStandarRekap,
                    'tanahParcels' => $createdTanahParcels,
                    'kapalVessels' => $createdKapalVessels,
                    'gedungItems' => $createdGedungItems,
                ];
            });

            $totalInserted = count($result['buildings'])
                + count($result['standarItems'])
                + count($result['tanahParcels'])
                + count($result['kapalVessels'])
                + count($result['gedungItems']);

            return response()->json(array_merge([
                'status' => 'success',
                'message' => "Berhasil mengimpor {$totalInserted} baris data ke database MySQL.",
                'counts' => [
                    'buildings' => count($result['buildings']),
                    'standarItems' => count($result['standarItems']),
                    'tanahParcels' => count($result['tanahParcels']),
                    'kapalVessels' => count($result['kapalVessels']),
                    'gedungItems' => count($result['gedungItems']),
                    'total' => $totalInserted,
                ],
            ], $result), 201);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaksi import dibatalkan karena kesalahan database: ' . $e->getMessage(),
            ], 500);
        }
    }
}
