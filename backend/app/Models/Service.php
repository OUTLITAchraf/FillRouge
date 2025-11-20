<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'price',
        'status',
        'image',
        'category_id',
        'city_id',
        'provider_id'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? asset(Storage::url($this->image)) : null;
    }

    protected static function booted()
    {
        static::deleting(function ($service) {
            $service->reservations()->delete();
            $service->reviews()->delete();
        });

        static::restoring(function ($service) {
            if ($service->provider()->exists()) {
                $service->provider()->update(['service_id' => $service->id]);
            }

            $service->reservations()->onlyTrashed()->get()->each->restore();
            $service->reviews()->onlyTrashed()->get()->each->restore();
        });
    }


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function city(){
        return $this->belongsTo(City::class, 'city_id');
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class)->orderBy('created_at','desc');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->orderBy('created_at','desc');
    }
}
