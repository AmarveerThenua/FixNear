import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals`
        );

        console.log(
          "Professionals:",
          response.data
        );

        setProfessionals(
          response.data.professionals
        );
      } catch (error) {
        console.error(
          "Fetch professionals error:",
          error
        );

        setError(
          "Unable to load professionals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">
              Loading professionals...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Find Professionals
          </h1>

          <p className="mt-3 text-gray-600">
            Find trusted professionals near you.
          </p>
        </div>

        {professionals.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-800">
              No professionals found
            </h2>

            <p className="mt-2 text-gray-500">
              Professionals will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <div
                key={professional._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="h-56 bg-gray-100">
                  {professional.image ? (
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">
                        👤
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {professional.name}
                      </h2>

                      <p className="mt-1 text-blue-600 font-medium">
                        {professional.profession}
                      </p>
                    </div>

                    {professional.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-yellow-500">
                      ★
                    </span>

                    <span className="font-semibold">
                      {professional.rating}
                    </span>

                    <span className="text-gray-500 text-sm">
                      ({professional.reviews} reviews)
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600 text-sm">
                    📍{" "}
                    {professional.location ||
                      professional.city}
                  </p>

                  <p className="mt-2 text-gray-600 text-sm">
                    🛠️ {professional.experience} experience
                  </p>

                  <p className="mt-4 text-lg font-bold text-gray-900">
                    Starting from ₹
                    {professional.price}
                  </p>

                  <div className="mt-4">
                    {professional.available ? (
                      <span className="text-sm text-green-600 font-medium">
                        ● Available Now
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">
                        ● Currently Unavailable
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/professionals/${professional._id}`}
                    className="block w-full mt-5 py-3 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Professionals;