<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TypesenseReindex extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'typesense:reindex';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $service = app(\App\Services\TypesenseService::class);
        $this->info('Creating collections...');
        $service->createCollections();

        $this->info('Indexing protocols...');
        \App\Models\Protocol::all()->each(function ($protocol) use ($service) {
            $service->indexProtocol($protocol);
        });

        $this->info('Indexing threads...');
        \App\Models\Thread::all()->each(function ($thread) use ($service) {
            $service->indexThread($thread);
        });

        $this->info('Reindexing complete!');
    }
}
