<?php

namespace Tests\Feature\Api\V1;

use App\Enums\ProfileVisibility;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\AlumniProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlumniTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_alumni_directory(): void
    {
        $user = User::factory()->create([
            'name' => 'Siti Nurhaliza, S.T.',
            'status' => UserStatus::ACTIVE->value,
            'role' => UserRole::ALUMNI->value,
        ]);

        AlumniProfile::create([
            'user_id' => $user->id,
            'graduation_year' => 2012,
            'alumni_identifier' => 'M3S-2012-0081',
            'visibility' => ProfileVisibility::PUBLIC->value,
        ]);

        $response = $this->getJson('/api/v1/alumni');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }

    public function test_can_fetch_alumni_by_slug(): void
    {
        $user = User::factory()->create([
            'name' => 'Siti Nurhaliza, S.T.',
            'status' => UserStatus::ACTIVE->value,
            'role' => UserRole::ALUMNI->value,
        ]);

        AlumniProfile::create([
            'user_id' => $user->id,
            'graduation_year' => 2012,
            'alumni_identifier' => 'M3S-2012-0081',
            'visibility' => ProfileVisibility::PUBLIC->value,
        ]);

        $response = $this->getJson('/api/v1/alumni/siti-nurhaliza');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.alumni_identifier', 'M3S-2012-0081');
    }

    public function test_can_fetch_alumni_by_official_identifier(): void
    {
        $user = User::factory()->create([
            'name' => 'Ahmad Fauzi, M.Pd.',
            'status' => UserStatus::ACTIVE->value,
            'role' => UserRole::ALUMNI->value,
        ]);

        AlumniProfile::create([
            'user_id' => $user->id,
            'graduation_year' => 2010,
            'alumni_identifier' => 'M3S-2010-0034',
            'visibility' => ProfileVisibility::PUBLIC->value,
        ]);

        // Case-insensitive M3S identifier test
        $response = $this->getJson('/api/v1/alumni/m3s-2010-0034');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.alumni_identifier', 'M3S-2010-0034');
    }

    public function test_invalid_identifier_format_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/alumni/invalid%20param%20with%20spaces%21');

        $response->assertStatus(400)
            ->assertJsonPath('status', 'error');
    }
}
