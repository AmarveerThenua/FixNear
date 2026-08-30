import React from 'react'
import { Link } from 'react-router-dom'

const ProfessionalCard = ({ professional }) => {

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300">

      <div className="p-6">

        {/* Profile */}
        <div className="flex items-center gap-4">

          <img
            src={professional.image}
            alt={professional.name}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div>

            <h3 className="text-lg font-semibold text-gray-900">
              {professional.name}
            </h3>

            <p className="text-blue-600 text-sm font-medium">
              {professional.profession}
            </p>

          </div>

        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-5">

          <span className="text-yellow-500">
            ★
          </span>

          <span className="font-semibold text-gray-800">
            {professional.rating}
          </span>

          <span className="text-gray-500 text-sm">
            ({professional.reviews} reviews)
          </span>

        </div>

        {/* Details */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">

          <p>
            📍 {professional.location}
          </p>

          <p>
            🚗 {professional.distance} km away
          </p>

          <p>
            💼 {professional.experience} experience
          </p>

        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-xs text-gray-500">
              Starting from
            </p>

            <p className="text-xl font-bold text-gray-900">
              ₹{professional.price}
            </p>

          </div>

          {professional.available ? (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              Available
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
              Unavailable
            </span>
          )}

        </div>

        {/* View Profile */}
        <Link
          to={`/professionals/${professional.id}`}
          className="block text-center w-full mt-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          View Profile
        </Link>

      </div>

    </div>
  )
}

export default ProfessionalCard