import { User, Mail } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminDasboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
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
          </div>
        </div>
      </div>
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
