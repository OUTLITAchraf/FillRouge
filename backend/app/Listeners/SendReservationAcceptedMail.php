<?php

namespace App\Listeners;

use App\Events\ReservationAccepted;
use App\Mail\ReservationAcceptedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendReservationAcceptedMail implements ShouldQueue
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
    public function handle(ReservationAccepted $event): void
    {
        $client = $event->reservation->client;
        Mail::to($client->email)->send(new ReservationAcceptedMail($event->reservation));
    }
}
