<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AsramaGedung;
use App\Models\AsramaRekap;
use App\Services\AsramaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AsramaController extends Controller
{
    public function __construct(private AsramaService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $singleId = $request->query('id');
        if ($singleId) {
            return $this->show($singleId);
        }

        $satdikFilter = $request->query('satdik_id');
        $hasFilter = $satdikFilter && $satdikFilter !== 'ALL';

        $rekapQuery = AsramaRekap::query()->orderBy('satdik_id');
        $gedungQuery = AsramaGedung::query()->orderBy('satdik_id')->orderBy('id');

        if ($hasFilter) {
            $rekapQuery->where('satdik_id', $satdikFilter);
            $gedungQuery->where('satdik_id', $satdikFilter);
        }

        $rekapRows = $rekapQuery->get();
        $gedungRows = $gedungQuery->get();

        $summary = $rekapRows->map(fn (AsramaRekap $r) => $this->service->formatRekap($r))->values()->all();
        $buildings = $gedungRows->map(fn (AsramaGedung $b) => $this->service->formatBuilding($b))->values()->all();

        $meta = null;
        if ($rekapRows->isNotEmpty()) {
            $first = $rekapRows->first();
            $meta = [
                'sumber' => $first->sumber ?? '',
                'tanggalData' => $first->tanggal_data ?? '',
                'standarRuang' => '4 m² per orang',
                'jumlahSatdik' => count($summary),
                'jumlahGedung' => count($buildings),
            ];
        }

        return response()->json([
            'status' => 'success',
            'meta' => $meta,
            'summary' => $summary,
            'buildings' => $buildings,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $row = AsramaGedung::find($id);
        if (!$row) {
            return response()->json(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $this->service->formatBuilding($row),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $input = $request->all();
        if (empty($input['nama']) || empty($input['satdikId'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak lengkap. Field nama gedung dan satdikId wajib diisi.',
            ], 400);
        }

        $satdikId = trim((string) $input['satdikId']);
        $nama = trim((string) $input['nama']);
        $kampus = !empty($input['kampus']) ? trim((string) $input['kampus']) : 'Kampus Utama';
        $peruntukan = !empty($input['peruntukan']) ? trim((string) $input['peruntukan']) : 'Putra';
        $jumlahKamar = isset($input['jumlahKamar']) ? (int) $input['jumlahKamar'] : 0;
        $luasM2 = isset($input['luasM2']) ? (float) $input['luasM2'] : 0.0;
        $kapasitas = isset($input['kapasitas']) && (float) $input['kapasitas'] > 0
            ? (float) $input['kapasitas']
            : ($luasM2 > 0 ? floor($luasM2 / 4) : 0.0);
        $status = !empty($input['status']) ? trim((string) $input['status']) : 'Digunakan';
        $keterangan = !empty($input['keterangan']) ? trim((string) $input['keterangan']) : '';

        $cleanRincian = [];
        if (!empty($input['rincian']) && is_array($input['rincian'])) {
            foreach ($input['rincian'] as $rc) {
                $cleanRincian[] = [
                    'label' => trim((string) ($rc['label'] ?? '')),
                    'ukuran' => trim((string) ($rc['ukuran'] ?? '-')),
                    'jumlah' => (int) ($rc['jumlah'] ?? 0),
                    'luasM2' => (float) ($rc['luasM2'] ?? 0),
                    'kapasitas' => (float) ($rc['kapasitas'] ?? 0),
                ];
            }
        }
        $rincianJson = !empty($cleanRincian) ? json_encode($cleanRincian, JSON_UNESCAPED_UNICODE) : null;

        if (!empty($input['id'])) {
            $id = trim((string) $input['id']);
        } else {
            $cleanCode = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', str_replace(['poltek-', 'supm-', 'akkp-', 'kp-'], '', $satdikId)));
            $cleanCode = substr($cleanCode, 0, 4) ?: 'ASR';
            do {
                $id = 'ASR-' . $cleanCode . '-' . random_int(100, 999);
            } while (AsramaGedung::where('id', $id)->exists());
        }

        $created = AsramaGedung::create([
            'id' => $id,
            'satdik_id' => $satdikId,
            'kampus' => $kampus,
            'nama' => $nama,
            'peruntukan' => $peruntukan,
            'jumlah_kamar' => $jumlahKamar,
            'luas_m2' => $luasM2,
            'kapasitas' => $kapasitas,
            'status' => $status,
            'keterangan' => $keterangan,
            'rincian_json' => $rincianJson,
        ]);

        $updatedSummaryRow = $this->service->recalculateRekap($satdikId);

        return response()->json([
            'status' => 'success',
            'message' => 'Gedung asrama berhasil ditambahkan.',
            'data' => $this->service->formatBuilding($created->fresh()),
            'summaryRow' => $updatedSummaryRow,
        ], 201);
    }

    public function update(Request $request, ?string $id = null): JsonResponse
    {
        $input = $request->all();
        $targetId = $id ?? ($request->query('id') ?? ($input['id'] ?? null));
        if (!$targetId) {
            return response()->json(['status' => 'error', 'message' => 'Parameter ID gedung asrama diperlukan.'], 400);
        }

        $existing = AsramaGedung::find($targetId);
        if (!$existing) {
            return response()->json(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan.'], 404);
        }

        $oldSatdikId = $existing->satdik_id;
        $newSatdikId = !empty($input['satdikId']) ? trim((string) $input['satdikId']) : $oldSatdikId;

        $mapping = [
            'satdikId' => ['col' => 'satdik_id', 'type' => 'string'],
            'kampus' => ['col' => 'kampus', 'type' => 'string'],
            'nama' => ['col' => 'nama', 'type' => 'string'],
            'peruntukan' => ['col' => 'peruntukan', 'type' => 'string'],
            'jumlahKamar' => ['col' => 'jumlah_kamar', 'type' => 'int'],
            'luasM2' => ['col' => 'luas_m2', 'type' => 'float'],
            'kapasitas' => ['col' => 'kapasitas', 'type' => 'float'],
            'status' => ['col' => 'status', 'type' => 'string'],
            'keterangan' => ['col' => 'keterangan', 'type' => 'string'],
        ];

        $updates = [];
        foreach ($mapping as $key => $meta) {
            if (array_key_exists($key, $input) && $input[$key] !== null) {
                $val = $input[$key];
                if ($meta['type'] === 'int') {
                    $val = (int) $val;
                } elseif ($meta['type'] === 'float') {
                    $val = (float) $val;
                } else {
                    $val = trim((string) $val);
                }
                $updates[$meta['col']] = $val;
            }
        }

        if (array_key_exists('rincian', $input)) {
            $cleanRincian = [];
            if (!empty($input['rincian']) && is_array($input['rincian'])) {
                foreach ($input['rincian'] as $rc) {
                    $cleanRincian[] = [
                        'label' => trim((string) ($rc['label'] ?? '')),
                        'ukuran' => trim((string) ($rc['ukuran'] ?? '-')),
                        'jumlah' => (int) ($rc['jumlah'] ?? 0),
                        'luasM2' => (float) ($rc['luasM2'] ?? 0),
                        'kapasitas' => (float) ($rc['kapasitas'] ?? 0),
                    ];
                }
            }
            $updates['rincian_json'] = !empty($cleanRincian) ? json_encode($cleanRincian, JSON_UNESCAPED_UNICODE) : null;
        }

        if (empty($updates)) {
            return response()->json(['status' => 'error', 'message' => 'Tidak ada field yang diperbarui.'], 400);
        }

        $existing->update($updates);

        $updatedSummaryRow = $this->service->recalculateRekap($newSatdikId);
        if ($oldSatdikId !== $newSatdikId) {
            $this->service->recalculateRekap($oldSatdikId);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data gedung asrama berhasil diperbarui.',
            'data' => $this->service->formatBuilding($existing->fresh()),
            'summaryRow' => $updatedSummaryRow,
        ]);
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
        if (!$targetId) {
            return response()->json(['status' => 'error', 'message' => 'Parameter ID gedung asrama diperlukan.'], 400);
        }

        $existing = AsramaGedung::find($targetId);
        if (!$existing) {
            return response()->json(['status' => 'error', 'message' => 'Gedung asrama tidak ditemukan atau sudah terhapus.'], 404);
        }

        $satdikId = $existing->satdik_id;
        $existing->delete();

        $updatedSummaryRow = $this->service->recalculateRekap($satdikId);

        return response()->json([
            'status' => 'success',
            'message' => 'Gedung asrama berhasil dihapus.',
            'deletedId' => $targetId,
            'summaryRow' => $updatedSummaryRow,
        ]);
    }
}
