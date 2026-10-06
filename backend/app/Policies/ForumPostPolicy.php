<?php

namespace App\Policies;

use App\Models\ForumPost;
use App\Models\User;

class ForumPostPolicy
{
    public function create(User $user, ForumPost $post): bool
    {
        return $user->isActive() && $user->isAlumni() && ! $post->thread?->is_locked;
    }

    public function update(User $user, ForumPost $post): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $post->user_id && ! $post->thread?->is_locked;
    }

    public function delete(User $user, ForumPost $post): bool
    {
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }

        return $user->id === $post->user_id;
    }
}
