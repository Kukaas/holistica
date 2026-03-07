<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

class ProtocolController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string'
        ]);

        $protocol = Protocol::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'tags' => $validated['tags'] ?? [],
            'author_id' => $request->user()->id,
            'status' => 'published',
            'avg_rating' => 0.0,
            'discussion_count' => 0,
            'ups' => 0,
            'downs' => 0,
        ]);

        return response()->json($protocol, 201);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. If search is requested, use Typesense
        if ($request->has('search') && !empty($request->search)) {
            $service = app(\App\Services\TypesenseService::class);

            $params = [
                'per_page' => 10,
                'page' => $request->get('page', 1)
            ];

            // Sorting mapping for Typesense
            $sort = $request->get('sort', 'recent');
            if ($sort === 'rating') {
                $params['sort_by'] = 'avg_rating:desc';
            }
            elseif ($sort === 'reviews') {
                $params['sort_by'] = 'discussion_count:desc';
            }
            elseif ($sort === 'upvoted') {
                $params['sort_by'] = 'ups:desc';
            }
            else {
                $params['sort_by'] = 'created_at:desc';
            }

            try {
                $results = $service->searchProtocols($request->search, $params);
                $ids = collect($results['hits'])->pluck('document.id');

                if ($ids->isNotEmpty()) {
                    // Quote the IDs for the SQL FIELD function to handle UUIDs
                    $quotedIds = $ids->map(fn($id) => "'$id'")->implode(',');

                    $paginator = Protocol::with('author')
                        ->withCount(['threads', 'reviews'])
                        ->whereIn('id', $ids)
                        ->orderByRaw("FIELD(id, $quotedIds)")
                        ->paginate(10);

                    return $this->appendUserVotes($paginator, auth()->id());
                }

                // If Typesense returns no hits, return empty pagination instead of fall-through to all
                return Protocol::whereRaw('1 = 0')->paginate(10);
            }
            catch (\Exception $e) {
                // Fallback to SQL search if Typesense fails or is unavailable
                \Illuminate\Support\Facades\Log::error('Typesense Search Fail: ' . $e->getMessage());

                $query = Protocol::query()->with('author')
                    ->withCount(['threads', 'reviews'])
                    ->where('title', 'LIKE', "%{$request->search}%")
                    ->orWhere('tags', 'LIKE', "%{$request->search}%");

                $paginator = $this->applySorting($query, $request->get('sort'))->paginate(10);
                return $this->appendUserVotes($paginator, auth()->id());
            }
        }

        // 2. Default SQL Logic (Fallback or browse mode)
        $query = Protocol::query()->with('author')->withCount(['threads', 'reviews']);
        $query = $this->applySorting($query, $request->get('sort'));

        $paginator = $query->paginate(10);
        return $this->appendUserVotes($paginator, auth('sanctum')->id());
    }

    /**
     * Helper to apply consistent sorting across SQL queries.
     */
    private function applySorting($query, $sort)
    {
        switch ($sort) {
            case 'reviews':
                return $query->orderBy('discussion_count', 'desc');
            case 'rating':
                return $query->orderBy('avg_rating', 'desc');
            case 'upvoted':
                return $query->orderBy('ups', 'desc');
            case 'recent':
            default:
                return $query->latest();
        }
    }

    /**
     * Batch-append user_vote to each item in a paginator.
     * One extra query for all IDs instead of N+1.
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
            ->where('votable_type', Protocol::class)
            ->whereIn('votable_id', $ids)
            ->pluck('value', 'votable_id');

        $paginator->getCollection()->transform(function ($item) use ($votes) {
            $item->user_vote = $votes->get($item->id);
            return $item;
        });

        return $paginator;
    }

    public function show(Protocol $protocol)
    {
        $protocol->loadCount(['threads', 'reviews'])->load('author');
        $userId = auth('sanctum')->id();
        $protocol->user_vote = $userId
            ?Vote::where('user_id', $userId)
            ->where('votable_type', Protocol::class)
            ->where('votable_id', $protocol->id)
            ->value('value')
            : null;
        return $protocol;
    }

    public function threads(Protocol $protocol)
    {
        $paginator = $protocol->threads()->with('user')->withCount('comments')->latest()->paginate(5);
        $userId = auth('sanctum')->id();

        if (!$userId) {
            $paginator->getCollection()->transform(function ($item) {
                $item->user_vote = null;
                return $item;
            });
            return $paginator;
        }

        $ids = $paginator->pluck('id');
        $votes = Vote::where('user_id', $userId)
            ->where('votable_type', \App\Models\Thread::class)
            ->whereIn('votable_id', $ids)
            ->pluck('value', 'votable_id');

        $paginator->getCollection()->transform(function ($item) use ($votes) {
            $item->user_vote = $votes->get($item->id);
            return $item;
        });

        return $paginator;
    }

    public function reviews(Protocol $protocol)
    {
        return $protocol->reviews()->with('user')->latest()->paginate(5);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Protocol $protocol)
    {
        if ($request->user()->id !== $protocol->author_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string'
        ]);

        $protocol->update($validated);

        return response()->json($protocol);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Protocol $protocol)
    {
        if ($request->user()->id !== $protocol->author_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cascade soft delete: Threads -> Comments -> Votes
        $protocol->threads()->each(function ($thread) {
            $thread->comments()->each(function ($comment) {
                    $comment->votes()->delete();
                    $comment->delete();
                }
                );
                $thread->delete();
            });

        $protocol->reviews()->each(function ($review) {
            $review->votes()->delete();
            $review->delete();
        });

        $protocol->delete();

        return response()->json(['message' => 'Protocol deleted. You can undo this action within 10 seconds.']);
    }

    /**
     * Restore the specified resource.
     */
    public function restore(Request $request, $id)
    {
        $protocol = Protocol::onlyTrashed()->findOrFail($id);

        if ($request->user()->id !== $protocol->author_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $protocol->restore();

        // Restore descendants
        $protocol->threads()->onlyTrashed()->each(function ($thread) {
            $thread->comments()->onlyTrashed()->each(function ($comment) {
                    $comment->votes()->onlyTrashed()->restore();
                    $comment->restore();
                }
                );
                $thread->restore();
            });

        $protocol->reviews()->onlyTrashed()->each(function ($review) {
            $review->votes()->onlyTrashed()->restore();
            $review->restore();
        });

        return response()->json(['message' => 'Protocol restored successully.']);
    }
}
