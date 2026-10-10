<?php

namespace Tests\Feature\Api\V1;

use App\Enums\ForumPostStatus;
use App\Enums\ForumThreadStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\ForumCategory;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ForumTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private ForumCategory $category;
    private ForumThread $thread;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'role' => UserRole::ALUMNI,
            'status' => UserStatus::ACTIVE,
        ]);

        $this->category = ForumCategory::create([
            'name' => 'Diskusi Umum',
            'slug' => 'diskusi-umum',
            'description' => 'Kategori umum alumni',
            'color' => '#0D9488',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->thread = ForumThread::create([
            'category_id' => $this->category->id,
            'user_id' => $this->user->id,
            'title' => 'Topik Uji Komunitas',
            'slug' => 'topik-uji-komunitas',
            'body' => 'Isi topik pengujian fungsionalitas forum.',
            'status' => ForumThreadStatus::PUBLISHED,
            'views_count' => 10,
            'last_post_at' => now(),
        ]);
    }

    public function test_categories_endpoint_returns_real_counts(): void
    {
        $response = $this->getJson('/api/v1/forum/categories');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.slug', 'diskusi-umum')
            ->assertJsonPath('data.0.topic_count', 1)
            ->assertJsonPath('data.0.post_count', 0);
    }

    public function test_unauthenticated_user_is_restricted_from_viewing_thread(): void
    {
        $response = $this->getJson("/api/v1/forum/threads/{$this->thread->slug}");

        $response->assertStatus(401)
            ->assertJsonPath('status', 'restricted')
            ->assertJsonPath('requires_auth', true);
    }

    public function test_authenticated_user_can_view_thread_and_views_count_increments(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        $initialViews = $this->thread->views_count;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/v1/forum/threads/{$this->thread->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.title', 'Topik Uji Komunitas');

        $this->assertDatabaseHas('forum_threads', [
            'id' => $this->thread->id,
            'views_count' => $initialViews + 1,
        ]);
    }

    public function test_authenticated_user_can_toggle_thread_like(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        // 1. Like
        $res1 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/like");

        $res1->assertStatus(200)
            ->assertJsonPath('data.liked', true)
            ->assertJsonPath('data.likes_count', 1);

        // 2. Unlike
        $res2 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/like");

        $res2->assertStatus(200)
            ->assertJsonPath('data.liked', false)
            ->assertJsonPath('data.likes_count', 0);
    }

    public function test_authenticated_user_can_toggle_thread_bookmark(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        // 1. Bookmark
        $res1 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/bookmark");

        $res1->assertStatus(200)
            ->assertJsonPath('data.bookmarked', true);

        $this->assertDatabaseHas('bookmarks', [
            'user_id' => $this->user->id,
            'thread_id' => $this->thread->id,
        ]);

        // 2. Remove Bookmark
        $res2 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/bookmark");

        $res2->assertStatus(200)
            ->assertJsonPath('data.bookmarked', false);

        $this->assertDatabaseMissing('bookmarks', [
            'user_id' => $this->user->id,
            'thread_id' => $this->thread->id,
        ]);
    }

    public function test_authenticated_user_can_reply_and_like_reply(): void
    {
        $token = $this->user->createToken('test')->plainTextToken;

        // 1. Store reply
        $resReply = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/posts", [
                'body' => 'Balasan pengujian hierarki diskusi.',
            ]);

        $resReply->assertStatus(201)
            ->assertJsonPath('status', 'success');

        $postId = $resReply->json('data.id');

        // 2. Like reply
        $resLike = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/posts/{$postId}/like");

        $resLike->assertStatus(200)
            ->assertJsonPath('data.liked', true)
            ->assertJsonPath('data.likes_count', 1);

        // 3. Nested reply to this post
        $resNested = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/v1/forum/threads/{$this->thread->id}/posts", [
                'body' => 'Balasan terhadap balasan pertama (anak).',
                'parent_id' => $postId,
            ]);

        $resNested->assertStatus(201)
            ->assertJsonPath('data.parent_id', $postId);
    }
}
