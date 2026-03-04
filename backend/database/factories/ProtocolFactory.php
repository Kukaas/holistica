<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Protocol>
 */
class ProtocolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'author_id' => \App\Models\User::factory(),
            'tags' => json_encode($this->faker->words(3)),
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'avg_rating' => $this->faker->randomFloat(2, 0, 5),
            'discussion_count' => 0, // Will be updated via relationships
        ];
    }
}
