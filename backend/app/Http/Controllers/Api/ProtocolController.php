<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use Illuminate\Http\Request;

class ProtocolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Protocol::query()->with('author');

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sort = $request->get('sort', 'recent');
        switch ($sort) {
            case 'reviews':
                $query->orderBy('discussion_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('avg_rating', 'desc');
                break;
            case 'recent':
            default:
                $query->latest();
                break;
        }

        return $query->paginate(10);
    }

    public function show(Protocol $protocol)
    {
        return $protocol->load(['author', 'threads.user', 'reviews.user']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Protocol $protocol)
    {
    //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Protocol $protocol)
    {
    //
    }
}
