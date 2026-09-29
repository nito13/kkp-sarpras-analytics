<?php
// C:\laragon\www\kkp-sarpras-analytics\index.php
// Gateway / Frontend Loader untuk SARPRAS KKP di Laragon Apache

$distIndex = __DIR__ . '/dist/index.html';

if (file_exists($distIndex)) {
    $html = file_get_contents($distIndex);
    
    // Tentukan base href agar asset CSS dan JS di dist/assets termuat dengan tepat
    $requestUri = $_SERVER['REQUEST_URI'] ?? '/';
    $baseHref = (strpos($requestUri, '/kkp-sarpras-analytics') !== false) 
        ? '/kkp-sarpras-analytics/dist/' 
        : '/dist/';
    
    if (strpos($html, '<base') === false) {
        $html = str_replace('<head>', "<head>\n    <base href=\"{$baseHref}\">", $html);
    }
    
    header('Content-Type: text/html; charset=utf-8');
    echo $html;
    exit;
}

echo "<h1>SARPRAS KKP</h1><p>Silakan jalankan <code>npm.cmd run build</code> terlebih dahulu.</p>";
