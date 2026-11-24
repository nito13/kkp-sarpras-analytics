<?php

namespace App\Services;

use App\Models\StandarBidang;
use App\Models\StandarItem;
use App\Models\StandarRekap;

class StandarSarprasService
{
    public function formatNumber($v): int|float
    {
        $f = (float) $v;
        $i = (int) round($f);
        return abs($f - $i) < 0.0001 ? $i : round($f, 2);
    }

    public function formatItem(StandarItem $r): array
    {
        $obj = [
            'id' => $r->id,
            'bidangId' => $r->bidang_id,
            'sec' => $r->sec,
            'subSec' => $r->sub_sec ?? '',
            'grpCode' => $r->grp_code ?? '',
            'grpName' => $r->grp_name,
            'subGrp' => $r->sub_grp ?? '',
            'no' => $r->item_no ?? '',
            'nama' => $r->nama,
            'stdVol' => $this->formatNumber($r->std_vol),
            'satuan' => $r->satuan ?? 'Unit',
            'real' => !empty($r->realisasi_json) ? (json_decode($r->realisasi_json, true) ?: []) : [],
        ];

        if (!empty($r->kondisi)) {
            $obj['kondisi'] = $r->kondisi;
        }
        if (!empty($r->keterangan)) {
            $obj['ket'] = $r->keterangan;
        }

        return $obj;
    }

    public function formatBidang(StandarBidang $b): array
    {
        return [
            'id' => $b->id,
            'code' => $b->code,
            'sheetName' => $b->sheet_name,
            'nama' => $b->nama,
            'categoryId' => $b->category_id ?? '',
            'prodi' => !empty($b->prodi_json) ? (json_decode($b->prodi_json, true) ?: []) : [],
            'satdikIds' => !empty($b->satdik_ids_json) ? (json_decode($b->satdik_ids_json, true) ?: []) : [],
            'prasaranaCount' => (int) $b->prasarana_count,
            'saranaCount' => (int) $b->sarana_count,
            'totalItems' => (int) $b->total_items,
            'groupNotes' => !empty($b->group_notes_json) ? (json_decode($b->group_notes_json, true) ?: []) : [],
        ];
    }

    public function formatRekap(StandarRekap $r): array
    {
        return [
            'id' => $r->id,
            'bidangId' => $r->bidang_id,
            'satdikId' => $r->satdik_id,
            'prasaranaTotal' => (int) $r->prasarana_total,
            'prasaranaTerpenuhi' => (int) $r->prasarana_terpenuhi,
            'prasaranaSebagian' => (int) $r->prasarana_sebagian,
            'prasaranaKosong' => (int) $r->prasarana_kosong,
            'saranaTotal' => (int) $r->sarana_total,
            'saranaTerpenuhi' => (int) $r->sarana_terpenuhi,
            'saranaSebagian' => (int) $r->sarana_sebagian,
            'saranaKosong' => (int) $r->sarana_kosong,
            'totalItems' => (int) $r->total_items,
            'totalTerpenuhi' => (int) $r->total_terpenuhi,
            'totalSebagian' => (int) $r->total_sebagian,
            'totalKosong' => (int) $r->total_kosong,
            'persenPrasarana' => (float) $r->persen_prasarana,
            'persenSarana' => (float) $r->persen_sarana,
            'persenTotal' => (float) $r->persen_total,
            'stdVolSum' => $this->formatNumber($r->std_vol_sum),
            'realVolSum' => $this->formatNumber($r->real_vol_sum),
        ];
    }

