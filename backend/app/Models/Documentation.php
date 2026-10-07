<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Documentation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'albums';

    protected $fillable = [
        'event_id',
        'title',
        'slug',
        'category',
        'event_date',
        'description',
        'cover_image',
        'photos',
        'photo_count',
        'is_featured',
        'status',
        'published_at',
    ];

    protected $appends = [
        'cover_image_url',
        'photo_urls',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'photos' => 'array',
            'photo_count' => 'integer',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Accessor for full cover image URL
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (empty($this->cover_image)) {
            return null;
        }

        if (str_starts_with($this->cover_image, 'http://') || str_starts_with($this->cover_image, 'https://')) {
            return $this->cover_image;
        }

        if (str_starts_with($this->cover_image, '/')) {
            return $this->cover_image;
        }

        return '/storage/' . $this->cover_image;
    }

    /**
     * Accessor for full photo URLs array
     */
    public function getPhotoUrlsAttribute(): array
    {
        $photos = $this->photos ?? [];
        if (!is_array($photos)) {
            return [];
        }

        return array_values(array_map(function ($photo) {
            if (empty($photo)) {
                return '';
            }
            if (str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://') || str_starts_with($photo, '/')) {
                return $photo;
            }
            return '/storage/' . $photo;
        }, array_filter($photos)));
    }
}
