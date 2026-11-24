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
| Legacy Compatibility Routes (APIs/*.php, Monitoring/*.php)
|--------------------------------------------------------------------------
| Menjamin 100% kompatibilitas dengan SPA React existing (core-bundle.min.js)
| yang mengakses endpoint pada path /APIs/*.php dan /Monitoring/*.php.
*/

// Monitoring
Route::get('/Monitoring/health.php', [MonitoringController::class, 'health']);
Route::get('/Monitoring/diagnostic.php', [MonitoringController::class, 'diagnostic']);

foreach (['APIs', 'backend/api', 'Frontend/APIs'] as $prefix) {
    Route::prefix($prefix)->group(function () {
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
    });
}
