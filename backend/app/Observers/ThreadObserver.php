<?php

namespace App\Observers;

use App\Models\Thread;

class ThreadObserver
{
    /**
     * Handle the Thread "created" event.
     */
    public function created(Thread $thread): void
    {
        app(\App\Services\TypesenseService::class)->indexThread($thread);
    }

    /**
     * Handle the Thread "updated" event.
     */
    public function updated(Thread $thread): void
    {
        app(\App\Services\TypesenseService::class)->indexThread($thread);
    }

    /**
     * Handle the Thread "deleted" event.
     */
    public function deleted(Thread $thread): void
    {
        app(\App\Services\TypesenseService::class)->deleteThread($thread->id);
    }

    /**
     * Handle the Thread "restored" event.
     */
    public function restored(Thread $thread): void
    {
    //
    }

    /**
     * Handle the Thread "force deleted" event.
     */
    public function forceDeleted(Thread $thread): void
    {
    //
    }
}
