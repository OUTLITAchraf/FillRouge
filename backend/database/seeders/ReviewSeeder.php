<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $clients = User::whereHas('roles', fn($q) => $q->where('name', 'client'))->pluck('id');
        $services = Service::where('status','approved')->pluck('id');

        foreach ($clients as $client) {
            // Review 2–4 random services
            $servicesToReview = $services->random(rand(2, 10));

            foreach ($servicesToReview as $service) {
                Review::create([
                    'rating' => rand(1, 5),
                    'comment' => fake()->sentence(),
                    'client_id' => $client,
                    'service_id' => $service,
                ]);
            }
        }

        // $this->command->info("✅ Reviews seeded successfully! (No duplicate reviews per service)");
    }
}
