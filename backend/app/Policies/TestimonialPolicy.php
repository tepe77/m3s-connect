<?php

namespace App\Policies;

use App\Models\Testimonial;
use App\Models\User;

class TestimonialPolicy
{
    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAlumni();
    }

    public function delete(User $user, Testimonial $testimonial): bool
    {
        return $user->isAdmin() || $user->id === $testimonial->user_id;
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
