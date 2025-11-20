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
use App\Http\Controllers\CityController;
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


Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service/{service}', [ServiceController::class, 'show']);
Route::get('/services/category/{category}', [ServiceController::class, 'bycategory']);
Route::get('/search-service', [ServiceController::class, 'searchByProvider']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/cities', [CityController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/service/{service}/reserve', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reviews', [ReviewController::class, 'index']);

    Route::patch('/reservation/update-status/{reservation}', [ReservationController::class, 'updateStatus']);

    Route::delete('/delete-review/{review}', [ReviewController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'role:client'])->group(function () {
    Route::post('/service/{service}/add-review', [ReviewController::class, 'store']);
    Route::put('/update-review/{review}', [ReviewController::class, 'update']);
});


Route::middleware(['auth:sanctum', 'role:provider'])->group(function () {
    Route::post('/create-service', [ServiceController::class, 'store']);
    Route::post('/update-service/{service}', [ServiceController::class, 'update']);
    Route::delete('/delete-service/{service}', [ServiceController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/admin/providers', [UserController::class, 'getProviders']);
    Route::get('/admin/clients', [UserController::class, 'getClients']);
    Route::patch('/admin/provider/update-status/{provider}', [UserController::class, 'updateStatus']);
    Route::delete('/admin/delete-user/{user}', [UserController::class, 'destroy']);

    Route::post('/admin/create-category', [CategoryController::class, 'store']);
    Route::put('/admin/update-category/{category}', [CategoryController::class, 'update']);
    Route::delete('/admin/delete-category/{category}', [CategoryController::class, 'destroy']);

    Route::patch('/admin/service/update-status/{service}', [ServiceController::class, 'updateStatus']);

    Route::post('/admin/user/{id}/restore', [UserController::class, 'restore']);
    Route::post('/admin/service/{id}/restore', [ServiceController::class, 'restore']);
    Route::post('/admin/review/{id}/restore', [ReviewController::class, 'restore']);
    Route::post('/admin/category/{id}/restore', [CategoryController::class, 'restore']);

    Route::post('/admin/user/{id}/force-delete', [UserController::class, 'forceDelete']);
    Route::post('/admin/service/{service}/force-delete',[ServiceController::class, 'forceDelete']);
    Route::post('/admin/category/{category}/force-delete',[CategoryController::class, 'forceDelete']);

});
