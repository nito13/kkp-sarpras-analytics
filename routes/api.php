<?php

use App\Http\Controllers\Api\AsramaController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BulkImportController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\GedungController;
use App\Http\Controllers\Api\KapalController;
use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\Api\SatdikController;
use App\Http\Controllers\Api\StandarSarprasController;
use App\Http\Controllers\Api\TambakKolamController;
use App\Http\Controllers\Api\TanahController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| REST API Routes — SIM-SARPRAS KKP (Laravel 10)
|--------------------------------------------------------------------------
*/

// Monitoring & Telemetri
Route::get('/health', [MonitoringController::class, 'health']);
Route::get('/diagnostic', [MonitoringController::class, 'diagnostic']);

// Otentikasi & Manajemen Pengguna (RBAC)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'index']);
Route::get('/users/{id}', [AuthController::class, 'show']);
Route::post('/users', [AuthController::class, 'store']);
Route::put('/users/{id?}', [AuthController::class, 'update']);
Route::delete('/users/{id?}', [AuthController::class, 'destroy']);

// Master 18 Satuan Pendidikan KKP
Route::get('/satdik', [SatdikController::class, 'index']);
Route::get('/satdik/{id}', [SatdikController::class, 'show']);

// Katalog Aset (Deprecated — Backward Compatibility)
Route::get('/assets', [AssetController::class, 'index']);
Route::match(['post', 'put', 'patch', 'delete'], '/assets', [AssetController::class, 'gone']);

// Ketersediaan Ruang Asrama Taruna
Route::get('/asrama', [AsramaController::class, 'index']);
Route::get('/asrama/{id}', [AsramaController::class, 'show']);
Route::post('/asrama', [AsramaController::class, 'store']);
Route::put('/asrama/{id?}', [AsramaController::class, 'update']);
Route::delete('/asrama/{id?}', [AsramaController::class, 'destroy']);

// Gedung & Bangunan
Route::get('/gedung', [GedungController::class, 'index']);
Route::post('/gedung', [GedungController::class, 'store']);
Route::put('/gedung/{id?}', [GedungController::class, 'update']);
Route::delete('/gedung/{id?}', [GedungController::class, 'destroy']);

// Kapal Latih
Route::get('/kapal', [KapalController::class, 'index']);
Route::post('/kapal', [KapalController::class, 'store']);
Route::put('/kapal/{id?}', [KapalController::class, 'update']);
Route::delete('/kapal/{id?}', [KapalController::class, 'destroy']);

// Bidang Tanah & Lahan BMN
Route::get('/tanah', [TanahController::class, 'index']);
Route::post('/tanah', [TanahController::class, 'store']);
Route::put('/tanah/{id?}', [TanahController::class, 'update']);
Route::delete('/tanah/{id?}', [TanahController::class, 'destroy']);

// Prasarana & Sarana Tambak & Kolam
Route::get('/tambak-kolam', [TambakKolamController::class, 'index']);
Route::post('/tambak-kolam', [TambakKolamController::class, 'store']);
Route::put('/tambak-kolam/{id?}', [TambakKolamController::class, 'update']);
Route::delete('/tambak-kolam/{id?}', [TambakKolamController::class, 'destroy']);

// Standar Minimal Sarpras Prodi
Route::get('/standar-sarpras', [StandarSarprasController::class, 'index']);
Route::get('/standar-sarpras/{id}', [StandarSarprasController::class, 'show']);
Route::post('/standar-sarpras', [StandarSarprasController::class, 'store']);
Route::put('/standar-sarpras/{id?}', [StandarSarprasController::class, 'update']);
Route::delete('/standar-sarpras/{id?}', [StandarSarprasController::class, 'destroy']);

// Audit Log Database
Route::get('/audit-logs', [AuditLogController::class, 'index']);
Route::post('/audit-logs', [AuditLogController::class, 'store']);
Route::delete('/audit-logs/{id?}', [AuditLogController::class, 'destroy']);

// Batch Import Excel (ACID Transaction)
Route::get('/bulk-import', [BulkImportController::class, 'status']);
Route::post('/bulk-import', [BulkImportController::class, 'import']);

// Gateway Dokumen Resmi (Terproteksi Otentikasi)
Route::get('/doc', [DocumentController::class, 'redirect']);

// Alias .php pada prefix /api/* untuk kompatibilitas penuh SPA Frontend
Route::get('/health.php', [MonitoringController::class, 'health']);
Route::get('/diagnostic.php', [MonitoringController::class, 'diagnostic']);

Route::get('/auth.php', [AuthController::class, 'index']);
Route::post('/auth.php', [AuthController::class, 'handlePost']);
Route::put('/auth.php', [AuthController::class, 'update']);
Route::delete('/auth.php', [AuthController::class, 'destroy']);

Route::get('/satdik.php', [SatdikController::class, 'index']);
Route::get('/assets.php', [AssetController::class, 'index']);
Route::match(['post', 'put', 'patch', 'delete'], '/assets.php', [AssetController::class, 'gone']);

Route::get('/asrama.php', [AsramaController::class, 'index']);
Route::post('/asrama.php', [AsramaController::class, 'store']);
Route::put('/asrama.php', [AsramaController::class, 'update']);
Route::delete('/asrama.php', [AsramaController::class, 'destroy']);

Route::get('/gedung.php', [GedungController::class, 'index']);
Route::post('/gedung.php', [GedungController::class, 'store']);
Route::put('/gedung.php', [GedungController::class, 'update']);
Route::delete('/gedung.php', [GedungController::class, 'destroy']);

Route::get('/kapal.php', [KapalController::class, 'index']);
Route::post('/kapal.php', [KapalController::class, 'store']);
Route::put('/kapal.php', [KapalController::class, 'update']);
Route::delete('/kapal.php', [KapalController::class, 'destroy']);

Route::get('/tanah.php', [TanahController::class, 'index']);
Route::post('/tanah.php', [TanahController::class, 'store']);
Route::put('/tanah.php', [TanahController::class, 'update']);
Route::delete('/tanah.php', [TanahController::class, 'destroy']);

Route::get('/tambak_kolam.php', [TambakKolamController::class, 'index']);
Route::post('/tambak_kolam.php', [TambakKolamController::class, 'store']);
Route::put('/tambak_kolam.php', [TambakKolamController::class, 'update']);
Route::delete('/tambak_kolam.php', [TambakKolamController::class, 'destroy']);

Route::get('/standar_sarpras.php', [StandarSarprasController::class, 'index']);
Route::post('/standar_sarpras.php', [StandarSarprasController::class, 'store']);
Route::put('/standar_sarpras.php', [StandarSarprasController::class, 'update']);
Route::delete('/standar_sarpras.php', [StandarSarprasController::class, 'destroy']);

Route::get('/audit_logs.php', [AuditLogController::class, 'index']);
Route::post('/audit_logs.php', [AuditLogController::class, 'store']);
Route::delete('/audit_logs.php', [AuditLogController::class, 'destroy']);

Route::get('/bulk_import.php', [BulkImportController::class, 'status']);
Route::post('/bulk_import.php', [BulkImportController::class, 'import']);

Route::get('/doc.php', [DocumentController::class, 'redirect']);
