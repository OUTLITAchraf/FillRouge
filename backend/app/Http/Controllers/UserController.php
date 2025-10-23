<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function updateStatus(Request $request,User $user){
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
        return response()->json([
            "message" => "Status Updated Successfully",
            "provider" => $user
        ], 201);
    }
}
