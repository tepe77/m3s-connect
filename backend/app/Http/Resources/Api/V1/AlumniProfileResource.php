<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlumniProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'graduation_year' => $this->graduation_year,
            'graduation_class' => $this->graduation_class,
            'alumni_identifier' => $this->alumni_identifier,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'bio' => $this->bio,
            'current_city' => $this->current_city,
            'current_country' => $this->current_country,
            'occupation' => $this->occupation,
            'company' => $this->company,
            'visibility' => $this->visibility?->value ?? $this->visibility,
            'verified_at' => $this->verified_at?->toISOString(),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->pluck('name')),
        ];
    }
}
