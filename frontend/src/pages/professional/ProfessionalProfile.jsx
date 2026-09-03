import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfessionalProfile = () => {
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("fixnearToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfessional(response.data.professional);
      } catch (error) {
        console.error(
          "Failed to fetch professional profile:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[240px] sm:min-h-[300px]">
        <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Professional Profile Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Professional Profile
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            View your professional account information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/professional-profile/edit")}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            {professional.image ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-gray-200 flex items-center justify-center text-3xl sm:text-4xl">
                👤
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
              {professional.name}
            </h2>

            <p className="text-blue-600 text-sm sm:text-base font-medium mt-1 break-words">
              {professional.profession}
            </p>

            <p className="text-gray-500 text-sm sm:text-base mt-2 break-words">
              {professional.email}
            </p>

            <p className="text-gray-500 text-sm sm:text-base break-words">
              {professional.phone || "Phone not provided"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {professional.available ? (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-medium">
                  Unavailable
                </span>
              )}

              {professional.isVerified && (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-8">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-400">
              Experience
            </p>

            <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
              {professional.experience || "Not provided"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-400">
              Price
            </p>

            <p className="font-medium text-sm sm:text-base text-green-600 mt-0.5">
              ₹{professional.price}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-400">
              City
            </p>

            <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
              {professional.city || "Not provided"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-400">
              State
            </p>

            <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
              {professional.state || "Not provided"}
            </p>
          </div>

          {professional.pincode && (
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-400">
                Pincode
              </p>

              <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5">
                {professional.pincode}
              </p>
            </div>
          )}

          {professional.location && (
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-400">
                Location
              </p>

              <p className="font-medium text-sm sm:text-base text-gray-700 mt-0.5 break-words">
                {professional.location}
              </p>
            </div>
          )}
        </div>

        {professional.address && (
          <div className="mt-5 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-400">
              Address
            </p>

            <p className="text-sm sm:text-base text-gray-700 mt-1 break-words leading-relaxed">
              {professional.address}
            </p>
          </div>
        )}

        {professional.description && (
          <div className="mt-5 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-400">
              Description
            </p>

            <p className="text-sm sm:text-base text-gray-700 mt-1 break-words leading-relaxed">
              {professional.description}
            </p>
          </div>
        )}

        {professional.skills?.length > 0 && (
          <div className="mt-5 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {professional.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm break-words"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {professional.serviceArea?.length > 0 && (
          <div className="mt-5 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Service Areas
            </p>

            <div className="flex flex-wrap gap-2">
              {professional.serviceArea.map(
                (area, index) => (
                  <span
                    key={index}
                    className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm break-words"
                  >
                    {area}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfile;