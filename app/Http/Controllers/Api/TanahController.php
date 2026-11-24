<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahBidang;
use App\Services\SatdikMapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TanahController extends Controller
{
    public function __construct(private SatdikMapService $satdikMap)
    {
    }

    private function formatRow(TanahBidang $row, array $satdikMap): array
    {
        $sid = $row->satdik_id;
        $sInfo = $satdikMap[$sid] ?? ['name' => $sid, 'short_name' => $sid, 'type' => 'Politeknik'];
        $luasM2 = (float) ($row->luas_m2 ?? 0);
        $luasHa = !empty($row->luas_ha) ? (float) $row->luas_ha : round($luasM2 / 10000, 4);

        return [
            'id' => $row->id,
            'satdikId' => $sid,
            'satdikName' => $sInfo['name'] ?? $sid,
            'satdikShortName' => $sInfo['short_name'] ?? $sInfo['name'] ?? $sid,
            'namaBidang' => $row->nama_bidang,
            'kodeBmn' => $row->kode_bmn ?? '2.01.01.01.001.0001',
            'nup' => (int) ($row->nup ?? 1),
            'luasM2' => $luasM2,
            'luasHa' => $luasHa,
            'statusSertifikat' => $row->status_sertifikat ?? 'Sertifikat Hak Pakai (SHP)',
            'noSertifikat' => $row->no_sertifikat ?? '-',
            'tanggalSertifikat' => $row->tanggal_sertifikat ?? '-',
            'atasNama' => $row->atas_nama ?? 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
            'peruntukan' => $row->peruntukan ?? 'Kampus & Fasilitas Akademik',
            'statusPemanfaatan' => $row->status_pemanfaatan ?? 'Digunakan Sendiri (Operasional)',
            'alamat' => $row->alamat ?? '',
            'kota' => $row->kota ?? '',
            'provinsi' => $row->provinsi ?? '',
            'tahunPerolehan' => (int) ($row->tahun_perolehan ?? 2020),
            'asalPerolehan' => $row->asal_perolehan ?? 'APBN',
            'keterangan' => $row->keterangan ?? '',
            'fotoSatelit' => $row->foto_satelit ?? '',
            'createdAt' => $row->created_at ? (string) $row->created_at : null,
            'updatedAt' => $row->updated_at ? (string) $row->updated_at : null,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $satdikId = trim((string) $request->query('satdik_id', ''));
            $search = trim((string) $request->query('q', ''));

            $query = TanahBidang::query();
            if ($satdikId !== '' && $satdikId !== 'ALL') {
                $query->where('satdik_id', $satdikId);
            }
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_bidang', 'like', "%{$search}%")
                        ->orWhere('no_sertifikat', 'like', "%{$search}%")
                        ->orWhere('kode_bmn', 'like', "%{$search}%")
                        ->orWhere('alamat', 'like', "%{$search}%");
                });
            }

            $rows = $query
                ->orderBy('satdik_id')
                ->orderBy('nup')
                ->orderByDesc('created_at')
                ->get();

            $map = $this->satdikMap->getInfoMap();
            $parcels = $rows->map(fn (TanahBidang $r) => $this->formatRow($r, $map))->values()->all();

            return response()->json([
                'status' => 'success',
                'total' => count($parcels),
                'data' => $parcels,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data bidang tanah: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->all();
        if (empty($body['satdikId']) || empty($body['namaBidang'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Field satdikId dan namaBidang wajib diisi.',
            ], 400);
        }

        $satdikId = trim((string) $body['satdikId']);
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), -3));
        $id = !empty($body['id']) ? trim((string) $body['id']) : ('TNH-' . $prefix . '-' . time() . '-' . random_int(100, 999));

        $luasM2 = isset($body['luasM2']) ? max(0, (float) $body['luasM2']) : 0;
        $luasHa = isset($body['luasHa']) && (float) $body['luasHa'] > 0 ? (float) $body['luasHa'] : round($luasM2 / 10000, 4);

        try {
            $created = TanahBidang::create([
                'id' => $id,
                'satdik_id' => $satdikId,
                'nama_bidang' => trim((string) $body['namaBidang']),
                'kode_bmn' => !empty($body['kodeBmn']) ? trim((string) $body['kodeBmn']) : '2.01.01.01.001.0001',
                'nup' => isset($body['nup']) ? max(1, (int) $body['nup']) : 1,
                'luas_m2' => $luasM2,
                'luas_ha' => $luasHa,
                'status_sertifikat' => !empty($body['statusSertifikat']) ? trim((string) $body['statusSertifikat']) : 'Sertifikat Hak Pakai (SHP)',
                'no_sertifikat' => isset($body['noSertifikat']) ? trim((string) $body['noSertifikat']) : '-',
                'tanggal_sertifikat' => isset($body['tanggalSertifikat']) ? trim((string) $body['tanggalSertifikat']) : '-',
                'atas_nama' => !empty($body['atasNama']) ? trim((string) $body['atasNama']) : 'Pemerintah RI c.q. Kementerian Kelautan dan Perikanan',
                'peruntukan' => !empty($body['peruntukan']) ? trim((string) $body['peruntukan']) : 'Kampus & Fasilitas Akademik',
                'status_pemanfaatan' => !empty($body['statusPemanfaatan']) ? trim((string) $body['statusPemanfaatan']) : 'Digunakan Sendiri (Operasional)',
                'alamat' => isset($body['alamat']) ? trim((string) $body['alamat']) : '',
                'kota' => isset($body['kota']) ? trim((string) $body['kota']) : '',
                'provinsi' => isset($body['provinsi']) ? trim((string) $body['provinsi']) : '',
                'tahun_perolehan' => isset($body['tahunPerolehan']) ? max(1950, (int) $body['tahunPerolehan']) : 2020,
                'asal_perolehan' => !empty($body['asalPerolehan']) ? trim((string) $body['asalPerolehan']) : 'APBN',
                'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : '',
                'foto_satelit' => isset($body['fotoSatelit']) ? trim((string) $body['fotoSatelit']) : '',
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Bidang tanah berhasil disimpan ke database.',
                'data' => $this->formatRow($created->fresh(), $map),
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan bidang tanah: ' . $e->getMessage(),
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
                'message' => 'ID bidang tanah wajib disertakan.',
            ], 400);
        }

        try {
            $existing = TanahBidang::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Bidang tanah dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $luasM2 = isset($body['luasM2']) ? (float) $body['luasM2'] : (float) $existing->luas_m2;
            $luasHa = isset($body['luasHa']) ? (float) $body['luasHa'] : round($luasM2 / 10000, 4);

            $existing->update([
                'satdik_id' => isset($body['satdikId']) ? trim((string) $body['satdikId']) : $existing->satdik_id,
                'nama_bidang' => isset($body['namaBidang']) ? trim((string) $body['namaBidang']) : $existing->nama_bidang,
                'kode_bmn' => isset($body['kodeBmn']) ? trim((string) $body['kodeBmn']) : $existing->kode_bmn,
                'nup' => isset($body['nup']) ? (int) $body['nup'] : (int) $existing->nup,
                'luas_m2' => $luasM2,
                'luas_ha' => $luasHa,
                'status_sertifikat' => isset($body['statusSertifikat']) ? trim((string) $body['statusSertifikat']) : $existing->status_sertifikat,
                'no_sertifikat' => isset($body['noSertifikat']) ? trim((string) $body['noSertifikat']) : $existing->no_sertifikat,
                'tanggal_sertifikat' => isset($body['tanggalSertifikat']) ? trim((string) $body['tanggalSertifikat']) : $existing->tanggal_sertifikat,
                'atas_nama' => isset($body['atasNama']) ? trim((string) $body['atasNama']) : $existing->atas_nama,
                'peruntukan' => isset($body['peruntukan']) ? trim((string) $body['peruntukan']) : $existing->peruntukan,
                'status_pemanfaatan' => isset($body['statusPemanfaatan']) ? trim((string) $body['statusPemanfaatan']) : $existing->status_pemanfaatan,
                'alamat' => isset($body['alamat']) ? trim((string) $body['alamat']) : $existing->alamat,
                'kota' => isset($body['kota']) ? trim((string) $body['kota']) : $existing->kota,
                'provinsi' => isset($body['provinsi']) ? trim((string) $body['provinsi']) : $existing->provinsi,
                'tahun_perolehan' => isset($body['tahunPerolehan']) ? (int) $body['tahunPerolehan'] : (int) $existing->tahun_perolehan,
                'asal_perolehan' => isset($body['asalPerolehan']) ? trim((string) $body['asalPerolehan']) : $existing->asal_perolehan,
                'keterangan' => isset($body['keterangan']) ? trim((string) $body['keterangan']) : $existing->keterangan,
                'foto_satelit' => isset($body['fotoSatelit']) ? trim((string) $body['fotoSatelit']) : ($existing->foto_satelit ?? ''),
            ]);

            $map = $this->satdikMap->getInfoMap();

            return response()->json([
                'status' => 'success',
                'message' => 'Data bidang tanah berhasil diperbarui.',
                'data' => $this->formatRow($existing->fresh(), $map),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui bidang tanah: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
        if (!$targetId) {
            return response()->json([
                'status' => 'error',
                'message' => 'ID bidang tanah wajib disertakan.',
            ], 400);
        }

        try {
            $existing = TanahBidang::find($targetId);
            if (!$existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Bidang tanah dengan ID {$targetId} tidak ditemukan.",
                ], 404);
            }

            $nama = $existing->nama_bidang;
            $existing->delete();

            return response()->json([
                'status' => 'success',
                'message' => "Bidang tanah \"{$nama}\" berhasil dihapus.",
                'id' => $targetId,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus bidang tanah: ' . $e->getMessage(),
            ], 500);
        }
    }
}
