<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the "provider" role exists
        $providerRole = Role::firstOrCreate(['name' => 'provider']);

        // Create 10 fake providers
        foreach (range(1, 20) as $i) {
            $provider = User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->unique()->phoneNumber(),
                'password' => Hash::make('password'),
                'address' => fake()->address(),
                'status' => fake()->randomElement(['pending', 'approved', 'rejected'])
            ]);

            // Assign role "provider"
            $provider->addRole($providerRole);
        }

        $this->command->info('✅ 10 providers seeded successfully!');
    }
}
