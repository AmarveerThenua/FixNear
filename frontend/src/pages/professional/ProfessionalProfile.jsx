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
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-2.5 sm:p-4 md:p-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-8 text-center shadow-sm border border-gray-100">
          <h2 className="text-base sm:text-xl font-semibold text-gray-800">
            Professional Profile Not Found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-6 min-h-screen">
      <div className="mb-3 sm:mb-5 lg:mb-6 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
            My Professional Profile
          </h1>

          <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500 mt-0.5 truncate">
            View your professional account information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/professional-profile/edit")}
          className="shrink-0 px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-blue-600 text-white rounded-md sm:rounded-lg hover:bg-blue-700 transition font-medium text-[9px] sm:text-xs lg:text-sm"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-4 md:p-5 lg:p-6 max-w-5xl">
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
          <div className="flex-shrink-0">
            {professional.image ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg sm:rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center text-xl sm:text-3xl">
                👤
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate">
              {professional.name}
            </h2>

            <p className="text-blue-600 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium mt-0.5 truncate">
              {professional.profession}
            </p>

            <p className="text-gray-500 text-[9px] sm:text-xs lg:text-sm mt-1 truncate">
              {professional.email}
            </p>

            <p className="text-gray-500 text-[9px] sm:text-xs lg:text-sm truncate">
              {professional.phone || "Phone not provided"}
            </p>

            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
              {professional.available ? (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-medium">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-medium">
                  Unavailable
                </span>
              )}

              {professional.isVerified && (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-5 lg:mt-6">
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
              Experience
            </p>
            <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 truncate">
              {professional.experience || "Not provided"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
              Price
            </p>
            <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-green-600 mt-0.5 truncate">
              ₹{professional.price}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
              City
            </p>
            <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 truncate">
              {professional.city || "Not provided"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
              State
            </p>
            <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 truncate">
              {professional.state || "Not provided"}
            </p>
          </div>

          {professional.pincode && (
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
                Pincode
              </p>
              <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 truncate">
                {professional.pincode}
              </p>
            </div>
          )}

          {professional.location && (
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
                Location
              </p>
              <p className="font-medium text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 truncate">
                {professional.location}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-5">
          {professional.address && (
            <div className="min-w-0 bg-gray-50 rounded-md sm:rounded-lg p-2 sm:p-3">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
                Address
              </p>

              <p className="text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 break-words line-clamp-2 leading-relaxed">
                {professional.address}
              </p>
            </div>
          )}

          {professional.description && (
            <div className="min-w-0 bg-gray-50 rounded-md sm:rounded-lg p-2 sm:p-3">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400">
                Description
              </p>

              <p className="text-[9px] sm:text-xs lg:text-sm text-gray-700 mt-0.5 break-words line-clamp-2 leading-relaxed">
                {professional.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-4">
          {professional.skills?.length > 0 && (
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400 mb-1">
                Skills
              </p>

              <div className="flex flex-wrap gap-1">
                {professional.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[7px] sm:text-[10px] lg:text-xs break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {professional.serviceArea?.length > 0 && (
            <div className="min-w-0">
              <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-400 mb-1">
                Service Areas
              </p>

              <div className="flex flex-wrap gap-1">
                {professional.serviceArea.map((area, index) => (
                  <span
                    key={index}
                    className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[7px] sm:text-[10px] lg:text-xs break-words"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;