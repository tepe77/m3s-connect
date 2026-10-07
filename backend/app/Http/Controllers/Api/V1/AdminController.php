<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Authorize that the current user has admin or moderator privileges.
     */
    protected function authorizeStaff(Request $request): ?JsonResponse
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, [UserRole::ADMIN, UserRole::MODERATOR])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Tindakan ini memerlukan hak akses Administrator atau Moderator.',
            ], 403);
        }
        return null;
    }

    /**
     * Overview stats for moderation dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $pendingVerifications = User::where('status', UserStatus::PENDING)->count();
        $pendingReports = Report::where('status', ReportStatus::PENDING)->count();
        $totalCategories = ForumCategory::count();
        $activeThreads = ForumThread::where('status', 'published')->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'pending_verifications' => $pendingVerifications,
                'pending_reports' => $pendingReports,
                'total_categories' => $totalCategories,
                'active_threads' => $activeThreads,
            ],
        ]);
    }

    // ==========================================
    // 1. FORUM CATEGORIES MANAGEMENT
    // ==========================================

    /**
     * List all categories (both active and inactive) with counts.
     */
    public function listCategories(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $categories = ForumCategory::withCount('threads')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }

    /**
     * Create a new forum category.
     */
    public function storeCategory(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $slug = Str::slug($validated['name']);
        if (ForumCategory::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::lower(Str::random(4));
        }

        $category = ForumCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? '',
            'color' => $validated['color'] ?? '#0D9488',
            'icon' => $validated['icon'] ?? 'chat',
            'image' => $validated['image'] ?? '/images/hero-man3-sleman.jpg',
            'sort_order' => $validated['sort_order'] ?? (ForumCategory::max('sort_order') + 1),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori forum berhasil ditambahkan.',
            'data' => $category,
        ], 201);
    }

    /**
     * Update an existing forum category.
     */
    public function updateCategory(Request $request, string $id): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $category = ForumCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $slug = Str::slug($validated['name']);
            if (ForumCategory::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug .= '-' . Str::lower(Str::random(4));
            }
            $validated['slug'] = $slug;
        }

        $category->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori forum berhasil diperbarui.',
            'data' => $category,
        ]);
    }

    /**
     * Delete or deactivate a forum category.
     */
    public function destroyCategory(Request $request, string $id): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $category = ForumCategory::withCount('threads')->findOrFail($id);

        if ($category->threads_count > 0) {
            // If has threads, toggle inactive instead of hard delete to preserve foreign integrity
            $category->update(['is_active' => false]);
            return response()->json([
                'status' => 'success',
                'message' => 'Kategori dinonaktifkan karena telah memiliki topik diskusi.',
                'data' => $category,
            ]);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori forum berhasil dihapus.',
        ]);
    }

    // ==========================================
    // 2. SPAM & CONTENT MODERATION REPORTS
    // ==========================================

    /**
     * List all moderation reports with filters.
     */
    public function listReports(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $query = Report::with(['reporter:id,name,email,role', 'resolver:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $reports = $query->latest()->paginate($request->integer('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }

    /**
     * Create a user content report (Any authenticated user).
     */
    public function submitReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reportable_type' => 'required|string',
            'reportable_id' => 'required|string',
            'reason' => 'required|string|max:200',
            'description' => 'nullable|string|max:1000',
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'reportable_type' => $validated['reportable_type'],
            'reportable_id' => $validated['reportable_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description'] ?? null,
            'status' => ReportStatus::PENDING,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan berhasil dikirimkan ke tim moderator.',
            'data' => $report,
        ], 201);
    }

    /**
     * Resolve or reject a moderation report with action.
     */
    public function handleReport(Request $request, string $id): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:reviewing,resolved,rejected',
            'action' => 'nullable|string|in:lock_thread,delete_content,warn_user,none',
            'notes' => 'nullable|string|max:500',
        ]);

        // Perform moderation action if specified
        if (!empty($validated['action'])) {
            if ($validated['action'] === 'lock_thread') {
                if ($report->reportable_type === ForumThread::class || str_contains($report->reportable_type, 'ForumThread')) {
                    ForumThread::where('id', $report->reportable_id)->update(['is_locked' => true]);
                }
            } elseif ($validated['action'] === 'delete_content') {
                if ($report->reportable_type === ForumPost::class || str_contains($report->reportable_type, 'ForumPost')) {
                    ForumPost::where('id', $report->reportable_id)->delete();
                } elseif ($report->reportable_type === ForumThread::class || str_contains($report->reportable_type, 'ForumThread')) {
                    ForumThread::where('id', $report->reportable_id)->delete();
                }
            }
        }

        $report->update([
            'status' => $validated['status'],
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan berhasil diperbarui.',
            'data' => $report->load(['resolver:id,name']),
        ]);
    }

    // ==========================================
    // 3. ALUMNI REGISTRATION VERIFICATIONS
    // ==========================================

    /**
     * List alumni registrations for verification review.
     */
    public function listAlumniVerifications(Request $request): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $query = User::with(['alumniProfile'])
            ->where('role', UserRole::ALUMNI);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // Default: show pending first
            $query->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END");
        }

        $users = $query->latest()->paginate($request->integer('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Approve alumni verification and generate NPA identifier.
     */
    public function approveAlumni(Request $request, string $userId): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $user = User::with('alumniProfile')->findOrFail($userId);
        $user->update(['status' => UserStatus::ACTIVE]);

        if ($user->alumniProfile) {
            $year = $user->alumniProfile->graduation_year ?? 2020;
            $identifier = $user->alumniProfile->alumni_identifier;

            if (!$identifier) {
                $identifier = AlumniProfile::generateIdentifier($year);
            }

            $user->alumniProfile->update([
                'alumni_identifier' => $identifier,
                'verified_at' => now(),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data alumni berhasil diverifikasi dan akun telah aktif.',
            'data' => $user->fresh(['alumniProfile']),
        ]);
    }

    /**
     * Reject or suspend an alumni account.
     */
    public function rejectAlumni(Request $request, string $userId): JsonResponse
    {
        if ($authError = $this->authorizeStaff($request)) {
            return $authError;
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user = User::with('alumniProfile')->findOrFail($userId);
        $user->update(['status' => UserStatus::SUSPENDED]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pendaftaran alumni telah ditolak / dinonaktifkan.',
            'data' => $user->fresh(['alumniProfile']),
        ]);
    }
}
