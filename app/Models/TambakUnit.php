<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TambakUnit extends Model
{
    protected $table = 'tambak_unit';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'satdik_id',
        'no_urut',
        'nama',
        'jenis',
        'kampus_lokasi',
        'luas_m2',
        'luas_label',
        'kondisi',
        'fungsi',
        'status_operasional',
        'pelataran',
        'pelataran_kategori',
        'listrik',
        'kincir',
        'jumlah_kincir',
        'lokasi_label',
        'map_url',
        'keterangan',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
