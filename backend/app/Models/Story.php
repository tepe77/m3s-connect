<?php

namespace App\Models;

use App\Enums\StoryStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Story extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'author_name',
        'author_avatar',
        'graduation_year',
        'profession',
        'company',
        'category',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'reading_time',
        'is_featured',
        'status',
        'published_at',
    ];

    protected $appends = [
        'display_author',
        'display_avatar',
        'display_role',
        'cover_image_url',
    ];

    protected function casts(): array
    {
        return [
            'reading_time' => 'integer',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'status' => StoryStatus::class,
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get author display name.
     */
    public function getDisplayAuthorAttribute(): string
    {
        if (! empty($this->author_name)) {
            return $this->author_name;
        }

        return $this->author?->name ?? 'Alumni Mayoga';
    }

    /**
     * Get author display avatar URL.
     */
    public function getDisplayAvatarAttribute(): string
    {
        if (! empty($this->author_avatar)) {
            if (str_starts_with($this->author_avatar, 'http://') || str_starts_with($this->author_avatar, 'https://') || str_starts_with($this->author_avatar, '/')) {
                return $this->author_avatar;
            }
            return '/storage/' . $this->author_avatar;
        }

        if ($this->author && ! empty($this->author->avatar)) {
            return $this->author->avatar;
        }

        return '/images/avatar-ahmad.jpg';
    }

    /**
     * Get formatted display role, company, or graduation year.
     */
    public function getDisplayRoleAttribute(): string
    {
        $parts = [];

        if (! empty($this->profession)) {
            $parts[] = $this->profession;
        }

        if (! empty($this->company)) {
            $parts[] = $this->company;
        } elseif (! empty($this->graduation_year)) {
            $parts[] = 'Angkatan ' . $this->graduation_year;
        }

        return ! empty($parts) ? implode(' di ', $parts) : 'Alumni MAN 3 Sleman';
    }

    /**
     * Get cover image URL formatted.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (empty($this->cover_image)) {
            return null;
        }

        if (str_starts_with($this->cover_image, 'http://') || str_starts_with($this->cover_image, 'https://') || str_starts_with($this->cover_image, '/')) {
            return $this->cover_image;
        }

        return '/storage/' . $this->cover_image;
    }
}
