<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AsramaGedung extends Model
{
    protected $table = 'asrama_gedung';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'satdik_id',
        'kampus',
        'nama',
        'peruntukan',
        'jumlah_kamar',
        'luas_m2',
        'kapasitas',
        'status',
        'keterangan',
        'rincian_json',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
