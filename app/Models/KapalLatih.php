<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KapalLatih extends Model
{
    protected $table = 'kapal_latih';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'satdik_id',
        'nama_kapal',
        'tahun_perolehan',
        'tonage_gt',
        'panjang_kapal',
        'jenis_kapal',
        'kapasitas_bbm',
        'jumlah_abk',
        'alat_tangkap',
        'id_transmitter',
        'status_bmn',
        'keterangan',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
