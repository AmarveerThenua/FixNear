import React from "react";
import ServiceCard from "../services/ServiceCard";
import services from "../../data/services";

const PopularServices = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      

        <div className="text-center mb-8 sm:mb-10 lg:mb-12">

          <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2">
            Our Services
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find trusted professionals for all your home and everyday
            service needs.
          </p>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default PopularServices;