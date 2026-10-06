<?php

namespace App\Policies;

use App\Models\AlumniProfile;
use App\Models\User;

class AlumniProfilePolicy
{
    /**
     * Determine whether the user can view the profile.
     */
    public function view(?User $user, AlumniProfile $profile): bool
    {
        // Public profiles can be viewed by anyone
        if ($profile->visibility?->value === 'public' || $profile->visibility === 'public') {
            return true;
        }

        // Members-only profiles require authenticated user
        if ($profile->visibility?->value === 'members' || $profile->visibility === 'members') {
            return $user !== null && $user->isActive();
        }

        // Private profiles can only be viewed by owner or admin
        return $user !== null && ($user->id === $profile->user_id || $user->isAdmin());
    }

    /**
     * Determine whether the user can update the profile.
     */
    public function update(User $user, AlumniProfile $profile): bool
    {
        return $user->isAdmin() || $user->id === $profile->user_id;
    }
}
