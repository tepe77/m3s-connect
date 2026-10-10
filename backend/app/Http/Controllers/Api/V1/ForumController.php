<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ForumThreadStatus;
use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\ForumCategory;
use App\Models\ForumLike;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\Notification;
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
            ->with(['threads' => function ($query) {
                $query->where('status', ForumThreadStatus::PUBLISHED)->withCount('posts');
            }])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($cat) {
                $totalPosts = $cat->threads->sum('posts_count');
                $cat->topic_count = $cat->threads_count;
                $cat->post_count = $totalPosts;
                unset($cat->threads);
                return $cat;
            });

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
        $query = ForumThread::with(['category', 'author:id,name,role,avatar', 'likes'])
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
     * Protected by alumni membership privacy requirement.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();

        // Privacy Check: Only authenticated alumni/members can access full thread details
        if (!$user) {
            return response()->json([
                'status' => 'restricted',
                'requires_auth' => true,
                'message' => 'Akses terbatas: Topik diskusi dan balasan forum hanya dapat diakses oleh member alumni yang sudah login.',
            ], 401);
        }

        $thread = ForumThread::with([
            'category',
            'author:id,name,role,avatar',
            'likes',
            'bookmarks',
            'posts' => function ($q) {
                $q->where('status', 'published')
                  ->with(['author:id,name,role,avatar', 'parent.author:id,name', 'likes'])
                  ->oldest();
            },
        ])
            ->where('slug', $slug)
            ->where('status', ForumThreadStatus::PUBLISHED)
            ->firstOrFail();

        // Increment view count
        $thread->increment('views_count');

        // Append user-specific flags and real counts
        $thread->is_liked = $thread->likes->contains('user_id', $user->id);
        $thread->is_bookmarked = $thread->bookmarks->contains('user_id', $user->id);
        $thread->likes_count = $thread->likes->count();
        $thread->replies_count = $thread->posts->count();

        foreach ($thread->posts as $post) {
            $post->is_liked = $post->likes->contains('user_id', $user->id);
            $post->likes_count = $post->likes->count();
        }

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

        // Create notification for target recipient (parent reply author or thread author)
        $targetUserId = null;
        $notifTitle = '';

        if (!empty($validated['parent_id'])) {
            $parentPost = ForumPost::find($validated['parent_id']);
            if ($parentPost && $parentPost->user_id !== $request->user()->id) {
                $targetUserId = $parentPost->user_id;
                $notifTitle = 'Tanggapan baru dari ' . $request->user()->name . ' atas balasan Anda';
            }
        } elseif ($thread->user_id && $thread->user_id !== $request->user()->id) {
            $targetUserId = $thread->user_id;
            $notifTitle = 'Balasan baru dari ' . $request->user()->name . ' pada topik Anda';
        }

        if ($targetUserId) {
            Notification::create([
                'user_id' => $targetUserId,
                'type' => 'forum_reply',
                'title' => $notifTitle,
                'body' => Str::limit($validated['body'], 120),
                'data' => [
                    'thread_id' => $thread->id,
                    'thread_slug' => $thread->slug,
                    'thread_title' => $thread->title,
                    'post_id' => $post->id,
                    'href' => "/forum/{$thread->slug}#reply-{$post->id}",
                ],
            ]);
        }

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

    /**
     * Toggle bookmark on a thread.
     */
    public function toggleThreadBookmark(Request $request, string $threadId): JsonResponse
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

        $existing = Bookmark::where('thread_id', $thread->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            $bookmarked = false;
        } else {
            Bookmark::create([
                'thread_id' => $thread->id,
                'user_id' => $userId,
            ]);
            $bookmarked = true;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'bookmarked' => $bookmarked,
            ],
            'message' => $bookmarked ? 'Topik berhasil disimpan.' : 'Topik dihapus dari simpanan.',
        ]);
    }

    /**
     * Toggle like on a reply / post.
     */
    public function togglePostLike(Request $request, string $postId): JsonResponse
    {
        $post = ForumPost::find($postId);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Balasan tidak ditemukan.',
            ], 404);
        }

        $userId = $request->user()->id;

        $existing = ForumLike::where('post_id', $post->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            ForumLike::create([
                'post_id' => $post->id,
                'user_id' => $userId,
            ]);
            $liked = true;
        }

        $count = ForumLike::where('post_id', $post->id)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'liked' => $liked,
                'likes_count' => $count,
            ],
        ]);
    }

    /**
     * Explicitly record a topic view.
     */
    public function recordView(Request $request, string $threadId): JsonResponse
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

        $thread->increment('views_count');

        return response()->json([
            'status' => 'success',
            'data' => [
                'views_count' => $thread->views_count,
            ],
        ]);
    }
}
