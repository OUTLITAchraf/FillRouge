<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user()->load('roles');
    return response()->json([
        "message" => "User Fetched Successfully",
        "user" => $user,
    ]);
});

Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest')->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest')->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('guest')->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('guest')->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['auth', 'signed', 'throttle:6,1'])->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum')->name('logout');


Route::middleware('auth:sanctum')->group(function (){
    Route::get('/services',[ServiceController::class, 'index']);
    Route::get('/service/{service}',[ServiceController::class, 'show']);
    Route::post('/service/{service}/reserve',[ReservationController::class, 'store']);

    Route::delete('/delete-review/{review}',[ReviewController::class, 'destroy']);
});


Route::middleware(['auth:sanctum','role:user'])->group(function (){
    Route::post('/service/{service}/review',[ReviewController::class, 'store']);
    Route::put('/update-review/{review}',[ReviewController::class, 'update']);
});


Route::middleware(['auth:sanctum','role:provider'])->group(function (){
    Route::post('/create-service',[ServiceController::class, 'store']);
    Route::put('/update-service/{service}',[ServiceController::class, 'update']);
    Route::delete('/delete-service/{service}',[ServiceController::class, 'destroy']);

    Route::put('/reservation/update-status/{reservation}',[ReservationController::class, 'updateStatus']);
});


Route::middleware(['auth:sanctum','role:admin'])->group(function(){
    Route::get('/admin/users',[UserController::class, 'index']);
    Route::put('/admin/update-status/{user}',[UserController::class, 'updateStatus']);

    Route::get('/categories',[CategoryController::class, 'index']);
    Route::post('/create-category',[CategoryController::class, 'store']);
    Route::put('/update-category/{category}',[CategoryController::class, 'update']);
    Route::delete('/delete-category/{category}',[CategoryController::class, 'destroy']);

    Route::put('/service/update-status/{service}',[ServiceController::class, 'updateStatus']);
});
