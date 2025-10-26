<?php

namespace App\Listeners;

use App\Events\ProviderRegistered;
use App\Mail\ProviderRegisterMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendProviderRegisteredMail implements ShouldQueue
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
    public function handle(ProviderRegistered $event): void
    {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->get();
        Mail::to($admin)->send(new ProviderRegisterMail($event->provider));
    }
}
