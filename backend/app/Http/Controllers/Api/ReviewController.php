<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
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
            'protocol_id' => 'required|exists:protocols,id',
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $review = Review::create($validated);

        // Update protocol's avg_rating and review count
        $protocol = $review->protocol;
        $protocol->avg_rating = $protocol->reviews()->avg('rating');
        $protocol->discussion_count = $protocol->threads()->count() + $protocol->reviews()->count();
        $protocol->save();

        // Sync to Typesense
        app(\App\Services\TypesenseService::class)->indexProtocol($protocol);

        return response()->json($review, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
    //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
    //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
    //
    }
}
