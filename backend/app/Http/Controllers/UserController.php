<?php

namespace App\Http\Controllers;

use App\Events\ProviderApproved;
use App\Mail\ProviderApprovedMail;
use App\Mail\ProviderRejectedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;


class UserController extends Controller
{
    public function index()
    {
        $users = User::where('name', '!=', 'Admin')->get();
        return response()->json([
            "message" => "Users Retrieved Successfully",
            "users" => $users->load('roles'),
        ], 201);
    }

    public function updateStatus(Request $request, User $user)
    {
        $auth_user = $request->user();

        $validated = $request->validate([
            "status" => "required|in:approved,rejected"
        ]);

        if (!$user) {
            return response()->json([
                "message" => "Provider Not Found!!"
            ], 404);
        }

        $user->update($validated);

        if ($user->status === 'approved') {
            event(new ProviderApproved($user));
        } else {
            Mail::to($user->email)->send(new ProviderRejectedMail($user));
        }

        return response()->json([
            "message" => "Status Updated Successfully",
            "provider" => $user
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
