<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'votable_id' => 1, // Will be overridden in seeder
            'votable_type' => \App\Models\Thread::class , // Will be overridden in seeder
            'value' => $this->faker->randomElement([1, -1]),
        ];
    }
}
