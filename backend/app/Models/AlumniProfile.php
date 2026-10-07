<?php

namespace App\Models;

use App\Enums\ProfileVisibility;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlumniProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'graduation_year',
        'graduation_class',
        'alumni_identifier',
        'gender',
        'birth_date',
        'bio',
        'current_city',
        'current_country',
        'occupation',
        'company',
        'visibility',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'graduation_year' => 'integer',
            'birth_date' => 'date',
            'verified_at' => 'datetime',
            'visibility' => ProfileVisibility::class,
        ];
    }

    /**
     * Generate unique alumni identifier in format M3S-{YEAR}-{SEQUENCE_4_DIGIT}
     */
    public static function generateIdentifier(int $graduationYear): string
    {
        $prefix = "M3S-{$graduationYear}-";
        $count = static::where('alumni_identifier', 'like', "{$prefix}%")->count();
        $seq = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
        $candidate = "{$prefix}{$seq}";

        while (static::where('alumni_identifier', $candidate)->exists()) {
            $count++;
            $seq = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
            $candidate = "{$prefix}{$seq}";
        }

        return $candidate;
    }

    protected static function booted(): void
    {
        static::creating(function (AlumniProfile $profile) {
            if (empty($profile->alumni_identifier)) {
                $year = $profile->graduation_year ?? (int) date('Y');
                $profile->alumni_identifier = static::generateIdentifier($year);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(AlumniEducation::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(AlumniExperience::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'alumni_skills');
    }

    public function socialLinks(): HasMany
    {
        return $this->hasMany(AlumniSocialLink::class);
    }
}
