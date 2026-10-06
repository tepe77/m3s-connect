<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ProfileVisibility;
use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\AlumniSocialLink;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Get the authenticated member's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'profile.skills',
            'profile.socialLinks',
            'profile.educations',
            'profile.experiences',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'profile' => $user->profile,
            ],
        ]);
    }

    /**
     * Update the authenticated member's profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'graduation_year' => 'nullable|integer|min:1970|max:2030',
            'graduation_class' => 'nullable|string|max:50',
            'alumni_identifier' => 'nullable|string|max:50',
            'gender' => 'nullable|in:male,female',
            'birth_date' => 'nullable|date',
            'bio' => 'nullable|string|max:1000',
            'current_city' => 'nullable|string|max:100',
            'current_country' => 'nullable|string|max:100',
            'occupation' => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'visibility' => 'nullable|in:public,members,private',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|in:linkedin,github,instagram,twitter,website',
            'social_links.*.url' => 'required|url|max:255',
        ]);

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
        }

        $profile = AlumniProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'graduation_year' => $validated['graduation_year'] ?? 2020,
                'graduation_class' => $validated['graduation_class'] ?? 'IPA 1',
                'visibility' => ProfileVisibility::MEMBERS,
            ]
        );

        $profileData = array_intersect_key($validated, array_flip([
            'graduation_year',
            'graduation_class',
            'alumni_identifier',
            'gender',
            'birth_date',
            'bio',
            'current_city',
            'current_country',
            'occupation',
            'company',
            'visibility',
        ]));

        $profile->update($profileData);

        // Sync Skills if provided
        if (isset($validated['skills'])) {
            $skillIds = [];
            foreach ($validated['skills'] as $skillName) {
                $skill = Skill::firstOrCreate(
                    ['name' => trim($skillName)],
                    ['slug' => Str::slug($skillName)]
                );
                $skillIds[] = $skill->id;
            }
            $profile->skills()->sync($skillIds);
        }

        // Sync Social Links if provided
        if (isset($validated['social_links'])) {
            $profile->socialLinks()->delete();
            foreach ($validated['social_links'] as $link) {
                if (!empty($link['url'])) {
                    $profile->socialLinks()->create([
                        'platform' => $link['platform'],
                        'url' => $link['url'],
                    ]);
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui.',
            'data' => [
                'user' => $user->fresh()->load([
                    'profile.skills',
                    'profile.socialLinks',
                ]),
            ],
        ]);
    }
}
