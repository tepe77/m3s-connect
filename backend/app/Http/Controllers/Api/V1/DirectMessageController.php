<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AlumniProfile;
use App\Models\DirectMessage;
use App\Models\DirectMessageThread;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DirectMessageController extends Controller
{
    /**
     * Get all message threads for authenticated user.
     */
    public function threads(Request $request): JsonResponse
    {
        $user = $request->user();

        $threads = DirectMessageThread::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne.profile', 'userTwo.profile'])
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($thread) use ($user) {
                $otherUser = $thread->getOtherParticipant($user->id);
                $unread = $thread->getUnreadCountFor($user->id);

                return [
                    'id' => $thread->id,
                    'subject' => $thread->subject,
                    'last_message' => $thread->last_message_content,
                    'last_message_at' => $thread->last_message_at?->toISOString(),
                    'unread_count' => $unread,
                    'participant' => [
                        'id' => $otherUser?->id,
                        'name' => $otherUser?->name ?? 'Pengguna Alumni',
                        'avatar' => $otherUser?->avatar,
                        'graduation_year' => $otherUser?->profile?->graduation_year,
                        'graduation_class' => $otherUser?->profile?->graduation_class,
                        'occupation' => $otherUser?->profile?->occupation,
                        'company' => $otherUser?->profile?->company,
                    ],
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $threads,
        ]);
    }

    /**
     * Get single thread conversation and mark as read.
     */
    public function showThread(string $id, Request $request): JsonResponse
    {
        $user = $request->user();

        if (!Str::isUuid($id)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Percakapan tidak ditemukan.',
            ], 404);
        }

        $thread = DirectMessageThread::with([
            'userOne.profile',
            'userTwo.profile',
            'messages.sender',
        ])
        ->where('id', $id)
        ->where(function ($q) use ($user) {
            $q->where('user_one_id', $user->id)
              ->orWhere('user_two_id', $user->id);
        })
        ->first();

        if (!$thread) {
            return response()->json([
                'status' => 'error',
                'message' => 'Percakapan tidak ditemukan.',
            ], 404);
        }

        // Mark unread messages as read
        DirectMessage::where('thread_id', $thread->id)
            ->where('recipient_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        // Reset unread count for current user
        if ($thread->user_one_id === $user->id) {
            $thread->update(['user_one_unread' => 0]);
        } else {
            $thread->update(['user_two_unread' => 0]);
        }

        $otherUser = $thread->getOtherParticipant($user->id);

        $messages = $thread->messages->map(function ($msg) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender?->name ?? 'Alumni',
                'sender_avatar' => $msg->sender?->avatar,
                'content' => $msg->content,
                'is_read' => $msg->is_read,
                'created_at' => $msg->created_at->toISOString(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $thread->id,
                'subject' => $thread->subject,
                'participant' => [
                    'id' => $otherUser?->id,
                    'name' => $otherUser?->name,
                    'avatar' => $otherUser?->avatar,
                    'graduation_year' => $otherUser?->profile?->graduation_year,
                    'graduation_class' => $otherUser?->profile?->graduation_class,
                    'occupation' => $otherUser?->profile?->occupation,
                    'company' => $otherUser?->profile?->company,
                ],
                'messages' => $messages,
            ],
        ]);
    }

    /**
     * Send new direct message (creates thread or reuses existing).
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'recipient_id' => 'required|string',
            'subject' => 'nullable|string|max:200',
            'content' => 'required|string|max:5000',
        ]);

        $recipientParam = $validated['recipient_id'];
        $recipientUser = null;

        if (Str::isUuid($recipientParam)) {
            $recipientUser = User::find($recipientParam);
            if (!$recipientUser) {
                $alumniProf = AlumniProfile::find($recipientParam);
                if ($alumniProf) {
                    $recipientUser = $alumniProf->user;
                }
            }
        } elseif (preg_match('/^alumni-(\d+)$/', $recipientParam, $matches)) {
            $offset = max(0, ((int) $matches[1]) - 1);
            $alumniProf = AlumniProfile::orderBy('created_at', 'asc')->skip($offset)->first();
            if ($alumniProf) {
                $recipientUser = $alumniProf->user;
            }
        } else {
            $alumniProf = AlumniProfile::where('alumni_identifier', $recipientParam)->first();
            if ($alumniProf) {
                $recipientUser = $alumniProf->user;
            }
        }

        if (!$recipientUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengguna penerima pesan tidak ditemukan.',
            ], 404);
        }

        $recipientId = $recipientUser->id;

        if ($recipientId === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak dapat mengirim pesan kepada diri sendiri.',
            ], 422);
        }

        // Check if thread already exists between these two users
        $thread = DirectMessageThread::where(function ($q) use ($user, $recipientId) {
            $q->where('user_one_id', $user->id)->where('user_two_id', $recipientId);
        })->orWhere(function ($q) use ($user, $recipientId) {
            $q->where('user_one_id', $recipientId)->where('user_two_id', $user->id);
        })->first();

        $subject = !empty($validated['subject']) ? trim($validated['subject']) : 'Pesan Alumni';

        if (!$thread) {
            $thread = DirectMessageThread::create([
                'user_one_id' => $user->id,
                'user_two_id' => $recipientId,
                'subject' => $subject,
                'last_message_content' => $validated['content'],
                'last_message_at' => now(),
                'user_two_unread' => 1,
            ]);
        } else {
            // Update thread metadata
            $isRecipientOne = ($thread->user_one_id === $recipientId);
            $thread->update([
                'subject' => !empty($validated['subject']) ? $subject : $thread->subject,
                'last_message_content' => $validated['content'],
                'last_message_at' => now(),
                'user_one_unread' => $isRecipientOne ? ($thread->user_one_unread + 1) : $thread->user_one_unread,
                'user_two_unread' => !$isRecipientOne ? ($thread->user_two_unread + 1) : $thread->user_two_unread,
            ]);
        }

        $message = DirectMessage::create([
            'thread_id' => $thread->id,
            'sender_id' => $user->id,
            'recipient_id' => $recipientId,
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pesan berhasil dikirim.',
            'data' => [
                'thread_id' => $thread->id,
                'message' => [
                    'id' => $message->id,
                    'content' => $message->content,
                    'created_at' => $message->created_at->toISOString(),
                ],
            ],
        ], 201);
    }

    /**
     * Reply to an existing thread.
     */
    public function replyThread(string $threadId, Request $request): JsonResponse
    {
        $user = $request->user();

        if (!Str::isUuid($threadId)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Percakapan tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $thread = DirectMessageThread::where('id', $threadId)
            ->where(function ($q) use ($user) {
                $q->where('user_one_id', $user->id)
                  ->orWhere('user_two_id', $user->id);
            })
            ->first();

        if (!$thread) {
            return response()->json([
                'status' => 'error',
                'message' => 'Percakapan tidak ditemukan.',
            ], 404);
        }

        $recipientId = ($thread->user_one_id === $user->id) ? $thread->user_two_id : $thread->user_one_id;
        $isRecipientOne = ($thread->user_one_id === $recipientId);

        $message = DirectMessage::create([
            'thread_id' => $thread->id,
            'sender_id' => $user->id,
            'recipient_id' => $recipientId,
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        $thread->update([
            'last_message_content' => $validated['content'],
            'last_message_at' => now(),
            'user_one_unread' => $isRecipientOne ? ($thread->user_one_unread + 1) : $thread->user_one_unread,
            'user_two_unread' => !$isRecipientOne ? ($thread->user_two_unread + 1) : $thread->user_two_unread,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dikirim.',
            'data' => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'sender_name' => $user->name,
                'sender_avatar' => $user->avatar,
                'content' => $message->content,
                'is_read' => false,
                'created_at' => $message->created_at->toISOString(),
            ],
        ]);
    }

    /**
     * Mark entire thread as read for current user.
     */
    public function markAsRead(string $threadId, Request $request): JsonResponse
    {
        $user = $request->user();

        if (!Str::isUuid($threadId)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pesan lokal telah ditandai dibaca.',
            ]);
        }

        $thread = DirectMessageThread::where('id', $threadId)
            ->where(function ($q) use ($user) {
                $q->where('user_one_id', $user->id)
                  ->orWhere('user_two_id', $user->id);
            })
            ->first();

        if ($thread) {
            DirectMessage::where('thread_id', $thread->id)
                ->where('recipient_id', $user->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            if ($thread->user_one_id === $user->id) {
                $thread->update(['user_one_unread' => 0]);
            } else {
                $thread->update(['user_two_unread' => 0]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pesan telah ditandai dibaca.',
        ]);
    }

    /**
     * Get total unread count for current user.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $unreadCount = DirectMessage::where('recipient_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'unread_count' => $unreadCount,
            ],
        ]);
    }
}
