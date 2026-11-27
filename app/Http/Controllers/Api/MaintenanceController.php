<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuditLogService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MaintenanceController extends Controller
{
    public const SETTING_KEY = 'maintenance_mode';

    public function __construct(private AuditLogService $auditLog)
    {
    }

    public static function defaultState(): array
    {
        return [
            'enabled' => false,
            'mode' => 'banner', // 'banner' | 'full'
            'title' => 'Pemberitahuan Pemeliharaan Sistem (Maintenance)',
            'message' => 'Sistem Informasi Sarana dan Prasarana Satuan Pendidikan KP sedang dalam pemeliharaan berkala untuk peningkatan performa dan sinkronisasi layanan.',
            'estimatedEnd' => '',
            'updatedBy' => '',
            'updatedAt' => null,
        ];
    }

    public static function ensureTableExists(): void
    {
        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->string('setting_key', 100)->primary();
                $table->text('setting_value')->nullable();
                $table->string('updated_by', 150)->nullable();
                $table->dateTime('updated_at')->nullable();
            });
        }
    }

    public static function getMaintenanceState(): array
    {
        $defaults = self::defaultState();

        try {
            if (!Schema::hasTable('system_settings')) {
                return $defaults;
            }

            $row = DB::table('system_settings')
                ->where('setting_key', self::SETTING_KEY)
                ->first();

            if (!$row || empty($row->setting_value)) {
                return $defaults;
            }

            $decoded = json_decode((string) $row->setting_value, true);
            if (!is_array($decoded)) {
                return $defaults;
            }

            $mode = in_array($decoded['mode'] ?? 'banner', ['banner', 'full'], true)
                ? $decoded['mode']
                : 'banner';

            return [
                'enabled' => (bool) ($decoded['enabled'] ?? false),
                'mode' => $mode,
                'title' => trim((string) ($decoded['title'] ?? '')) ?: $defaults['title'],
                'message' => trim((string) ($decoded['message'] ?? '')) ?: $defaults['message'],
                'estimatedEnd' => trim((string) ($decoded['estimatedEnd'] ?? '')),
                'updatedBy' => trim((string) ($decoded['updatedBy'] ?? ($row->updated_by ?? ''))),
                'updatedAt' => $row->updated_at ? (string) $row->updated_at : ($decoded['updatedAt'] ?? null),
            ];
        } catch (\Throwable $e) {
            return $defaults;
        }
    }

    private function verifyCentralAdmin(Request $request, array $body = []): ?JsonResponse
    {
        $actor = is_array($body['_actor'] ?? null) ? $body['_actor'] : [];
        $actorRole = strtolower(trim((string) ($actor['role'] ?? $request->header('X-Actor-Role', ''))));
        $actorId = strtoupper(trim((string) ($actor['id'] ?? $request->header('X-Actor-Id', ''))));

        $allowed = in_array($actorRole, ['administrator', 'super_admin', 'admin_pusdik'], true)
            || in_array($actorId, ['USR-ADMIN', 'USR-001'], true);

        if (!$allowed) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => 'Akses ditolak. Hanya Admin Pusat / Super Administrator yang dapat mengubah mode pemeliharaan.',
            ], 403);
        }

        return null;
    }

    public function show(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'success' => true,
            'data' => self::getMaintenanceState(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $input = $request->all();
        if ($denied = $this->verifyCentralAdmin($request, $input)) {
            return $denied;
        }

        try {
            self::ensureTableExists();

            $previous = self::getMaintenanceState();
            $defaults = self::defaultState();
            $actorInfo = $this->auditLog->extractActor($request, $input);

            $enabled = filter_var($input['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $mode = in_array($input['mode'] ?? $previous['mode'], ['banner', 'full'], true)
                ? (string) $input['mode']
                : 'banner';
            $title = trim((string) ($input['title'] ?? $previous['title'])) ?: $defaults['title'];
            $message = trim((string) ($input['message'] ?? $previous['message'])) ?: $defaults['message'];
            $estimatedEnd = trim((string) ($input['estimatedEnd'] ?? ''));
            $nowStr = now()->format('Y-m-d H:i:s');

            $newState = [
                'enabled' => $enabled,
                'mode' => $mode,
                'title' => $title,
                'message' => $message,
                'estimatedEnd' => $estimatedEnd,
                'updatedBy' => $actorInfo['name'],
                'updatedAt' => $nowStr,
            ];

            DB::table('system_settings')->updateOrInsert(
                ['setting_key' => self::SETTING_KEY],
                [
                    'setting_value' => json_encode($newState, JSON_UNESCAPED_UNICODE),
                    'updated_by' => $actorInfo['name'],
                    'updated_at' => $nowStr,
                ]
            );

            $modeLabel = $mode === 'full' ? 'Halaman Penuh (Kunci Non-Admin)' : 'Banner Pengumuman Atas';
            $statusLabel = $enabled ? "AKTIF ({$modeLabel})" : 'NONAKTIF (Sistem Normal)';

            $this->auditLog->record([
                'actionType' => 'INPUT',
                'operation' => 'UPDATE',
                'module' => 'sistem',
                'tableName' => 'system_settings',
                'recordId' => self::SETTING_KEY,
                'recordName' => 'Mode Pemeliharaan Sistem (Maintenance)',
                'satdikId' => 'ALL',
                'satdikName' => 'Seluruh Satdik (Nasional)',
                'actorId' => $actorInfo['id'],
                'actorName' => $actorInfo['name'],
                'actorEmail' => $actorInfo['email'],
                'actorRole' => $actorInfo['role'],
                'summary' => ($enabled ? 'Mengaktifkan' : 'Mematikan') . " notifikasi pemeliharaan sistem menjadi {$statusLabel}.",
                'payload' => [
                    '_before' => $previous,
                    '_after' => $newState,
                ],
            ], $request);

            return response()->json([
                'status' => 'success',
                'success' => true,
                'message' => $enabled
                    ? 'Mode Pemeliharaan Sistem berhasil DIAKTIFKAN.'
                    : 'Mode Pemeliharaan Sistem berhasil DIMATIKAN (Sistem kembali normal).',
                'data' => $newState,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => 'Gagal menyimpan pengaturan pemeliharaan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
