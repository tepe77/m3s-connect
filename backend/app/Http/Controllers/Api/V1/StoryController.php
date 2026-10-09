<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\StoryStatus;
use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StoryController extends Controller
{
    /**
     * Display a listing of published alumni stories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::query()
            ->with('author')
            ->where('status', StoryStatus::PUBLISHED);

        // Filter by category
        if ($request->filled('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        // Search in title, author, company, profession, or graduation year
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%")
                    ->orWhere('author_name', 'ilike', "%{$search}%")
                    ->orWhere('profession', 'ilike', "%{$search}%")
                    ->orWhere('company', 'ilike', "%{$search}%")
                    ->orWhere('graduation_year', 'ilike', "%{$search}%");
            });
        }

        // Filter featured only
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $query->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc');

        $limit = $request->integer('limit', 30);
        $stories = $query->take($limit)->get();

        // Get available categories for filter pills
        $categories = Story::query()
            ->where('status', StoryStatus::PUBLISHED)
            ->whereNotNull('category')
            ->select('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'status' => 'success',
            'data' => $stories,
            'categories' => $categories,
            'total' => $stories->count(),
        ]);
    }

    /**
     * Display a specific alumni story by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $story = Story::query()
            ->with('author')
            ->where('slug', $slug)
            ->where('status', StoryStatus::PUBLISHED)
            ->first();

        if (! $story) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kisah alumni tidak ditemukan.',
            ], 404);
        }

        // Related stories in same category
        $related = Story::query()
            ->where('id', '!=', $story->id)
            ->where('status', StoryStatus::PUBLISHED)
            ->where('category', $story->category)
            ->take(3)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $story,
            'related' => $related,
        ]);
    }

    /**
     * Store a newly submitted alumni story from user/visitor with anti-abuse mitigations.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Honeypot Bot Trap: Bot fills invisible decoy fields
        if ($request->filled('_hp_website') || $request->filled('website') || $request->filled('hp_fax')) {
            // Return fake success response so bot script concludes without attempting alternative vectors
            return response()->json([
                'status' => 'success',
                'message' => 'Terima kasih! Kisah inspiratif Anda berhasil diajukan dan sedang dalam peninjauan oleh tim redaksi sebelum ditampilkan ke publik.',
                'data' => [
                    'id' => (string) Str::uuid(),
                    'created_at' => now()->toIso8601String(),
                ],
            ], 200);
        }

        // 2. Time-trap Check: Human takes at least ~3 seconds to fill and submit
        $formTime = $request->input('_form_time');
        if ($formTime && is_numeric($formTime)) {
            $durationMs = (now()->getTimestampMs()) - (float) $formTime;
            if ($durationMs > 0 && $durationMs < 3000) {
                // Submitted inhumanly fast; silent drop with fake success
                return response()->json([
                    'status' => 'success',
                    'message' => 'Terima kasih! Kisah inspiratif Anda berhasil diajukan dan sedang dalam peninjauan oleh tim redaksi sebelum ditampilkan ke publik.',
                    'data' => [
                        'id' => (string) Str::uuid(),
                        'created_at' => now()->toIso8601String(),
                    ],
                ], 200);
            }
        }

        // 3. Request Validation
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'author_name' => ['required', 'string', 'min:2', 'max:100'],
            'graduation_year' => ['required', 'string', 'max:50'],
            'profession' => ['nullable', 'string', 'max:100'],
            'company' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string', 'min:30', 'max:50000'],
            'cover_image' => ['nullable', 'image', 'max:3072'],
        ]);

        // 4. Heuristic Content Analysis (Spam & Abuse detection)
        $combinedText = $validated['title'] . ' ' . ($validated['excerpt'] ?? '') . ' ' . $validated['content'];

        // Check for link count flood (> 2 URLs in body)
        $urlMatches = preg_match_all('#https?://#i', $validated['content']);
        if ($urlMatches > 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mohon maaf, naskah tidak diperkenankan memuat lebih dari 2 tautan URL eksternal.',
            ], 422);
        }

        // Check for Cyrillic spam characters on an Indonesian high school portal
        if (preg_match('/[\x{0400}-\x{04FF}]/u', $combinedText)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Terima kasih! Kisah inspiratif Anda berhasil diajukan.',
            ], 200);
        }

        // Check for common gambling, casino, illegal slot keywords
        if (preg_match('/(slot\s*gacor|judi\s*online|slot\s*online|casino|poker88|sbobet|crypto\s*giveaway|whatsapp\s*hack)/i', $combinedText)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Terima kasih! Kisah inspiratif Anda berhasil diajukan.',
            ], 200);
        }

        // 5. Sanitization (Anti-XSS)
        $cleanTitle = strip_tags(trim($validated['title']));
        $cleanAuthorName = strip_tags(trim($validated['author_name']));
        $cleanGraduationYear = strip_tags(trim($validated['graduation_year']));
        $cleanProfession = ! empty($validated['profession']) ? strip_tags(trim($validated['profession'])) : null;
        $cleanCompany = ! empty($validated['company']) ? strip_tags(trim($validated['company'])) : null;
        $cleanCategory = strip_tags(trim($validated['category']));
        $cleanExcerpt = ! empty($validated['excerpt']) ? strip_tags(trim($validated['excerpt'])) : null;

        // Content sanitization: strip dangerous tags and script handlers
        $cleanContent = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $validated['content']);
        $cleanContent = preg_replace('#<iframe(.*?)>(.*?)</iframe>#is', '', $cleanContent);
        $cleanContent = preg_replace('#<object(.*?)>(.*?)</object>#is', '', $cleanContent);
        $cleanContent = preg_replace('#<embed(.*?)>(.*?)</embed>#is', '', $cleanContent);
        $cleanContent = preg_replace('#(javascript:|onerror=|onload=|onclick=|onmouseover=)#i', '', $cleanContent);
        $cleanContent = strip_tags($cleanContent, '<p><br><h3><h4><h5><h6><b><strong><i><em><ul><ol><li><blockquote>');

        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $coverImagePath = $request->file('cover_image')->store('stories/covers', 'public');
        }

        $baseSlug = Str::slug($cleanTitle);
        $slug = $baseSlug . '-' . Str::random(5);

        // Calculate approximate reading time (approx 200 words per minute)
        $wordCount = str_word_count(strip_tags($cleanContent));
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $user = $request->user();

        $story = Story::create([
            'user_id' => $user?->id,
            'title' => $cleanTitle,
            'slug' => $slug,
            'author_name' => $cleanAuthorName,
            'author_avatar' => $user?->avatar,
            'graduation_year' => $cleanGraduationYear,
            'profession' => $cleanProfession,
            'company' => $cleanCompany,
            'category' => $cleanCategory,
            'excerpt' => $cleanExcerpt ?? Str::limit(strip_tags($cleanContent), 160),
            'content' => $cleanContent,
            'cover_image' => $coverImagePath,
            'reading_time' => $readingTime,
            'is_featured' => false,
            'status' => StoryStatus::PENDING_REVIEW,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih! Kisah inspiratif Anda berhasil diajukan dan sedang dalam peninjauan oleh tim redaksi sebelum ditampilkan ke publik.',
            'data' => [
                'id' => $story->id,
                'title' => $story->title,
                'created_at' => $story->created_at,
            ],
        ], 201);
    }
}
