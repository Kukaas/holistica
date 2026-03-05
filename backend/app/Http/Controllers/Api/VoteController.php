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
            'value' => 'required|in:1,-1,0',
        ]);

        $userId = auth()->id();
        $votableId = $validated['votable_id'];
        $votableType = $validated['votable_type'];
        $newValue = (int)$validated['value'];

        // Enforce one vote per user per item
        $existingVote = Vote::where('user_id', $userId)
            ->where('votable_id', $votableId)
            ->where('votable_type', $votableType)
            ->first();

        $model = $votableType::find($votableId);
        if (!$model) {
            return response()->json(['message' => 'Target not found.'], 404);
        }

        if ($existingVote) {
            $oldValue = $existingVote->value;

            // Handle toggle off (deletion)
            if ($newValue === 0) {
                // Revert old vote in counters
                if ($oldValue == 1)
                    $model->decrement('ups');
                if ($oldValue == -1)
                    $model->decrement('downs');
                $existingVote->forceDelete();
                return response()->json(['message' => 'Vote removed.'], 200);
            }

            // Handle switching vote
            if ($oldValue != $newValue) {
                // Revert old
                if ($oldValue == 1)
                    $model->decrement('ups');
                if ($oldValue == -1)
                    $model->decrement('downs');

                // Apply new
                if ($newValue == 1)
                    $model->increment('ups');
                if ($newValue == -1)
                    $model->increment('downs');

                $existingVote->update(['value' => $newValue]);
                return response()->json($existingVote, 200);
            }

            // Same value? Just return it
            return response()->json($existingVote, 200);
        }

        // Handle new vote (but only if not 0)
        if ($newValue === 0) {
            return response()->json(['message' => 'No existing vote to remove.'], 400);
        }

        $vote = Vote::create([
            'user_id' => $userId,
            'votable_id' => $votableId,
            'votable_type' => $votableType,
            'value' => $newValue
        ]);

        if ($newValue == 1)
            $model->increment('ups');
        if ($newValue == -1)
            $model->increment('downs');

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
