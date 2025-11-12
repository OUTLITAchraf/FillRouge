<?php

namespace App\Listeners;

use App\Events\ReservationCancelled;
use App\Mail\ReservationCancelledByClientMail;
use App\Mail\ReservationCancelledMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendReservationCancelledMail implements ShouldQueue
{

    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ReservationCancelled $event): void
    {
        $reservation = $event->reservation;

        if ($event->cancelledBy === 'provider') {
            $client = $reservation->client;
            Mail::to($client->email)->send(new ReservationCancelledMail($reservation));
        }
        
        if ($event->cancelledBy == 'client') {
            $provider = $reservation->service->provider;
            Mail::to($provider->email)->send(new ReservationCancelledByClientMail($reservation));
        }
    }
}
