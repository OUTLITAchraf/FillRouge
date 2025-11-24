<?php

namespace App\Http\Controllers;

use App\Models\City;

class CityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/cities",
     *     summary="Get all cities",
     *     description="Retrieve a list of all available cities",
     *     operationId="getCities",
     *     tags={"Cities"},
     *     @OA\Response(
     *         response=200,
     *         description="Cities fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Cities fetched successfully"),
     *             @OA\Property(property="cities", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="New York")
     *             ))
     *         )
     *     )
     * )
     */
    public function index(){
        $cities = City::all();
        return response()->json([
            "message" => "Cities fetched successfully",
            "cities" => $cities
        ], 200);
    }
}
