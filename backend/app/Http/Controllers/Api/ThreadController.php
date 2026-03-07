<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Thread;
use App\Models\Vote;
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

        $paginator = $query->latest()->paginate(15);
        return $this->appendUserVotes($paginator, auth('sanctum')->id());
    }

    public function show(Thread $thread)
    {
        $thread->loadCount('comments')->load(['user', 'protocol']);
        $userId = auth('sanctum')->id();
        $thread->user_vote = $userId
            ?Vote::where('user_id', $userId)
            ->where('votable_type', Thread::class)
            ->where('votable_id', $thread->id)
            ->value('value')
            : null;
        return $thread;
    }

    public function comments(Thread $thread)
    {
        $userId = auth('sanctum')->id();

        // Paginate root comments only, eagerly loading replies
        $paginator = $thread->comments()
            ->whereNull('parent_id')
            ->with(['user', 'votes', 'replies.user', 'replies.votes'])
            ->latest()
            ->paginate(10);

        // Append user_vote to each comment and its replies using the already-loaded votes
        $paginator->getCollection()->transform(function ($comment) use ($userId) {
            $comment->user_vote = $userId
                ? optional($comment->votes->firstWhere('user_id', $userId))->value
                : null;

            if ($comment->relationLoaded('replies')) {
                $comment->replies->transform(function ($reply) use ($userId) {
                            $reply->user_vote = $userId
                                ? optional($reply->votes->firstWhere('user_id', $userId))->value
                                : null;
                            return $reply;
                        }
                        );
                    }

                    return $comment;
                });

        return $paginator;
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
    /**
     * Batch-append user_vote to each thread in a paginator.
     */
    private function appendUserVotes($paginator, $userId)
    {
        if (!$userId) {
            $paginator->getCollection()->transform(function ($item) {
                $item->user_vote = null;
                return $item;
            });
            return $paginator;
        }

        $ids = $paginator->pluck('id');
        $votes = Vote::where('user_id', $userId)
            ->where('votable_type', Thread::class)
            ->whereIn('votable_id', $ids)
            ->pluck('value', 'votable_id');

        $paginator->getCollection()->transform(function ($item) use ($votes) {
            $item->user_vote = $votes->get($item->id);
            return $item;
        });

        return $paginator;
    }
}
