<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditLogController extends Controller
{
    public function __construct(private AuditLogService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $actionType = strtoupper(trim((string) $request->query('action_type', 'ALL')));
            $operation = strtoupper(trim((string) $request->query('operation', 'ALL')));
            $module = strtolower(trim((string) $request->query('module', 'ALL')));
            $satdikId = trim((string) $request->query('satdik_id', 'ALL'));
            $search = trim((string) $request->query('q', ''));
            $limit = max(10, min(2000, (int) $request->query('limit', 500)));

            $query = AuditLog::query();
            if ($actionType !== '' && $actionType !== 'ALL') {
                $query->where('action_type', $actionType);
            }
            if ($operation !== '' && $operation !== 'ALL') {
                $query->where('operation', $operation);
            }
            if ($module !== '' && $module !== 'all') {
                $query->where('module', $module);
            }
            if ($satdikId !== '' && $satdikId !== 'ALL') {
                $query->where('satdik_id', $satdikId);
            }
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('record_name', 'like', "%{$search}%")
                        ->orWhere('record_id', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%")
                        ->orWhere('actor_name', 'like', "%{$search}%")
                        ->orWhere('actor_email', 'like', "%{$search}%")
                        ->orWhere('table_name', 'like', "%{$search}%")
                        ->orWhere('satdik_name', 'like', "%{$search}%");
                });
            }

            $rows = $query->orderByDesc('created_at')->orderByDesc('id')->limit($limit)->get();
            $formatted = $rows->map(fn (AuditLog $r) => $this->service->formatRow($r))->values()->all();

            $agg = DB::table('audit_logs')->selectRaw("
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN action_type = 'INPUT' THEN 1 ELSE 0 END), 0) AS input_count,
                COALESCE(SUM(CASE WHEN action_type = 'DELETE' THEN 1 ELSE 0 END), 0) AS delete_count,
                COALESCE(SUM(CASE WHEN operation = 'CREATE' THEN 1 ELSE 0 END), 0) AS create_count,
                COALESCE(SUM(CASE WHEN operation = 'UPDATE' THEN 1 ELSE 0 END), 0) AS update_count,
                COALESCE(SUM(CASE WHEN operation = 'BULK_IMPORT' THEN 1 ELSE 0 END), 0) AS bulk_import_count,
                COALESCE(SUM(CASE WHEN operation = 'RESTORE' THEN 1 ELSE 0 END), 0) AS restore_count
            ")->first();

            return response()->json([
                'status' => 'success',
                'stats' => [
                    'total' => (int) ($agg->total ?? count($formatted)),
                    'inputCount' => (int) ($agg->input_count ?? 0),
                    'deleteCount' => (int) ($agg->delete_count ?? 0),
                    'createCount' => (int) ($agg->create_count ?? 0),
                    'updateCount' => (int) ($agg->update_count ?? 0),
                    'bulkImportCount' => (int) ($agg->bulk_import_count ?? 0),
                    'restoreCount' => (int) ($agg->restore_count ?? 0),
                ],
                'total' => count($formatted),
                'data' => $formatted,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat log audit database: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $body = $request->all();
        if (!is_array($body) || empty($body)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payload JSON tidak valid.',
            ], 400);
        }

        if (isset($body['entries']) && is_array($body['entries'])) {
            $createdIds = [];
            foreach ($body['entries'] as $entry) {
                if (is_array($entry)) {
                    $lid = $this->service->record($entry, $request);
                    if ($lid) {
                        $createdIds[] = $lid;
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => count($createdIds) . ' catatan log berhasil disimpan ke database.',
                'ids' => $createdIds,
            ], 201);
        }

        $logId = $this->service->record($body, $request);
        if (!$logId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mencatat log ke database.',
            ], 500);
        }

        $createdRow = AuditLog::find($logId);

        return response()->json([
            'status' => 'success',
            'message' => 'Log aktivitas database berhasil dicatat.',
            'data' => $createdRow ? $this->service->formatRow($createdRow) : null,
        ], 201);
    }

    public function destroy(Request $request, ?string $id = null): JsonResponse
    {
        $mode = trim((string) $request->query('mode', ''));
        $actionType = strtoupper(trim((string) $request->query('action_type', '')));

        try {
            if ($mode === 'clear') {
                if ($actionType === 'INPUT' || $actionType === 'DELETE') {
                    AuditLog::where('action_type', $actionType)->delete();
                } else {
                    AuditLog::query()->delete();
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Catatan log berhasil dibersihkan.',
                ]);
            }

            $targetId = $id ?? ($request->query('id') ?? $request->input('id'));
            if (!$targetId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Parameter ID log diperlukan untuk penghapusan.',
                ], 400);
            }

            AuditLog::where('id', $targetId)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Catatan log berhasil dihapus.',
                'deletedId' => $targetId,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus catatan log: ' . $e->getMessage(),
            ], 500);
        }
    }
}
