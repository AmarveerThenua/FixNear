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

        console.log(
          "Professional:",
          response.data.professional
        );

        setProfessional(
          response.data.professional
        );
      } catch (error) {
        console.error(
          "Fetch professional error:",
          error
        );

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
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading professional...
          </p>
        </div>
      </section>
    );
  }

  if (error || !professional) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error || "This professional does not exist."}
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Professionals
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {professional.image ? (
              <img
                src={professional.image}
                alt={professional.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
            )}

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {professional.name}
                </h1>

                {professional.isVerified && (
                  <span className="inline-block w-fit mx-auto md:mx-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="mt-2 text-blue-600 font-medium">
                {professional.profession}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <span className="text-yellow-500">
                  ★
                </span>

                <span className="font-semibold">
                  {professional.rating}
                </span>

                <span className="text-gray-500">
                  ({professional.reviews} reviews)
                </span>
              </div>

              <p className="mt-3 text-gray-600">
                📍 {professional.location || professional.city}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Experience
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {professional.experience || "Not specified"}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Starting Price
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              ₹{professional.price}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Availability
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
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

        <div className="bg-white rounded-2xl p-8 mt-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            About Professional
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {professional.description ||
              `${professional.name} is an experienced ${professional.profession.toLowerCase()} providing reliable and quality services.`}
          </p>
        </div>

        {professional.skills?.length > 0 && (
          <div className="bg-white rounded-2xl p-8 mt-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3 mt-5">
              {professional.skills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 mt-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Address & Service Area
          </h2>

          <div className="mt-5 space-y-3">
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">
                Address:
              </span>{" "}
              {professional.address || "Not provided"}
            </p>

            <p className="text-gray-600">
              <span className="font-medium text-gray-900">
                City:
              </span>{" "}
              {professional.city || "Not provided"}
            </p>

            <p className="text-gray-600">
              <span className="font-medium text-gray-900">
                State:
              </span>{" "}
              {professional.state || "Not provided"}
            </p>

            <p className="text-gray-600">
              <span className="font-medium text-gray-900">
                Pincode:
              </span>{" "}
              {professional.pincode || "Not provided"}
            </p>
          </div>

          {professional.serviceArea?.length > 0 && (
            <div className="mt-6">
              <p className="font-medium text-gray-900 mb-3">
                Service Areas
              </p>

              <div className="flex flex-wrap gap-2">
                {professional.serviceArea.map(
                  (area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 mt-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Availability
          </h2>

          <div className="mt-4">
            {professional.available ? (
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                ● Available Now
              </span>
            ) : (
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-full font-medium">
                ● Currently Unavailable
              </span>
            )}
          </div>
        </div>

        <div className="mt-8">
          {professional.available ? (
            <Link
              to={`/book/${professional._id}`}
              className="block w-full py-4 text-center bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Book This Professional
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-4 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/professionals"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Professionals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalProfile;