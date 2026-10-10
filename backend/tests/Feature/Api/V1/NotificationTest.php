<?php

namespace Tests\Feature\Api\V1;

use App\Enums\ForumThreadStatus;
use App\Models\DirectMessage;
use App\Models\DirectMessageThread;
use App\Models\ForumCategory;
use App\Models\ForumThread;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_notifications(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'direct_message',
            'title' => 'Pesan baru dari Alumni',
            'body' => 'Halo Mas apa kabar?',
            'data' => [
                'href' => '/messages?thread=123',
            ],
        ]);

        $response = $this->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.unread_count', 1)
            ->assertJsonPath('data.notifications.0.title', 'Pesan baru dari Alumni')
            ->assertJsonPath('data.notifications.0.href', '/messages?thread=123');
    }

    public function test_sending_direct_message_creates_notification_for_recipient(): void
    {
        $sender = User::factory()->create(['name' => 'Budi Santoso']);
        $recipient = User::factory()->create(['name' => 'Siti Nurhaliza']);

        Sanctum::actingAs($sender);

        $response = $this->postJson('/api/v1/messages', [
            'recipient_id' => $recipient->id,
            'subject' => 'Peluang Karir',
            'content' => 'Halo Siti, ada lowongan frontend?',
        ]);

        $response->assertCreated();

        $threadId = $response->json('data.thread_id');

        $notif = Notification::where('user_id', $recipient->id)->first();
        $this->assertNotNull($notif);
        $this->assertEquals('direct_message', $notif->type);
        $this->assertEquals('Pesan baru dari Budi Santoso', $notif->title);
        $this->assertEquals("/messages?thread={$threadId}", $notif->data['href']);
    }

    public function test_replying_to_thread_creates_notification_for_counterpart(): void
    {
        $userOne = User::factory()->create(['name' => 'Alumni A']);
        $userTwo = User::factory()->create(['name' => 'Alumni B']);

        $thread = DirectMessageThread::create([
            'user_one_id' => $userOne->id,
            'user_two_id' => $userTwo->id,
            'subject' => 'Diskusi',
            'last_message_content' => 'Pesan awal',
            'last_message_at' => now(),
        ]);

        Sanctum::actingAs($userOne);

        $response = $this->postJson("/api/v1/messages/threads/{$thread->id}/reply", [
            'content' => 'Ini jawaban balasan dari A',
        ]);

        $response->assertOk();

        $notif = Notification::where('user_id', $userTwo->id)->first();
        $this->assertNotNull($notif);
        $this->assertEquals("/messages?thread={$thread->id}", $notif->data['href']);
    }

    public function test_posting_reply_to_forum_thread_creates_specific_notification(): void
    {
        $author = User::factory()->create(['name' => 'Penulis Topik']);
        $replier = User::factory()->create(['name' => 'Penanggap']);

        $category = ForumCategory::create([
            'name' => 'Umum',
            'slug' => 'umum',
            'is_active' => true,
        ]);

        $thread = ForumThread::create([
            'category_id' => $category->id,
            'user_id' => $author->id,
            'title' => 'Rencana Reuni Akbar 2026',
            'slug' => 'rencana-reuni-akbar-2026',
            'body' => 'Konten topik diskusi',
            'status' => ForumThreadStatus::PUBLISHED,
        ]);

        Sanctum::actingAs($replier);

        $response = $this->postJson("/api/v1/forum/threads/{$thread->id}/posts", [
            'body' => 'Saya setuju dengan rencana ini!',
        ]);

        $response->assertCreated();
        $postId = $response->json('data.id');

        $notif = Notification::where('user_id', $author->id)->first();
        $this->assertNotNull($notif);
        $this->assertEquals('forum_reply', $notif->type);
        $this->assertEquals("/forum/rencana-reuni-akbar-2026#reply-{$postId}", $notif->data['href']);
    }

    public function test_user_can_mark_notification_as_read_and_mark_all(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $notif1 = Notification::create([
            'user_id' => $user->id,
            'type' => 'forum_reply',
            'title' => 'Notif 1',
            'body' => 'Body 1',
            'data' => ['href' => '/forum/slug-1'],
        ]);

        $notif2 = Notification::create([
            'user_id' => $user->id,
            'type' => 'forum_reply',
            'title' => 'Notif 2',
            'body' => 'Body 2',
            'data' => ['href' => '/forum/slug-2'],
        ]);

        // Mark single as read
        $res = $this->postJson("/api/v1/notifications/{$notif1->id}/read");
        $res->assertOk();
        $this->assertNotNull($notif1->fresh()->read_at);
        $this->assertNull($notif2->fresh()->read_at);

        // Mark all as read
        $resAll = $this->postJson('/api/v1/notifications/read-all');
        $resAll->assertOk();
        $this->assertNotNull($notif2->fresh()->read_at);
    }
}
