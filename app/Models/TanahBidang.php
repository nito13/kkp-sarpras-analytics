<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TanahBidang extends Model
{
    protected $table = 'tanah_bidang';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'satdik_id',
        'nama_bidang',
        'kode_bmn',
        'nup',
        'luas_m2',
        'luas_ha',
        'status_sertifikat',
        'no_sertifikat',
        'tanggal_sertifikat',
        'atas_nama',
        'peruntukan',
        'status_pemanfaatan',
        'alamat',
        'kota',
        'provinsi',
        'tahun_perolehan',
        'asal_perolehan',
        'keterangan',
        'foto_satelit',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
