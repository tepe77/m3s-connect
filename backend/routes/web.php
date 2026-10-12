<?php

use Illuminate\Support\Facades\Route;

/**
 * Root Route Protection:
 * - If client requests JSON (API client/tools), return clean, non-leaking service status.
 * - If client is a standard web browser, redirect away to the public portal frontend (alumni.mayoga.sch.id).
 * - Admin panel remains accessible under /admin.
 */
Route::get('/', function () {
    if (request()->wantsJson()) {
        return response()->json([
            'status' => 'online',
            'service' => 'M3S Connect API Service',
            'version' => 'v1',
        ]);
    }

    return redirect()->away(config('app.frontend_url', 'https://alumni.mayoga.sch.id'));
});

/**
 * Fallback Web Routes:
 * Prevent scanning, framework fingerprinting, or route enumeration.
 * Unmatched web requests redirect to the official frontend portal or return 404 JSON for API calls.
 */
Route::fallback(function () {
    if (request()->wantsJson() || request()->is('api/*')) {
        return response()->json([
            'status' => 'error',
            'message' => 'Resource not found.',
        ], 404);
    }

    return redirect()->away(config('app.frontend_url', 'https://alumni.mayoga.sch.id'));
});

