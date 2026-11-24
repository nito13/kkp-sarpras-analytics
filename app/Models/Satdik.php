<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Satdik extends Model
{
    protected $table = 'satdik';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'short_name',
        'jenjang',
        'type',
        'provinsi',
        'kota',
        'region',
        'lat',
        'lng',
        'map_x',
        'map_y',
        'taruna_count',
        'dosen_count',
        'luas_lahan_ha',
        'luas_bangunan_m2',
        'akreditasi',
        'established_year',
        'kampus_cabang_json',
        'rector',
        'prodi_json',
        'created_at',
    ];

    public function asramaRekap(): HasOne
    {
        return $this->hasOne(AsramaRekap::class, 'satdik_id', 'id');
    }

    public function asramaGedung(): HasMany
    {
        return $this->hasMany(AsramaGedung::class, 'satdik_id', 'id');
    }

    public function gedungBangunan(): HasMany
    {
        return $this->hasMany(GedungBangunan::class, 'satdik_id', 'id');
    }

    public function kapalLatih(): HasMany
    {
        return $this->hasMany(KapalLatih::class, 'satdik_id', 'id');
    }

    public function tanahBidang(): HasMany
    {
        return $this->hasMany(TanahBidang::class, 'satdik_id', 'id');
    }

    public function tambakRekap(): HasOne
    {
        return $this->hasOne(TambakRekap::class, 'satdik_id', 'id');
    }

    public function tambakUnit(): HasMany
    {
        return $this->hasMany(TambakUnit::class, 'satdik_id', 'id');
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'shortName' => $this->short_name ?? '',
            'jenjang' => $this->jenjang ?? '',
            'type' => $this->type ?? '',
            'provinsi' => $this->provinsi ?? '',
            'kota' => $this->kota ?? '',
            'region' => $this->region ?? '',
            'lat' => (float) $this->lat,
            'lng' => (float) $this->lng,
            'mapX' => (int) ($this->map_x ?? 0),
            'mapY' => (int) ($this->map_y ?? 0),
            'tarunaCount' => (int) $this->taruna_count,
            'dosenCount' => (int) $this->dosen_count,
            'luasLahanHa' => (float) $this->luas_lahan_ha,
            'luasBangunanM2' => (float) $this->luas_bangunan_m2,
            'akreditasi' => $this->akreditasi ?? '',
            'establishedYear' => (int) $this->established_year,
            'kampusCabang' => !empty($this->kampus_cabang_json) ? (json_decode($this->kampus_cabang_json, true) ?: []) : [],
            'rector' => $this->rector ?? '',
            'prodi' => !empty($this->prodi_json) ? (json_decode($this->prodi_json, true) ?: []) : [],
        ];
    }
}
