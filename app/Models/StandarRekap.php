<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StandarRekap extends Model
{
    protected $table = 'standar_rekap';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'bidang_id',
        'satdik_id',
        'prasarana_total',
        'prasarana_terpenuhi',
        'prasarana_sebagian',
        'prasarana_kosong',
        'sarana_total',
        'sarana_terpenuhi',
        'sarana_sebagian',
        'sarana_kosong',
        'total_items',
        'total_terpenuhi',
        'total_sebagian',
        'total_kosong',
        'persen_prasarana',
        'persen_sarana',
        'persen_total',
        'std_vol_sum',
        'real_vol_sum',
    ];

    public function bidang(): BelongsTo
    {
        return $this->belongsTo(StandarBidang::class, 'bidang_id', 'id');
    }

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
