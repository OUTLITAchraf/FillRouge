<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Ensure the "user" role exists
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create 10 fake users
        foreach (range(1, 30) as $i) {
            $user = User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->unique()->phoneNumber(),
                'password' => Hash::make('password'),
                'address' => fake()->address(),
                'status' => 'approved'
            ]);

            // Assign role "user"
            $user->addRole($userRole);
        }

        $this->command->info('✅ 10 users seeded successfully!');
    }
}
