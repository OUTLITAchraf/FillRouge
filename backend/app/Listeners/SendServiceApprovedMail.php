<?php

namespace App\Listeners;

use App\Events\ServiceApproved;
use App\Mail\ServiceApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendServiceApprovedMail  implements ShouldQueue
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
    public function handle(ServiceApproved $event): void
    {
        $provider = $event->service->provider;
        Mail::to($provider->email)->send(new ServiceApprovedMail($event->service));
    }
}
