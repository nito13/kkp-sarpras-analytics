<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GedungBangunan extends Model
{
    protected $table = 'gedung_bangunan';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'satdik_id',
        'kampus',
        'jenis_gedung',
        'jumlah',
        'nama_gedung',
        'jumlah_lantai',
        'luas_m2',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
