<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $user = $request->user();
        if (!$user) {
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
     * Show single alumni profile.
     */
    public function show(string $id, Request $request): JsonResponse
    {
        $profile = AlumniProfile::with(['user', 'skills', 'socialLinks', 'educations', 'experiences'])
            ->where('id', $id)
            ->orWhere('user_id', $id)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }
}
