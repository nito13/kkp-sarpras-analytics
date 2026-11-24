<?php

namespace App\Services;

use App\Models\Satdik;
use App\Models\TambakRekap;
use App\Models\TambakUnit;

class TambakService
{
    public function formatRekap(TambakRekap $row): array
    {
        return [
            'satdikId' => $row->satdik_id,
            'namaSatdik' => $row->nama_satdik,
            'kodeSatdik' => $row->kode_satdik ?? '',
            'jenjang' => $row->jenjang ?? 'Politeknik',
            'jumlahUnit' => (int) ($row->jumlah_unit ?? 0),
            'jumlahTambak' => (int) ($row->jumlah_tambak ?? 0),
            'jumlahKolam' => (int) ($row->jumlah_kolam ?? 0),
            'jumlahTandon' => (int) ($row->jumlah_tandon ?? 0),
            'luasTotalM2' => (float) ($row->luas_total_m2 ?? 0),
            'luasTambakM2' => (float) ($row->luas_tambak_m2 ?? 0),
            'luasKolamM2' => (float) ($row->luas_kolam_m2 ?? 0),
            'kondisiBaik' => (int) ($row->kondisi_baik ?? 0),
            'kondisiRusakRingan' => (int) ($row->kondisi_rusak_ringan ?? 0),
            'kondisiRusakBerat' => (int) ($row->kondisi_rusak_berat ?? 0),
            'unitAktif' => (int) ($row->unit_aktif ?? 0),
            'unitBelumDimanfaatkan' => (int) ($row->unit_belum_dimanfaatkan ?? 0),
            'totalKincir' => (int) ($row->total_kincir ?? 0),
            'dayaListrik' => $row->daya_listrik ?? '-',
            'lokasiUtama' => $row->lokasi_utama ?? '-',
            'mapUrl' => (!empty($row->map_url) && str_contains($row->map_url, 'drive.google.com'))
                ? 'APIs/doc.php?ref=wakatobi-tambak'
                : ($row->map_url ?? ''),
            'keterangan' => $row->keterangan ?? '',
        ];
    }

    public function formatUnit(TambakUnit $row, array $satdikMap = []): array
    {
        $sid = $row->satdik_id;
        $sInfo = $satdikMap[$sid] ?? ['nama' => $sid, 'jenjang' => 'Politeknik'];

        return [
            'id' => $row->id,
            'satdikId' => $sid,
            'namaSatdik' => $sInfo['nama'],
            'jenjang' => $sInfo['jenjang'],
            'noUrut' => (int) ($row->no_urut ?? 1),
            'nama' => $row->nama,
            'jenis' => $row->jenis ?? 'Tambak',
            'kampusLokasi' => $row->kampus_lokasi ?? '-',
            'luasM2' => (float) ($row->luas_m2 ?? 0),
            'luasLabel' => $row->luas_label ?? '-',
            'kondisi' => $row->kondisi ?? 'Baik',
            'fungsi' => $row->fungsi ?? '-',
            'statusOperasional' => $row->status_operasional ?? 'Aktif Budidaya',
            'pelataran' => $row->pelataran ?? 'Tanah',
            'pelataranKategori' => $row->pelataran_kategori ?? 'Tanah',
            'listrik' => $row->listrik ?? '-',
            'kincir' => $row->kincir ?? '-',
            'jumlahKincir' => (int) ($row->jumlah_kincir ?? 0),
            'lokasiLabel' => $row->lokasi_label ?? '-',
            'mapUrl' => $row->map_url ?? '',
            'keterangan' => $row->keterangan ?? '',
        ];
    }

    public function resolvePelataranKategori(string $pelataran): string
    {
        $u = strtoupper($pelataran);
        if (str_contains($u, 'HDPE') || str_contains($u, 'HDFE') || str_contains($u, 'GEOMEMBRAN')) {
            return 'HDPE / Geomembran';
        }
        if (str_contains($u, 'BETON') || str_contains($u, 'SEMEN') || str_contains($u, 'RABATAN')) {
            return 'Beton / Semen';
        }
        if (str_contains($u, 'FIBER') || str_contains($u, 'TERPAL')) {
            return 'Fiber / Terpal';
        }

        return 'Tanah';
    }

    public function recalculateRekap(string $satdikId): ?array
    {
        $rows = TambakUnit::where('satdik_id', $satdikId)->get();

        $jmlUnit = $rows->count();
        $jmlTambak = 0;
        $jmlKolam = 0;
        $jmlTandon = 0;
        $luasTotal = 0.0;
        $luasTambak = 0.0;
        $luasKolam = 0.0;
        $kBaik = 0;
        $kRr = 0;
        $kRb = 0;
        $uAktif = 0;
        $uBelum = 0;
        $totalKincir = 0;

        foreach ($rows as $r) {
            $jenis = $r->jenis ?? 'Tambak';
            $luas = (float) ($r->luas_m2 ?? 0);
            $kondisi = $r->kondisi ?? 'Baik';
            $statusOp = $r->status_operasional ?? 'Aktif Budidaya';

            $luasTotal += $luas;
            if ($jenis === 'Tambak') {
                $jmlTambak++;
                $luasTambak += $luas;
            } elseif ($jenis === 'Kolam') {
                $jmlKolam++;
                $luasKolam += $luas;
            } else {
                $jmlTandon++;
                $luasKolam += $luas;
            }

            if ($kondisi === 'Baik') {
                $kBaik++;
            } elseif ($kondisi === 'Rusak Ringan') {
                $kRr++;
            } else {
                $kRb++;
            }

            if (in_array($statusOp, ['Aktif Budidaya', 'Koperasi / Sewa', 'Tandon / Pendukung'], true)) {
                $uAktif++;
            } else {
                $uBelum++;
            }

            $totalKincir += (int) ($r->jumlah_kincir ?? 0);
        }

        $stats = [
            'jumlah_unit' => $jmlUnit,
            'jumlah_tambak' => $jmlTambak,
            'jumlah_kolam' => $jmlKolam,
            'jumlah_tandon' => $jmlTandon,
            'luas_total_m2' => round($luasTotal, 2),
            'luas_tambak_m2' => round($luasTambak, 2),
            'luas_kolam_m2' => round($luasKolam, 2),
            'kondisi_baik' => $kBaik,
            'kondisi_rusak_ringan' => $kRr,
            'kondisi_rusak_berat' => $kRb,
            'unit_aktif' => $uAktif,
            'unit_belum_dimanfaatkan' => $uBelum,
            'total_kincir' => $totalKincir,
        ];

        $existing = TambakRekap::find($satdikId);
        if ($existing) {
            $existing->update($stats);
            $rekap = $existing->fresh();
        } else {
            $satRow = Satdik::find($satdikId);
            $rekap = TambakRekap::create(array_merge([
                'satdik_id' => $satdikId,
                'nama_satdik' => $satRow ? $satRow->name : $satdikId,
                'kode_satdik' => strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $satdikId), 0, 3)),
                'jenjang' => $satRow ? ($satRow->type ?: 'Politeknik') : 'Politeknik',
            ], $stats));
        }

        return $rekap ? $this->formatRekap($rekap) : null;
    }
}
