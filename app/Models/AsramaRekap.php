<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AsramaRekap extends Model
{
    protected $table = 'asrama_rekap';

    protected $primaryKey = 'satdik_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'satdik_id',
        'nama_excel',
        'jumlah_asrama',
        'jumlah_kamar',
        'luas_m2',
        'kapasitas',
        'kapasitas_aktif',
        'luas_adjustment',
        'kapasitas_adjustment',
        'jumlah_tidak_dipakai',
        'jumlah_perlu_renovasi',
        'keterangan',
        'drive_url',
        'sumber',
        'tanggal_data',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
