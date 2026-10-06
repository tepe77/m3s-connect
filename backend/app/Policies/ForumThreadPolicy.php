<?php

namespace App\Policies;

use App\Enums\ForumThreadStatus;
use App\Models\ForumThread;
use App\Models\User;

class ForumThreadPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, ForumThread $thread): bool
    {
        if ($thread->status === ForumThreadStatus::PUBLISHED) {
            return true;
        }

        return $user !== null && ($user->isAdmin() || $user->isModerator() || $user->id === $thread->user_id);
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAlumni();
    }

    public function update(User $user, ForumThread $thread): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $thread->user_id
            && ! $thread->is_locked
            && $thread->status === ForumThreadStatus::PUBLISHED;
    }

    public function delete(User $user, ForumThread $thread): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $thread->user_id && ! $thread->is_locked;
    }

    public function moderate(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
