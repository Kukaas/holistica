<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 users first
        $users = \App\Models\User::factory(10)->create();

        $realisticProtocols = [
            [
                'title' => 'Morning Hydration & Mineral Routine',
                'content' => 'Start your day with 16oz of filtered water, a pinch of Celtic sea salt, and a squeeze of lemon to replenish electrolytes and kickstart digestion.',
                'tags' => ['hydration', 'morning-routine', 'minerals'],
            ],
            [
                'title' => 'Anti-Inflammatory Turmeric Golden Milk',
                'content' => 'A soothing evening drink made with almond milk, turmeric, ginger, black pepper, and honey to reduce systemic inflammation and improve sleep quality.',
                'tags' => ['anti-inflammatory', 'sleep', 'turmeric'],
            ],
            [
                'title' => 'Intermittent Fasting for Metabolic Health',
                'content' => 'A guide to the 16:8 fasting protocol. Focus on nutrient-dense whole foods during the 8-hour window and stay hydrated during the fasting period.',
                'tags' => ['fasting', 'metabolism', 'weight-loss'],
            ],
            [
                'title' => 'Breathwork Technique for Stress Reduction',
                'content' => 'The Box Breathing method: Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat for 5-10 minutes to calm the nervous system.',
                'tags' => ['breathwork', 'stress-relief', 'mental-health'],
            ],
            [
                'title' => 'Gut-Healing Bone Broth Protocol',
                'content' => 'Simmer organic grass-fed bones with apple cider vinegar for 24-48 hours. Rich in collagen and amino acids to support gut lining integrity.',
                'tags' => ['gut-health', 'collagen', 'nutrition'],
            ],
            [
                'title' => 'Magnesium Soak for Muscle Recovery',
                'content' => 'Add 2 cups of Epsom salts (magnesium sulfate) to a warm bath. Soak for 20 minutes to relieve muscle tension and support detoxification.',
                'tags' => ['recovery', 'magnesium', 'detox'],
            ],
            [
                'title' => 'Cold Exposure for Immune Support',
                'content' => 'End your shower with 30-60 seconds of cold water. Gradually increase duration to boost brown fat activation and immune response.',
                'tags' => ['cold-therapy', 'immunity', 'biohacking'],
            ],
            [
                'title' => 'Digital Detox Evening Routine',
                'content' => 'Turn off all screens 2 hours before bed. Use red light or candlelight to protect melatonin production and improve circadian rhythm.',
                'tags' => ['sleep-hygiene', 'melatonin', 'wellness'],
            ],
            [
                'title' => 'Lion\'s Mane Mushroom for Cognitive Focus',
                'content' => 'Incorporate dual-extracted Lion\'s Mane powder into your morning coffee or tea to support Nerve Growth Factor (NGF) and mental clarity.',
                'tags' => ['nootropics', 'brain-health', 'focus'],
            ],
            [
                'title' => 'Ashwagandha for Adrenal Support',
                'content' => 'Take 300-600mg of KSM-66 Ashwagandha twice daily to help the body adapt to stress and balance cortisol levels.',
                'tags' => ['adaptogens', 'stress', 'hormones'],
            ],
            [
                'title' => 'Vitamin D & Sunlight Optimization',
                'content' => 'Get 10-20 minutes of midday sun exposure without sunscreen. Crucial for bone health, mood regulation, and immune function.',
                'tags' => ['vitamin-d', 'sunlight', 'immunity'],
            ],
            [
                'title' => 'Fermented Foods for Microbe Diversity',
                'content' => 'Include 1-2 servings of raw sauerkraut, kimchi, or kefir daily to introduce beneficial probiotics and support your microbiome.',
                'tags' => ['probiotics', 'microbiome', 'digestion'],
            ],
        ];

        // Create 12 Protocols from realistic data
        $protocols = collect($realisticProtocols)->map(function ($data) use ($users) {
            return \App\Models\Protocol::factory()->create(array_merge($data, [
            'author_id' => $users->random()->id,
            'status' => 'published',
            ]));
        });

        $realisticThreads = [
            'Does anyone add ginger to their morning mineral water?',
            'How long did it take to see results with Golden Milk?',
            'Tips for surviving the last 2 hours of a 16:8 fast?',
            'My experience with Box Breathing during work stress',
            'Best places to source grass-fed bones for broth?',
            'Frequency of magnesium baths for chronic back pain?',
            'How do you handle the initial shock of cold showers?',
            'What do you do for 2 hours during a digital detox?',
            'Noticing better focus with Lion\'s Mane after 2 weeks',
            'Can I take Ashwagandha with my other supplements?',
        ];

        // Create 10 Threads with realistic titles
        $threads = collect($realisticThreads)->map(function ($title) use ($protocols, $users) {
            return \App\Models\Thread::factory()->create([
            'protocol_id' => $protocols->random()->id,
            'user_id' => $users->random()->id,
            'title' => $title,
            'status' => 'open',
            ]);
        });

        // Create Comments for threads
        $threads->each(function ($thread) use ($users) {
            \App\Models\Comment::factory(rand(2, 5))->create([
                'thread_id' => $thread->id,
                'user_id' => fn() => $users->random()->id,
                'content' => fake()->randomElement([
                    'This worked wonders for me! Thanks for sharing.',
                    'I tried this but felt a bit nauseous, any tips?',
                    'Does anyone know if this is safe during pregnancy?',
                    'I highly recommend adding a bit of honey to this.',
                    'Great advice, I started this last week and feel much better.',
                    'How often do you recommend doing this?',
                ]),
            ]);
        });

        // Create Reviews for protocols
        $protocols->each(function ($protocol) use ($users) {
            \App\Models\Review::factory(rand(1, 3))->create([
                'protocol_id' => $protocol->id,
                'user_id' => fn() => $users->random()->id,
                'content' => fake()->randomElement([
                    'A game changer for my daily energy levels.',
                    'Simple to follow and very effective.',
                    'I wish I had known about this years ago!',
                    'Decent protocol, but requires consistent effort.',
                    'Exactly what I was looking for to improve my wellness routine.',
                ]),
            ]);
        });

        // Add some votes to comments and reviews
        $comments = \App\Models\Comment::all();
        $reviews = \App\Models\Review::all();

        $comments->each(function ($comment) use ($users) {
            $users->random(rand(0, 3))->each(function ($user) use ($comment) {
                    \App\Models\Vote::updateOrCreate(
                    [
                        'votable_id' => $comment->id,
                        'votable_type' => \App\Models\Comment::class ,
                        'user_id' => $user->id,
                    ],
                    ['value' => rand(0, 1) ? 1 : -1]
                    );
                }
                );
            });

        $reviews->each(function ($review) use ($users) {
            $users->random(rand(0, 3))->each(function ($user) use ($review) {
                    \App\Models\Vote::updateOrCreate(
                    [
                        'votable_id' => $review->id,
                        'votable_type' => \App\Models\Review::class ,
                        'user_id' => $user->id,
                    ],
                    ['value' => rand(0, 1) ? 1 : -1]
                    );
                }
                );
            });
    }
}
