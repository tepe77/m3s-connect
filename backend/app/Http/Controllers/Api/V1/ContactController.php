<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Store a new contact message sent by user or alumni.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'graduation_year' => ['nullable', 'string', 'max:20'],
            'category' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'min:3', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        $user = $request->user();

        $message = ContactMessage::create([
            'user_id' => $user?->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'graduation_year' => $validated['graduation_year'] ?? null,
            'category' => $validated['category'] ?? 'umum',
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'unread',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pesan Anda telah berhasil dikirim ke Sekretariat IKAMAYOGA.',
            'data' => [
                'id' => $message->id,
                'created_at' => $message->created_at,
            ],
        ], 201);
    }

    /**
     * Display a paginated listing of contact messages for administrators.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query()->with('user:id,name,email');

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        $messages = $query->latest()->paginate($request->integer('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $messages,
        ]);
    }
}
