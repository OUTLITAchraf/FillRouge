<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request,Service $service){
        $this->authorize('create');

        $request->validate([
            'rating' => 'required|int',
            'comment' => 'required|string'
        ]);

        $user = $request->user();

        $exists = Review::where('client_id',$user->id)->where('service_id',$service->id)->exists();

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

    public function update(Request $request,Review $review){

        $this->authorize('update',$review);

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

    public function destroy(Review $review){
        $this->authorize('delete',$review);

        $review->delete();

        return response()->json([
            'message' => 'Review Deleted Successfully',
            'review' => $review
        ], 201);
    }
}
