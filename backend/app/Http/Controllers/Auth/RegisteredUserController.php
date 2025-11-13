<?php

namespace App\Http\Controllers\Auth;

use App\Events\ProviderRegistered;
use App\Http\Controllers\Controller;
use App\Mail\ProviderRegisterMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'address' => ['required', 'string', 'min:10', 'max:200'], 
            'phone' => ['required', 'string', 'max:20', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:client,provider',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->role === 'provider' ? 'pending' : 'approved',
            'address' => $request->address, 
            'phone' => $request->phone,
        ]);
        $role = $request->role ? $request->role : 'admin';
        $user->addRole($role);
        $token = $user->createToken('auth_token')->plainTextToken;

        event(new Registered($user));

        if ($user->hasRole('provider')) {
            event(new ProviderRegistered($user));
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }
}
