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
        $query = Thread::query()->with(['user', 'protocol']);

        if ($request->has('protocol_id')) {
            $query->where('protocol_id', $request->protocol_id);
        }

        return $query->paginate(15);
    }

    public function show(Thread $thread)
    {
        return $thread->load(['user', 'protocol', 'comments.user', 'comments.votes']);
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Thread $thread)
    {
    //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
    //
    }
}
