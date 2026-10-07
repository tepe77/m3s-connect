<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentationController extends Controller
{
    /**
     * Display a listing of public documentations & photo galleries.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Documentation::query()
            ->where('status', 'published');

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $query->orderBy('is_featured', 'desc')
            ->orderBy('event_date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('limit')) {
            $limit = min((int) $request->limit, 50);
            $documentations = $query->take($limit)->get();
        } else {
            $documentations = $query->paginate($request->integer('per_page', 12));
        }

        return response()->json([
            'status' => 'success',
            'data' => $documentations,
        ]);
    }

    /**
     * Display the specified documentation item by slug or ID.
     */
    public function show(string $slug): JsonResponse
    {
        $doc = Documentation::where(function ($q) use ($slug) {
            $q->where('slug', $slug)
                ->orWhere('id', $slug);
        })
        ->where('status', 'published')
        ->first();

        if (! $doc) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dokumentasi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $doc,
        ]);
    }
}
