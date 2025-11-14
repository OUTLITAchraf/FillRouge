<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="FillRouge API",
 *     version="1.0.0",
 *     description="API documentation for FillRouge service reservation platform",
 *     @OA\Contact(
 *         email="support@fillrouge.com",
 *         name="FillRouge Support"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local API Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Enter your Bearer token in the format: Bearer {token}"
 * )
 * 
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints for user authentication"
 * )
 * 
 * @OA\Tag(
 *     name="Categories",
 *     description="API Endpoints for managing categories"
 * )
 * 
 * @OA\Tag(
 *     name="Services",
 *     description="API Endpoints for managing services"
 * )
 * 
 * @OA\Tag(
 *     name="Reservations",
 *     description="API Endpoints for managing reservations"
 * )
 * 
 * @OA\Tag(
 *     name="Reviews",
 *     description="API Endpoints for managing reviews"
 * )
 * 
 * @OA\Tag(
 *     name="Users",
 *     description="API Endpoints for managing users and providers"
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
