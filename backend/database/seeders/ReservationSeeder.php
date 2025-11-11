<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Service;

class ReservationSeeder extends Seeder
{
    public function run()
    {
        $clients = User::whereHas('roles', function ($q) {
            $q->where('name', 'user');
        })->pluck('id');
        $services = Service::pluck('id'); // all services

        if ($clients->isEmpty() || $services->isEmpty()) {
            $this->command->info('No clients or services found, skipping reservations seeding.');
            return;
        }

        foreach (range(1, 50) as $i) {
            Reservation::create([
                'status' => fake()->randomElement(['pending', 'accepte', 'refuse', 'completed', 'cancelled']),
                'reservation_date' => fake()->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d H:i:s'),
                'description' => fake()->sentence(6),
                'client_id' => $clients->random(),
                'service_id' => $services->random(),
            ]);
        }
    }
}
