<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StandarItem extends Model
{
    protected $table = 'standar_item';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'bidang_id',
        'sec',
        'sub_sec',
        'grp_code',
        'grp_name',
        'sub_grp',
        'item_no',
        'nama',
        'std_vol',
        'satuan',
        'realisasi_json',
        'kondisi',
        'keterangan',
        'sort_order',
    ];

    public function bidang(): BelongsTo
    {
        return $this->belongsTo(StandarBidang::class, 'bidang_id', 'id');
    }
}
