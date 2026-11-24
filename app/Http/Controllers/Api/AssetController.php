<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class AssetController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Modul inventaris katalog telah dinonaktifkan.',
            'total' => 0,
            'data' => [],
        ]);
    }

    public function gone(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Modul inventaris sarpras telah dinonaktifkan.',
        ], 410);
    }
}
