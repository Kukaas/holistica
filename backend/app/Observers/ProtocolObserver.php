<?php

namespace App\Observers;

use App\Models\Protocol;

class ProtocolObserver
{
    /**
     * Handle the Protocol "created" event.
     */
    public function created(Protocol $protocol): void
    {
        app(\App\Services\TypesenseService::class)->indexProtocol($protocol);
    }

    /**
     * Handle the Protocol "updated" event.
     */
    public function updated(Protocol $protocol): void
    {
        app(\App\Services\TypesenseService::class)->indexProtocol($protocol);
    }

    /**
     * Handle the Protocol "deleted" event.
     */
    public function deleted(Protocol $protocol): void
    {
        app(\App\Services\TypesenseService::class)->deleteProtocol($protocol->id);
    }

    /**
     * Handle the Protocol "restored" event.
     */
    public function restored(Protocol $protocol): void
    {
    //
    }

    /**
     * Handle the Protocol "force deleted" event.
     */
    public function forceDeleted(Protocol $protocol): void
    {
    //
    }
}
