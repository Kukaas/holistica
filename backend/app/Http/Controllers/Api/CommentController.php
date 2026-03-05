<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
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
            'thread_id' => 'required|exists:threads,id',
            'content' => 'required|string|min:3',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = Comment::create(array_merge($validated, [
            'user_id' => auth()->id()
        ]));

        // Re-index the thread to reflect new comment count
        $thread = \App\Models\Thread::find($validated['thread_id']);
        if ($thread) {
            app(\App\Services\TypesenseService::class)->indexThread($thread);
        }

        return response()->json($comment->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
    //
    }

    public function update(Request $request, Comment $comment)
    {
        if (auth()->id() !== $comment->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:3',
        ]);

        $comment->update($validated);

        $thread = \App\Models\Thread::find($comment->thread_id);
        if ($thread) {
            app(\App\Services\TypesenseService::class)->indexThread($thread);
        }

        return response()->json($comment->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        if (auth()->id() !== $comment->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $threadId = $comment->thread_id;
        $comment->delete();

        $thread = \App\Models\Thread::find($threadId);
        if ($thread) {
            app(\App\Services\TypesenseService::class)->indexThread($thread);
        }

        return response()->json(['message' => 'Comment deleted']);
    }
}
