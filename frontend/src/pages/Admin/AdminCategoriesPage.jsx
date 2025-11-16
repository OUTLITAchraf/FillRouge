import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Tag, Plus, Edit, Trash2, X, Loader2, FolderOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "../../features/ServiceSlice";
import { toast } from "sonner";

// Validation schema
const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  display_name: yup
    .string()
    .required("Display name is required")
    .min(2, "Display name must be at least 2 characters"),
});

export default function AdminCategoriesPage() {
  const { categories, createCategoryStatus, updateCategoryStatus, deleteCategoryStatus, fetchCategoriesStatus } =
    useSelector((state) => state.services);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    category: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      display_name: "",
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    reset({ name: "", display_name: "" });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    reset({
      id: category.id,
      name: category.name,
      display_name: category.display_name,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data) => {
    if (editingCategory) {
      try {

        await dispatch(updateCategory(data)).unwrap();
        setShowModal(false)
        toast.success("Category Updated Successfully")

        dispatch(fetchCategories())
      } catch (error) {
        console.log("Error :", error);
        setShowModal(true)

        toast.error("Request Failed!!!")

      }
    } else {
      try {
        await dispatch(createCategory(data)).unwrap();
        setShowModal(false);
        toast.success("Category Created Successfully");

        dispatch(fetchCategories());
      } catch (error) {
        console.log(error.response?.data?.message);
        setShowModal(true);
        if (error.status == 409) {
          toast.error("This category already exists");
        } else {
          toast.error("Request Failed");
        }
      }
    }
  };

  const openDeleteModal = (category) => {
    setDeleteModal({ open: true, category });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, category: null });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(deleteModal.category.id)).unwrap();
      setDeleteModal({ open: false, category: null });
      toast.success("Category Deleted Successfully");

      dispatch(fetchCategories())

    } catch (error) {
      console.log("Error :", error);
      setDeleteModal({ open: true })

      toast.error("Request Failed")
    }
  };

  if (fetchCategoriesStatus == "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 lg:p-4 bg-[#ECF0F1]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#2C3E50]">
                Categories Management
              </h1>
              <p className="text-gray-600">
                Manage service categories on the platform
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center gap-2 bg-[#E67E22] hover:bg-[#D35400]"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2C3E50]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Display Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories?.map((category, index) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#2C3E50]">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-[#ECF0F1] text-[#2C3E50]">
                          <Tag size={14} />
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#2C3E50]">
                        {category.display_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                          >
                            <Edit size={16} />
                            <p>Edit</p>
                          </button>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="flex items-center gap-2 p-2 rounded-lg transition-colors bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                          >
                            <Trash2 size={16} />
                            <p>Delete</p>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-xl font-bold text-[#2C3E50]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                    Name (slug)
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="e.g., cleaning, plumbing"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                  />
                  {errors.name && (
                    <p className="text-[#E74C3C] text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Use lowercase letters and hyphens only
                  </p>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                    Display Name
                  </label>
                  <input
                    type="text"
                    {...register("display_name")}
                    placeholder="e.g., Cleaning Services"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                  />
                  {errors.display_name && (
                    <p className="text-[#E74C3C] text-sm mt-1">
                      {errors.display_name.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This will be shown to users
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createCategoryStatus == "loading" || updateCategoryStatus == "loading"}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 ${editingCategory
                      ? "bg-[#2ECC71] hover:bg-[#27AE60]"
                      : "bg-[#E67E22] hover:bg-[#D35400]"
                      }`}
                  >
                    {createCategoryStatus == "loading" || updateCategoryStatus == "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        {editingCategory ? "Updating..." : "Adding..."}
                      </span>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Add Category"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#E74C3C]/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-[#E74C3C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#2C3E50]">
                  Delete Category
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>"{deleteModal.category?.display_name}"</strong>? but you can restore him later
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleteCategoryStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#ECF0F1] text-[#2C3E50] hover:bg-[#BDC3C7] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCategoryStatus == "loading"}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#E74C3C] hover:bg-[#C0392B] disabled:opacity-50"
              >
                {deleteCategoryStatus == "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Deleting...
                  </span>
                ) : (
                  "Delete Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
