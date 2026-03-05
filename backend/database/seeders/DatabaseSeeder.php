<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Protocol;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Review;
use App\Models\Vote;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable observers during seeding to prevent Typesense sync issues
        Protocol::unsetEventDispatcher();
        Thread::unsetEventDispatcher();
        Comment::unsetEventDispatcher();
        Review::unsetEventDispatcher();

        // Create specific user first
        $users = collect([]);
        $users->push(User::firstOrCreate(
        ['email' => 'maligaso.chesterlukea@gmail.com'],
        [
            'name' => 'Chester Luke Maligaso',
            'password' => Hash::make('12345678'),
        ]
        ));

        // Create second specific user
        $users->push(User::firstOrCreate(
        ['email' => 'jhondoe@example.com'],
        [
            'name' => 'Jhon Doe',
            'password' => Hash::make('12345678'),
        ]
        ));

        // Create more users for variety
        User::factory(10)->create()->each(fn($u) => $users->push($u));

        $realisticProtocols = [
            [
                'title' => 'Morning Vitality: Hydration & Mineral Stack',
                'content' => "Optimizing your morning hydration is the most effective way to kickstart your metabolic health. This protocol focuses on cellular rehydration through a specific blend of 16oz filtered water, 1/4 teaspoon of high-quality Celtic sea salt (gray salt), and fresh lemon juice.\n\nThe minerals in the salt serve as electrolytes, ensuring the water actually enters your cells rather than just passing through, while the lemon boosts bile production for effective digestion throughout the day.",
                'tags' => ['hydration', 'metabolism', 'morning-routine', 'minerals'],
            ],
            [
                'title' => 'The Anti-Inflammatory Golden Milk Evening Ritual',
                'content' => "Systemic inflammation is the root cause of most modern health issues. This evening protocol uses a dual-extracted approach to turmeric and ginger. Mix one cup of warm nut milk with a teaspoon of high-curcumin turmeric, a pinch of black pepper (essential for bioavailability), and fresh ginger.\n\nDrinking this 60 minutes before bed lowers cortisol levels, reduces joint pain, and facilitates a significantly deeper REM sleep cycle.",
                'tags' => ['anti-inflammatory', 'sleep-optimization', 'turmeric', 'wellness'],
            ],
            [
                'title' => 'Metabolic Reset: The 16:8 Intermittent Fasting Guide',
                'content' => "Intermittent fasting is more than just 'skipping breakfast'—it's about hormonal signaling. By restricting your feeding window to 8 hours (usually 12 PM to 8 PM), you allow your insulin levels to drop sufficiently to trigger autophagy, the body's natural cellular cleaning process.\n\nDuring the 16-hour fasting window, consume only black coffee, plain tea, or water with minerals to maintain the fasted state.",
                'tags' => ['fasting', 'longevity', 'weight-management', 'autophagy'],
            ],
            [
                'title' => 'Box Breathing: Instant Nervous System Regulation',
                'content' => "Modern life keeps us in a state of 'Sympathetic Dominance' (fight or flight). Box Breathing is a powerful tool used by elite performers to force the body back into the Parasympathetic state (rest and digest).\n\nProcess: Inhale for 4s, Hold for 4s, Exhale for 4s, Hold for 4s. Repeat this 'box' for at least 5 minutes. You will notice an immediate drop in heart rate and mental 'chatter'.",
                'tags' => ['breathwork', 'stress-reduction', 'mental-clarity', 'performance'],
            ],
            [
                'title' => 'Deep Gut Healing: 24-Hour Collagen Bone Broth',
                'content' => "Leaky gut syndrome can manifest as brain fog, skin issues, and fatigue. This protocol involve simmering grass-fed beef bones in filtered water with apple cider vinegar for a full 24-48 hours. The vinegar helps extract the dense collagen and glutamine from the bones.\n\nConsuming 8oz of this broth daily provides the specific amino acids needed to 'seal' the gut lining and support immune health.",
                'tags' => ['gut-health', 'collagen', 'immunity', 'nutrition'],
            ],
            [
                'title' => 'Magnesium Recovery: The Epsom Salt Soak',
                'content' => "Over 70% of the population is magnesium deficient. Transdermal absorption (through the skin) is one of the most efficient ways to replenish this vital mineral. Dissolve 2 cups of pure Epsom salts in a warm bath (not hot, as heat can cause mineral loss).\n\nSoak for 20-30 minutes. This protocol is specifically designed for high-intensity athletes or those suffering from chronic muscle tension and restless sleep.",
                'tags' => ['muscle-recovery', 'magnesium', 'sleep', 'detoxification'],
            ],
            [
                'title' => 'Cold Thermogenesis for Immune Resilience',
                'content' => "Controlled cold exposure activates the 'mammalian dive reflex' and boosts mitochondrial density. Start by ending your normal showers with 30 seconds of maximum cold. Focus on rhythmic breathing through the nose to signal safety to your brain.\n\nThis practice increases white blood cell count and activates 'Brown Adipose Tissue' (BAT), which burns calories to generate heat.",
                'tags' => ['cold-therapy', 'immunity', 'weight-loss', 'biohacking'],
            ],
            [
                'title' => 'Circadian Guard: Digital Detox & Blue Light Protocol',
                'content' => "Our eyes are the primary clocks for our brain. Artificial blue light after sunset suppresses melatonin production for hours. This protocol mandates shutting off all screens (TVs, phones, laptops) at least 2 hours before your target sleep time.\n\nReplace artificial light with candlelight or low-lumen amber bulbs. This 'light hygiene' ensures your internal master clock stays synced for optimal hormone production.",
                'tags' => ['circadian-rhythm', 'melatonin', 'light-hygiene', 'sleep'],
            ],
            [
                'title' => 'Cognitive Enhancement with Dual-Extracted Lion\'s Mane',
                'content' => "Lion's Mane is a unique nootropic that stimulates Nerve Growth Factor (NGF). To be effective, the mushroom must be dual-extracted (hot water and alcohol) to break down the chitin and release the active erinacines.\n\nAdd 1000mg of dual-extracted powder to your morning beverage. Users typically report enhanced recall, improved verbal fluency, and better focus during complex tasks.",
                'tags' => ['nootropics', 'brain-health', 'focus', 'mushrooms'],
            ],
            [
                'title' => 'Adrenal Recovery: KSM-66 Ashwagandha Protocol',
                'content' => "Ashwagandha is an adaptogen that helps the body 'adapt' to stress by modulating the HPA axis. The KSM-66 extract is the most researched form with the highest concentration of withanolides.\n\nTake 300mg in the morning and 300mg in the evening. This protocol is essential for those experiencing 'Adrenal Fatigue' or chronic high-cortisol levels.",
                'tags' => ['adaptogens', 'hormone-balance', 'stress-management'],
            ],
        ];

        // Create Protocols
        $protocols = collect($realisticProtocols)->map(function ($data) use ($users) {
            return Protocol::create(array_merge($data, [
            'author_id' => $users->random()->id,
            'status' => 'published',
            'ups' => rand(15, 120),
            'downs' => rand(0, 15),
            'avg_rating' => rand(35, 50) / 10,
            ]));
        });

        $realisticThreads = [
            [
                'title' => 'Does quality of salt really matter for the hydration protocol?',
                'content' => "I've been using standard table salt for my morning water, but I see everyone recommending Celtic or Himalayan sea salt. Is there a measurable difference in mineral content, or is it just marketing? I'd love to hear some science-based takes on this.",
                'tags' => ['minerals', 'science', 'hydration']
            ],
            [
                'title' => 'The "First Week Fog" with Golden Milk—normal?',
                'content' => "I started the Anti-Inflammatory Turmeric protocol last Monday. While I'm sleeping better, I feel a bit groggy during the day. Has anyone else experienced an initial 'detox' period when starting high-dose turmeric? How long did it last for you?",
                'tags' => ['side-effects', 'results', 'experience']
            ],
            [
                'title' => 'Best nut milk brand for the Golden Milk ritual?',
                'content' => "I want to follow the protocol exactly, but most almond milks at the store are full of gums and thickeners. Do people make their own, or is there a specific 'clean' brand that pairs well with turmeric and ginger?",
                'tags' => ['nutrition', 'brands', 'recipe']
            ],
            [
                'title' => 'Fasting during intensive work weeks?',
                'content' => "I'm a developer and usually need a high carb breakfast for mental clarity. I'm nervous that the 16:8 fast will cause brain fog during my morning standups. Does anyone here fast during high-pressure work periods? Any tips for maintaining focus?",
                'tags' => ['fasting', 'productivity', 'lifestyle']
            ],
            [
                'title' => 'Sourcing bones for the healing protocol in rural areas',
                'content' => "Locating grass-fed beef bones in my area is proving difficult. Are there any reputable online sources that ship frozen? Or would standard grocery store bones still provide the collagen/glutamine benefits?",
                'tags' => ['sourcing', 'gut-health', 'logistics']
            ],
            [
                'title' => 'Magnesium bath frequency for chronic lower back pain',
                'content' => "The soak protocol mentions high-intensity athletes, but what about chronic postural pain? I'm wondering if a daily soak is too much, or if 3 times a week is the sweet spot for muscle relaxation. Any experiences with physical therapy synergy?",
                'tags' => ['muscle-pain', 'recovery', 'timing']
            ],
            [
                'title' => 'Handling the "Gasp Reflex" in cold showers',
                'content' => "Every time I switch to cold, I immediately gasp and start shallow breathing. I know the protocol says nose breathing is key, but it's so hard to maintain! Does this get easier over time, or is there a mental trick to stay calm?",
                'tags' => ['cold-exposure', 'breathwork', 'technique']
            ],
            [
                'title' => 'Light hygiene and shared living spaces',
                'content' => "I'm trying to follow the digital detox protocol, but my partner likes to watch TV in the evening. How do you guys manage the 'light environment' when your housemates aren't on board? Are blue-light blocking glasses a viable workaround?",
                'tags' => ['lifestyle', 'challenges', 'sleep']
            ],
            [
                'title' => 'Lion\'s Mane: Extract vs. Whole Mushroom Powder',
                'content' => "A lot of brands sell 'dried mushroom powder' but it's not dual-extracted. The guide says dual extraction is essential for NGF. Has anyone tried both and noticed a significant difference in results? I'm curious if the extra cost is justified.",
                'tags' => ['nootropics', 'dosage', 'results']
            ],
            [
                'title' => 'Ashwagandha and morning vs. evening dosage',
                'content' => "The KSM-66 protocol says 300mg twice daily. If I find it makes me a bit too relaxed, can I take the full 600mg right before bed? Or does the HPA-axis modulation require the split dose approach?",
                'tags' => ['timing', 'stress', 'advice']
            ],
        ];

        // Create Threads
        $threads = collect($realisticThreads)->map(function ($threadData) use ($protocols, $users) {
            return Thread::create([
            'protocol_id' => $protocols->random()->id,
            'user_id' => $users->random()->id,
            'title' => $threadData['title'],
            'content' => $threadData['content'],
            'tags' => $threadData['tags'],
            'status' => 'open',
            'ups' => rand(8, 45),
            'downs' => rand(0, 8),
            ]);
        });

        // Create Comments
        $threads->each(function ($thread) use ($users) {
            $numComments = rand(4, 9);
            for ($i = 0; $i < $numComments; $i++) {
                $comment = $thread->comments()->create([
                    'user_id' => $users->random()->id,
                    'content' => fake()->randomElement([
                        "I had the same question! Looking forward to someone with more biotech experience chiming in.",
                        "Great points. I've found that consistency is more important than the specific brand of supplements.",
                        "I've been following this for 3 months now and the results are truly night and day. Don't give up!",
                        "Interesting perspective. personally, I've found that the 16:8 fast works best when I drink plenty of salted water in the morning.",
                        "Does anyone have any peer-reviewed papers on this specific topic? I'd love to read more deeply into the mechanism.",
                        "I've shared this with my family and we're all seeing improvements in our sleep scores. Truly a game changer.",
                        "Thanks for starting this thread. I was feeling a bit isolated with my experience but it seems I'm not alone.",
                        "Wait, I thought the protocol said we should avoid caffeine? Or is black coffee actually beneficial for the metabolic signaling?",
                        "Just ordered some high-quality extracts based on the discussion here. Hopefully I see results soon!"
                    ]),
                    'ups' => rand(2, 25),
                    'downs' => rand(0, 4),
                ]);

                // Add some nested replies
                if (rand(0, 1) === 1) {
                    $numReplies = rand(1, 4);
                    for ($j = 0; $j < $numReplies; $j++) {
                        $comment->replies()->create([
                            'thread_id' => $thread->id,
                            'user_id' => $users->random()->id,
                            'content' => fake()->randomElement([
                                "Strongly agree with that point.",
                                "Have you considered trying the liquid extract instead?",
                                "That's a very common misconception actually!",
                                "Could you elaborate on how you measured your results?",
                                "I tried that and had a completely different outcome. Might be genetic."
                            ]),
                            'parent_id' => $comment->id,
                            'ups' => rand(0, 10),
                            'downs' => rand(0, 2),
                        ]);
                    }
                }
            }
        });

        // Create Reviews
        $protocols->each(function ($protocol) use ($users) {
            $numReviews = rand(2, 6);
            for ($i = 0; $i < $numReviews; $i++) {
                Review::create([
                    'protocol_id' => $protocol->id,
                    'user_id' => $users->random()->id,
                    'comment' => fake()->randomElement([
                        'Highly recommended for anyone looking to level up their daily energy.',
                        'The results took about two weeks to manifest, but they are very noticeable now.',
                        'I wish the sourcing section was a bit more detailed for international users, but the protocol itself is solid.',
                        'Very well documented and explained. The biological reasoning makes a lot of sense.',
                        'Life-changing. My chronic fatigue is significantly reduced after implementing this ritual.',
                        'A bit challenging to maintain while traveling, but perfect for a home routine.'
                    ]),
                    'rating' => rand(4, 5),
                ]);
            }
        });

        // Add Votes
        $comments = Comment::all();
        $reviews = Review::all();

        foreach ([$comments, $reviews] as $items) {
            $items->each(function ($item) use ($users) {
                $users->random(rand(2, 5))->each(function ($user) use ($item) {
                        Vote::updateOrCreate(
                        [
                            'votable_id' => $item->id,
                            'votable_type' => get_class($item),
                            'user_id' => $user->id,
                        ],
                        ['value' => rand(0, 1) ? 1 : -1]
                        );
                    }
                    );
                });
        }
    }
}
