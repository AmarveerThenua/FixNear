import React from "react";
import { useParams } from "react-router-dom";
import services from "../../data/services";

const ServiceDetails = () => {
  const { id } = useParams();

  const service = services.find(
    (item) => item.id === Number(id)
  );

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Service Not Found
        </h1>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-5 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 md:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {service.icon}
          </div>

          <h1 className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {service.name} Services
          </h1>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-blue-600 font-medium">
            {service.category}
          </p>

          <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl leading-relaxed">
            {service.description}
          </p>

          <div className="mt-6 sm:mt-7 md:mt-9 lg:mt-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Why choose FixNear?
            </h2>

            <div className="mt-3 sm:mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-5">
              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-lg sm:rounded-xl">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
                  ✓ Verified Professionals
                </h3>

                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed">
                  Connect with trusted professionals.
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-lg sm:rounded-xl">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
                  📍 Near Your Location
                </h3>

                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed">
                  Find professionals available nearby.
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-5 bg-gray-50 rounded-lg sm:rounded-xl">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">
                  ⭐ Trusted Reviews
                </h3>

                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed">
                  Check ratings before making a decision.
                </p>
              </div>
            </div>
          </div>

          <button className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition">
            Find Professionals
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;