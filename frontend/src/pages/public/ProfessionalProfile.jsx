import React from "react";
import { Link, useParams } from "react-router-dom";
import professionals from "../../data/professionals";

const ProfessionalProfile = () => {

  const { id } = useParams();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  if (!professional) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-gray-800">
            Professional Not Found
          </h1>

          <Link
            to="/professionals"
            className="inline-block mt-5 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Professionals
          </Link>

        </div>

      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">

      <div className="max-w-5xl mx-auto px-6">

        {/* Back */}
        <Link
          to="/professionals"
          className="inline-block mb-6 text-blue-600 hover:text-blue-700"
        >
          ← Back to Professionals
        </Link>


        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            <img
              src={professional.image}
              alt={professional.name}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="text-center md:text-left">

              <h1 className="text-3xl font-bold text-gray-900">
                {professional.name}
              </h1>

              <p className="mt-2 text-blue-600 font-medium">
                {professional.profession}
              </p>

              {/* Rating */}
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

              {/* Location */}
              <p className="mt-3 text-gray-600">
                📍 {professional.location}
              </p>

            </div>

          </div>

        </div>


        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Experience */}
          <div className="bg-white rounded-xl p-6">

            <p className="text-gray-500 text-sm">
              Experience
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {professional.experience}
            </p>

          </div>


          {/* Price */}
          <div className="bg-white rounded-xl p-6">

            <p className="text-gray-500 text-sm">
              Starting Price
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              ₹{professional.price}
            </p>

          </div>


          {/* Distance */}
          <div className="bg-white rounded-xl p-6">

            <p className="text-gray-500 text-sm">
              Distance
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {professional.distance} km
            </p>

          </div>

        </div>


        {/* About */}
        <div className="bg-white rounded-2xl p-8 mt-6">

          <h2 className="text-2xl font-bold text-gray-900">
            About Professional
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {professional.name} is an experienced{" "}
            {professional.profession.toLowerCase()} with{" "}
            {professional.experience} of experience. You can book
            this professional for reliable and quality service.
          </p>

        </div>


        {/* Availability */}
        <div className="bg-white rounded-2xl p-8 mt-6">

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


        {/* Booking */}
        <div className="mt-8">

          {professional.available ? (

            <Link
              to={`/book/${professional.id}`}
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

      </div>

    </section>
  );
};

export default ProfessionalProfile;