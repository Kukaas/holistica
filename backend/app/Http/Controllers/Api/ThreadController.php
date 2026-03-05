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
        $query = Thread::query()->with(['user', 'protocol'])->withCount('comments');

        if ($request->has('protocol_id')) {
            $query->where('protocol_id', $request->protocol_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
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
        ]);

        // Mock current user ID for assessment purposes if not authenticated
        $userId = auth()->id();

        $thread = Thread::create([
            'protocol_id' => $validated['protocol_id'],
            'title' => $validated['title'],
            'user_id' => $userId,
            'status' => 'open',
        ]);

        // Update protocol's discussion_count
        $protocol = $thread->protocol;
        $protocol->discussion_count = $protocol->threads()->count() + $protocol->reviews()->count();
        $protocol->save();

        // Sync to Typesense
        app(\App\Services\TypesenseService::class)->indexThread($thread);

        return response()->json($thread->load('user'), 201);
    }

    public function update(Request $request, Thread $thread)
    {
        if (auth()->id() !== $thread->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $thread->update($validated);

        app(\App\Services\TypesenseService::class)->indexThread($thread);

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
