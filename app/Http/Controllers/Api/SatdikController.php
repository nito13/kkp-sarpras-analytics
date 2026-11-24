<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Satdik;
use Illuminate\Http\JsonResponse;

class SatdikController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = Satdik::query()->orderBy('id', 'asc')->get();
        $formatted = $rows->map(fn (Satdik $s) => $s->toFrontendArray())->values()->all();

        return response()->json([
            'status' => 'success',
            'total' => count($formatted),
            'data' => $formatted,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $satdik = Satdik::find($id);
        if (!$satdik) {
            return response()->json([
                'status' => 'error',
                'message' => 'Satuan Pendidikan tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $satdik->toFrontendArray(),
        ]);
    }
}
