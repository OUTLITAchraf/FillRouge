<?php

namespace App\Listeners;

use App\Events\ServiceRejected;
use App\Mail\ServiceRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendServiceRejectedMail implements ShouldQueue
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
    public function handle(ServiceRejected $event): void
    {
        $provider = $event->service->provider;

        Mail::to($provider)->queue(new ServiceRejectedMail($event->service));
    }
}
