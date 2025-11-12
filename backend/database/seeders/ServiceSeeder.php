<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there are some providers and categories
        $providers = User::whereHas('roles', function ($q) {
            $q->where('name', 'provider');
        })->get();

        $categories = Category::all();

        // If no providers or categories exist, skip seeding
        if ($providers->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('⚠️ Please seed providers and categories before running ServiceSeeder.');
            return;
        }

        foreach (range(1, 50) as $i) {
            $provider = $providers->random();
            $category = $categories->random();

            Service::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(3),
                'price' => fake()->randomFloat(2, 100, 2000),
                'image' => 'https://placehold.co/600x400?text=Service+' . $i,
                'provider_id' => $provider->id,
                'category_id' => $category->id,
                'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            ]);
        }

        $this->command->info('✅ Services table seeded successfully!');
    }
}
