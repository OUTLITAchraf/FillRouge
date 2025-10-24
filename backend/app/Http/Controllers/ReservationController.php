<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request,Service $service)
    {
        $request->validate([
            'date' => 'required|date'
        ]);

        $user = $request->user();

        $existing = Reservation::where('client_id', $user->id)
            ->where('service_id', $service->id)
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'You have already reserved this service.'
            ], 409);
        }

        $reservation = Reservation::create([
            'date' => $request->date,
            'client_id' => $user->id,
            'service_id' => $service->id
        ]);

        return response()->json([
            'message' => 'You Reserved This Service Successfully',
            'reservatuon' => $reservation
        ], 201);
    }
}
