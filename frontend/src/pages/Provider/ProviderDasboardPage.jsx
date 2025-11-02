import React, { useState } from "react";
import { Calendar, Star, User, Mail, Phone, MapPin } from "lucide-react";

export default function ProviderDasboardPage() {
  const [isEditing, setIsEditing] = useState(false);

  const [providerData, setProviderData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY, USA",
  });

  const [formData, setFormData] = useState({ ...providerData });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    setProviderData({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...providerData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: "#2C3E50" }}>
            Profile Information
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-white bg-[#E67E22] hover:bg-[#D35400] rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start space-x-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
              >
                <User style={{ color: "#2ECC71" }} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#2C3E50" }}
                >
                  {providerData.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
              >
                <Mail style={{ color: "#2ECC71" }} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#2C3E50" }}
                >
                  {providerData.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
              >
                <Phone style={{ color: "#2ECC71" }} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#2C3E50" }}
                >
                  {providerData.phone}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(46, 204, 113, 0.1)" }}
              >
                <MapPin style={{ color: "#2ECC71" }} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#2C3E50" }}
                >
                  {providerData.location}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Edit Form */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2C3E50" }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRing: "#2ECC71" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2C3E50" }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2C3E50" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#2C3E50" }}
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2ECC71")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {/* Save Changes button */}
              <button
                onClick={handleUpdate}
                className="flex-1 px-6 py-3 text-white bg-[#2ECC71] hover:bg-[#27AE60] rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>

              {/* Cancel button */}
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-[#ECF0F1] hover:bg-[#BDC3C7] text-[#2C3E50] rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: "#2C3E50" }}
              >
                24
              </p>
            </div>
            <Calendar style={{ color: "#2ECC71" }} size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: "#2C3E50" }}
              >
                18
              </p>
            </div>
            <Star style={{ color: "#E67E22" }} size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: "#2C3E50" }}
              >
                4.8
              </p>
            </div>
            <Star style={{ color: "#E67E22", fill: "#E67E22" }} size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
