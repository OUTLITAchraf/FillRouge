import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";

export default function ProviderDasboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { data, status } = useSelector((state) => state.services.services);
  const fullAdress = `${user?.address}, ${data?.data?.[0].city?.name}` 


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
            </div>

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
                value={fullAdress}
              />
            </div>
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
