<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StandarBidang extends Model
{
    protected $table = 'standar_bidang';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'code',
        'sheet_name',
        'nama',
        'category_id',
        'prodi_json',
        'satdik_ids_json',
        'prasarana_count',
        'sarana_count',
        'total_items',
        'group_notes_json',
        'sumber',
        'tanggal_data',
        'sort_order',
    ];

    public function rekap(): HasMany
    {
        return $this->hasMany(StandarRekap::class, 'bidang_id', 'id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(StandarItem::class, 'bidang_id', 'id');
    }
}
