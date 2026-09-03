import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...formData,
    };

    login(updatedUser);

    setMessage("Profile updated successfully!");
  };

  return (
    <section className="w-full">
      {/* =========================
          Heading
      ========================= */}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
          Manage your personal information.
        </p>
      </div>

      {/* =========================
          Profile Card
      ========================= */}

      <div className="w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
        {/* Success Message */}

        {message && (
          <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm sm:text-base text-green-700">
              {message}
            </p>
          </div>
        )}

        {/* =========================
            Profile Image / User Info
        ========================= */}

        <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl">
              👤
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
              FixNear User
            </p>
          </div>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Name */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Location */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* =========================
              Save Button
          ========================= */}

          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;