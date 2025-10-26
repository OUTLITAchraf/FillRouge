<?php

namespace App\Providers;

use App\Events\ProviderApproved;
use App\Events\ProviderRegistered;
use App\Events\ProviderRejected;
use App\Events\ServiceApproved;
use App\Events\ServiceRejected;
use App\Listeners\SendProviderApprovedMail;
use App\Listeners\SendProviderRegisteredMail;
use App\Listeners\SendProviderRejectedMail;
use App\Listeners\SendServiceApprovedMail;
use App\Listeners\SendServiceRejectedMail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        
        ProviderRegistered::class => [
            SendProviderRegisteredMail::class,
        ],

        ProviderApproved::class => [
            SendProviderApprovedMail::class,
        ],

        ProviderRejected::class => [
            SendProviderRejectedMail::class,
        ],

        ServiceApproved::class => [
            SendServiceApprovedMail::class,
        ],

        ServiceRejected::class => [
            SendServiceRejectedMail::class,
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
