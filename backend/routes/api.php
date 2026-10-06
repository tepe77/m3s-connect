<?php

use App\Http\Controllers\Api\V1\AlumniController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ForumController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // Public & Member Profile Routes
    Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::patch('/', [ProfileController::class, 'update']);
    });

    // Alumni Directory Routes
    Route::prefix('alumni')->group(function () {
        Route::get('/', [AlumniController::class, 'index']);
        Route::get('/{id}', [AlumniController::class, 'show']);
    });

    // Public News & Comments Routes (WordPress-style)
    Route::prefix('news')->group(function () {
        Route::get('/', [NewsController::class, 'index']);
        Route::get('/{slug}', [NewsController::class, 'show']);
        Route::post('/{slug}/comments', [NewsController::class, 'storeComment']);
    });

    // Community Forum Routes (Discourse-style)
    Route::prefix('forum')->group(function () {
        Route::get('/categories', [ForumController::class, 'categories']);
        Route::get('/threads', [ForumController::class, 'index']);
        Route::get('/threads/{slug}', [ForumController::class, 'show']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/threads', [ForumController::class, 'storeThread']);
            Route::post('/threads/{id}/posts', [ForumController::class, 'storePost']);
            Route::post('/threads/{id}/like', [ForumController::class, 'toggleThreadLike']);
        });
    });
});
