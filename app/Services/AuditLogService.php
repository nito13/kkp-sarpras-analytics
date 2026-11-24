<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Satdik;
use Illuminate\Http\Request;

class AuditLogService
{
    public function extractActor(?Request $request = null, ?array $body = null): array
    {
        $actor = [];
        if (is_array($body) && isset($body['_actor']) && is_array($body['_actor'])) {
            $actor = $body['_actor'];
        }

        $id = $actor['id'] ?? ($request?->header('X-Actor-Id') ?? ($request?->query('actor_id') ?? 'USR-ADMIN'));
        $name = $actor['name'] ?? ($request?->header('X-Actor-Name') ?? ($request?->query('actor_name') ?? 'Administrator / Operator Sistem'));
        $email = $actor['email'] ?? ($request?->header('X-Actor-Email') ?? ($request?->query('actor_email') ?? 'administrator@kkp.go.id'));
        $role = $actor['roleLabel'] ?? ($actor['role'] ?? ($request?->header('X-Actor-Role') ?? ($request?->query('actor_role') ?? 'Administrator Utama')));

        return [
            'id' => trim((string) $id) ?: 'USR-ADMIN',
            'name' => trim((string) $name) ?: 'Administrator / Operator Sistem',
            'email' => trim((string) $email) ?: 'administrator@kkp.go.id',
            'role' => trim((string) $role) ?: 'Administrator Utama',
        ];
    }

    public function formatRow(AuditLog $row): array
    {
        $payload = null;
        if (!empty($row->payload_json)) {
            $decoded = json_decode($row->payload_json, true);
            $payload = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $row->payload_json;
        }

        return [
            'id' => $row->id,
            'actionType' => $row->action_type ?? 'INPUT',
            'operation' => $row->operation ?? 'CREATE',
            'module' => $row->module ?? 'umum',
            'tableName' => $row->table_name ?? '-',
            'recordId' => $row->record_id ?? '-',
            'recordName' => $row->record_name ?? '-',
            'satdikId' => $row->satdik_id ?? 'ALL',
            'satdikName' => $row->satdik_name ?? '-',
            'actorId' => $row->actor_id ?? 'USR-ADMIN',
            'actorName' => $row->actor_name ?? 'Administrator Sistem',
            'actorEmail' => $row->actor_email ?? 'administrator@kkp.go.id',
            'actorRole' => $row->actor_role ?? 'Administrator Utama',
            'summary' => $row->summary ?? '',
            'payload' => $payload,
            'ipAddress' => $row->ip_address ?? '127.0.0.1',
            'createdAt' => $row->created_at ? (string) $row->created_at : date('Y-m-d H:i:s'),
        ];
    }

    public function record(array $entry, ?Request $request = null): ?string
    {
        try {
            $actionType = strtoupper(trim((string) ($entry['actionType'] ?? ($entry['action_type'] ?? 'INPUT'))));
            if (!in_array($actionType, ['INPUT', 'DELETE'], true)) {
                $actionType = ($actionType === 'HAPUS' || $actionType === 'REMOVE') ? 'DELETE' : 'INPUT';
            }

            $operation = strtoupper(trim((string) ($entry['operation'] ?? ($actionType === 'DELETE' ? 'DELETE' : 'CREATE'))));
            $module = strtolower(trim((string) ($entry['module'] ?? 'umum')));
            $tableName = trim((string) ($entry['tableName'] ?? ($entry['table_name'] ?? '-')));
            $recordId = trim((string) ($entry['recordId'] ?? ($entry['record_id'] ?? '-')));
            $recordName = trim((string) ($entry['recordName'] ?? ($entry['record_name'] ?? $recordId)));
            $satdikId = trim((string) ($entry['satdikId'] ?? ($entry['satdik_id'] ?? 'ALL'))) ?: 'ALL';
            $satdikName = trim((string) ($entry['satdikName'] ?? ($entry['satdik_name'] ?? '')));

            if ($satdikName === '' && $satdikId !== '' && $satdikId !== 'ALL') {
                $satdik = Satdik::query()->select(['name', 'short_name'])->find($satdikId);
                if ($satdik) {
                    $satdikName = $satdik->name ?: ($satdik->short_name ?: $satdikId);
                }
            }
            if ($satdikName === '') {
                $satdikName = $satdikId === 'ALL' ? 'Seluruh Satdik (Nasional)' : $satdikId;
            }

            $requestBody = is_array($entry['requestBody'] ?? null) ? $entry['requestBody'] : null;
            $actor = $entry['actor'] ?? $this->extractActor($request, $requestBody);
            $actorId = trim((string) ($entry['actorId'] ?? ($actor['id'] ?? 'USR-ADMIN')));
            $actorName = trim((string) ($entry['actorName'] ?? ($actor['name'] ?? 'Administrator Sistem')));
            $actorEmail = trim((string) ($entry['actorEmail'] ?? ($actor['email'] ?? 'administrator@kkp.go.id')));
            $actorRole = trim((string) ($entry['actorRole'] ?? ($actor['role'] ?? 'Administrator Utama')));

            $summary = trim((string) ($entry['summary'] ?? ''));
            $payload = $entry['payload'] ?? ($entry['data'] ?? null);
            $payloadJson = is_string($payload) ? $payload : ($payload !== null ? json_encode($payload, JSON_UNESCAPED_UNICODE) : null);

            $ipAddress = $request?->ip() ?? '127.0.0.1';
            $logId = !empty($entry['id'])
                ? trim((string) $entry['id'])
                : ('LOG-' . strtoupper(substr($actionType, 0, 3)) . '-' . date('YmdHis') . '-' . random_int(1000, 9999));

            $existing = AuditLog::find($logId);
            if ($existing) {
                $existing->update([
                    'summary' => $summary,
                    'payload_json' => $payloadJson ?? $existing->payload_json,
                    'actor_id' => mb_substr($actorId, 0, 64),
                    'actor_name' => mb_substr($actorName, 0, 250),
                    'actor_email' => mb_substr($actorEmail, 0, 150),
                    'actor_role' => mb_substr($actorRole, 0, 100),
                ]);
            } else {
                AuditLog::create([
                    'id' => $logId,
                    'action_type' => $actionType,
                    'operation' => $operation,
                    'module' => $module,
                    'table_name' => $tableName,
                    'record_id' => mb_substr($recordId, 0, 100),
                    'record_name' => mb_substr($recordName, 0, 250),
                    'satdik_id' => mb_substr($satdikId, 0, 64),
                    'satdik_name' => mb_substr($satdikName, 0, 250),
                    'actor_id' => mb_substr($actorId, 0, 64),
                    'actor_name' => mb_substr($actorName, 0, 250),
                    'actor_email' => mb_substr($actorEmail, 0, 150),
                    'actor_role' => mb_substr($actorRole, 0, 100),
                    'summary' => $summary,
                    'payload_json' => $payloadJson,
                    'ip_address' => mb_substr((string) $ipAddress, 0, 64),
                    'created_at' => now(),
                ]);
            }

            return $logId;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
