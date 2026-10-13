<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ProfileVisibility;
use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\AlumniSocialLink;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'avatar' => 'nullable|string',
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
            'educations' => 'nullable|array',
            'educations.*.institution' => 'required|string|max:150',
            'educations.*.degree' => 'nullable|string|max:100',
            'educations.*.field_of_study' => 'nullable|string|max:100',
            'educations.*.start_year' => 'nullable|integer|min:1970|max:2035',
            'educations.*.end_year' => 'nullable|integer|min:1970|max:2035',
            'educations.*.description' => 'nullable|string|max:500',
            'experiences' => 'nullable|array',
            'experiences.*.company' => 'required|string|max:150',
            'experiences.*.position' => 'required|string|max:100',
            'experiences.*.location' => 'nullable|string|max:100',
            'experiences.*.start_date' => 'nullable|string|max:30',
            'experiences.*.end_date' => 'nullable|string|max:30',
            'experiences.*.is_current' => 'nullable|boolean',
            'experiences.*.description' => 'nullable|string|max:500',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        // Process avatar if present (URL string, preset path, or base64 data URI)
        if (isset($validated['avatar'])) {
            $avatarVal = $validated['avatar'];
            if (str_starts_with($avatarVal, 'data:image/')) {
                $parts = explode(',', $avatarVal, 2);
                if (count($parts) === 2) {
                    $imageData = base64_decode($parts[1]);
                    $extension = 'png';
                    if (str_contains($parts[0], 'jpeg') || str_contains($parts[0], 'jpg')) {
                        $extension = 'jpg';
                    } elseif (str_contains($parts[0], 'webp')) {
                        $extension = 'webp';
                    }
                    $filename = 'avatars/avatar_' . $user->id . '_' . time() . '.' . $extension;
                    Storage::disk('public')->put($filename, $imageData);
                    $user->avatar = '/storage/' . $filename;
                }
            } else {
                $user->avatar = $avatarVal;
            }
        }

        $user->save();

        $profile = AlumniProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'graduation_year' => $validated['graduation_year'] ?? 2020,
                'graduation_class' => $validated['graduation_class'] ?? 'IPA 1',
                'visibility' => ProfileVisibility::MEMBERS,
            ]
        );

        if (empty($profile->alumni_identifier)) {
            $year = $profile->graduation_year ?? 2020;
            $profile->alumni_identifier = AlumniProfile::generateIdentifier($year);
            $profile->save();
        }

        $profileData = array_intersect_key($validated, array_flip([
            'graduation_year',
            'graduation_class',
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

        // Sync Educations if provided
        if (isset($validated['educations'])) {
            $profile->educations()->delete();
            foreach ($validated['educations'] as $edu) {
                if (!empty($edu['institution'])) {
                    $profile->educations()->create([
                        'institution' => $edu['institution'],
                        'degree' => $edu['degree'] ?? null,
                        'field_of_study' => $edu['field_of_study'] ?? null,
                        'start_year' => !empty($edu['start_year']) ? (int) $edu['start_year'] : null,
                        'end_year' => !empty($edu['end_year']) ? (int) $edu['end_year'] : null,
                        'description' => $edu['description'] ?? null,
                    ]);
                }
            }
        }

        // Sync Experiences if provided
        if (isset($validated['experiences'])) {
            $profile->experiences()->delete();
            foreach ($validated['experiences'] as $exp) {
                if (!empty($exp['company']) && !empty($exp['position'])) {
                    $profile->experiences()->create([
                        'company' => $exp['company'],
                        'position' => $exp['position'],
                        'location' => $exp['location'] ?? null,
                        'start_date' => !empty($exp['start_date']) ? $exp['start_date'] : null,
                        'end_date' => !empty($exp['end_date']) ? $exp['end_date'] : null,
                        'is_current' => !empty($exp['is_current']),
                        'description' => $exp['description'] ?? null,
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
                    'profile.educations',
                    'profile.experiences',
                ]),
                'profile' => $profile->fresh([
                    'skills',
                    'socialLinks',
                    'educations',
                    'experiences',
                ]),
            ],
        ]);
    }

    /**
     * Upload avatar image directly.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $user = $request->user();
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => '/storage/' . $path]);

        return response()->json([
            'status' => 'success',
            'message' => 'Foto profil berhasil diunggah.',
            'data' => [
                'avatar' => $user->avatar_url ?? $user->avatar,
            ],
        ]);
    }
}
