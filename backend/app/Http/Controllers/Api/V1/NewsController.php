<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Display a listing of published news.
     */
    public function index(Request $request): JsonResponse
    {
        $query = News::with(['category.parent', 'author'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category)
                  ->orWhereHas('parent', fn ($sub) => $sub->where('slug', $request->category));
            });
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $news = $query->paginate($request->integer('per_page', 10));

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }

    /**
     * Display the specified news item by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $news = News::with([
            'category.parent',
            'author',
            'comments' => fn ($q) => $q->where('is_approved', true)->latest(),
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ]);
    }

    /**
     * Store a comment for the specified news item.
     */
    public function storeComment(Request $request, string $slug): JsonResponse
    {
        $news = News::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'author_name' => 'required|string|max:100',
            'author_email' => 'required|email|max:150',
            'author_url' => 'nullable|url|max:255',
            'content' => 'required|string|max:2000',
            'parent_id' => 'nullable|uuid|exists:news_comments,id',
        ]);

        $comment = NewsComment::create([
            'news_id' => $news->id,
            'user_id' => $request->user()?->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'author_name' => $validated['author_name'],
            'author_email' => $validated['author_email'],
            'author_url' => $validated['author_url'] ?? null,
            'content' => $validated['content'],
            'is_approved' => true,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil dikirim.',
            'data' => $comment,
        ], 201);
    }
}
