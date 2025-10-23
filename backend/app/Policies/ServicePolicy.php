<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ServicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Service $service)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Service $service)
    {
        // Admins can update any service
        if ($user->role === 'admin') {
            return true;
        }

        // Only the creator provider can update
        return $user->id === $service->provider_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Service $service)
    {
        // Admins can delete any service
        if ($user->role === 'admin') {
            return true;
        }

        // Only the creator provider can delete
        return $user->id === $service->provider_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Service $service)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Service $service)
    {
        //
    }
}
