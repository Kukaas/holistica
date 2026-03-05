<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'votable_id' => 'required|string',
            'votable_type' => 'required|string',
            'value' => 'required|in:1,-1',
        ]);

        $userId = auth()->id();

        // Enforce one vote per user per item
        $existingVote = Vote::where('user_id', $userId)
            ->where('votable_id', $validated['votable_id'])
            ->where('votable_type', $validated['votable_type'])
            ->first();

        if ($existingVote) {
            // If different value, update. If same, maybe delete (unsure of desired toggle behavior, but user said "only once")
            // For now, let's stick to the "already voted" message as per existing code
            return response()->json(['message' => 'You have already voted on this item.'], 422);
        }

        $vote = Vote::create(array_merge($validated, ['user_id' => $userId]));

        // Update the target model's counters
        $model = $validated['votable_type']::find($validated['votable_id']);
        if ($model) {
            if ($validated['value'] == 1) {
                $model->increment('ups');
            }
            else {
                $model->increment('downs');
            }
        }

        return response()->json($vote, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vote $vote)
    {
    //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vote $vote)
    {
    //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vote $vote)
    {
    //
    }
}
