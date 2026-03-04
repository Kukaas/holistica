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
