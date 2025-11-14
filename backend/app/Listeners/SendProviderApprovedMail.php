<?php

namespace App\Listeners;

use App\Events\ProviderApproved;
use App\Mail\ProviderApprovedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendProviderApprovedMail implements ShouldQueue
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
    public function handle(ProviderApproved $event): void
    {
        Mail::to($event->provider)->queue(new ProviderApprovedMail($event->provider));
    }
}
