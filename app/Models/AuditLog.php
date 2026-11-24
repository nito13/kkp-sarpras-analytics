<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'action_type',
        'operation',
        'module',
        'table_name',
        'record_id',
        'record_name',
        'satdik_id',
        'satdik_name',
        'actor_id',
        'actor_name',
        'actor_email',
        'actor_role',
        'summary',
        'payload_json',
        'ip_address',
        'created_at',
    ];
}
