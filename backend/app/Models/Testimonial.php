<?php

namespace App\Models;

use App\Enums\TestimonialStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'author_name',
        'author_avatar',
        'graduation_year',
        'content',
        'position',
        'company',
        'rating',
        'is_featured',
        'status',
        'published_at',
    ];

    protected $appends = [
        'display_name',
        'display_avatar',
        'display_role',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'status' => TestimonialStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the display name of the author (custom author_name or user account name).
     */
    public function getDisplayNameAttribute(): string
    {
        if (! empty($this->author_name)) {
            return $this->author_name;
        }

        return $this->user?->name ?? 'Alumni Mayoga';
    }

    /**
     * Get the display avatar URL of the author.
     */
    public function getDisplayAvatarAttribute(): string
    {
        if (! empty($this->author_avatar)) {
            if (str_starts_with($this->author_avatar, 'http://') || str_starts_with($this->author_avatar, 'https://') || str_starts_with($this->author_avatar, '/')) {
                return $this->author_avatar;
            }
            return '/storage/' . $this->author_avatar;
        }

        if ($this->user && ! empty($this->user->avatar)) {
            return $this->user->avatar;
        }

        return '/images/avatar-ahmad.jpg';
    }

    /**
     * Get the formatted role, company, and graduation year for display.
     */
    public function getDisplayRoleAttribute(): string
    {
        $parts = [];

        if (! empty($this->position)) {
            $parts[] = $this->position;
        }

        if (! empty($this->company)) {
            $parts[] = $this->company;
        } elseif (! empty($this->graduation_year)) {
            $parts[] = 'Angkatan ' . $this->graduation_year;
        }

        return ! empty($parts) ? implode(', ', $parts) : 'Alumni MAN 3 Sleman';
    }
}
