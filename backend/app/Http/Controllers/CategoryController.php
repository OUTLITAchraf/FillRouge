<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/categories",
     *     summary="Get all categories",
     *     description="Retrieve a list of all categories",
     *     operationId="getCategories",
     *     tags={"Categories"},
     *     @OA\Response(
     *         response=201,
     *         description="Categories fetched successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Categories Fetched Successfully"),
     *             @OA\Property(property="categories", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="plumbing"),
     *                 @OA\Property(property="display_name", type="string", example="Plumbing Services")
     *             ))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $categories = Category::withTrashed()->orderByDesc('created_at')->get();
        return response()->json([
            "message" => "Categories Fetched Successfully",
            "categories" => $categories
        ], 200);
    }
    /**
     * @OA\Post(
     *     path="/admin/create-category",
     *     summary="Create a new category",
     *     description="Create a new category (Admin only)",
     *     operationId="storeCategory",
     *     tags={"Categories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "display_name"},
     *             @OA\Property(property="name", type="string", example="plumbing"),
     *             @OA\Property(property="display_name", type="string", example="Plumbing Services")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category Created Successfully"),
     *             @OA\Property(property="category", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "display_name" => "required|string"
        ]);

        $nameExists = Category::where('name', $request->name)->exists();
        $displayNameExists = Category::where('display_name', $request->display_name)->exists();

        if ($nameExists || $displayNameExists) {
            return response()->json([
                'message' => 'This category already exists'
            ], 409);
        }

        $category = Category::create($validated);
        return response()->json([
            "message" => "Category Created Successfully",
            "category" => $category
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/admin/update-category/{category}",
     *     summary="Update a category",
     *     description="Update an existing category (Admin only)",
     *     operationId="updateCategory",
     *     tags={"Categories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="Category ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "display_name"},
     *             @OA\Property(property="name", type="string", example="plumbing"),
     *             @OA\Property(property="display_name", type="string", example="Plumbing Services")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category Updated Successfully"),
     *             @OA\Property(property="category", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Category not found")
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/admin/delete-category/{category}",
     *     summary="Delete a category",
     *     description="Soft delete a category (Admin only)",
     *     operationId="deleteCategory",
     *     tags={"Categories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="Category ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category Deleted Successfully"),
     *             @OA\Property(property="category", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Category not found")
     * )
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            "message" => "Category Deleted Successfully",
            "category" => $category
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/admin/category/{id}/restore",
     *     summary="Restore a deleted category",
     *     description="Restore a soft-deleted category (Admin only)",
     *     operationId="restoreCategory",
     *     tags={"Categories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Category ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category restored successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category restored successfully"),
     *             @OA\Property(property="category", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Category not found")
     * )
     */
    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();

        return response()->json([
            'message' => 'Category restored successfully',
            'category' => $category
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/admin/category/{category}/force-delete",
     *     summary="Permanently delete a category",
     *     description="Permanently delete a soft-deleted category (Admin only)",
     *     operationId="forceDeleteCategory",
     *     tags={"Categories"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="Category ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category permanently deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Category permanently deleted successfully"),
     *             @OA\Property(property="category", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Category not found")
     * )
     */
    public function forceDelete($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->forceDelete();

        return response()->json([
            'message' => 'Category permanently deleted successfully',
            'category' => $category
        ], 201);
    }
}
