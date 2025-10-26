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
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:user,provider',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->role === 'provider' ? 'pending' : 'approved',
        ]);
        $role = $request->role?$request->role:'admin';
        $user->addRole($role);

        event(new Registered($user));

        $admin = User::where('name','admin')->first();

        if ($user->hasRole('provider')) {
            event(new ProviderRegistered($user));
        }

        return response()->json([
            'message' => 'User registered successfully',
            'role' => $request->role,
        ], 201);
    }
}
