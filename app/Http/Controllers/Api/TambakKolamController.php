<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TambakRekap;
use App\Models\TambakUnit;
use App\Services\TambakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TambakKolamController extends Controller
{
    public function __construct(private TambakService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $satdikFilter = trim((string) $request->query('satdik_id', ''));

        try {
            if ($satdikFilter !== '' && $satdikFilter !== 'ALL') {
                $rekapRows = TambakRekap::where('satdik_id', $satdikFilter)->orderBy('nama_satdik')->get();
                $unitRows = TambakUnit::where('satdik_id', $satdikFilter)->orderBy('no_urut')->orderBy('id')->get();
            } else {
                $rekapRows = TambakRekap::orderBy('jenjang')->orderBy('nama_satdik')->get();
                $unitRows = TambakUnit::orderBy('satdik_id')->orderBy('no_urut')->orderBy('id')->get();
            }

            $satdikMap = [];
            foreach ($rekapRows as $r) {
                $satdikMap[$r->satdik_id] = [
                    'nama' => $r->nama_satdik,
                    'jenjang' => $r->jenjang ?? 'Politeknik',
                ];
            }

            $summary = $rekapRows->map(fn (TambakRekap $r) => $this->service->formatRekap($r))->values()->all();
            $units = $unitRows->map(fn (TambakUnit $u) => $this->service->formatUnit($u, $satdikMap))->values()->all();

            return response()->json([
                'status' => 'success',
                'meta' => [
                    'title' => 'Prasarana dan Sarana Tambak dan Kolam Satuan Pendidikan KKP',
                    'source' => '1c-Data Tambak dan Kolam Satuan Pendidikan.pdf',
                    'tahun' => 2025,
                    'totalSatdik' => count($summary),
                    'satdikMemilikiUnit' => count(array_filter($summary, fn ($s) => $s['jumlahUnit'] > 0)),
                    'totalUnit' => count($units),
                    'totalLuasM2' => round(array_sum(array_column($units, 'luasM2')), 2),
                    'totalKincir' => array_sum(array_column($units, 'jumlahKincir')),
                ],
                'summary' => $summary,
                'units' => $units,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tabel tambak & kolam belum diinisialisasi. Jalankan php artisan migrate --seed terlebih dahulu.',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->all();
        if (empty($body['satdikId']) || empty($body['nama'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Field satdikId dan nama unit tambak/kolam wajib diisi.',
            ], 400);
        }

        $satdikId = trim((string) $body['satdikId']);
        $id = !empty($body['id'])
            ? trim((string) $body['id'])
            : ('TBK-' . strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3)) . '-' . random_int(100, 999));

        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : 0;
        $kampusLokasi = isset($body['kampusLokasi']) ? trim((string) $body['kampusLokasi']) : '-';
        $pelataran = !empty($body['pelataran']) ? trim((string) $body['pelataran']) : 'HDPE';

        try {
            $result = DB::transaction(function () use ($id, $satdikId, $body, $luasM2, $kampusLokasi, $pelataran) {
                $created = TambakUnit::create([
                    'id' => $id,
                    'satdik_id' => $satdikId,
                    'no_urut' => isset($body['noUrut']) ? (int) $body['noUrut'] : 99,
                    'nama' => trim((string) $body['nama']),
                    'jenis' => !empty($body['jenis']) ? trim((string) $body['jenis']) : 'Tambak',
                    'kampus_lokasi' => $kampusLokasi,
                    'luas_m2' => $luasM2,
                    'luas_label' => !empty($body['luasLabel']) ? trim((string) $body['luasLabel']) : ($luasM2 > 0 ? number_format($luasM2, 0, ',', '.') . ' m2' : '-'),
                    'kondisi' => !empty($body['kondisi']) ? trim((string) $body['kondisi']) : 'Baik',
                    'fungsi' => isset($body['fungsi']) ? trim((string) $body['fungsi']) : 'Budidaya Perikanan',
                    'status_operasional' => !empty($body['statusOperasional']) ? trim((string) $body['statusOperasional']) : 'Aktif Budidaya',
                    'pelataran' => $pelataran,
                    'pelataran_kategori' => !empty($body['pelataranKategori']) ? trim((string) $body['pelataranKategori']) : $this->service->resolvePelataranKategori($pelataran),
                    'listrik' => isset($body['listrik']) ? trim((string) $body['listrik']) : '-',
                    'kincir' => isset($body['kincir']) ? trim((string) $body['kincir']) : '-',
                    'jumlah_kincir' => isset($body['jumlahKincir']) ? max(0, (int) $body['jumlahKincir']) : 0,
                    'lokasi_label' => isset($body['lokasiLabel']) ? trim((string) $body['lokasiLabel']) : $kampusLokasi,
                    'map_url' => isset($body['mapUrl']) ? trim((string) $body['mapUrl']) : '',
                    'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : '',
                ]);

                $updatedSummary = $this->service->recalculateRekap($satdikId);

                return [$created->fresh(), $updatedSummary];
            });

            [$createdRow, $updatedSummary] = $result;
            $satMap = $updatedSummary ? [$satdikId => ['nama' => $updatedSummary['namaSatdik'], 'jenjang' => $updatedSummary['jenjang']]] : [];

            return response()->json([
                'status' => 'success',
                'message' => 'Unit tambak/kolam berhasil ditambahkan ke database MySQL.',
                'data' => [
                    'unit' => $this->service->formatUnit($createdRow, $satMap),
                    'summary' => $updatedSummary,
                ],
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, ?string $id = null): JsonResponse
    {
        $body = $request->all();
        $targetId = trim((string) ($id ?? ($body['id'] ?? $request->query('id', ''))));
        if ($targetId === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'ID unit tambak/kolam wajib disertakan untuk pembaruan.',
            ], 400);
        }

        $oldRow = TambakUnit::find($targetId);
        if (!$oldRow) {
            return response()->json([
                'status' => 'error',
                'message' => "Unit tambak/kolam dengan ID '{$targetId}' tidak ditemukan.",
            ], 404);
        }

        $oldSatdikId = $oldRow->satdik_id;
        $satdikId = !empty($body['satdikId']) ? trim((string) $body['satdikId']) : $oldSatdikId;
        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : (float) $oldRow->luas_m2;
        $pelataran = !empty($body['pelataran']) ? trim((string) $body['pelataran']) : $oldRow->pelataran;

        try {
            $result = DB::transaction(function () use ($oldRow, $oldSatdikId, $satdikId, $body, $luasM2, $pelataran) {
                $oldRow->update([
                    'satdik_id' => $satdikId,
                    'no_urut' => isset($body['noUrut']) ? (int) $body['noUrut'] : (int) $oldRow->no_urut,
                    'nama' => !empty($body['nama']) ? trim((string) $body['nama']) : $oldRow->nama,
                    'jenis' => !empty($body['jenis']) ? trim((string) $body['jenis']) : $oldRow->jenis,
                    'kampus_lokasi' => isset($body['kampusLokasi']) ? trim((string) $body['kampusLokasi']) : $oldRow->kampus_lokasi,
                    'luas_m2' => $luasM2,
                    'luas_label' => isset($body['luasLabel']) ? trim((string) $body['luasLabel']) : ($luasM2 > 0 ? number_format($luasM2, 0, ',', '.') . ' m2' : '-'),
                    'kondisi' => !empty($body['kondisi']) ? trim((string) $body['kondisi']) : $oldRow->kondisi,
                    'fungsi' => isset($body['fungsi']) ? trim((string) $body['fungsi']) : $oldRow->fungsi,
                    'status_operasional' => !empty($body['statusOperasional']) ? trim((string) $body['statusOperasional']) : $oldRow->status_operasional,
                    'pelataran' => $pelataran,
                    'pelataran_kategori' => !empty($body['pelataranKategori']) ? trim((string) $body['pelataranKategori']) : $this->service->resolvePelataranKategori((string) $pelataran),
                    'listrik' => isset($body['listrik']) ? trim((string) $body['listrik']) : $oldRow->listrik,
                    'kincir' => isset($body['kincir']) ? trim((string) $body['kincir']) : $oldRow->kincir,
                    'jumlah_kincir' => isset($body['jumlahKincir']) ? max(0, (int) $body['jumlahKincir']) : (int) $oldRow->jumlah_kincir,
                    'lokasi_label' => isset($body['lokasiLabel']) ? trim((string) $body['lokasiLabel']) : $oldRow->lokasi_label,
                    'map_url' => isset($body['mapUrl']) ? trim((string) $body['mapUrl']) : $oldRow->map_url,
                    'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : $oldRow->keterangan,
                ]);

                $updatedSummary = $this->service->recalculateRekap($satdikId);
                if ($oldSatdikId !== $satdikId) {
                    $this->service->recalculateRekap($oldSatdikId);
                }

                return [$oldRow->fresh(), $updatedSummary];
            });

            [$updatedRow, $updatedSummary] = $result;
            $satMap = $updatedSummary ? [$satdikId => ['nama' => $updatedSummary['namaSatdik'], 'jenjang' => $updatedSummary['jenjang']]] : [];

            return response()->json([
                'status' => 'success',
                'message' => 'Data unit tambak/kolam berhasil diperbarui.',
                'data' => [
                    'unit' => $this->service->formatUnit($updatedRow, $satMap),
                    'summary' => $updatedSummary,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = trim((string) ($id ?? ($request->query('id') ?? $request->input('id', ''))));
        if ($targetId === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'Parameter ID unit tambak/kolam wajib diberikan untuk penghapusan.',
            ], 400);
        }

        $oldRow = TambakUnit::find($targetId);
        if (!$oldRow) {
            return response()->json([
                'status' => 'error',
                'message' => "Unit tambak/kolam dengan ID '{$targetId}' tidak ditemukan.",
            ], 404);
        }

        $satdikId = $oldRow->satdik_id;

        try {
            $updatedSummary = DB::transaction(function () use ($oldRow, $satdikId) {
                $oldRow->delete();
                return $this->service->recalculateRekap($satdikId);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Unit tambak/kolam berhasil dihapus.',
                'data' => [
                    'deletedId' => $targetId,
                    'satdikId' => $satdikId,
                    'summary' => $updatedSummary,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus unit tambak/kolam: ' . $e->getMessage(),
            ], 500);
        }
    }
}
