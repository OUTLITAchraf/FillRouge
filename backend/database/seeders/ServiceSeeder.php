<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $providers = User::whereHas('roles', fn ($q) => $q->where('name', 'provider'))
            ->where('status', 'approved')
            ->get();

        $categories = \App\Models\Category::pluck('id')->toArray();
        $cities = \App\Models\City::pluck('id')->toArray();

        foreach ($providers as $provider) {
            Service::create([
                'title'       => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'price'       => fake()->numberBetween(100, 1000),
                'status'      => 'approved',
                'image'       => "https://placehold.co/600x400?text=Service+" . $provider->id,
                'category_id' => fake()->randomElement($categories),
                'city_id' => fake()->randomElement($cities),
                'provider_id' => $provider->id,
            ]);
        }

        // $this->command->info("✅ Services seeded successfully! (Each provider = 1 service)");
    }
}
