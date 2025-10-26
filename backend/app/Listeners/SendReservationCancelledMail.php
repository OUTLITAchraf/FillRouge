<?php

namespace App\Listeners;

use App\Events\ReservationCancelled;
use App\Mail\ReservationCancelledMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
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
        $client = $event->reservation->client;
        Mail::to($client->email)->send(new ReservationCancelledMail($event->reservation));
    }
}
