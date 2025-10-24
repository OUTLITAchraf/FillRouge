<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request,Service $service)
    {
        if($service->status === 'pending' || $service->status === 'rejected'){
            return response()->json([
                'message' => 'This service not avaible for reservation'
            ], 403);
        }

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
            'message' => 'You Reserved In This Service Successfully',
            'reservatuon' => $reservation
        ], 201);
    }

    public function updateStatus(Request $request,Reservation $reservation){
        $this->authorize('updateStatus',$reservation);

        $validated = $request->validate([
            'status' => 'required|in:accepted,refused,completed,cancelled'
        ]);

        $reservation->update($validated);
        $reservation->load('service','client');

        return response()->json([
            'message' => 'Status Of Reservation Updated Successfully',
            'reservation' => $reservation
        ], 201);
    }
}
