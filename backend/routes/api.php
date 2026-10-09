<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AlumniController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\DirectMessageController;
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

    // Member Profile Routes
    Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::patch('/', [ProfileController::class, 'update']);
        Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
    });

    // In-App Direct Message Routes (Private Peer-to-Peer)
    Route::middleware('auth:sanctum')->prefix('messages')->group(function () {
        Route::get('/threads', [DirectMessageController::class, 'threads']);
        Route::get('/threads/{id}', [DirectMessageController::class, 'showThread']);
        Route::post('/', [DirectMessageController::class, 'sendMessage']);
        Route::post('/threads/{id}/reply', [DirectMessageController::class, 'replyThread']);
        Route::post('/threads/{id}/read', [DirectMessageController::class, 'markAsRead']);
        Route::get('/unread-count', [DirectMessageController::class, 'unreadCount']);
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

    // Public Events & Agenda Routes
    Route::prefix('events')->group(function () {
        Route::get('/', function () {
            $events = \App\Models\Event::with('category')
                ->where('status', \App\Enums\EventStatus::PUBLISHED)
                ->orderBy('start_at', 'asc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $events,
            ]);
        });
    });

    // Public Documentation & Gallery Routes
    Route::prefix('documentations')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\V1\DocumentationController::class, 'index']);
        Route::get('/{slug}', [\App\Http\Controllers\Api\V1\DocumentationController::class, 'show']);
    });

    // Public Alumni Testimonials Routes (Marquee Showcase & Submission)
    Route::prefix('testimonials')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\V1\TestimonialController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\V1\TestimonialController::class, 'store']);
    });

    // Public Contact Message Submission (Rate-limited to 5 per minute per IP)
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

    // Content Report Submission (Authenticated members)
    Route::middleware('auth:sanctum')->post('/reports', [AdminController::class, 'submitReport']);

    // Admin & Moderator Operations Panel
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);

        // Forum Category Management
        Route::get('/forum/categories', [AdminController::class, 'listCategories']);
        Route::post('/forum/categories', [AdminController::class, 'storeCategory']);
        Route::put('/forum/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/forum/categories/{id}', [AdminController::class, 'destroyCategory']);

        // Moderation & Spam Reports
        Route::get('/reports', [AdminController::class, 'listReports']);
        Route::patch('/reports/{id}', [AdminController::class, 'handleReport']);

        // Contact Messages from Public
        Route::get('/contacts', [ContactController::class, 'index']);

        // Alumni Registration Verifications
        Route::get('/alumni/verifications', [AdminController::class, 'listAlumniVerifications']);
        Route::post('/alumni/{id}/verify', [AdminController::class, 'approveAlumni']);
        Route::post('/alumni/{id}/reject', [AdminController::class, 'rejectAlumni']);
    });
});
