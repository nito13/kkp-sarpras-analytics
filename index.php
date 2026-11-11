<?php
// Entry point Laragon / Apache untuk Sarana dan Prasarana Satuan Pendidikan KP
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
if (file_exists(__DIR__ . '/index.html')) {
    include_once __DIR__ . '/index.html';
} elseif (file_exists(__DIR__ . '/Frontend/index.html')) {
    include_once __DIR__ . '/Frontend/index.html';
}
