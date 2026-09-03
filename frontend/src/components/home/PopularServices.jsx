import React, { useState } from "react";
import ServiceCard from "../services/ServiceCard";
import services from "../../data/services";

const PopularServices = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
        <div className="text-center mb-5 sm:mb-8 lg:mb-12">
          <p className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-1 sm:mb-2">
            Our Services
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find trusted professionals for all your home and everyday service
            needs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        {services.length > 6 && (
          <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              {showAll ? "Show Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularServices;