<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{

    public function index()
    {
        $services = Service::all();

        return response()->json([
            'message' => 'Services Fetched Successfully',
            'services' => $services
        ], 201);
    }

    public function show(Service $service) {

        return response()->json([
            'message' => 'Service Detail Fetched Successfully',
            'service' => $service->load('user')
        ], 201);
    }
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
        try {
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
        } catch (Exception $e) {

            return response()->json([
                'message' => 'Something went wrong while creating the service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Service $service)
    {

        $this->authorize('update', $service);
        $validated = $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service Updated Successfully',
            'service' => $service
        ], 201);
    }

    public function destroy(Service $service)
    {
        $this->authorize('delete',$service);
        try {

            $service = DB::transaction(function () use ($service) {
                    $service->user->update(['service_id' => null]);
                    $service->delete();

                    return $service;
                }
            );

            return response()->json([
                'message' => 'Service Deleted Successfully',
                'service' => $service
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error deleting service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request,Service $service){
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Status Of Service Updated successfully',
            'service' => $service
        ], 201);
    }
}
