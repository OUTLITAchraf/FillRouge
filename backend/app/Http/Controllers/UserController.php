<?php

namespace App\Http\Controllers;

use App\Events\ProviderApproved;
use App\Events\ProviderRejected;
use App\Mail\ProviderApprovedMail;
use App\Mail\ProviderRejectedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;


class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/providers",
     *     summary="Get all providers",
     *     description="Retrieve paginated list of service providers (Admin only)",
     *     operationId="getProviders",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=201,
     *         description="Providers retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Providers Retrieved Successfully"),
     *             @OA\Property(property="providers", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function getProviders(Request $request)
    {
        $query = User::whereHasRole('provider')->withTrashed();

        if ($request->filled('provider_name')) {
            $query->where('name', 'like', "%{$request->provider_name}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $providers = $query->orderByDesc('created_at')->with('service')->paginate(10);
        return response()->json([
            "message" => "Providers Retrieved Successfully",
            "providers" => $providers,
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/admin/clients",
     *     summary="Get all clients",
     *     description="Retrieve paginated list of clients (Admin only)",
     *     operationId="getClients",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="client_name",
     *         in="query",
     *         description="Filter by client name",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Clients retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Clients Retrieved Successfully"),
     *             @OA\Property(property="clients", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function getClients(Request $request)
    {
        $query = User::whereHasRole('client')->withTrashed();

        if ($request->filled('client_name')) {
            $query->where('name', 'like', "%{$request->client_name}%");
        }

        $clients = $query->orderByDesc('created_at')->paginate(10);
        return response()->json([
            "message" => "Clients Retrieved Successfully",
            "clients" => $clients,
        ], 200);
    }

    /**
     * @OA\Patch(
     *     path="/admin/provider/update-status/{provider}",
     *     summary="Update provider status",
     *     description="Approve or reject a provider (Admin only)",
     *     operationId="updateProviderStatus",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="provider",
     *         in="path",
     *         description="Provider ID",
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
     *         description="Provider status updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Status Updated Successfully"),
     *             @OA\Property(property="provider", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Provider not found")
     * )
     */
    public function updateStatus(Request $request, User $provider)
    {

        $validated = $request->validate([
            "status" => "required|in:approved,rejected"
        ]);

        if (!$provider) {
            return response()->json([
                "message" => "Provider Not Found!!"
            ], 404);
        }

        $provider->update($validated);

        if ($provider->status === 'approved') {
            event(new ProviderApproved($provider));
        } else {
            event(new ProviderRejected($provider));
        }

        return response()->json([
            "message" => "Status Updated Successfully",
            "provider" => $provider
        ], 201);
    }

    /**
     * @OA\Delete(
     *     path="/admin/delete-user/{user}",
     *     summary="Delete a user",
     *     description="Soft delete a user (Admin only)",
     *     operationId="deleteUser",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User Soft Deleted Successfully"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message' => 'User Soft Deleted Successfully',
            'user' => $user
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/admin/user/{id}/restore",
     *     summary="Restore a deleted user",
     *     description="Restore a soft-deleted user (Admin only)",
     *     operationId="restoreUser",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User restored successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User restored successfully"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return response()->json([
            'message' => 'User restored successfully',
            'user' => $user
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/admin/user/{id}/force-delete",
     *     summary="Permanently delete a user",
     *     description="Permanently delete a soft-deleted user (Admin only)",
     *     operationId="forceDeleteUser",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User permanently deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User permanently deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->forceDelete();
        return response()->json([
            'message' => 'User permanently deleted successfully',
        ], 201);
    }
}
