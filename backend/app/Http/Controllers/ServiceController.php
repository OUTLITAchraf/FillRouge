<?php

namespace App\Http\Controllers;

use App\Events\ServiceApproved;
use App\Events\ServiceCreated;
use App\Events\ServiceRejected;
use App\Models\Category;
use App\Models\Service;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/services",
     *     summary="Get all services",
     *     description="Retrieve paginated list of services with filters",
     *     operationId="getServices",
     *     tags={"Services"},
     *     @OA\Parameter(
     *         name="category_name",
     *         in="query",
     *         description="Filter by category name",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="provider_name",
     *         in="query",
     *         description="Filter by provider name",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="min_price",
     *         in="query",
     *         description="Minimum price filter",
     *         required=false,
     *         @OA\Schema(type="number")
     *     ),
     *     @OA\Parameter(
     *         name="max_price",
     *         in="query",
     *         description="Maximum price filter",
     *         required=false,
     *         @OA\Schema(type="number")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Services fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Services Fetched Successfully"),
     *             @OA\Property(property="services", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        // Log::info('User from guard:', [$user]);

        $this->authorize('viewAny', Service::class);

        $query = Service::query()->with(['provider', 'category', 'reservations', 'reviews.client']);

        if ($user?->hasRole('provider')) {
            $query->where('provider_id', $user->id);
        } elseif (!$user?->hasRole('admin')) {
            $query->where('status', 'approved');
        } else {
            $query->withTrashed();
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

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $services = $query->orderByDesc('created_at')->paginate(12);
        $services->getCollection()->transform(function ($service) use ($user) {
            $service->is_reserved = false;

            if ($user) {
                $service->is_reserved = $user->reservations()->where('service_id', $service->id)->exists();
            }

            return $service;
        });

        return response()->json([
            'message' => 'Services Fetched Successfully',
            'services' => $services,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/service/{service}",
     *     summary="Get service details",
     *     description="Retrieve details of a specific service",
     *     operationId="getService",
     *     tags={"Services"},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service details fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service Detail Fetched Successfully"),
     *             @OA\Property(property="service", type="object")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Service not found")
     * )
     */
    public function show(Service $service)
    {
        $this->authorize('view', $service);
        $user = auth('sanctum')->user();

        $hasReserved = false;
        $hasReviewed = false;

        if ($user) {
            $hasReserved = $service->reservations()->where('client_id', $user->id)->exists();
            $hasReviewed = $service->reviews()->where('client_id', $user->id)->exists();
        }

        $isWorking = $service->reservations()->where('status','accepte')->exists();

        Log::info('Provider is working :',[$isWorking]);
        return response()->json([
            'message' => 'Service Detail Fetched Successfully',
            'service' => $service->load('category', 'provider', 'reviews.user')->setAttribute('hasReserved', $hasReserved)->setAttribute('hasReviewed', $hasReviewed)->setAttribute('isWorking', $isWorking)
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/create-service",
     *     summary="Create a new service",
     *     description="Create a new service (Provider only)",
     *     operationId="storeService",
     *     tags={"Services"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "description", "price", "category_id"},
     *             @OA\Property(property="title", type="string", example="Professional Plumbing"),
     *             @OA\Property(property="description", type="string", example="Expert plumbing services"),
     *             @OA\Property(property="price", type="number", format="float", example=50.00),
     *             @OA\Property(property="category_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service Created Successfully"),
     *             @OA\Property(property="service", type="object")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Provider already has a service"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpg,jpeg,png'
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

                $imagePath = null;
                if ($request->hasFile('image')) {
                    $imagePath = $request->file('image')->store('services', 'public');
                }

                $service = Service::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'price' => $request->price,
                    'status' => 'pending',
                    'image' => $imagePath,
                    'category_id' => $request->category_id,
                    'provider_id' => $providerId
                ]);

                $request->user()->update([
                    'service_id' => $service->id
                ]);

                $service->with(['provider', 'category']);

                return $service;
            });

            event(new ServiceCreated($service));

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


    /**
     * @OA\Put(
     *     path="/update-service/{service}",
     *     summary="Update a service",
     *     description="Update service details (Provider only)",
     *     operationId="updateService",
     *     tags={"Services"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Professional Plumbing"),
     *             @OA\Property(property="description", type="string", example="Expert plumbing services"),
     *             @OA\Property(property="price", type="number", format="float", example=50.00)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service Updated Successfully"),
     *             @OA\Property(property="service", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Service not found")
     * )
     */
    public function update(Request $request, Service $service)
    {
        Log::info('Price :', [$request->only('price')]);
        $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg'
        ]);

        $data = $request->only(['title', 'description', 'price']);

        // Only update image if provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $data['image'] = $request->file('image')->store('services', 'public');
        }

        $service->update($data);

        return response()->json([
            'message' => 'Service Updated Successfully',
            'service' => $service
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/delete-service/{service}",
     *     summary="Delete a service",
     *     description="Soft delete a service",
     *     operationId="deleteService",
     *     tags={"Services"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service Deleted Successfully"),
     *             @OA\Property(property="service", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Service not found")
     * )
     */
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

    public function forceDelete($id){
        $service = Service::withTrashed()->findOrFail($id);
        $service->forceDelete();

        return response()->json([
            "message" => "Service permanently deleted successfully"
        ], 201);
    }


    /**
     * @OA\Patch(
     *     path="/admin/service/update-status/{service}",
     *     summary="Update service status",
     *     description="Approve or reject a service (Admin only)",
     *     operationId="updateServiceStatus",
     *     tags={"Services"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"approved", "rejected"}, example="approved")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service status updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Status Of Service Updated successfully"),
     *             @OA\Property(property="service", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Service not found")
     * )
     */
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