    public function recalculateRekap(string $bidangId): array
    {
        $bidang = StandarBidang::find($bidangId);
        if (!$bidang) {
            return ['bidang' => null, 'rekap' => []];
        }

        $satdikIds = !empty($bidang->satdik_ids_json) ? (json_decode($bidang->satdik_ids_json, true) ?: []) : [];
        $codePrefix = $bidang->code ?? 'STD';

        $items = StandarItem::where('bidang_id', $bidangId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $pTotBidang = 0;
        $sTotBidang = 0;
        foreach ($items as $it) {
            if ($it->sec === 'A') {
                $pTotBidang++;
            } else {
                $sTotBidang++;
            }
        }
        $totalItemsBidang = $items->count();

        $bidang->update([
            'prasarana_count' => $pTotBidang,
            'sarana_count' => $sTotBidang,
            'total_items' => $totalItemsBidang,
        ]);

        $updatedRekap = [];
        foreach ($satdikIds as $sid) {
            $pTot = $pFull = $pPart = $pZero = 0;
            $sTot = $sFull = $sPart = $sZero = 0;
            $pScoreSum = 0.0;
            $sScoreSum = 0.0;
            $stdVolSum = 0.0;
            $realVolSum = 0.0;

            foreach ($items as $it) {
                $sv = (float) ($it->std_vol ?? 0);
                $realMap = !empty($it->realisasi_json) ? (json_decode($it->realisasi_json, true) ?: []) : [];
                $rv = isset($realMap[$sid]) ? (float) $realMap[$sid] : 0.0;

                $stdVolSum += $sv;
                $realVolSum += $rv;
                $ratioItem = ($sv <= 0 && $rv > 0) ? 1.0 : (($sv > 0) ? min(1.0, $rv / $sv) : 0.0);

                if ($it->sec === 'A') {
                    $pTot++;
                    $pScoreSum += $ratioItem;
                    if ($sv > 0 && $rv >= $sv) {
                        $pFull++;
                    } elseif ($rv > 0) {
                        $pPart++;
                    } else {
                        $pZero++;
                    }
                } else {
                    $sTot++;
                    $sScoreSum += $ratioItem;
                    if ($sv > 0 && $rv >= $sv) {
                        $sFull++;
                    } elseif ($rv > 0) {
                        $sPart++;
                    } else {
                        $sZero++;
                    }
                }
            }

            $totItems = $pTot + $sTot;
            $totFull = $pFull + $sFull;
            $totPart = $pPart + $sPart;
            $totZero = $pZero + $sZero;

            $persenP = $pTot > 0 ? round(($pScoreSum / $pTot) * 100, 1) : 0.0;
            $persenS = $sTot > 0 ? round(($sScoreSum / $sTot) * 100, 1) : 0.0;
            $persenAll = $totItems > 0 ? round((($pScoreSum + $sScoreSum) / $totItems) * 100, 1) : 0.0;

            $rekapId = $codePrefix . '-' . $sid;
            $existing = StandarRekap::where('bidang_id', $bidangId)
                ->where('satdik_id', $sid)
                ->first();

            $values = [
                'prasarana_total' => $pTot,
                'prasarana_terpenuhi' => $pFull,
                'prasarana_sebagian' => $pPart,
                'prasarana_kosong' => $pZero,
                'sarana_total' => $sTot,
                'sarana_terpenuhi' => $sFull,
                'sarana_sebagian' => $sPart,
                'sarana_kosong' => $sZero,
                'total_items' => $totItems,
                'total_terpenuhi' => $totFull,
                'total_sebagian' => $totPart,
                'total_kosong' => $totZero,
                'persen_prasarana' => $persenP,
                'persen_sarana' => $persenS,
                'persen_total' => $persenAll,
                'std_vol_sum' => $stdVolSum,
                'real_vol_sum' => $realVolSum,
            ];

            if ($existing) {
                $existing->update($values);
                $rekapModel = $existing->fresh();
            } else {
                $rekapModel = StandarRekap::create(array_merge([
                    'id' => $rekapId,
                    'bidang_id' => $bidangId,
                    'satdik_id' => $sid,
                ], $values));
            }

            $updatedRekap[] = $this->formatRekap($rekapModel);
        }

        return [
            'bidang' => $this->formatBidang($bidang->fresh()),
            'rekap' => $updatedRekap,
        ];
    }
}
