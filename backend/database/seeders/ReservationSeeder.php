<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $clients = User::whereHas('roles', fn($q) => $q->where('name', 'client'))->pluck('id');
        $services = Service::where('status','approved')->pluck('id');

        foreach ($clients as $client) {
            // Reserve 3–5 random services
            $servicesToReserve = $services->random(rand(3, 8));

            foreach ($servicesToReserve as $service) {
                Reservation::create([
                    'status' => fake()->randomElement(['pending', 'accepte', 'refuse', 'completed', 'cancelled']),
                    'reservation_date' => fake()->dateTimeBetween('-1 month', '+1 month'),
                    'description' => fake()->sentence(),
                    'client_id' => $client,
                    'service_id' => $service,
                ]);
            }
        }

        // $this->command->info("✅ Reservations seeded successfully! (No duplicate reservations per service)");
    }
}
