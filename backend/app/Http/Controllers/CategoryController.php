<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::all();
        return response()->json([
            "message" => "Categories Fetched Successfully",
            "categories" => $categories
        ], 201);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "display_name" => "required|string"
        ]);

        $category = Category::create($validated);
        return response()->json([
            "message" => "Category Created Successfully",
            "category" => $category
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "display_name" => "required|string"
        ]);
        $category->update($validated);

        return response()->json([
            "message" => "Category Updated Successfully",
            "category" => $category
        ], 201);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            "message" => "Category Deleted Successfully",
            "category" => $category
        ], 201);
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();

        return response()->json([
            'message' => 'Category restored successfully',
            'category' => $category
        ], 201);
    }
}
