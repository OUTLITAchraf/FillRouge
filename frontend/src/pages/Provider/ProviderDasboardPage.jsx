import React, { useEffect, useState } from "react";
import {
  Calendar,
  Star,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchServices } from "../../features/ServiceSlice";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(
      /^(\+212|0)[5-7]\d{8}$/,
      "Please enter a valid Moroccan phone number (e.g., +212600000000 or 0600000000)"
    )
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

export default function ProviderDasboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { data, status } = useSelector((state) => state.services.services);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log("Updated data:", data);
    // 🔹 call API here (ex: api.put(`/provider/${user.id}`, data))
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setIsEditing(false);
  };

  const calculateAverageRating = () => {
    const reviews = data?.data?.[0]?.reviews;
    if (!reviews || reviews?.length === 0) return 0;
    const sum = reviews?.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews?.length).toFixed(1);
  };

  return (
    <>
      {status == "loading" ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto ">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: "#2C3E50" }}>
                Profile Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex flex-row gap-2 px-2 py-2 text-white items-center bg-[#E67E22] hover:bg-[#D35400] rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                {/* Name */}
                <ProfileField
                  icon={<User color="#2ECC71" />}
                  label="Full Name"
                  value={user.name}
                />
                {/* Email */}
                <ProfileField
                  icon={<Mail color="#2ECC71" />}
                  label="Email Address"
                  value={user.email}
                />
                {/* Phone */}
                <ProfileField
                  icon={<Phone color="#2ECC71" />}
                  label="Phone Number"
                  value={user.phone}
                />
                {/* Address */}
                <ProfileField
                  icon={<MapPin color="#2ECC71" />}
                  label="Address"
                  value={user.address}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormInput
                  label="Full Name"
                  name="name"
                  register={register}
                  error={errors.name}
                />

                {/* Email */}
                <FormInput
                  label="Email Address"
                  name="email"
                  register={register}
                  error={errors.email}
                />

                {/* Phone */}
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  register={register}
                  error={errors.phone}
                />

                {/* Address */}
                <FormInput
                  label="Address"
                  name="address"
                  register={register}
                  error={errors.address}
                />

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white bg-[#2ECC71] hover:bg-[#27AE60] rounded-lg transition-colors font-medium"
                  >
                    <Save className="w-5 h-5" /> {/* Save icon */}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#ECF0F1] hover:bg-[#BDC3C7] text-[#2C3E50] rounded-lg transition-colors font-medium"
                  >
                    <X className="w-5 h-5" /> {/* Cancel icon */}
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <StatCard
              icon={<Calendar color="#2ECC71" size={32} />}
              label="Total Reservations"
              value={data?.data?.[0]?.reservations?.length}
            />
            <StatCard
              icon={<Star color="#E67E22" size={32} />}
              label="Total Reviews"
              value={data?.data?.[0]?.reviews?.length}
            />
            <StatCard
              icon={<Star color="#E67E22" fill="#E67E22" size={32} />}
              label="Average Rating"
              value={calculateAverageRating()}
            />
          </div>
        </div>
      )}
    </>
  );
}

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="w-13 h-13 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#2ECC711A]">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-[#2C3E50]">{value || "-"}</p>
    </div>
  </div>
);

const FormInput = ({ label, name, type = "text", register, error }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-[#2C3E50]">
      {label}
    </label>
    <input
      type={type}
      {...register(name)}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-[#2ECC71]"
      }`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1 text-[#2C3E50]">
        {value ? value : 0}
      </p>
    </div>
    {icon}
  </div>
);
