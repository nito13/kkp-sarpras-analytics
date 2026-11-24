<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KapalLatih;
use App\Services\SatdikMapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KapalController extends Controller
{
    public function __construct(private SatdikMapService $satdikMap)
    {
    }

    private function formatRow(KapalLatih $row, array $satdikMap): array
    {
        $sid = $row->satdik_id;
        $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];

        return [
            'id' => $row->id,
            'satdikId' => $sid,
            'satdikName' => $sInfo['name'] ?? $sid,
            'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
            'namaKapal' => $row->nama_kapal ?? '',
            'tahunPerolehan' => (int) ($row->tahun_perolehan ?? 2020),
            'tonageGt' => (float) ($row->tonage_gt ?? 0),
            'panjangKapal' => (float) ($row->panjang_kapal ?? 0),
            'jenisKapal' => $row->jenis_kapal ?? 'Kapal Latih Perikanan',
            'kapasitasBbm' => (float) ($row->kapasitas_bbm ?? 0),
            'jumlahAbk' => (int) ($row->jumlah_abk ?? 0),
            'alatTangkap' => $row->alat_tangkap ?? '-',
            'idTransmitter' => $row->id_transmitter ?? '-',
            'statusBmn' => $row->status_bmn ?? 'Terdaftar BMN (Aktif Operasional)',
            'keterangan' => $row->keterangan ?? '',
            'createdAt' => $row->created_at ? (string) $row->created_at : null,
            'updatedAt' => $row->updated_at ? (string) $row->updated_at : null,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $satdikId = trim((string) $request->query('satdik_id', ''));
            $search = trim((string) $request->query('q', ''));

            $query = KapalLatih::query();
            if ($satdikId !== '' && $satdikId !== 'ALL') {
                $query->where('satdik_id', $satdikId);
            }
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_kapal', 'like', "%{$search}%")
                        ->orWhere('jenis_kapal', 'like', "%{$search}%")
                        ->orWhere('alat_tangkap', 'like', "%{$search}%")
                        ->orWhere('id_transmitter', 'like', "%{$search}%")
                        ->orWhere('status_bmn', 'like', "%{$search}%");
                });
            }

            $rows = $query
                ->orderBy('satdik_id')
                ->orderBy('nama_kapal')
                ->orderByDesc('created_at')
                ->get();

            $map = $this->satdikMap->getInfoMap();
            $vessels = $rows->map(fn (KapalLatih $r) => $this->formatRow($r, $map))->values()->all();

            return response()->json([
                'status' => 'success',
                'total' => count($vessels),
                'data' => $vessels,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data kapal latih: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->all();
        if (empty($body['satdikId']) || empty($body['namaKapal'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Field satdikId dan namaKapal wajib diisi.',
            ], 400);
        }

        $satdikId = trim((string) $body['satdikId']);
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim((string) $body['id']) : ('KPL-' . $prefix . '-' . time() . '-' . random_int(100, 999));

        try {
            $created = KapalLatih::create([
                'id' => $id,
                'satdik_id' => $satdikId,
                'nama_kapal' => trim((string) $body['namaKapal']),
                'tahun_perolehan' => isset($body['tahunPerolehan']) && (int) $body['tahunPerolehan'] > 0 ? (int) $body['tahunPerolehan'] : 2020,
                'tonage_gt' => isset($body['tonageGt']) ? max(0, (float) $body['tonageGt']) : 0,
                'panjang_kapal' => isset($body['panjangKapal']) ? max(0, (float) $body['panjangKapal']) : 0,
                'jenis_kapal' => !empty($body['jenisKapal']) ? trim((string) $body['jenisKapal']) : 'Kapal Latih Perikanan',
                'kapasitas_bbm' => isset($body['kapasitasBbm']) ? max(0, (float) $body['kapasitasBbm']) : 0,
                'jumlah_abk' => isset($body['jumlahAbk']) ? max(0, (int) $body['jumlahAbk']) : 0,
                'alat_tangkap' => !empty($body['alatTangkap']) ? trim((string) $body['alatTangkap']) : '-',
                'id_transmitter' => !empty($body['idTransmitter']) ? trim((string) $body['idTransmitter']) : '-',
                'status_bmn' => !empty($body['statusBmn']) ? trim((string) $body['statusBmn']) : 'Terdaftar BMN (Aktif Operasional)',
                'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : '',
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Data kapal latih berhasil disimpan ke database.',
                'data' => $this->formatRow($created->fresh(), $map),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan kapal latih: ' . $e->getMessage(),
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
                'message' => 'ID kapal latih wajib disertakan.',
            ], 400);
        }

        try {
            $existing = KapalLatih::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Kapal latih dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $existing->update([
                'satdik_id' => isset($body['satdikId']) ? trim((string) $body['satdikId']) : $existing->satdik_id,
                'nama_kapal' => isset($body['namaKapal']) ? trim((string) $body['namaKapal']) : $existing->nama_kapal,
                'tahun_perolehan' => isset($body['tahunPerolehan']) ? (int) $body['tahunPerolehan'] : (int) $existing->tahun_perolehan,
                'tonage_gt' => isset($body['tonageGt']) ? (float) $body['tonageGt'] : (float) $existing->tonage_gt,
                'panjang_kapal' => isset($body['panjangKapal']) ? (float) $body['panjangKapal'] : (float) $existing->panjang_kapal,
                'jenis_kapal' => isset($body['jenisKapal']) ? trim((string) $body['jenisKapal']) : $existing->jenis_kapal,
                'kapasitas_bbm' => isset($body['kapasitasBbm']) ? (float) $body['kapasitasBbm'] : (float) $existing->kapasitas_bbm,
                'jumlah_abk' => isset($body['jumlahAbk']) ? (int) $body['jumlahAbk'] : (int) $existing->jumlah_abk,
                'alat_tangkap' => isset($body['alatTangkap']) ? trim((string) $body['alatTangkap']) : $existing->alat_tangkap,
                'id_transmitter' => isset($body['idTransmitter']) ? trim((string) $body['idTransmitter']) : $existing->id_transmitter,
                'status_bmn' => isset($body['statusBmn']) ? trim((string) $body['statusBmn']) : $existing->status_bmn,
                'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : $existing->keterangan,
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Data kapal latih berhasil diperbarui.',
                'data' => $this->formatRow($existing->fresh(), $map),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui kapal latih: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
        if (!$targetId) {
            return response()->json([
                'status' => 'error',
                'message' => 'ID kapal latih wajib disertakan.',
            ], 400);
        }

        try {
            $existing = KapalLatih::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Kapal latih dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $nama = $existing->nama_kapal;
            $existing->delete();

            return response()->json([
                'status' => 'success',
                'message' => "Kapal latih \"{$nama}\" berhasil dihapus.",
                'id' => $targetId,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kapal latih: ' . $e->getMessage(),
            ], 500);
        }
    }
}
