<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laratrust\Traits\HasRolesAndPermissions;
use Laravel\Sanctum\HasApiTokens;
use Laratrust\Contracts\LaratrustUser;


class User extends Authenticatable implements LaratrustUser
{
    use HasApiTokens, HasFactory, Notifiable, HasRolesAndPermissions, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
        'phone',
        'status',
        'service_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function booted()
    {
        static::deleting(function ($user) {
            $user->tokens()->delete();
            // Nullify provider_id in services when user soft deleted
            $user->service()->withTrashed()->update(['provider_id' => null]);

            // Optional: soft delete reservations and reviews made by this user
            $user->reservations()->delete();
            $user->reviews()->delete();
        });


        static::restoring(function ($user) {
            // Restore the user's service if it exists
            if ($service = Service::onlyTrashed()->where('provider_id', $user->id)->first()) {
                $service->restore();
            }

            // Restore related reservations
            Reservation::onlyTrashed()
                ->where('client_id', $user->id)
                ->get()
                ->each(function ($reservation) {
                    $reservation->restore();
                });

            // Restore related reviews
            Review::onlyTrashed()
                ->where('client_id', $user->id)
                ->get()
                ->each(function ($review) {
                    $review->restore();
                });
        });
    }

    public function service()
    {
        return $this->hasOne(Service::class, 'provider_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'client_id')->orderBy('created_at', 'desc');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'client_id')->orderByDesc('created_at');
    }
}
