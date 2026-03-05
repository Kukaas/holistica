<?php

namespace App\Services;

use Typesense\Client;
use GuzzleHttp\Client as GuzzleClient;

class TypesenseService
{
    protected Client $client;

    public function __construct()
    {
        // Force Guzzle to ignore SSL issues on Windows for development
        $guzzle = new GuzzleClient([
            'verify' => false,
            'timeout' => 10.0,
        ]);

        $this->client = new Client([
            'nodes' => [
                [
                    'host' => env('TYPESENSE_HOST'),
                    'port' => (int) env('TYPESENSE_PORT', 443),
                    'protocol' => env('TYPESENSE_PROTOCOL', 'https'),
                ],
            ],
            'api_key' => env('TYPESENSE_ADMIN_API_KEY'),
            'connection_timeout_seconds' => 10,
            'client' => $guzzle, // Correctly pass the client within the config array
        ]);
    }

    public function createCollections(): void
    {
        $schemas = [
            [
                'name' => 'protocols',
                'fields' => [
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'content', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'facet' => true],
                    ['name' => 'avg_rating', 'type' => 'float'],
                    ['name' => 'discussion_count', 'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ],
            [
                'name' => 'threads',
                'fields' => [
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'protocol_id', 'type' => 'string', 'facet' => true],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ],
        ];

        foreach ($schemas as $schema) {
            try {
                $this->client->collections[$schema['name']]->delete();
            } catch (\Exception $e) { }
            $this->client->collections->create($schema);
        }
    }

    public function indexProtocol($protocol): void
    {
        $document = [
            'id' => (string) $protocol->id,
            'title' => (string) $protocol->title,
            'content' => (string) $protocol->content,
            'tags' => is_string($protocol->tags) ? (json_decode($protocol->tags, true) ?? []) : ($protocol->tags ?? []),
            'avg_rating' => (float) $protocol->avg_rating,
            'discussion_count' => (int) $protocol->discussion_count,
            'created_at' => (int) $protocol->created_at->timestamp,
        ];
        $this->client->collections['protocols']->documents->upsert($document);
    }

    public function indexThread($thread): void
    {
        $document = [
            'id' => (string) $thread->id,
            'title' => (string) $thread->title,
            'protocol_id' => (string) $thread->protocol_id,
            'created_at' => (int) $thread->created_at->timestamp,
        ];
        $this->client->collections['threads']->documents->upsert($document);
    }

    public function searchProtocols(string $query, array $params = []): array
    {
        $searchParams = array_merge([
            'q' => $query,
            'query_by' => 'title,content,tags',
        ], $params);

        return $this->client->collections['protocols']->documents->search($searchParams);
    }

    public function deleteProtocol($id): void { $this->client->collections['protocols']->documents[(string) $id]->delete(); }
    public function deleteThread($id): void { $this->client->collections['threads']->documents[(string) $id]->delete(); }
}