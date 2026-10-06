<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAlumni();
    }

    public function resolve(User $user, Report $report): bool
    {
        // Reporter cannot resolve their own report
        if ($user->id === $report->user_id) {
            return false;
        }

        return $user->isAdmin() || $user->isModerator();
    }
}
