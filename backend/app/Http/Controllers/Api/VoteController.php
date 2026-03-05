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
            'user_id' => 'required|exists:users,id',
            'votable_id' => 'required|string',
            'votable_type' => 'required|string',
            'value' => 'required|in:1,-1',
        ]);

        // Enforce one vote per user per item
        $existingVote = Vote::where('user_id', $validated['user_id'])
            ->where('votable_id', $validated['votable_id'])
            ->where('votable_type', $validated['votable_type'])
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You have already voted on this item.'], 422);
        }

        $vote = Vote::create($validated);

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
