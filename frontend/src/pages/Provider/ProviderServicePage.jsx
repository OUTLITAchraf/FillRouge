import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Briefcase,
  DollarSign,
  Tag,
  FileText,
  Upload,
  X,
  Edit,
  Plus,
  ImagePlus,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createService,
  fetchServices,
  updateService,
} from "../../features/ServiceSlice";
import { toast } from "sonner";

// Validation schema - make it dynamic
const createServiceSchema = yup.object().shape({
  title: yup
    .string()
    .required("Service title is required")
    .min(5, "Title must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  category_id: yup.string().required("Category is required"),
  image: yup.mixed().required("Image is required"),
});

const updateServiceSchema = yup.object().shape({
  title: yup
    .string()
    .required("Service title is required")
    .min(5, "Title must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  category_id: yup.string(),
  image: yup.mixed().nullable(), // Make image optional for updates
});

export default function ProviderServiceDashboard() {
  const [showModal, setShowModal] = useState(false);
  const {
    categories,
    services: { data, status },
    createServiceStatus,
    updateServiceStatus,
  } = useSelector((state) => state.services);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // Use different schema based on whether editing or creating
    resolver: yupResolver(
      data?.data?.[0] ? updateServiceSchema : createServiceSchema
    ),
    defaultValues: {
      id: null,
      title: "",
      description: "",
      price: "",
      category_id: "",
    },
  });

  const onSubmit = async (formDataValues) => {
    const formData = new FormData();

    formData.append("title", formDataValues.title);
    formData.append("description", formDataValues.description);
    formData.append("price", formDataValues.price);

    // Only append image if a new one is selected
    if (formDataValues.image && formDataValues.image[0]) {
      formData.append("image", formDataValues.image[0]);
    }

    try {
      let result;
      if (formDataValues?.id) {
        
        result = await dispatch(
          updateService({ id: formDataValues.id, formData })
        ).unwrap();
        console.log("Result of dispatch update service :", result);
        toast.success("Service Updated Successfully");
      } else {
        formData.append("category_id", formDataValues.category_id);

        result = await dispatch(createService(formData)).unwrap();
        console.log("Result of dispatch create service :", result);
        toast.success("Service Created Successfully");
      }

      await dispatch(fetchServices());

      setShowModal(false);
      reset();
    } catch (error) {
      console.log("Error creating service:", error);
      toast.error(
        error?.message ||
          error?.error ||
          "Failed to create service. Please try again."
      );
    }
  };

  const openModal = () => {
    if (data?.data?.[0]) {
      // Editing existing service
      reset({
        id: data?.data?.[0].id,
        title: data?.data?.[0].title,
        description: data?.data?.[0].description,
        price: data?.data?.[0].price,
        category_id: data?.data?.[0].category_id,
      });
    } else {
      // Adding new service
      reset({
        id: null,
        title: "",
        description: "",
        price: "",
        category_id: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-[#2ECC71]",
      pending: "bg-[#E67E22]",
      rejected: "bg-[#E74C3C]",
    };
    return colors[status] || "bg-[#95A5A6]";
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: CheckCircle,
      rejected: XCircle,
      pending: Edit,
    };
    return icons[status] || Edit;
  };

  const StatusIcon = getStatusIcon(data?.data?.[0]?.status);

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 lg:p-0 bg-[#ECF0F1]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#2C3E50]">
              My Service
            </h1>
            <p className="text-gray-600">Manage your service offering</p>
          </div>

          {data?.data?.[0] ? (
            // Service Exists - Display Service Card
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Service Image */}
              <div className="relative h-64 lg:h-96">
                <img
                  src={data?.data?.[0].image_url}
                  alt={data?.data?.[0].title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`flex items-center gap-2 absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
                    data?.data?.[0].status
                  )}`}
                >
                  <StatusIcon size={15} />
                  <p>
                    {data?.data?.[0].status.charAt(0).toUpperCase() +
                      data?.data?.[0].status.slice(1)}
                  </p>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-[#2C3E50]">
                      {data?.data?.[0].title}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-[#ECF0F1] text-[#2C3E50]">
                        <Tag size={14} />
                        {data?.data?.[0].category.display_name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={openModal}
                    className="px-4 py-2 rounded-lg text-white font-semibold transition-colors flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60]"
                  >
                    <Edit size={18} />
                    Update Service
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Description */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={20} className="text-[#2ECC71]" />
                      <h3 className="font-semibold text-[#2C3E50]">
                        Description
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {data?.data?.[0].description}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign size={20} className="text-[#2ECC71]" />
                      <h3 className="font-semibold text-[#2C3E50]">Price</h3>
                    </div>
                    <p className="text-4xl font-bold text-[#2ECC71]">
                      {data?.data?.[0].price} DH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // No Service - Display Empty State
            <div className="bg-white rounded-lg shadow-lg p-12 text-center lg:overflow-hidden">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#2ECC71]/10">
                <Briefcase size={48} className="text-[#2ECC71]" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[#2C3E50]">
                No Service Added Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't created your service yet. Add your service to start
                receiving reservations from customers.
              </p>
              <button
                onClick={openModal}
                className="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-colors inline-flex items-center gap-2 bg-[#E67E22] hover:bg-[#D35400]"
              >
                <Plus size={24} />
                Add Your Service
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2C3E50]">
                {data?.data?.[0] ? "Update Service" : "Add New Service"}
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
                {/* Title */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#2C3E50]">
                    <Briefcase size={18} className="text-[#2ECC71]" />
                    Service Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    placeholder="e.g., Professional Home Cleaning"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                  />
                  {errors.title && (
                    <p className="text-[#E74C3C] text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#2C3E50]">
                    <FileText size={18} className="text-[#2ECC71]" />
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows="4"
                    placeholder="Describe your service in detail..."
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors resize-none text-[#2C3E50]"
                  />
                  {errors.description && (
                    <p className="text-[#E74C3C] text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Price and Category Row */}
                <div
                  className={`grid grid-cols-1 ${
                    !data?.data?.[0] ? "md:grid-cols-2 gap-4" : ""
                  }`}
                >
                  {/* Price */}
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#2C3E50]">
                      <DollarSign size={18} className="text-[#2ECC71]" />
                      Price
                    </label>
                    <input
                      type="number"
                      {...register("price")}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                    />
                    {errors.price && (
                      <p className="text-[#E74C3C] text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  {!data?.data?.[0] ? (
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#2C3E50]">
                        <Tag size={18} className="text-[#2ECC71]" />
                        Category
                      </label>
                      <select
                        {...register("category_id")}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2ECC71] transition-colors text-[#2C3E50]"
                      >
                        <option value="">Select a category</option>
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.display_name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="text-[#E74C3C] text-sm mt-1">
                          {errors.category_id.message}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Image */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-[#2C3E50]">
                    <ImagePlus size={18} className="text-[#2ECC71]" />
                    Service Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3"
                  />

                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.image.message}
                    </p>
                  )}
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
                    disabled={
                      createServiceStatus == "loading" ||
                      updateServiceStatus == "loading"
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 ${
                      data?.data?.[0]
                        ? "bg-[#2ECC71] hover:bg-[#27AE60]"
                        : "bg-[#E67E22] hover:bg-[#D35400]"
                    }`}
                  >
                    {createServiceStatus == "loading" ||
                    updateServiceStatus == "loading" ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 text-red-600" />
                        <span className="font-medium">Uploading...</span>
                      </>
                    ) : data?.data?.[0] ? (
                      "Update Service"
                    ) : (
                      "Add Service"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
