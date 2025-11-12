<?php

namespace App\Http\Controllers;

use App\Events\ReservationAccepted;
use App\Events\ReservationCancelled;
use App\Events\ReservationCompleted;
use App\Events\ReservationRefused;
use App\Mail\ReservationAcceptedMail;
use App\Mail\ReservationCancelledByClientMail;
use App\Mail\ReservationCancelledMail;
use App\Mail\ReservationCompletedMail;
use App\Mail\ReservationRefusedMail;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('user')) {
            $reservations = Reservation::where('client_id', $user->id)->get();
        } else {
            $reservations = Reservation::where('service_id', $user->service_id)->get();
        }

        return response()->json([
            'message' => 'Reservation Fetched Successfully',
            'reservations' => $reservations->load('client'),
            'user' => $user
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

        $user = $request->user();
        // Log::info('Sender of request :', [$user]);

        $validated = $request->validate([
            'status' => 'required|in:accepted,refused,completed,cancelled'
        ]);

        $reservation->update($validated);
        $reservation->load('service', 'client');

        if ($reservation->status == 'accepted') {
            event(new ReservationAccepted($reservation));
        } elseif ($reservation->status == 'refused') {
            event(new ReservationRefused($reservation));
        } elseif ($reservation->status == 'completed') {
            event(new ReservationCompleted($reservation));
        } else {
            if ($user->hasRole('provider')) {
                event(new ReservationCancelled($reservation, 'provider'));
            } else {
                event(new ReservationCancelled($reservation, 'client'));
            }
        }
        return response()->json([
            'message' => 'Status Of Reservation Updated Successfully',
            'reservation' => $reservation
        ], 201);
    }
}
