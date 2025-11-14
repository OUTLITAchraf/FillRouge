<?php

namespace App\Listeners;

use App\Events\ReservationRefused;
use App\Mail\ReservationRefusedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendReservationRefusedMail implements ShouldQueue
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
    public function handle(ReservationRefused $event): void
    {
        $client = $event->reservation->client;
        Mail::to($client)->queue(new ReservationRefusedMail($event->reservation));
    }
}
