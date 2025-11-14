<?php

namespace App\Listeners;

use App\Events\ServiceCreated;
use App\Mail\ServiceCreatedMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendServiceCreatedMail implements ShouldQueue
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
    public function handle(ServiceCreated $event): void
    {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->get();
        Mail::to($admin)->queue(new ServiceCreatedMail($event->service));
    }
}
