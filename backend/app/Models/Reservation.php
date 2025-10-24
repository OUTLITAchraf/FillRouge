<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'date',
        'client_id',
        'service_id'
    ];

    public function service(){
        $this->belongsTo(Service::class);
    }

    public function user(){
        $this->belongsTo(User::class, 'client_id');
    }
}
