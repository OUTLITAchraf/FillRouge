<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'reservation_date' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'description' => fake()->paragraph(),
            'client_id' => User::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
