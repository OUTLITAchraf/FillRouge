<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * @OA\Get(
     *     path="/reviews",
     *     summary="Get user reviews",
     *     description="Retrieve reviews for authenticated user (Client or Provider)",
     *     operationId="getReviews",
     *     tags={"Reviews"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="rating",
     *         in="query",
     *         description="Filter by rating",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="client_name",
     *         in="query",
     *         description="Filter by client name",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reviews fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review Fetched Successfully"),
     *             @OA\Property(property="reviews", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="statistics", type="object",
     *                 @OA\Property(property="total_reviews", type="integer"),
     *                 @OA\Property(property="average_rating", type="number"),
     *                 @OA\Property(property="rating_distribution", type="object")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Review::query()->with('client');

        if ($user->hasRole('provider')) {
            $query->where('service_id',$user->service_id);
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('client_name')) {
            $query->whereHas('client', function ($q) use ($request) {
                $q->where('name','like',"%{$request->client_name}%");
            });
        }

        if ($user->hasRole('admin')) {
            $query->withTrashed();
            $reviews = $query->orderByDesc('deleted_at')->with(['service.provider', 'service.category'])->paginate(10);
        }

        $reviews = $query->orderByDesc('created_at')->paginate(10);

        $allReviews = Review::query();
        if ($user->hasRole('provider')) {
            $allReviews->where('service_id', $user->service_id);
        }
        
        $totalReviews = $allReviews->count();
        $averageRating = $totalReviews > 0 ? round($allReviews->avg('rating'), 1) : 0;
        
        $ratingDistribution = [
            5 => $allReviews->clone()->where('rating', 5)->count(),
            4 => $allReviews->clone()->where('rating', 4)->count(),
            3 => $allReviews->clone()->where('rating', 3)->count(),
            2 => $allReviews->clone()->where('rating', 2)->count(),
            1 => $allReviews->clone()->where('rating', 1)->count(),
        ];

        return response()->json([
            'message' => 'Review Fetched Successfully',
            'reviews' => $reviews,
            'statistics' => [
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'rating_distribution' => $ratingDistribution
            ]
        ], 200);
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

    /**
     * @OA\Post(
     *     path="/admin/review/{id}/restore",
     *     summary="Restore a deleted review",
     *     description="Restore a soft-deleted review (Admin only)",
     *     operationId="restoreReview",
     *     tags={"Reviews"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Review ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review restored successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review restored successfully"),
     *             @OA\Property(property="review", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Review not found")
     * )
     */
    public function restore($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->restore();

        return response()->json([
            'message' => 'Review restored successfully',
            'review' => $review
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/admin/review/{review}/force-delete",
     *     summary="Permanently delete a review",
     *     description="Permanently delete a soft-deleted review (Admin only)",
     *     operationId="forceDeleteReview",
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
     *         description="Review permanently deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Review permanently deleted successfully"),
     *             @OA\Property(property="review", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Review not found")
     * )
     */
    public function forceDelete($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->forceDelete();

        return response()->json([
            'message' => 'Review permanently deleted successfully',
            'review' => $review
        ], 201);
    }
}
