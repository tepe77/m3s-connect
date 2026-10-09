<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    /**
     * Store a new contact message sent by user or alumni with anti-spam protections.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Honeypot Bot Trap: Bot fills in invisible decoy inputs
        if ($request->filled('_hp_website') || $request->filled('website') || $request->filled('hp_fax')) {
            // Return fake success response so bot script concludes without attempting alternative vectors
            return response()->json([
                'status' => 'success',
                'message' => 'Pesan Anda telah berhasil dikirim ke Sekretariat IKAMAYOGA.',
                'data' => [
                    'id' => (string) Str::uuid(),
                    'created_at' => now()->toIso8601String(),
                ],
            ], 200);
        }

        // 2. Time-trap Check: Human takes at least ~2.5 seconds to fill and submit
        $formTime = $request->input('_form_time');
        if ($formTime && is_numeric($formTime)) {
            $durationMs = (now()->getTimestampMs()) - (float) $formTime;
            if ($durationMs > 0 && $durationMs < 2500) {
                // Submitted inhumanly fast; silent drop with fake success
                return response()->json([
                    'status' => 'success',
                    'message' => 'Pesan Anda telah berhasil dikirim ke Sekretariat IKAMAYOGA.',
                    'data' => [
                        'id' => (string) Str::uuid(),
                        'created_at' => now()->toIso8601String(),
                    ],
                ], 200);
            }
        }

        // 3. Request Validation
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'graduation_year' => ['nullable', 'string', 'max:20'],
            'category' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'min:3', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        $messageContent = $validated['message'];
        $subjectContent = $validated['subject'];
        $combinedText = $subjectContent . ' ' . $messageContent;

        // 4. Heuristic Content Analysis (Spam detection)
        $isSpam = false;
        $spamReason = null;

        // Check for link count flood (> 2 URLs in body)
        $urlMatches = preg_match_all('#https?://#i', $messageContent);
        if ($urlMatches > 2) {
            $isSpam = true;
            $spamReason = 'Mengandung lebih dari 2 tautan URL eksternal';
        }

        // Check for Cyrillic spam characters on an Indonesian high school portal
        if (!$isSpam && preg_match('/[\x{0400}-\x{04FF}]/u', $combinedText)) {
            $isSpam = true;
            $spamReason = 'Terdeteksi karakter Cyrillic (spam bot internasional)';
        }

        // Check for common gambling, casino, illegal slot keywords
        if (!$isSpam && preg_match('/(slot\s*gacor|judi\s*online|slot\s*online|casino|poker88|sbobet|crypto\s*giveaway|whatsapp\s*hack)/i', $combinedText)) {
            $isSpam = true;
            $spamReason = 'Terdeteksi kata kunci terlarang (judi/slot/crypto)';
        }

        $user = $request->user();

        $message = ContactMessage::create([
            'user_id' => $user?->id,
            'name' => strip_tags($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ? strip_tags($validated['phone']) : null,
            'graduation_year' => $validated['graduation_year'] ? strip_tags($validated['graduation_year']) : null,
            'category' => $validated['category'] ?? 'umum',
            'subject' => strip_tags($validated['subject']),
            'message' => strip_tags($validated['message']),
            'status' => $isSpam ? 'spam' : 'unread',
            'admin_notes' => $isSpam ? "Otomatis ditandai spam: {$spamReason}" : null,
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
