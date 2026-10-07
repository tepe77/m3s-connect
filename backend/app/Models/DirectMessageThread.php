<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DirectMessageThread extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'subject',
        'last_message_content',
        'last_message_at',
        'user_one_unread',
        'user_two_unread',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'user_one_unread' => 'integer',
            'user_two_unread' => 'integer',
        ];
    }

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'thread_id')->orderBy('created_at', 'asc');
    }

    /**
     * Get the other participant in the thread given a user ID.
     */
    public function getOtherParticipant(string $userId): ?User
    {
        if ($this->user_one_id === $userId) {
            return $this->userTwo;
        }

        return $this->userOne;
    }

    /**
     * Get unread count for a given user ID.
     */
    public function getUnreadCountFor(string $userId): int
    {
        return $this->user_one_id === $userId ? $this->user_one_unread : $this->user_two_unread;
    }
}
