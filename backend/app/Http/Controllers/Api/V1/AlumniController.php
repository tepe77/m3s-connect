<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AlumniController extends Controller
{
    /**
     * List alumni for the directory.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AlumniProfile::with(['user', 'skills', 'socialLinks'])
            ->whereHas('user', function ($q) {
                $q->where('status', 'active');
            });

        // Filter based on privacy
        $viewer = $request->user('sanctum');
        if (!$viewer) {
            $query->where('visibility', 'public');
        } else {
            $query->whereIn('visibility', ['public', 'members']);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('occupation', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('skills', fn ($s) => $s->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('graduation_year')) {
            $query->where('graduation_year', $request->graduation_year);
        }

        if ($request->filled('city')) {
            $query->where('current_city', 'like', "%{$request->city}%");
        }

        if ($request->filled('occupation')) {
            $query->where('occupation', 'like', "%{$request->occupation}%");
        }

        $alumni = $query->latest('verified_at')->paginate($request->integer('per_page', 24));

        return response()->json([
            'status' => 'success',
            'data' => $alumni,
        ]);
    }

    /**
     * Show single alumni profile with PostgreSQL UUID safe query and privacy enforcement.
     */
    public function show(string $id, Request $request): JsonResponse
    {
        $viewer = $request->user('sanctum');

        $query = AlumniProfile::with(['user', 'skills', 'socialLinks', 'educations', 'experiences']);

        $slugToIdentifier = [
            'alumni-1' => 'M3S-2012-0081',
            'alumni-2' => 'M3S-2010-0034',
            'alumni-3' => 'M3S-2015-0112',
            'alumni-4' => 'M3S-2018-0042',
            'alumni-5' => 'M3S-2016-0067',
            'alumni-6' => 'M3S-2014-0019',
        ];

        if (Str::isUuid($id)) {
            $query->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('user_id', $id);
            });
            $profile = $query->first();
        } elseif (isset($slugToIdentifier[$id])) {
            $profile = $query->where('alumni_identifier', $slugToIdentifier[$id])->first();
        } elseif (preg_match('/^alumni-(\d+)$/', $id, $matches)) {
            // Support dummy/sample slug format gracefully
            $offset = max(0, ((int) $matches[1]) - 1);
            $profile = $query->orderBy('created_at', 'asc')->skip($offset)->first();
        } else {
            $profile = $query->where('alumni_identifier', $id)->first();
        }

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profil alumni tidak ditemukan.',
            ], 404);
        }

        $visibilityValue = is_object($profile->visibility) ? $profile->visibility->value : $profile->visibility;

        // If private: only owner or admin can view
        if ($visibilityValue === 'private') {
            $isOwner = $viewer && ($viewer->id === $profile->user_id);
            $isAdmin = $viewer && method_exists($viewer, 'isAdmin') && $viewer->isAdmin();

            if (!$isOwner && !$isAdmin) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Profil ini dikonfigurasi sebagai privat.',
                ], 403);
            }
        }

        // If members-only and viewer is unauthenticated guest:
        // Mask contact links and email
        if ($visibilityValue === 'members' && !$viewer) {
            $profile->setRelation('socialLinks', collect([]));
            if ($profile->user) {
                $profile->user->makeHidden(['email']);
            }
            $profile->contacts_locked = true;
        } else {
            $profile->contacts_locked = false;
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }
}
