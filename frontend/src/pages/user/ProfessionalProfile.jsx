import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ProfessionalProfile = () => {
  const { id } = useParams();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals/${id}`
        );

        setProfessional(response.data.professional);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load professional."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Loading professional...
          </p>
        </div>
      </section>
    );
  }

  if (error || !professional) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            {error || "This professional does not exist."}
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-5 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700"
          >
            Back to Professionals
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-5 lg:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            {professional.image ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-4xl sm:text-5xl">👤</span>
              </div>
            )}

            <div className="text-center md:text-left flex-1 min-w-0 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {professional.name}
                </h1>

                {professional.isVerified && (
                  <span className="inline-block w-fit mx-auto md:mx-0 px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-blue-600 font-medium">
                {professional.profession}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                <span className="text-yellow-500 text-sm sm:text-base">
                  ★
                </span>

                <span className="font-semibold text-sm sm:text-base">
                  {professional.rating}
                </span>

                <span className="text-gray-500 text-xs sm:text-sm">
                  ({professional.reviews} reviews)
                </span>
              </div>

              <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm break-words">
                📍 {professional.location || professional.city}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 mt-3 sm:mt-6">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm">
              Experience
            </p>

            <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-gray-900 break-words">
              {professional.experience || "Not specified"}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm">
              Starting Price
            </p>

            <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-gray-900">
              ₹{professional.price}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm">
              Availability
            </p>

            <p
              className={`mt-1.5 sm:mt-2 text-base sm:text-xl font-bold ${
                professional.available
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {professional.available
                ? "Available"
                : "Unavailable"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 mt-3 sm:mt-6 shadow-sm">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            About Professional
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-gray-600 leading-relaxed break-words">
            {professional.description ||
              `${professional.name} is an experienced ${professional.profession.toLowerCase()} providing reliable and quality services.`}
          </p>
        </div>

        {professional.skills?.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 mt-3 sm:mt-6 shadow-sm">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Skills
            </h2>

            <div className="flex flex-wrap gap-1.5 sm:gap-3 mt-3 sm:mt-5">
              {professional.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 sm:px-4 py-1 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-sm font-medium break-words"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 mt-3 sm:mt-6 shadow-sm">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Address & Service Area
          </h2>

          <div className="mt-3 sm:mt-5 space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-base text-gray-600 break-words">
              <span className="font-medium text-gray-900">
                Address:
              </span>{" "}
              {professional.address || "Not provided"}
            </p>

            <p className="text-xs sm:text-base text-gray-600">
              <span className="font-medium text-gray-900">
                City:
              </span>{" "}
              {professional.city || "Not provided"}
            </p>

            <p className="text-xs sm:text-base text-gray-600">
              <span className="font-medium text-gray-900">
                State:
              </span>{" "}
              {professional.state || "Not provided"}
            </p>

            <p className="text-xs sm:text-base text-gray-600">
              <span className="font-medium text-gray-900">
                Pincode:
              </span>{" "}
              {professional.pincode || "Not provided"}
            </p>
          </div>

          {professional.serviceArea?.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <p className="font-medium text-gray-900 text-xs sm:text-base mb-2 sm:mb-3">
                Service Areas
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {professional.serviceArea.map((area, index) => (
                  <span
                    key={index}
                    className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] sm:text-sm break-words"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 mt-3 sm:mt-6 shadow-sm">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Availability
          </h2>

          <div className="mt-3 sm:mt-4">
            {professional.available ? (
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-base font-medium">
                ● Available Now
              </span>
            ) : (
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-500 rounded-full text-xs sm:text-base font-medium">
                ● Currently Unavailable
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-8">
          {professional.available ? (
            <Link
              to={`/book/${professional._id}`}
              className="block w-full py-3 sm:py-4 text-center bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 transition"
            >
              Book This Professional
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3 sm:py-4 bg-gray-300 text-gray-500 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          )}
        </div>

        <div className="text-center mt-4 sm:mt-6">
          <Link
            to="/professionals"
            className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
          >
            ← Back to Professionals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalProfile;