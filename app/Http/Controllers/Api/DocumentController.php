<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AsramaRekap;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class DocumentController extends Controller
{
    private const DOCUMENT_MAP = [
        'poltek-aup' => 'https://drive.google.com/file/d/1X6CqZ7XQ6heEONfSez-TWB4A5v31-8Rn/view?usp=sharing',
        'poltek-kp-sidoarjo' => 'https://drive.google.com/file/d/1MAlPdnv70f6ROfDyk7S2uq8TcF81GP2S/view?usp=sharing',
        'poltek-kp-bitung' => 'https://drive.google.com/file/d/1QVBEWs_wUjAKQyJ8J3WO02o-zf8FLPH9/view?usp=sharing',
        'poltek-kp-sorong' => 'https://drive.google.com/file/d/1yXLRzNCz1PCiWIYiTbxYXiQymsCHnDkn/view?usp=sharing',
        'poltek-kp-karawang' => 'https://drive.google.com/file/d/1BVn0WMyYEd29Z3wl1zOhOPFUe3_UbncZ/view?usp=sharing',
        'poltek-kp-kupang' => 'https://drive.google.com/file/d/1tzeX_aVSOH4h1dvDsBVh9GJKt7ky5C2M/view?usp=sharing',
        'poltek-kp-bone' => 'https://drive.google.com/file/d/1zbWHEgeuFM1amb3Nl-7oIc_b1mCDA5uY/view?usp=sharing',
        'poltek-kp-pangandaran' => 'https://drive.google.com/file/d/1IlrVTV-yfya6WyujYyMlCi9MbiFJg5b-/view?usp=sharing',
        'poltek-kp-dumai' => 'https://drive.google.com/file/d/11tkIxHxhUHodrD1I1CaBrBiYyHTHeIsw/view?usp=sharing',
        'poltek-kp-jembrana' => 'https://drive.google.com/file/d/12k5IvkWQW2pqye9GTw_dntmPrnq9d3iS/view?usp=sharing',
        'akkp-wakatobi' => 'https://drive.google.com/file/d/1WTfwpN7wI6qDTZzPFLO0XuIihojqHdnr/view?usp=sharing',
        'supm-ladong' => 'https://drive.google.com/file/d/14TBYGWUDtKHo-WucKp5vnfILBoaPoG1R/view?usp=sharing',
        'supm-pariaman' => 'https://drive.google.com/file/d/1nEcfgRBw_BU_UnbwDUQqM2qv25BjTual/view?usp=sharing',
        'supm-kotaagung' => 'https://drive.google.com/file/d/1UA9dnejoxFHx6JC89psiwi8YGTf8_nJK/view?usp=sharing',
        'supm-tegal' => 'https://drive.google.com/file/d/1c-YtdyhHNpeN22Pf71-FNB7OunFeUUAc/view?usp=sharing',
        'supm-waiheru' => 'https://drive.google.com/file/d/1Szlj58p9-6nomyF_Nxbh9J9KuFwh3jHX/view?usp=sharing',
        'wakatobi-tambak' => 'https://drive.google.com/file/d/1kmTbwtt2u5t4lKjYFw5ZoqSOI5xjkj1T/view?usp=drive_link',
    ];

    public function redirect(Request $request): BaseResponse
    {
        $hasServerCookie = !empty($request->cookie('kkp_sarpras_active'));
        $hasClientCookie = $request->cookie('kkp_sarpras_client') === '1';

        if (!$hasServerCookie && !$hasClientCookie) {
            $html = '<!doctype html><html lang="id"><head><meta charset="utf-8"><title>403 Akses Ditolak</title>'
                . '<style>body{background:#0f172a;color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}'
                . '.box{background:#1e293b;border:1px solid #334155;padding:24px 32px;border-radius:16px;max-width:420px;text-align:center}'
                . 'h1{color:#f43f5e;font-size:18px;margin:0 0 8px}p{color:#94a3b8;font-size:13px;line-height:1.5;margin:0}</style></head>'
                . '<body><div class="box"><h1>403 — Akses Dokumen Ditolak</h1><p>Dokumen surat kedinasan hanya dapat diakses oleh pengguna yang telah masuk (login) ke dalam Sistem Informasi Sarpras KP.</p></div></body></html>';

            return new Response($html, 403, ['Content-Type' => 'text/html; charset=utf-8']);
        }

        $ref = strtolower(trim((string) $request->query('ref', '')));
        $targetUrl = self::DOCUMENT_MAP[$ref] ?? '';

        if ($targetUrl === '' && $ref !== '') {
            try {
                $row = AsramaRekap::find($ref);
                if ($row && !empty($row->drive_url) && str_starts_with($row->drive_url, 'http')) {
                    $targetUrl = $row->drive_url;
                }
            } catch (\Throwable $e) {
            }
        }

        if ($targetUrl === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'Dokumen tidak ditemukan.',
            ], 404);
        }

        return redirect()->away($targetUrl, 302, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
    }
}
