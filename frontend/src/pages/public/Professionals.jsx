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

        setProfessionals(response.data.professionals || []);
      } catch (error) {
        console.error("Fetch professionals error:", error);
        setError("Unable to load professionals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Loading professionals...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-5 sm:py-7 lg:py-9">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-6">
        <div className="text-center mb-5 sm:mb-7 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Find Professionals
          </h1>

          <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600">
            Find trusted professionals near you.
          </p>
        </div>

        {professionals.length === 0 ? (
          <div className="text-center py-10 sm:py-14">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              No professionals found
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              Professionals will appear here once they register.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 min-[768px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {professionals.map((professional) => (
              <div
                key={professional._id}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition min-w-0 flex flex-col"
              >
                <div className="h-28 min-[400px]:h-32 sm:h-36 lg:h-40 bg-gray-100">
                  {professional.image ? (
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl lg:text-5xl">
                        👤
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-3 lg:p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                        {professional.name}
                      </h2>

                      <p className="mt-0.5 text-[9px] sm:text-xs lg:text-sm text-blue-600 font-medium truncate">
                        {professional.profession}
                      </p>
                    </div>

                    {professional.isVerified && (
                      <span className="shrink-0 text-[7px] sm:text-[9px] lg:text-[10px] bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-2 sm:mt-2.5">
                    <span className="text-yellow-500 text-xs sm:text-sm">
                      ★
                    </span>

                    <span className="text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900">
                      {professional.rating}
                    </span>

                    <span className="text-gray-500 text-[8px] sm:text-[10px] lg:text-xs truncate">
                      ({professional.reviews} reviews)
                    </span>
                  </div>

                  <p className="mt-1.5 text-[9px] sm:text-xs lg:text-sm text-gray-600 truncate">
                    📍 {professional.location || professional.city}
                  </p>

                  <p className="mt-1 text-[9px] sm:text-xs lg:text-sm text-gray-600 truncate">
                    🛠️ {professional.experience} experience
                  </p>

                  <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                    ₹{professional.price}
                  </p>

                  <div className="mt-1.5">
                    {professional.available ? (
                      <span className="text-[9px] sm:text-xs lg:text-sm text-green-600 font-medium">
                        ● Available Now
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-xs lg:text-sm text-gray-500 font-medium">
                        ● Unavailable
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/professionals/${professional._id}`}
                    className="block w-full mt-auto pt-2.5 sm:pt-3"
                  >
                    <span className="flex items-center justify-center w-full py-1.5 sm:py-2 lg:py-2.5 bg-blue-600 text-white text-[9px] sm:text-xs lg:text-sm font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 transition">
                      View Profile
                    </span>
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