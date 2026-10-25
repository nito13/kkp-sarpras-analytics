<?php
// Entry point Laragon / Apache untuk SIM-SARPRAS KKP
if (file_exists(__DIR__ . '/index.html')) {
    include_once __DIR__ . '/index.html';
} elseif (file_exists(__DIR__ . '/Frontend/index.html')) {
    include_once __DIR__ . '/Frontend/index.html';
}
