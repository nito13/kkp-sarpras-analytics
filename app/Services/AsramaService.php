<?php

namespace App\Services;

use App\Models\AsramaGedung;
use App\Models\AsramaRekap;
use App\Models\Satdik;
use Illuminate\Support\Facades\DB;

class AsramaService
{
    public function formatBuilding(AsramaGedung $r): array
    {
        return [
            'id' => $r->id,
            'satdikId' => $r->satdik_id,
            'kampus' => $r->kampus ?? '',
            'nama' => $r->nama,
            'peruntukan' => $r->peruntukan ?? '',
            'jumlahKamar' => (int) ($r->jumlah_kamar ?? 0),
            'luasM2' => (float) ($r->luas_m2 ?? 0),
            'kapasitas' => (float) ($r->kapasitas ?? 0),
            'status' => $r->status ?? 'Digunakan',
            'keterangan' => $r->keterangan ?? '',
            'rincian' => !empty($r->rincian_json) ? (json_decode($r->rincian_json, true) ?: []) : [],
        ];
    }

    public function formatRekap(AsramaRekap $r): array
    {
        return [
            'satdikId' => $r->satdik_id,
            'namaExcel' => $r->nama_excel ?? '',
            'jumlahAsrama' => (int) ($r->jumlah_asrama ?? 0),
            'jumlahKamar' => (int) ($r->jumlah_kamar ?? 0),
            'luasM2' => (float) ($r->luas_m2 ?? 0),
            'kapasitas' => (float) ($r->kapasitas ?? 0),
            'kapasitasAktif' => (float) ($r->kapasitas_aktif ?? 0),
            'luasAdjustment' => $r->luas_adjustment === null ? null : (float) $r->luas_adjustment,
            'kapasitasAdjustment' => $r->kapasitas_adjustment === null ? null : (float) $r->kapasitas_adjustment,
            'jumlahTidakDipakai' => (int) ($r->jumlah_tidak_dipakai ?? 0),
            'jumlahPerluRenovasi' => (int) ($r->jumlah_perlu_renovasi ?? 0),
            'keterangan' => $r->keterangan ?? '',
            'driveUrl' => !empty($r->drive_url) ? ('APIs/doc.php?ref=' . urlencode($r->satdik_id)) : '',
        ];
    }

    public function recalculateRekap(string $satdikId, string $defaultSource = 'SIM-SARPRAS Input'): ?array
    {
        $agg = DB::table('asrama_gedung')
            ->where('satdik_id', $satdikId)
            ->selectRaw("
                COUNT(*) as jumlah_asrama,
                COALESCE(SUM(jumlah_kamar), 0) as jumlah_kamar,
                COALESCE(SUM(luas_m2), 0) as luas_m2,
                COALESCE(SUM(kapasitas), 0) as kapasitas,
                COALESCE(SUM(CASE WHEN status = 'Digunakan' THEN kapasitas ELSE 0 END), 0) as kapasitas_aktif,
                COALESCE(SUM(CASE WHEN status = 'Tidak Digunakan' THEN 1 ELSE 0 END), 0) as jumlah_tidak_dipakai,
                COALESCE(SUM(CASE WHEN status = 'Perlu Renovasi' THEN 1 ELSE 0 END), 0) as jumlah_perlu_renovasi
            ")
            ->first();

        if (!$agg) {
            return null;
        }

        $existing = AsramaRekap::find($satdikId);

        if ($existing) {
            $existing->update([
                'jumlah_asrama' => (int) $agg->jumlah_asrama,
                'jumlah_kamar' => (int) $agg->jumlah_kamar,
                'luas_m2' => (float) $agg->luas_m2,
                'kapasitas' => (float) $agg->kapasitas,
                'kapasitas_aktif' => (float) $agg->kapasitas_aktif,
                'jumlah_tidak_dipakai' => (int) $agg->jumlah_tidak_dipakai,
                'jumlah_perlu_renovasi' => (int) $agg->jumlah_perlu_renovasi,
            ]);
            $rekap = $existing->fresh();
        } else {
            $satdik = Satdik::find($satdikId);
            $namaExcel = $satdik ? ($satdik->short_name ?: $satdik->name) : $satdikId;

            $rekap = AsramaRekap::create([
                'satdik_id' => $satdikId,
                'nama_excel' => $namaExcel,
                'jumlah_asrama' => (int) $agg->jumlah_asrama,
                'jumlah_kamar' => (int) $agg->jumlah_kamar,
                'luas_m2' => (float) $agg->luas_m2,
                'kapasitas' => (float) $agg->kapasitas,
                'kapasitas_aktif' => (float) $agg->kapasitas_aktif,
                'jumlah_tidak_dipakai' => (int) $agg->jumlah_tidak_dipakai,
                'jumlah_perlu_renovasi' => (int) $agg->jumlah_perlu_renovasi,
                'sumber' => $defaultSource,
                'tanggal_data' => now()->toDateString(),
            ]);
        }

        return $rekap ? $this->formatRekap($rekap) : null;
    }
}
