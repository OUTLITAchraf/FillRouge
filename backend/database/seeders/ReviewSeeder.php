<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Service;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all clients and services
        $clients = User::whereHas('roles', function ($q) {
            $q->where('name', 'user');
        })->get();

        $services = Service::all();

        // If you have no users or services yet, exit early
        if ($clients->isEmpty() || $services->isEmpty()) {
            $this->command->warn('⚠️ No clients or services found. Please seed them first.');
            return;
        }

        // Create 20 random reviews
        foreach (range(1, 50) as $i) {
            Review::create([
                'rating' => rand(1, 5),
                'comment' => fake()->sentence(),
                'client_id' => $clients->random()->id,
                'service_id' => $services->random()->id,
            ]);
        }

        $this->command->info('✅ 20 reviews seeded successfully!');
    }
}
