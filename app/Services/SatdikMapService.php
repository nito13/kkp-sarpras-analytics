<?php

namespace App\Services;

use App\Models\Satdik;

class SatdikMapService
{
    public function getInfoMap(): array
    {
        $map = [];
        try {
            $rows = Satdik::query()->select(['id', 'name', 'short_name', 'type'])->get();
            foreach ($rows as $r) {
                $map[$r->id] = [
                    'name' => $r->name,
                    'short_name' => $r->short_name,
                    'type' => $r->type,
                ];
            }
        } catch (\Throwable $e) {
            // Fallback empty map
        }

        return $map;
    }

    public function getNameMap(): array
    {
        $map = [];
        try {
            $rows = Satdik::query()->select(['id', 'name', 'short_name'])->get();
            foreach ($rows as $r) {
                $map[$r->id] = $r->name ?: $r->short_name;
            }
        } catch (\Throwable $e) {
            // Fallback empty map
        }

        return $map;
    }
}
