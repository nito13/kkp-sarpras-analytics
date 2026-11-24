<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MonitoringController extends Controller
{
    public function health(): JsonResponse
    {
        try {
            $safeCount = function (string $table): int {
                try {
                    return (int) DB::table($table)->count();
                } catch (\Throwable $e) {
                    return 0;
                }
            };

            // Verify live DB connection
            DB::connection()->getPdo();

            $conn = config('database.default');
            $dbCfg = config("database.connections.{$conn}");

            return response()->json([
                'status' => 'connected',
                'success' => true,
                'framework' => 'Laravel ' . app()->version(),
                'database' => $dbCfg['database'] ?? 'kkp_sarpras_db',
                'host' => ($dbCfg['host'] ?? '127.0.0.1') . ':' . ($dbCfg['port'] ?? '3306'),
                'serverTime' => now()->format('Y-m-d H:i:s'),
                'counts' => [
                    'assets' => $safeCount('assets'),
                    'satdik' => $safeCount('satdik'),
                    'users' => $safeCount('users'),
                    'asramaSatdik' => $safeCount('asrama_rekap'),
                    'asramaGedung' => $safeCount('asrama_gedung'),
                    'standarBidang' => $safeCount('standar_bidang'),
                    'standarItems' => $safeCount('standar_item'),
                    'tambakUnit' => $safeCount('tambak_unit'),
                    'tanahBidang' => $safeCount('tanah_bidang'),
                    'gedungBangunan' => $safeCount('gedung_bangunan'),
                    'kapalLatih' => $safeCount('kapal_latih'),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function diagnostic(): JsonResponse
    {
        $startTime = microtime(true);
        $conn = config('database.default');
        $dbCfg = config("database.connections.{$conn}");

        $report = [
            'system' => [
                'framework' => 'Laravel ' . app()->version(),
                'phpVersion' => PHP_VERSION,
                'phpSapi' => php_sapi_name(),
                'os' => PHP_OS_FAMILY,
                'serverSoftware' => $_SERVER['SERVER_SOFTWARE'] ?? 'CLI / Artisan',
                'serverTime' => now()->format('Y-m-d H:i:s T'),
                'memoryUsage' => round(memory_get_usage() / 1024 / 1024, 2) . ' MB',
                'memoryPeak' => round(memory_get_peak_usage() / 1024 / 1024, 2) . ' MB',
            ],
            'extensions' => [
                'pdo' => extension_loaded('pdo'),
                'pdo_mysql' => extension_loaded('pdo_mysql'),
                'json' => extension_loaded('json'),
                'mbstring' => extension_loaded('mbstring'),
                'openssl' => extension_loaded('openssl'),
            ],
            'directories' => [
                'app' => is_dir(app_path()),
                'config' => is_dir(config_path()),
                'database' => is_dir(database_path()),
                'public' => is_dir(public_path()),
                'resources' => is_dir(resource_path()),
                'routes' => is_dir(base_path('routes')),
                'storage' => is_dir(storage_path()),
            ],
            'database' => [
                'status' => 'untested',
                'host' => ($dbCfg['host'] ?? '127.0.0.1') . ':' . ($dbCfg['port'] ?? '3306'),
                'database' => $dbCfg['database'] ?? 'kkp_sarpras_db',
                'user' => $dbCfg['username'] ?? 'root',
                'latencyMs' => null,
                'tables' => [],
            ],
        ];

        try {
            $dbStart = microtime(true);
            DB::connection()->getPdo();
            $report['database']['latencyMs'] = round((microtime(true) - $dbStart) * 1000, 2);
            $report['database']['status'] = 'connected';

            $tables = [
                'satdik', 'users', 'assets', 'asrama_rekap', 'asrama_gedung',
                'standar_bidang', 'standar_rekap', 'standar_item',
                'tambak_rekap', 'tambak_unit', 'tanah_bidang',
                'gedung_bangunan', 'kapal_latih', 'audit_logs',
            ];
            foreach ($tables as $tbl) {
                try {
                    $report['database']['tables'][$tbl] = (int) DB::table($tbl)->count();
                } catch (\Throwable $ex) {
                    $report['database']['tables'][$tbl] = 'Error: ' . $ex->getMessage();
                }
            }
        } catch (\Throwable $e) {
            $report['database']['status'] = 'disconnected';
            $report['database']['message'] = 'MySQL offline atau belum dijalankan di Laragon (' . $e->getMessage() . ')';
            $report['database']['hint'] = 'Jalankan Apache & MySQL dari Laragon control panel.';
        }

        $report['executionTimeMs'] = round((microtime(true) - $startTime) * 1000, 2);

        return response()->json($report);
    }
}
