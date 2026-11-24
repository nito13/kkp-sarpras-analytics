<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asset extends Model
{
    protected $table = 'assets';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'satdik_id',
        'satdik_name',
        'prodi',
        'category',
        'condition',
        'condition_score',
        'acquisition_year',
        'utilization_rate',
        'capacity_desc',
        'specs',
        'cert_expiry_date',
        'last_maintenance_date',
        'next_maintenance_date',
        'maintenance_urgency',
        'issues_summary',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
