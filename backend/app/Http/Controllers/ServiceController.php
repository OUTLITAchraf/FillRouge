<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id'
        ]);

        $providerId = $request->user()->id;

        $existing = Service::where('provider_id', $providerId)->first();
        if ($existing) {
            return response()->json([
                'message' => 'You already have a service'
            ], 400);
        }

        $service = DB::transaction(function () use ($request, $providerId) {
            $service = Service::create([
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'status' => 'pending',
                'category_id' => $request->category_id,
                'provider_id' => $providerId
            ]);

            $request->user()->update([
                'service_id' => $service->id
            ]);

            return $service;
        });

        return response()->json([
            'message' => 'Service Created Successfully',
            'service' => $service
        ], 201);
    }
}
