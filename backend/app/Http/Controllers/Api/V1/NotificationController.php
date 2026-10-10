<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get()
            ->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'type' => $notif->type,
                    'title' => $notif->title,
                    'body' => $notif->body,
                    'data' => $notif->data ?? [],
                    'href' => $notif->data['href'] ?? ($notif->type === 'direct_message' ? '/messages' : '/forum'),
                    'is_read' => !is_null($notif->read_at),
                    'read_at' => $notif->read_at?->toISOString(),
                    'created_at' => $notif->created_at->toISOString(),
                ];
            });

        $unreadCount = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ],
        ]);
    }

    /**
     * Mark single notification as read.
     */
    public function markAsRead(string $id, Request $request): JsonResponse
    {
        $user = $request->user();

        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notifikasi tidak ditemukan.',
            ], 404);
        }

        $notification->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai telah dibaca.',
            'data' => [
                'id' => $notification->id,
                'read_at' => $notification->read_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Mark all notifications as read for current user.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Semua notifikasi ditandai telah dibaca.',
        ]);
    }
}
