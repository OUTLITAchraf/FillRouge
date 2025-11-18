<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/reviews",
     *     summary="Get all reviews",
     *     description="Retrieve all reviews Admin only",
     *     operationId="getReviews",
     *     tags={"Reviews"},
     *     @OA\Response(
     *         response=201,
     *         description="Reviews fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review Fetched Successfully"),
     *             @OA\Property(property="reviews", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $reviews = Review::orderByDesc('created_at')->get();

        return response()->json([
            'message' => 'Review Fetched Successfully',
            'reviews' => $reviews->load('user')
        ], 201);
    }
    /**
     * @OA\Post(
     *     path="/service/{service}/add-review",
     *     summary="Create a review",
     *     description="Create a review for a service (Client only)",
     *     operationId="storeReview",
     *     tags={"Reviews"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="service",
     *         in="path",
     *         description="Service ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"rating", "comment"},
     *             @OA\Property(property="rating", type="integer", example=5),
     *             @OA\Property(property="comment", type="string", example="Excellent service!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review posted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Your Review Posted Successfully"),
     *             @OA\Property(property="review", type="object")
     *         )
     *     ),
     *     @OA\Response(response=409, description="Already reviewed this service"),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function store(Request $request, Service $service)
    {

        $request->validate([
            'rating' => 'required|int',
            'comment' => 'required|string'
        ]);

        $user = $request->user();

        $exists = Review::where('client_id', $user->id)->where('service_id', $service->id)->exists();

        if ($exists) {
            return response()->json([
                'message' => 'You have already reviewed this service.'
            ], 409);
        }

        $review = Review::create([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'client_id' => $user->id,
            'service_id' => $service->id
        ]);

        return response()->json([
            'message' => 'Your Review Posted Successfully',
            'review' => $review
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/update-review/{review}",
     *     summary="Update a review",
     *     description="Update your own review",
     *     operationId="updateReview",
     *     tags={"Reviews"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="review",
     *         in="path",
     *         description="Review ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="rating", type="integer", example=4),
     *             @OA\Property(property="comment", type="string", example="Updated review comment")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Your Review Updated Successfully"),
     *             @OA\Property(property="review", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Review not found")
     * )
     */
    public function update(Request $request, Review $review)
    {

        $this->authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'nullable|int',
            'comment' => 'nullable|string'
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Your Review Updated Successfully',
            'review' => $review
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/delete-review/{review}",
     *     summary="Delete a review",
     *     description="Delete your own review",
     *     operationId="deleteReview",
     *     tags={"Reviews"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="review",
     *         in="path",
     *         description="Review ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review Deleted Successfully"),
     *             @OA\Property(property="review", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Review not found")
     * )
     */
    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json([
            'message' => 'Review Deleted Successfully',
            'review' => $review
        ], 201);
    }

    public function restore($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->restore();

        return response()->json([
            'message' => 'Review restored successfully',
            'review' => $review
        ], 201);
    }
}
