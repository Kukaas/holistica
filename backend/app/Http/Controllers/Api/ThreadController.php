<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Thread;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. If search is requested, use Typesense
        if ($request->filled('search')) {
            $service = app(\App\Services\TypesenseService::class);
            $params = [
                'per_page' => 10,
                'page' => $request->get('page', 1),
                'sort_by' => 'created_at:desc'
            ];

            if ($request->has('protocol_id')) {
                $params['filter_by'] = "protocol_id:={$request->protocol_id}";
            }

            try {
                $results = $service->searchThreads($request->search, $params);
                $ids = collect($results['hits'])->pluck('document.id');

                if ($ids->isNotEmpty()) {
                    $quotedIds = $ids->map(fn($id) => "'$id'")->implode(',');
                    return Thread::with(['user', 'protocol'])
                        ->withCount('comments')
                        ->whereIn('id', $ids)
                        ->orderByRaw("FIELD(id, $quotedIds)")
                        ->paginate(10);
                }
                return Thread::whereRaw('1 = 0')->paginate(10);
            }
            catch (\Exception $e) {
                \Log::error('Thread Typesense Search Fail: ' . $e->getMessage());
            // Fallback to SQL below
            }
        }

        // 2. Default SQL Logic
        $query = Thread::query()->with(['user', 'protocol'])->withCount('comments');

        if ($request->has('protocol_id')) {
            $query->where('protocol_id', $request->protocol_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate(15);
    }

    public function show(Thread $thread)
    {
        return $thread->loadCount('comments')->load(['user', 'protocol']);
    }

    public function comments(Thread $thread)
    {
        // Paginate root comments only, eagerly loading replies
        return $thread->comments()
            ->whereNull('parent_id')
            ->with(['user', 'votes', 'replies.user', 'replies.votes'])
            ->latest()
            ->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'protocol_id' => 'required|exists:protocols,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string'
        ]);

        $thread = Thread::create([
            'protocol_id' => $validated['protocol_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'tags' => $validated['tags'] ?? [],
            'user_id' => auth()->id(),
            'status' => 'open',
        ]);

        // Update protocol's discussion_count
        $protocol = $thread->protocol;
        $protocol->discussion_count = $protocol->threads()->count() + $protocol->reviews()->count();
        $protocol->save();

        return response()->json($thread->load('user'), 201);
    }

    public function update(Request $request, Thread $thread)
    {
        if (auth()->id() !== $thread->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $thread->update($validated);

        return response()->json($thread->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        if (auth()->id() !== $thread->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $protocol = $thread->protocol;
        $thread->delete();

        if ($protocol) {
            $protocol->discussion_count = $protocol->threads()->count() + $protocol->reviews()->count();
            $protocol->save();
        }

        return response()->json(['message' => 'Thread deleted']);
    }
}
