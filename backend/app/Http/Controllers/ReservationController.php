<?php

namespace App\Http\Controllers;

use App\Events\ReservationAccepted;
use App\Events\ReservationCancelled;
use App\Events\ReservationCompleted;
use App\Events\ReservationRefused;
use App\Mail\ReservationAcceptedMail;
use App\Mail\ReservationCancelledMail;
use App\Mail\ReservationCompletedMail;
use App\Mail\ReservationRefusedMail;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $provider = $request->user();

        $reservations = Reservation::where('service_id', $provider->service_id)->get();

        return response()->json([
            'message' => 'Reservation Fetched Successfully',
            'reservation' => $reservations->load('client'),
            'provider' => $provider
        ], 201);
    }


    public function store(Request $request, Service $service)
    {
        if ($service->status === 'pending' || $service->status === 'rejected') {
            return response()->json([
                'message' => 'This service not avaible for reservation'
            ], 403);
        }

        $request->validate([
            'reservation_date' => 'required|date',
            'description' => 'required|string|max:255'
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
            'reservation_date' => $request->reservation_date,
            'description' => $request->description,
            'client_id' => $user->id,
            'service_id' => $service->id
        ]);

        return response()->json([
            'message' => 'You Reserved In This Service Successfully',
            'reservatuon' => $reservation
        ], 201);
    }


    public function updateStatus(Request $request, Reservation $reservation)
    {
        $this->authorize('updateStatus', $reservation);

        $validated = $request->validate([
            'status' => 'required|in:accepted,refused,completed,cancelled'
        ]);

        $reservation->update($validated);
        $reservation->load('service', 'client');

        $client = $reservation->client;

        if ($reservation->status == 'accepted') {
            event(new ReservationAccepted($reservation));
        } elseif ($reservation->status == 'refused') {
            event(new ReservationRefused($reservation));
        } elseif ($reservation->status == 'completed') {
            event(new ReservationCompleted($reservation));
        } else {
            event(new ReservationCancelled($reservation));
        }
        return response()->json([
            'message' => 'Status Of Reservation Updated Successfully',
            'reservation' => $reservation
        ], 201);
    }
}
