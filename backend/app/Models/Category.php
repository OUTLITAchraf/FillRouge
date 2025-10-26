<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'display_name'
    ];

    protected $dates = ['deleted_at'];

    protected static function booted()
    {
        // Handle soft delete
        static::deleting(function ($category) {
            $category->services->each(function ($service) {
                // Nullify service_id for provider
                if ($service->provider) {
                    $service->provider->update(['service_id' => null]);
                }

                // Soft delete reservations and reviews
                $service->reservations()->delete();
                $service->reviews()->delete();

                // Soft delete service
                $service->delete();
            });
        });

        // Handle restore
        static::restoring(function ($category) {
            $category->services()->onlyTrashed()->get()->each(function ($service) {
                // Restore service
                $service->restore();

                // Restore reservations and reviews
                $service->reservations()->onlyTrashed()->get()->each->restore();
                $service->reviews()->onlyTrashed()->get()->each->restore();

                // Update service_id for provider
                if ($service->provider) {
                    $service->provider->update(['service_id' => $service->id]);
                }
            });
        });
    }


    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
