import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <div className="p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition duration-300 h-full flex flex-col">


      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
        {service.icon}
      </div>

      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
        {service.name}
      </h3>

  
      <p className="mt-2 text-gray-500 text-xs sm:text-sm leading-relaxed flex-1">
        {service.description}
      </p>

     
      <Link
        to={`/services/${service.id}`}
        className="inline-block mt-4 sm:mt-5 text-blue-600 text-sm sm:text-base font-medium hover:text-blue-800 transition"
      >
        View Service →
      </Link>

    </div>
  );
};

export default ServiceCard;