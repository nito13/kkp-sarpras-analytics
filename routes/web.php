<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SIM-SARPRAS KKP SPA Shell
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()
        ->view('app')
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
})->name('home');

// Fallback untuk SPA client-side routing (kecuali path API/Monitoring/aset)
Route::fallback(function () {
    return response()
        ->view('app')
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
});
