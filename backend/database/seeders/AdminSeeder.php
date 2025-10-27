<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 'admin' role if it doesn't exist
        $adminRole = Role::firstOrCreate([
            'name' => 'admin'
        ]);

        // Create admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@fillrouge.com'], // ✅ update email if you want
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'), // ✅ change for production
                'email_verified_at' => now(),
            ]
        );

        // Attach the admin role to the user if not already attached
        if (!$admin->hasRole('admin')) {
            $admin->addRole($adminRole);
        }
    }
}
