<?php

namespace App\Policies;

use App\Enums\StoryStatus;
use App\Models\Story;
use App\Models\User;

class StoryPolicy
{
    public function view(?User $user, Story $story): bool
    {
        if ($story->status === StoryStatus::PUBLISHED) {
            return true;
        }

        return $user !== null && ($user->isAdmin() || $user->isModerator() || $user->id === $story->user_id);
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAlumni();
    }

    public function update(User $user, Story $story): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $story->user_id && $story->status === StoryStatus::DRAFT;
    }

    public function delete(User $user, Story $story): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $story->user_id && in_array($story->status, [StoryStatus::DRAFT, StoryStatus::PENDING_REVIEW]);
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
