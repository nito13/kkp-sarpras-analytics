<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StandarBidang;
use App\Models\StandarItem;
use App\Models\StandarRekap;
use App\Services\StandarSarprasService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StandarSarprasController extends Controller
{
    public function __construct(private StandarSarprasService $service)
    {
    }

    private function normalizeKondisi(mixed $raw): ?string
    {
        if ($raw === null) {
            return null;
        }
        $val = trim((string) $raw);
        if ($val === '') {
            return null;
        }
        $lower = strtolower($val);
        if ($lower === 'b' || $lower === 'baik' || $lower === 'baik (b)') {
            return 'B';
        }
        if ($lower === 'rr' || $lower === 'rusak ringan' || $lower === 'rusak ringan (rr)') {
            return 'RR';
        }
        if ($lower === 'rb' || $lower === 'rusak berat' || $lower === 'rusak berat (rb)') {
            return 'RB';
        }
        return mb_substr($val, 0, 50);
    }

    public function index(Request $request): JsonResponse
    {
        $singleId = $request->query('id');
        if ($singleId) {
            return $this->show($singleId);
        }

        $mode = $request->query('mode', 'all');
        $bidangFilter = $request->query('bidang_id');
        $satdikFilter = $request->query('satdik_id');

        $hasBidang = $bidangFilter && $bidangFilter !== 'ALL';
        $hasSatdik = $satdikFilter && $satdikFilter !== 'ALL';

        $bidangQuery = StandarBidang::query()->orderBy('sort_order')->orderBy('id');
        if ($hasBidang) {
            $bidangQuery->where('id', $bidangFilter);
        }
        $bidangRows = $bidangQuery->get();

        $rekapQuery = StandarRekap::query()->orderBy('bidang_id')->orderBy('satdik_id');
        if ($hasBidang) {
            $rekapQuery->where('bidang_id', $bidangFilter);
        }
        if ($hasSatdik) {
            $rekapQuery->where('satdik_id', $satdikFilter);
        }
        $rekapRows = $rekapQuery->get();

        $itemRows = collect();
        if ($mode !== 'summary') {
            $itemQuery = StandarItem::query()->orderBy('sort_order')->orderBy('id');
            if ($hasBidang) {
                $itemQuery->where('bidang_id', $bidangFilter);
            }
            $itemRows = $itemQuery->get();
        }

        $allSatdikIds = [];
        $totalP = 0;
        $totalS = 0;
        $totalCells = 0;

        $bidang = [];
        foreach ($bidangRows as $b) {
            $sids = !empty($b->satdik_ids_json) ? (json_decode($b->satdik_ids_json, true) ?: []) : [];
            if ($hasSatdik && !in_array($satdikFilter, $sids, true)) {
                continue;
            }
            foreach ($sids as $sid) {
                if (!in_array($sid, $allSatdikIds, true)) {
                    $allSatdikIds[] = $sid;
                }
            }
            $pCount = (int) $b->prasarana_count;
            $sCount = (int) $b->sarana_count;
            $tItems = (int) $b->total_items;
            $totalP += $pCount;
            $totalS += $sCount;
            $totalCells += $tItems * count($sids);

            $bidang[] = $this->service->formatBidang($b);
        }

        $allowedSet = array_flip(array_column($bidang, 'id'));
        $rekap = $rekapRows->map(fn (StandarRekap $r) => $this->service->formatRekap($r))->values()->all();

        $items = [];
        foreach ($itemRows as $r) {
            if (!isset($allowedSet[$r->bidang_id])) {
                continue;
            }
            $items[] = $this->service->formatItem($r);
        }

        $meta = null;
        if ($bidangRows->isNotEmpty()) {
            $first = $bidangRows->first();
            $meta = [
                'sumber' => $first->sumber ?? 'Data Contoh.xlsx',
                'tanggalData' => $first->tanggal_data ?? '',
                'jumlahBidang' => count($bidang),
                'jumlahSatdik' => count($allSatdikIds),
                'satdikIds' => $allSatdikIds,
                'totalPrasarana' => $totalP,
                'totalSarana' => $totalS,
                'totalItems' => $totalP + $totalS,
                'totalTitikRealisasi' => $totalCells,
            ];
        }

        return response()->json([
            'status' => 'success',
            'meta' => $meta,
            'bidang' => $bidang,
            'rekap' => $rekap,
            'items' => $items,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $row = StandarItem::find($id);
        if (!$row) {
            return response()->json(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $this->service->formatItem($row),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $input = $request->all();
        if (empty($input['nama']) || empty($input['bidangId'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak lengkap. Field nama dan bidangId wajib diisi.',
            ], 400);
        }

        $bidangId = trim((string) $input['bidangId']);
        $bidRow = StandarBidang::find($bidangId);
        if (!$bidRow) {
            return response()->json(['status' => 'error', 'message' => "Bidang '{$bidangId}' tidak ditemukan."], 404);
        }

        $sec = in_array(strtoupper((string) ($input['sec'] ?? 'A')), ['A', 'B'], true)
            ? strtoupper((string) $input['sec'])
            : 'A';

        $realMap = [];
        if (!empty($input['real']) && is_array($input['real'])) {
            foreach ($input['real'] as $k => $v) {
                $realMap[$k] = (float) $v;
            }
        } elseif (!empty($input['realSatdikId']) && isset($input['realVol']) && $input['realVol'] !== '') {
            $realMap[trim((string) $input['realSatdikId'])] = (float) $input['realVol'];
        }

        $codePrefix = $bidRow->code ?: 'STD';
        if (!empty($input['id'])) {
            $id = trim((string) $input['id']);
        } else {
            do {
                $id = $codePrefix . '-' . $sec . '-' . random_int(100, 999);
            } while (StandarItem::where('id', $id)->exists());
        }

        $nextOrder = (int) (StandarItem::where('bidang_id', $bidangId)->max('sort_order') ?? 0) + 1;

        $created = StandarItem::create([
            'id' => $id,
            'bidang_id' => $bidangId,
            'sec' => $sec,
            'sub_sec' => !empty($input['subSec']) ? trim((string) $input['subSec']) : $sec,
            'grp_code' => !empty($input['grpCode']) ? trim((string) $input['grpCode']) : ($sec . '.1'),
            'grp_name' => !empty($input['grpName']) ? trim((string) $input['grpName']) : 'FASILITAS STANDAR',
            'sub_grp' => !empty($input['subGrp']) ? trim((string) $input['subGrp']) : null,
            'item_no' => !empty($input['no'] ?? ($input['itemNo'] ?? null)) ? trim((string) ($input['no'] ?? $input['itemNo'])) : null,
            'nama' => trim((string) $input['nama']),
            'std_vol' => isset($input['stdVol']) ? (float) $input['stdVol'] : 1.0,
            'satuan' => !empty($input['satuan']) ? trim((string) $input['satuan']) : 'Unit',
            'realisasi_json' => json_encode($realMap, JSON_UNESCAPED_UNICODE),
            'kondisi' => $this->normalizeKondisi($input['kondisi'] ?? null),
            'keterangan' => !empty($input['ket'] ?? ($input['keterangan'] ?? null)) ? trim((string) ($input['ket'] ?? $input['keterangan'])) : null,
            'sort_order' => $nextOrder,
        ]);

        $calcResult = $this->service->recalculateRekap($bidangId);

        return response()->json([
            'status' => 'success',
            'message' => 'Item standar sarpras berhasil ditambahkan.',
            'data' => $this->service->formatItem($created->fresh()),
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ], 201);
    }

    public function update(Request $request, ?string $id = null): JsonResponse
    {
        $input = $request->all();
        $targetId = $id ?? ($request->query('id') ?? ($input['id'] ?? null));
        if (!$targetId) {
            return response()->json(['status' => 'error', 'message' => 'Parameter ID item standar sarpras diperlukan.'], 400);
        }

        $existing = StandarItem::find($targetId);
        if (!$existing) {
            return response()->json(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan.'], 404);
        }

        $updates = [];
        if (isset($input['nama'])) {
            $updates['nama'] = trim((string) $input['nama']);
        }
        if (isset($input['sec']) && in_array(strtoupper((string) $input['sec']), ['A', 'B'], true)) {
            $updates['sec'] = strtoupper((string) $input['sec']);
        }
        if (isset($input['subSec'])) {
            $updates['sub_sec'] = trim((string) $input['subSec']);
        }
        if (isset($input['grpCode'])) {
            $updates['grp_code'] = trim((string) $input['grpCode']);
        }
        if (isset($input['grpName'])) {
            $updates['grp_name'] = trim((string) $input['grpName']);
        }
        if (isset($input['subGrp'])) {
            $updates['sub_grp'] = trim((string) $input['subGrp']);
        }
        if (isset($input['no']) || isset($input['itemNo'])) {
            $updates['item_no'] = trim((string) ($input['no'] ?? $input['itemNo']));
        }
        if (isset($input['stdVol'])) {
            $updates['std_vol'] = (float) $input['stdVol'];
        }
        if (isset($input['satuan'])) {
            $updates['satuan'] = trim((string) $input['satuan']);
        }
        if (array_key_exists('kondisi', $input)) {
            $updates['kondisi'] = $this->normalizeKondisi($input['kondisi']);
        }
        if (array_key_exists('ket', $input) || array_key_exists('keterangan', $input)) {
            $ketVal = $input['ket'] ?? ($input['keterangan'] ?? null);
            $updates['keterangan'] = !empty($ketVal) ? trim((string) $ketVal) : null;
        }

        $currentReal = !empty($existing->realisasi_json) ? (json_decode($existing->realisasi_json, true) ?: []) : [];
        $realChanged = false;
        if (isset($input['real']) && is_array($input['real'])) {
            foreach ($input['real'] as $sid => $vol) {
                $currentReal[$sid] = (float) $vol;
            }
            $realChanged = true;
        } elseif (isset($input['satdikId']) && isset($input['realVol'])) {
            $currentReal[$input['satdikId']] = (float) $input['realVol'];
            $realChanged = true;
        }

        if ($realChanged) {
            $updates['realisasi_json'] = json_encode($currentReal, JSON_UNESCAPED_UNICODE);
        }

        if (empty($updates)) {
            return response()->json(['status' => 'error', 'message' => 'Tidak ada perubahan data yang dikirim.'], 400);
        }

        $existing->update($updates);
        $calcResult = $this->service->recalculateRekap($existing->bidang_id);

        return response()->json([
            'status' => 'success',
            'message' => 'Data item standar sarpras berhasil diperbarui.',
            'data' => $this->service->formatItem($existing->fresh()),
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ]);
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
        if (!$targetId) {
            return response()->json(['status' => 'error', 'message' => 'Parameter ID item standar sarpras diperlukan.'], 400);
        }

        $existing = StandarItem::find($targetId);
        if (!$existing) {
            return response()->json(['status' => 'error', 'message' => 'Item standar sarpras tidak ditemukan atau sudah terhapus.'], 404);
        }

        $bidangId = $existing->bidang_id;
        $existing->delete();

        $calcResult = $this->service->recalculateRekap($bidangId);

        return response()->json([
            'status' => 'success',
            'message' => 'Item standar sarpras berhasil dihapus.',
            'deletedId' => $targetId,
            'bidang' => $calcResult['bidang'],
            'rekap' => $calcResult['rekap'],
        ]);
    }
}
