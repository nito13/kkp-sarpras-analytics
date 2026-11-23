<?php
/**
 * ============================================================================
 * GATEWAY DOKUMEN RESMI & SURAT KEDINASAN (TERPROTEKSI OTENTIKASI)
 * ============================================================================
 * Path: APIs/doc.php
 * Menyimpan dan mengalihkan (redirect) tautan dokumen Google Drive di sisi server
 * sehingga URL asli surat kedinasan tidak pernah terekspos di kode sumber Frontend.
 */

if (file_exists(__DIR__ . '/../Backend/config/database.php')) {
    require_once __DIR__ . '/../Backend/config/database.php';
} else {
    require_once __DIR__ . '/../config/database.php';
}

// Verifikasi bahwa pengguna sudah login melalui cookie sesi aplikasi
$hasServerCookie = !empty($_COOKIE['kkp_sarpras_active']);
$hasClientCookie = !empty($_COOKIE['kkp_sarpras_client']) && $_COOKIE['kkp_sarpras_client'] === '1';

if (!$hasServerCookie && !$hasClientCookie) {
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="id"><head><meta charset="utf-8"><title>403 Akses Ditolak</title>';
    echo '<style>body{background:#0f172a;color:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}';
    echo '.box{background:#1e293b;border:1px solid #334155;padding:24px 32px;border-radius:16px;max-width:420px;text-align:center}';
    echo 'h1{color:#f43f5e;font-size:18px;margin:0 0 8px}p{color:#94a3b8;font-size:13px;line-height:1.5;margin:0}</style></head>';
    echo '<body><div class="box"><h1>403 — Akses Dokumen Ditolak</h1><p>Dokumen surat kedinasan hanya dapat diakses oleh pengguna yang telah masuk (login) ke dalam Sistem Informasi Sarpras KP.</p></div></body></html>';
    exit();
}

$ref = strtolower(trim((string)($_GET['ref'] ?? '')));

// Peta tautan dokumen resmi di sisi server (tidak pernah dikirim ke Page Source / JS)
$DOCUMENT_MAP = [
    'poltek-aup'            => 'https://drive.google.com/file/d/1X6CqZ7XQ6heEONfSez-TWB4A5v31-8Rn/view?usp=sharing',
    'poltek-kp-sidoarjo'    => 'https://drive.google.com/file/d/1MAlPdnv70f6ROfDyk7S2uq8TcF81GP2S/view?usp=sharing',
    'poltek-kp-bitung'      => 'https://drive.google.com/file/d/1QVBEWs_wUjAKQyJ8J3WO02o-zf8FLPH9/view?usp=sharing',
    'poltek-kp-sorong'      => 'https://drive.google.com/file/d/1yXLRzNCz1PCiWIYiTbxYXiQymsCHnDkn/view?usp=sharing',
    'poltek-kp-karawang'    => 'https://drive.google.com/file/d/1BVn0WMyYEd29Z3wl1zOhOPFUe3_UbncZ/view?usp=sharing',
    'poltek-kp-kupang'      => 'https://drive.google.com/file/d/1tzeX_aVSOH4h1dvDsBVh9GJKt7ky5C2M/view?usp=sharing',
    'poltek-kp-bone'        => 'https://drive.google.com/file/d/1zbWHEgeuFM1amb3Nl-7oIc_b1mCDA5uY/view?usp=sharing',
    'poltek-kp-pangandaran' => 'https://drive.google.com/file/d/1IlrVTV-yfya6WyujYyMlCi9MbiFJg5b-/view?usp=sharing',
    'poltek-kp-dumai'       => 'https://drive.google.com/file/d/11tkIxHxhUHodrD1I1CaBrBiYyHTHeIsw/view?usp=sharing',
    'poltek-kp-jembrana'    => 'https://drive.google.com/file/d/12k5IvkWQW2pqye9GTw_dntmPrnq9d3iS/view?usp=sharing',
    'akkp-wakatobi'         => 'https://drive.google.com/file/d/1WTfwpN7wI6qDTZzPFLO0XuIihojqHdnr/view?usp=sharing',
    'supm-ladong'           => 'https://drive.google.com/file/d/14TBYGWUDtKHo-WucKp5vnfILBoaPoG1R/view?usp=sharing',
    'supm-pariaman'         => 'https://drive.google.com/file/d/1nEcfgRBw_BU_UnbwDUQqM2qv25BjTual/view?usp=sharing',
    'supm-kotaagung'        => 'https://drive.google.com/file/d/1UA9dnejoxFHx6JC89psiwi8YGTf8_nJK/view?usp=sharing',
    'supm-tegal'            => 'https://drive.google.com/file/d/1c-YtdyhHNpeN22Pf71-FNB7OunFeUUAc/view?usp=sharing',
    'supm-waiheru'          => 'https://drive.google.com/file/d/1Szlj58p9-6nomyF_Nxbh9J9KuFwh3jHX/view?usp=sharing',
    'wakatobi-tambak'       => 'https://drive.google.com/file/d/1kmTbwtt2u5t4lKjYFw5ZoqSOI5xjkj1T/view?usp=drive_link',
];

$targetUrl = $DOCUMENT_MAP[$ref] ?? '';

// Cek fallback di database MySQL apabila dokumen ditambahkan dinamis
if ($targetUrl === '' && $ref !== '') {
    try {
        $pdo = getDbConnection(true);
        $stmt = $pdo->prepare("SELECT drive_url FROM asrama_rekap WHERE satdik_id = :sid LIMIT 1");
        $stmt->execute([':sid' => $ref]);
        $row = $stmt->fetch();
        if (!empty($row['drive_url']) && strpos($row['drive_url'], 'http') === 0) {
            $targetUrl = $row['drive_url'];
        }
    } catch (Throwable $e) {}
}

if ($targetUrl === '') {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'error', 'message' => 'Dokumen tidak ditemukan.'], JSON_UNESCAPED_UNICODE);
    exit();
}

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Location: ' . $targetUrl, true, 302);
exit();
