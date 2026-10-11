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
        // 1. Sanitasi input: cegah karakter berbahaya / injection / directory traversal
        $cleanId = trim($id);
        if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/', $cleanId)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Format pengenal alumni tidak valid.',
            ], 400);
        }

        $viewer = $request->user('sanctum');

        $query = AlumniProfile::with(['user', 'skills', 'socialLinks', 'educations', 'experiences']);

        $profile = null;

        // A. Cek jika input adalah UUID (Direct PK / User ID lookup)
        if (Str::isUuid($cleanId)) {
            $profile = (clone $query)->where(function ($q) use ($cleanId) {
                $q->where('id', $cleanId)->orWhere('user_id', $cleanId);
            })->first();
        }

        // B. Cek Format Resmi Alumni Identifier (misal: "M3S-2012-0081" atau "m3s-2012-0081")
        if (!$profile && preg_match('/^m3s-\d{4}-\d{4}$/i', $cleanId)) {
            $profile = (clone $query)->whereRaw('LOWER(alumni_identifier) = ?', [strtolower($cleanId)])->first();
        }

        // C. Cek Format Slug Nama + Year/Identifier (e.g. "siti-nurhaliza-2012" atau "siti-nurhaliza-0081")
        if (!$profile && preg_match('/^(.*?)-(\d{4})$/', $cleanId, $matches)) {
            $namePart = $matches[1];
            $codeOrYear = (int) $matches[2];
            $profile = (clone $query)
                ->where(function ($q) use ($codeOrYear) {
                    $q->where('graduation_year', $codeOrYear)
                      ->orWhere('alumni_identifier', 'like', "%{$codeOrYear}");
                })
                ->whereHas('user', function ($u) use ($namePart) {
                    $u->whereRaw("LOWER(REPLACE(name, ' ', '-')) LIKE ?", ['%' . strtolower($namePart) . '%']);
                })
                ->first();
        }

        // D. Cek Format Slug Nama Bersih (e.g. "siti-nurhaliza", "dr-farhan-hakim", "farhan-hakim", "siti-nurhaliza-s-t")
        if (!$profile) {
            $words = array_values(array_filter(explode('-', strtolower($cleanId)), fn ($w) => strlen($w) > 2));
            if (!empty($words)) {
                $profile = (clone $query)->whereHas('user', function ($u) use ($words) {
                    $u->where(function ($sub) use ($words) {
                        foreach ($words as $w) {
                            $sub->whereRaw("LOWER(name) LIKE ?", ['%' . $w . '%']);
                        }
                    });
                })->first();
            }

            if (!$profile) {
                $normalizedSlug = str_replace('-', ' ', strtolower($cleanId));
                $profile = (clone $query)->whereHas('user', function ($u) use ($normalizedSlug) {
                    $u->whereRaw("LOWER(name) LIKE ?", ['%' . $normalizedSlug . '%']);
                })->first();
            }
        }

        // E. Backward-compatibility untuk legacy dummy slug ("alumni-1", "alumni-2", dst.)
        if (!$profile) {
            $slugToIdentifier = [
                'alumni-1' => 'M3S-2012-0081',
                'alumni-2' => 'M3S-2010-0034',
                'alumni-3' => 'M3S-2015-0112',
                'alumni-4' => 'M3S-2018-0042',
                'alumni-5' => 'M3S-2016-0067',
                'alumni-6' => 'M3S-2014-0019',
            ];

            if (isset($slugToIdentifier[$cleanId])) {
                $profile = (clone $query)->where('alumni_identifier', $slugToIdentifier[$cleanId])->first();
            } elseif (preg_match('/^alumni-(\d+)$/', $cleanId, $matches)) {
                $offset = max(0, ((int) $matches[1]) - 1);
                $profile = (clone $query)->orderBy('created_at', 'asc')->skip($offset)->first();
            } else {
                $profile = (clone $query)->where('alumni_identifier', $cleanId)->first();
            }
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
