<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $user = $request->user();

        if ($user->hasRole("provider") && $user->status === 'pending') {
            return response()->json([
                'message' => 'Your account is pending approval. Please wait for admin validation.',
            ], 403);
        }

        if ($user->hasRole("provider") && $user->status === 'rejected'){
            return response()->json([
                "message" => "Your account have been rejected by admin",
            ], 403);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        $user = $user->load('roles');

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token'=> $token,
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
