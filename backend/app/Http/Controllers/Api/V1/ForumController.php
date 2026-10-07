<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ForumThreadStatus;
use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use App\Models\ForumLike;
use App\Models\ForumPost;
use App\Models\ForumThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForumController extends Controller
{
    /**
     * List all active forum categories with thread counts.
     */
    public function categories(): JsonResponse
    {
        $categories = ForumCategory::where('is_active', true)
            ->withCount(['threads' => function ($query) {
                $query->where('status', ForumThreadStatus::PUBLISHED);
            }])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }

    /**
     * List forum threads with category filter, tag, search, and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ForumThread::with(['category', 'author:id,name,role', 'likes'])
            ->withCount('posts')
            ->where('status', ForumThreadStatus::PUBLISHED);

        // Filter by category slug
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Search query
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('body', 'ilike', "%{$search}%");
            });
        }

        // Sorting: top, new, or latest activity
        $tab = $request->get('tab', 'latest');
        if ($tab === 'top') {
            $query->withCount('likes')->orderByDesc('is_pinned')->orderByDesc('likes_count')->orderByDesc('views_count');
        } elseif ($tab === 'new') {
            $query->orderByDesc('is_pinned')->latest();
        } else {
            $query->orderByDesc('is_pinned')->orderByDesc('last_post_at')->latest();
        }

        $threads = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $threads,
        ]);
    }

    /**
     * Show thread details with author and all published posts/replies.
     */
    public function show(string $slug): JsonResponse
    {
        $thread = ForumThread::with([
            'category',
            'author:id,name,role',
            'likes',
            'posts' => function ($q) {
                $q->where('status', 'published')
                  ->with(['author:id,name,role', 'parent.author:id,name', 'likes'])
                  ->oldest();
            },
        ])
            ->where('slug', $slug)
            ->where('status', ForumThreadStatus::PUBLISHED)
            ->firstOrFail();

        // Increment view count
        $thread->increment('views_count');

        return response()->json([
            'status' => 'success',
            'data' => $thread,
        ]);
    }

    /**
     * Create a new forum thread (Authenticated user).
     */
    public function storeThread(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|uuid|exists:forum_categories,id',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $slug = Str::slug($validated['title']) . '-' . Str::lower(Str::random(5));

        $thread = ForumThread::create([
            'category_id' => $validated['category_id'],
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => $slug,
            'body' => $validated['body'],
            'status' => ForumThreadStatus::PUBLISHED,
            'is_pinned' => false,
            'is_locked' => false,
            'views_count' => 1,
            'last_post_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Topik diskusi berhasil dipublikasikan.',
            'data' => $thread->load(['category', 'author:id,name,role']),
        ], 201);
    }

    /**
     * Store a reply/post in a thread (Authenticated user).
     */
    public function storePost(Request $request, string $threadId): JsonResponse
    {
        $thread = Str::isUuid($threadId)
            ? ForumThread::find($threadId)
            : ForumThread::where('slug', $threadId)->first();

        if (!$thread) {
            return response()->json([
                'status' => 'error',
                'message' => 'Topik diskusi tidak ditemukan.',
            ], 404);
        }

        if ($thread->is_locked) {
            return response()->json([
                'status' => 'error',
                'message' => 'Topik ini telah dikunci oleh moderator.',
            ], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|uuid|exists:forum_posts,id',
        ]);

        $post = ForumPost::create([
            'thread_id' => $thread->id,
            'user_id' => $request->user()->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'body' => $validated['body'],
            'status' => 'published',
        ]);

        // Update thread last post timestamp
        $thread->update(['last_post_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dikirimkan.',
            'data' => $post->load(['author:id,name,role', 'parent.author:id,name']),
        ], 201);
    }

    /**
     * Toggle like on a thread.
     */
    public function toggleThreadLike(Request $request, string $threadId): JsonResponse
    {
        $thread = Str::isUuid($threadId)
            ? ForumThread::find($threadId)
            : ForumThread::where('slug', $threadId)->first();

        if (!$thread) {
            return response()->json([
                'status' => 'error',
                'message' => 'Topik diskusi tidak ditemukan.',
            ], 404);
        }

        $userId = $request->user()->id;

        $existing = ForumLike::where('thread_id', $thread->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            ForumLike::create([
                'thread_id' => $thread->id,
                'user_id' => $userId,
            ]);
            $liked = true;
        }

        $count = ForumLike::where('thread_id', $thread->id)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'liked' => $liked,
                'likes_count' => $count,
            ],
        ]);
    }
}
