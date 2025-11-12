<?php

namespace App\Http\Controllers;

use App\Events\ServiceApproved;
use App\Events\ServiceRejected;
use App\Models\Category;
use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        // Log::info('User from guard:', ['user' => $user]);

        $this->authorize('viewAny', Service::class);

        $query = Service::query()->with(['provider', 'category', 'reservations', 'reviews.user']);

        if ($user?->hasRole('provider')) {
            $query->where('provider_id', $user->id);
        } elseif (!$user?->hasRole('admin')) {
            $query->where('status', 'approved');
        }

        if ($request->filled('category_name')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category_name);
            });
        }

        if ($request->filled('provider_name')) {
            $query->whereHas('provider', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->provider_name}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $services = $query->paginate(12);

        return response()->json([
            'message' => 'Services Fetched Successfully',
            'services' => $services,
        ], 201);
    }


    public function show(Service $service)
    {
        $this->authorize('view', $service);
        $user = auth()->user();

        $hasReserved = false;
        $hasReviewed = false;

        // Log::info('User:', [$user]);
        // Log::info('Status hasReserved before if:', [$hasReserved]);

        if ($user) {
            // Log::info('Status hasReserved in if before search service:', [$hasReserved]);

            $hasReserved = $service->reservations()->where('client_id', $user->id)->exists();
            $hasReviewed = $service->reviews()->where('client_id', $user->id)->exists();

            // Log::info('Status hasReserved in if after search service:', [$hasReserved]);
        }

        // Log::info('Status hasReserved after if:', [$hasReserved]);
        return response()->json([
            'message' => 'Service Detail Fetched Successfully',
            'service' => $service->load('category', 'provider', 'reviews.user')->setAttribute('hasReserved', $hasReserved)->setAttribute('hasReviewed', $hasReviewed)
        ], 201);
    }


    public function store(Request $request)
    {
        $this->authorize('create');
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
                    $service->provider?->update(['service_id' => null]);
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

    public function restore($id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->restore();

        return response()->json([
            'message' => 'Service restored successfully',
            'service' => $service
        ], 201);
    }


    public function updateStatus(Request $request, Service $service)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $service->update($validated);
        $service->load('provider', 'category');

        if ($service->status == 'approved') {
            event(new ServiceApproved($service));
        } else {
            event(new ServiceRejected($service));
        }

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
            'services' => $services->load('provider')
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
            'service' => $service->load('provider')
        ], 201);
    }
}
