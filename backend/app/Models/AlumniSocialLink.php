<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniSocialLink extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'alumni_social_links';

    protected $fillable = [
        'alumni_profile_id',
        'platform',
        'url',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(AlumniProfile::class, 'alumni_profile_id');
    }
}
