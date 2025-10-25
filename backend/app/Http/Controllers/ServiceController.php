<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();
        $this->authorize('viewAny', Service::class);

        $query = Service::query();

        if ($user?->hasRole('admin')) {

            $services = $query->get();
        } elseif ($user?->hasRole('provider')) {

            $services = $query->where('provider_id', $user->id)->get();
        } else {
            $services = $query->where('status', 'approved')->get();
        }

        return response()->json([
            'message' => 'Services Fetched Successfully',
            'services' => $services->load('category', 'provider')
        ], 201);
    }

    public function show(Service $service)
    {
        $this->authorize('view', $service);
        return response()->json([
            'message' => 'Service Detail Fetched Successfully',
            'service' => $service->load('category', 'provider', 'reviews')
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
        $this->authorize('delete', $service);
        try {

            $service = DB::transaction(
                function () use ($service) {
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

    public function updateStatus(Request $request, Service $service)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Status Of Service Updated successfully',
            'service' => $service
        ], 201);
    }

    public function bycategory(Category $category)
    {
        $services = Service::where('category_id', $category->id)->get();

        return response()->json([
            'message' => 'Services With Filter Fetched Successfully',
            'services' => $services
        ], 201);
    }

    public function searchByProvider(Request $request)
    {
        $providerName = $request->input('provider_name');

        $service = Service::whereHas('provider', function ($query) use ($providerName) {
            $query->where('name', 'like', '%' . $providerName . '%');
        })->get();

        if ($service->isEmpty()) {
            return response()->json([
                'message' => 'There no service by this provider'
            ], 404);
        }

        return response()->json([
            'message' => 'Search An Service By Provider Completed Successfully',
            'service' => $service
        ], 201);
    }
}
