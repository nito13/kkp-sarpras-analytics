<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GedungBangunan;
use App\Services\SatdikMapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GedungController extends Controller
{
    public function __construct(private SatdikMapService $satdikMap)
    {
    }

    private function formatRow(GedungBangunan $row, array $satdikMap): array
    {
        $sid = $row->satdik_id;
        $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];

        return [
            'id' => $row->id,
            'satdikId' => $sid,
            'satdikName' => $sInfo['name'] ?? $sid,
            'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
            'kampus' => $row->kampus ?? ($sid === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama'),
            'jenisGedung' => $row->jenis_gedung ?? 'Gedung Perkuliahan / Kelas',
            'jumlah' => (int) ($row->jumlah ?? 1),
            'namaGedung' => $row->nama_gedung ?? '',
            'jumlahLantai' => (int) ($row->jumlah_lantai ?? 0),
            'luasM2' => (float) ($row->luas_m2 ?? 0),
            'createdAt' => $row->created_at ? (string) $row->created_at : null,
            'updatedAt' => $row->updated_at ? (string) $row->updated_at : null,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $satdikId = trim((string) $request->query('satdik_id', ''));
            $search = trim((string) $request->query('q', ''));

            $query = GedungBangunan::query();
            if ($satdikId !== '' && $satdikId !== 'ALL') {
                $query->where('satdik_id', $satdikId);
            }
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('jenis_gedung', 'like', "%{$search}%")
                        ->orWhere('nama_gedung', 'like', "%{$search}%");
                });
            }

            $rows = $query
                ->orderBy('satdik_id')
                ->orderBy('jenis_gedung')
                ->orderBy('nama_gedung')
                ->orderByDesc('created_at')
                ->get();

            $map = $this->satdikMap->getInfoMap();
            $items = $rows->map(fn (GedungBangunan $r) => $this->formatRow($r, $map))->values()->all();

            return response()->json([
                'status' => 'success',
                'total' => count($items),
                'data' => $items,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->all();
        if (empty($body['satdikId']) || empty($body['namaGedung'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Field satdikId dan namaGedung wajib diisi.',
            ], 400);
        }

        $satdikId = trim((string) $body['satdikId']);
        $defaultKampus = $satdikId === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama';
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim((string) $body['id']) : ('GDG-' . $prefix . '-' . time() . '-' . random_int(100, 999));

        try {
            $created = GedungBangunan::create([
                'id' => $id,
                'satdik_id' => $satdikId,
                'kampus' => !empty($body['kampus']) ? trim((string) $body['kampus']) : $defaultKampus,
                'jenis_gedung' => !empty($body['jenisGedung']) ? trim((string) $body['jenisGedung']) : 'Gedung Perkuliahan / Kelas',
                'jumlah' => isset($body['jumlah']) && (int) $body['jumlah'] > 0 ? (int) $body['jumlah'] : 1,
                'nama_gedung' => trim((string) $body['namaGedung']),
                'jumlah_lantai' => isset($body['jumlahLantai']) ? max(0, (int) $body['jumlahLantai']) : 0,
                'luas_m2' => isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : 0,
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Data gedung dan bangunan berhasil disimpan ke database.',
                'data' => $this->formatRow($created->fresh(), $map),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, ?string $id = null): JsonResponse
    {
        $body = $request->all();
        $targetId = $id ?? ($body['id'] ?? $request->query('id'));
        if (!$targetId) {
            return response()->json([
                'status' => 'error',
                'message' => 'ID gedung dan bangunan wajib disertakan.',
            ], 400);
        }

        try {
            $existing = GedungBangunan::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Data gedung dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $satdikId = isset($body['satdikId']) ? trim((string) $body['satdikId']) : $existing->satdik_id;
            $existing->update([
                'satdik_id' => $satdikId,
                'kampus' => isset($body['kampus']) ? trim((string) $body['kampus']) : ($existing->kampus ?? ($satdikId === 'poltek-aup' ? 'Kampus Jakarta' : 'Kampus Utama')),
                'jenis_gedung' => isset($body['jenisGedung']) ? trim((string) $body['jenisGedung']) : $existing->jenis_gedung,
                'jumlah' => isset($body['jumlah']) ? max(1, (int) $body['jumlah']) : (int) $existing->jumlah,
                'nama_gedung' => isset($body['namaGedung']) ? trim((string) $body['namaGedung']) : $existing->nama_gedung,
                'jumlah_lantai' => isset($body['jumlahLantai']) ? max(0, (int) $body['jumlahLantai']) : (int) $existing->jumlah_lantai,
                'luas_m2' => isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : (float) $existing->luas_m2,
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Data gedung dan bangunan berhasil diperbarui.',
                'data' => $this->formatRow($existing->fresh(), $map),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
        if (!$targetId) {
            return response()->json([
                'status' => 'error',
                'message' => 'ID gedung dan bangunan wajib disertakan.',
            ], 400);
        }

        try {
            $existing = GedungBangunan::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Gedung dan bangunan dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $nama = $existing->nama_gedung;
            $existing->delete();

            return response()->json([
                'status' => 'success',
                'message' => "Gedung \"{$nama}\" berhasil dihapus.",
                'id' => $targetId,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus gedung dan bangunan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
