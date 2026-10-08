<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\TestimonialStatus;
use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of approved testimonials for public display.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query()
            ->with('user')
            ->where('status', TestimonialStatus::APPROVED);

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $query->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc');

        $limit = $request->integer('limit', 20);
        $testimonials = $query->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $testimonials,
        ]);
    }

    /**
     * Store a newly created testimonial submitted by an alumni or member.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'min:10', 'max:1000'],
            'position' => ['nullable', 'string', 'max:100'],
            'company' => ['nullable', 'string', 'max:100'],
            'graduation_year' => ['nullable', 'string', 'max:20'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'author_name' => ['nullable', 'string', 'max:100'],
        ]);

        $user = $request->user();

        $testimonial = Testimonial::create([
            'user_id' => $user?->id,
            'author_name' => $user ? $user->name : ($validated['author_name'] ?? null),
            'author_avatar' => $user ? $user->avatar : null,
            'position' => $validated['position'] ?? null,
            'company' => $validated['company'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
            'content' => $validated['content'],
            'rating' => $validated['rating'] ?? 5,
            'is_featured' => false,
            'status' => TestimonialStatus::PENDING,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih! Testimoni Anda berhasil dikirim dan akan diverifikasi oleh tim admin sebelum ditampilkan di halaman beranda.',
            'data' => $testimonial,
        ], 201);
    }
}
