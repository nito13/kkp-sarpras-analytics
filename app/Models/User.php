<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'nip',
        'email',
        'password',
        'role',
        'role_label',
        'jabatan',
        'unit_kerja',
        'accessible_satdik',
        'satdik_name',
        'permissions_json',
        'avatar_url',
        'created_at',
    ];

    protected $hidden = [
        'password',
    ];

    public function toFrontendArray(): array
    {
        $permissions = [];
        if (!empty($this->permissions_json)) {
            $decoded = is_string($this->permissions_json)
                ? json_decode($this->permissions_json, true)
                : $this->permissions_json;
            $permissions = is_array($decoded) ? $decoded : [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'nip' => $this->nip ?? '',
            'email' => $this->email,
            'role' => $this->role,
            'roleLabel' => $this->role_label ?? '',
            'jabatan' => $this->jabatan ?? '',
            'unitKerja' => $this->unit_kerja ?? '',
            'accessibleSatdik' => $this->accessible_satdik ?? 'ALL',
            'satdikName' => $this->satdik_name ?? '',
            'permissions' => $permissions,
            'avatarUrl' => $this->avatar_url ?? '',
            'createdAt' => $this->created_at ? (string) $this->created_at : null,
        ];
    }
}
