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
    /**
     * @OA\Get(
     *     path="/reservations",
     *     summary="Get user reservations",
     *     description="Retrieve reservations for the authenticated user (client or provider)",
     *     operationId="getReservations",
     *     tags={"Reservations"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=201,
     *         description="Reservations fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Reservation Fetched Successfully"),
     *             @OA\Property(property="reservations", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Reservation::query()->with(['client', 'service']);

        if ($user->hasRole('client')) {
            $query->where('client_id', $user->id);
        } else {
            $query->where('service_id', $user->service_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('client_name')) {
            $query->whereHas('client', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->client_name}%");
            });
        }

        if ($request->filled('service_title')) {
            $query->whereHas('service', function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->service_title}%");
            });
        }

        $reservations = $query->paginate(10);

        return response()->json([
            'message' => 'Reservation Fetched Successfully',
            'reservations' => $reservations,
            'user' => $user
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/service/{service}/reserve",
     *     summary="Create a reservation",
     *     description="Create a new reservation for a service (Client only)",
     *     operationId="storeReservation",
     *     tags={"Reservations"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"reservation_date", "description"},
     *             @OA\Property(property="reservation_date", type="string", format="date", example="2024-12-25"),
     *             @OA\Property(property="description", type="string", example="Need plumbing service for bathroom")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reservation created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="You Reserved In This Service Successfully"),
     *             @OA\Property(property="reservatuon", type="object")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Service not available for reservation"),
     *     @OA\Response(response=409, description="Already reserved this service"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
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


    /**
     * @OA\Patch(
     *     path="/reservation/update-status/{reservation}",
     *     summary="Update reservation status",
     *     description="Update the status of a reservation (Provider or Client)",
     *     operationId="updateReservationStatus",
     *     tags={"Reservations"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="reservation",
     *         in="path",
     *         description="Reservation ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"accepte", "refuse", "completed", "cancelled"}, example="accepte")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reservation status updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Status Of Reservation Updated Successfully"),
     *             @OA\Property(property="reservation", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Reservation not found")
     * )
     */
    public function updateStatus(Request $request, Reservation $reservation)
    {
        $this->authorize('updateStatus', $reservation);

        $user = $request->user();
        // Log::info('Sender of request :', [$user]);

        $validated = $request->validate([
            'status' => 'required|in:accepte,refuse,completed,cancelled'
        ]);

        $reservation->update($validated);
        $reservation->load('service', 'client');

        if ($reservation->status == 'accepte') {
            event(new ReservationAccepted($reservation));
        } elseif ($reservation->status == 'refuse') {
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
