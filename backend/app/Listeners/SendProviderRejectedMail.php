<?php

namespace App\Listeners;

use App\Events\ProviderRejected;
use App\Mail\ProviderRejectedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendProviderRejectedMail implements ShouldQueue
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
    public function handle(ProviderRejected $event): void
    {
        Mail::to($event->provider)->queue(new ProviderRejectedMail($event->provider));
    }
}
