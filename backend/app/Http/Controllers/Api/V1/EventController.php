<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\EventStatus;
use App\Enums\RsvpStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventRsvp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of public events & agenda.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::query()
            ->with(['category', 'creator:id,name'])
            ->withCount(['rsvps' => function ($q) {
                $q->where('status', RsvpStatus::REGISTERED);
            }])
            ->whereIn('status', [EventStatus::PUBLISHED, EventStatus::COMPLETED]);

        // Filter by Tab: upcoming (default), past, or all
        $tab = $request->input('tab', 'upcoming');
        $now = now();

        if ($tab === 'upcoming') {
            $query->where(function ($q) use ($now) {
                $q->where('end_at', '>=', $now)
                    ->orWhere(function ($sub) use ($now) {
                        $sub->whereNull('end_at')
                            ->where('start_at', '>=', $now->copy()->subHours(6));
                    });
            })->orderBy('start_at', 'asc');
        } elseif ($tab === 'past') {
            $query->where(function ($q) use ($now) {
                $q->where('end_at', '<', $now)
                    ->orWhere(function ($sub) use ($now) {
                        $sub->whereNull('end_at')
                            ->where('start_at', '<', $now->copy()->subHours(6));
                    });
            })->orderBy('start_at', 'desc');
        } else {
            // 'all'
            $query->orderBy('start_at', 'desc');
        }

        // Filter by Category
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                    ->orWhere('id', $categorySlug);
            });
        }

        // Search Keyword
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%")
                    ->orWhere('location', 'ilike', "%{$search}%");
            });
        }

        // Optional Limit for Widgets (e.g. Dashboard)
        if ($request->filled('limit')) {
            $limit = min((int) $request->limit, 50);
            $events = $query->take($limit)->get();
        } else {
            $events = $query->paginate($request->integer('per_page', 12));
        }

        // Check user RSVP status if authenticated
        $userId = Auth::guard('sanctum')->id();
        $userRsvps = [];
        if ($userId) {
            $eventIds = $events instanceof \Illuminate\Pagination\LengthAwarePaginator
                ? $events->pluck('id')->toArray()
                : $events->pluck('id')->toArray();

            $userRsvps = EventRsvp::where('user_id', $userId)
                ->whereIn('event_id', $eventIds)
                ->pluck('status', 'event_id')
                ->toArray();
        }

        // Append computed fields to data collection
        $items = $events instanceof \Illuminate\Pagination\LengthAwarePaginator ? $events->getCollection() : $events;
        $items->transform(function (Event $event) use ($userRsvps) {
            $eventStatus = $event->status instanceof EventStatus ? $event->status->value : $event->status;
            $isPast = $event->end_at ? $event->end_at->isPast() : $event->start_at->copy()->addHours(4)->isPast();
            $isOpen = ! $isPast && $eventStatus === EventStatus::PUBLISHED->value;

            if ($event->registration_end_at && $event->registration_end_at->isPast()) {
                $isOpen = false;
            }

            $userRsvp = $userRsvps[$event->id] ?? null;
            $userRsvpValue = $userRsvp instanceof RsvpStatus ? $userRsvp->value : $userRsvp;

            $event->is_past = $isPast;
            $event->is_registration_open = $isOpen;
            $event->user_rsvp_status = $userRsvpValue;
            $event->is_registered = $userRsvpValue === RsvpStatus::REGISTERED->value;

            return $event;
        });

        return response()->json([
            'status' => 'success',
            'data' => $events,
        ]);
    }

    /**
     * Display the specified event details by slug or ID.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $event = Event::query()
            ->with([
                'category',
                'creator:id,name',
                'rsvps' => function ($q) {
                    $q->where('status', RsvpStatus::REGISTERED)
                        ->with('user:id,name,role,avatar', 'user.profile:id,user_id,graduation_year,graduation_class')
                        ->orderBy('registered_at', 'asc')
                        ->take(30);
                },
            ])
            ->withCount(['rsvps' => function ($q) {
                $q->where('status', RsvpStatus::REGISTERED);
            }])
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->first();

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agenda kegiatan tidak ditemukan.',
            ], 404);
        }

        $userId = Auth::guard('sanctum')->id();
        $userRsvp = null;
        if ($userId) {
            $userRsvp = EventRsvp::where('event_id', $event->id)
                ->where('user_id', $userId)
                ->first();
        }

        $now = now();
        $isPast = $event->end_at ? $event->end_at->isPast() : $event->start_at->copy()->addHours(4)->isPast();
        $regStart = $event->registration_start_at ?? $event->created_at;
        $regEnd = $event->registration_end_at ?? $event->start_at;
        $isRegistrationOpen = ! $isPast && $now->between($regStart, $regEnd);
        $isQuotaFull = $event->max_participants && $event->rsvps_count >= $event->max_participants;

        $userRsvpStatus = $userRsvp ? ($userRsvp->status instanceof RsvpStatus ? $userRsvp->status->value : $userRsvp->status) : null;

        $responseData = $event->toArray();
        $responseData['is_past'] = $isPast;
        $responseData['is_registration_open'] = $isRegistrationOpen && ! $isQuotaFull;
        $responseData['is_quota_full'] = (bool) $isQuotaFull;
        $responseData['user_rsvp_status'] = $userRsvpStatus;
        $responseData['is_registered'] = $userRsvpStatus === RsvpStatus::REGISTERED->value;
        $responseData['registered_attendees'] = $event->rsvps->map(function ($rsvp) {
            return [
                'id' => $rsvp->id,
                'user_id' => $rsvp->user_id,
                'name' => $rsvp->user?->name ?? 'Alumni',
                'graduation_year' => $rsvp->user?->profile?->graduation_year ?? null,
                'graduation_class' => $rsvp->user?->profile?->graduation_class ?? null,
                'avatar_url' => $rsvp->user?->avatar_url ?? null,
                'registered_at' => $rsvp->registered_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $responseData,
        ]);
    }

    /**
     * Submit RSVP / Registration for the authenticated user.
     */
    public function rsvp(Request $request, string $slug): JsonResponse
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Silakan masuk (login) terlebih dahulu untuk mendaftar agenda.',
            ], 401);
        }

        $event = Event::query()
            ->withCount(['rsvps' => function ($q) {
                $q->where('status', RsvpStatus::REGISTERED);
            }])
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug)
                    ->orWhere('id', $slug);
            })
            ->first();

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agenda tidak ditemukan.',
            ], 404);
        }

        if ($event->status !== EventStatus::PUBLISHED) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agenda ini belum dipublikasikan atau sudah ditutup.',
            ], 422);
        }

        $now = now();
        $isPast = $event->end_at ? $event->end_at->isPast() : $event->start_at->copy()->addHours(4)->isPast();
        if ($isPast) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agenda ini telah selesai dilaksanakan.',
            ], 422);
        }

        if ($event->registration_end_at && $now->isAfter($event->registration_end_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Batas waktu pendaftaran untuk agenda ini telah berakhir.',
            ], 422);
        }

        if ($event->registration_start_at && $now->isBefore($event->registration_start_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pendaftaran untuk agenda ini belum dibuka.',
            ], 422);
        }

        // Check if already registered
        $existingRsvp = EventRsvp::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingRsvp && $existingRsvp->status === RsvpStatus::REGISTERED) {
            return response()->json([
                'status' => 'success',
                'message' => 'Anda telah terdaftar pada agenda ini sebelumnya.',
                'data' => [
                    'is_registered' => true,
                    'rsvp_status' => 'registered',
                ],
            ]);
        }

        // Check Quota
        if ($event->max_participants && $event->rsvps_count >= $event->max_participants) {
            return response()->json([
                'status' => 'error',
                'message' => 'Maaf, kuota peserta untuk agenda ini sudah penuh.',
            ], 422);
        }

        // Create or update RSVP
        $rsvp = EventRsvp::updateOrCreate(
            [
                'event_id' => $event->id,
                'user_id' => $user->id,
            ],
            [
                'status' => RsvpStatus::REGISTERED,
                'registered_at' => now(),
                'cancelled_at' => null,
            ]
        );

        $newCount = EventRsvp::where('event_id', $event->id)
            ->where('status', RsvpStatus::REGISTERED)
            ->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Selamat! Konfirmasi kehadiran (RSVP) Anda berhasil dicatat.',
            'data' => [
                'is_registered' => true,
                'rsvp_status' => 'registered',
                'total_rsvps' => $newCount,
            ],
        ]);
    }

    /**
     * Cancel RSVP / Registration for the authenticated user.
     */
    public function cancelRsvp(Request $request, string $slug): JsonResponse
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Silakan masuk terlebih dahulu.',
            ], 401);
        }

        $event = Event::where(function ($q) use ($slug) {
            $q->where('slug', $slug)
                ->orWhere('id', $slug);
        })->first();

        if (! $event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agenda tidak ditemukan.',
            ], 404);
        }

        $rsvp = EventRsvp::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $rsvp || $rsvp->status === RsvpStatus::CANCELLED) {
            return response()->json([
                'status' => 'success',
                'message' => 'Anda belum terdaftar pada agenda ini.',
                'data' => [
                    'is_registered' => false,
                ],
            ]);
        }

        $rsvp->update([
            'status' => RsvpStatus::CANCELLED,
            'cancelled_at' => now(),
        ]);

        $newCount = EventRsvp::where('event_id', $event->id)
            ->where('status', RsvpStatus::REGISTERED)
            ->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Pendaftaran kehadiran Anda pada agenda ini telah dibatalkan.',
            'data' => [
                'is_registered' => false,
                'rsvp_status' => 'cancelled',
                'total_rsvps' => $newCount,
            ],
        ]);
    }

    /**
     * Get list of event categories with active event count.
     */
    public function categories(): JsonResponse
    {
        $categories = EventCategory::withCount(['events' => function ($q) {
            $q->whereIn('status', [EventStatus::PUBLISHED, EventStatus::COMPLETED]);
        }])
        ->orderBy('name', 'asc')
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }
}
