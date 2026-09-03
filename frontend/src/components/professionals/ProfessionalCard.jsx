import React from "react";
import { Link } from "react-router-dom";

const ProfessionalCard = ({ professional }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 h-full">

      <div className="p-4 sm:p-5 lg:p-6">

     

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">

          {professional.image ? (
            <img
              src={professional.image}
              alt={professional.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg sm:text-xl font-bold flex-shrink-0">
              {professional.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {professional.name}
            </h3>

            <p className="text-blue-600 text-xs sm:text-sm font-medium truncate">
              {professional.profession}
            </p>
          </div>

        </div>


   
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 flex-wrap">

          <span className="text-yellow-500 text-sm sm:text-base">
            ★
          </span>

          <span className="font-semibold text-gray-800 text-sm sm:text-base">
            {professional.rating || 0}
          </span>

          <span className="text-gray-500 text-xs sm:text-sm">
            ({professional.reviews || 0} reviews)
          </span>

        </div>


        <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-gray-600">

          <p className="flex items-start gap-1.5">
            <span className="shrink-0">📍</span>
            <span className="wrap-break-word">
              {professional.location ||
                professional.city ||
                "Location not provided"}
            </span>
          </p>

          <p className="flex items-start gap-1.5">
            <span className="shrink-0">💼</span>
            <span className="wrap-break-word">
              {professional.experience ||
                "Experience not provided"}
            </span>
          </p>

        </div>


        

        <div className="mt-5 sm:mt-6 flex items-center justify-between gap-3">

          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-gray-500">
              Starting from
            </p>

            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{professional.price || 0}
            </p>
          </div>

          {professional.available ? (
            <span className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium bg-green-100 text-green-700 rounded-full whitespace-nowrap flex-shrink-0">
              Available
            </span>
          ) : (
            <span className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-500 rounded-full whitespace-nowrap flex-shrink-0">
              Unavailable
            </span>
          )}

        </div>


       

        <Link
          to={`/professionals/${professional._id}`}
          className="block text-center w-full mt-4 sm:mt-5 py-2.5 sm:py-3 px-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition"
        >
          View Profile
        </Link>

      </div>

    </div>
  );
};

export default ProfessionalCard;