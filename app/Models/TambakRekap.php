<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TambakRekap extends Model
{
    protected $table = 'tambak_rekap';

    protected $primaryKey = 'satdik_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'satdik_id',
        'nama_satdik',
        'kode_satdik',
        'jenjang',
        'jumlah_unit',
        'jumlah_tambak',
        'jumlah_kolam',
        'jumlah_tandon',
        'luas_total_m2',
        'luas_tambak_m2',
        'luas_kolam_m2',
        'kondisi_baik',
        'kondisi_rusak_ringan',
        'kondisi_rusak_berat',
        'unit_aktif',
        'unit_belum_dimanfaatkan',
        'total_kincir',
        'daya_listrik',
        'lokasi_utama',
        'map_url',
        'keterangan',
    ];

    public function satdik(): BelongsTo
    {
        return $this->belongsTo(Satdik::class, 'satdik_id', 'id');
    }
}
