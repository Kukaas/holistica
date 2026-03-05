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
            else {
                $params['sort_by'] = 'created_at:desc';
            }

            try {
                $results = $service->searchProtocols($request->search, $params);
                $ids = collect($results['hits'])->pluck('document.id');

                // Return Eloquent models based on Typesense IDs to keep author relations etc.
                return Protocol::with('author')
                    ->whereIn('id', $ids)
                    ->orderByRaw("FIELD(id, " . $ids->implode(',') . ")")
                    ->paginate(10);
            }
            catch (\Exception $e) {
                // Fallback to SQL search if Typesense fails
                \Log::error('Typesense Search Fail: ' . $e->getMessage());
            }
        }

        // 2. Default SQL Logic (Fallback or browse mode)
        $query = Protocol::query()->with('author');

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
