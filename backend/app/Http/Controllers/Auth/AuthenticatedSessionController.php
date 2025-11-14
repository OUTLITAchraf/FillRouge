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
     * @OA\Post(
     *     path="/login",
     *     summary="User login",
     *     description="Authenticate user and return access token",
     *     operationId="login",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="user@example.com"),
     *                 @OA\Property(property="roles", type="array", @OA\Items(
     *                     @OA\Property(property="name", type="string", example="client")
     *                 ))
     *             ),
     *             @OA\Property(property="token", type="string", example="1|abc123def456...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Account pending approval or rejected",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Your account is pending approval. Please wait for admin validation.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
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
     * @OA\Post(
     *     path="/logout",
     *     summary="User logout",
     *     description="Revoke the current user's access token",
     *     operationId="logout",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logged out successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Logged out successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
