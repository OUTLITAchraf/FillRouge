<?php

namespace App\Listeners;

use App\Events\ReservationCompleted;
use App\Mail\ReservationCompletedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendReservationCompletedMail implements ShouldQueue
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
    public function handle(ReservationCompleted $event): void
    {
        $client = $event->reservation->client;
        Mail::to($client->email)->send(new ReservationCompletedMail($event->reservation));
    }
}
