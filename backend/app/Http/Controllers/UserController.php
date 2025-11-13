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
    public function getProviders()
    {
        $providers = User::whereHasRole('provider')->with('service')->paginate(10);
        return response()->json([
            "message" => "Providers Retrieved Successfully",
            "providers" => $providers,
        ], 201);
    }

        public function getUsers()
    {
        $users = User::whereHasRole('client')->paginate(10);
        return response()->json([
            "message" => "Users Retrieved Successfully",
            "users" => $users,
        ], 201);
    }

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

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message' => 'User Soft Deleted Successfully',
            'user' => $user
        ], 201);
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return response()->json([
            'message' => 'User restored successfully',
            'user' => $user
        ], 201);
    }
}
