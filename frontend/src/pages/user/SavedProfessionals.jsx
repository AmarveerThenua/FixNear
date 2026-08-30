import React, { useState } from "react";
import professionals from "../../data/professionals";
import { Link } from "react-router-dom";

const SavedProfessionals = () => {

  // Temporary saved professional IDs
  const [savedIds, setSavedIds] = useState([1, 3]);

  const savedProfessionals = professionals.filter(
    (professional) => savedIds.includes(professional.id)
  );

  const removeSaved = (id) => {
    setSavedIds(
      savedIds.filter((savedId) => savedId !== id)
    );
  };

  return (
    <section>

      {/* Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Saved Professionals
        </h1>

        <p className="mt-2 text-gray-600">
          Professionals you saved for later.
        </p>

      </div>


      {/* Empty State */}
      {savedProfessionals.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

          <div className="text-5xl mb-4">
            ❤️
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No Saved Professionals
          </h2>

          <p className="mt-2 text-gray-500">
            Save professionals you like and find them here later.
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Find Professionals
          </Link>

        </div>

      ) : (

        /* Professionals */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {savedProfessionals.map((professional) => (

            <div
              key={professional.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >

              {/* Image */}
              <img
                src={professional.image}
                alt={professional.name}
                className="w-full h-48 object-cover"
              />


              {/* Content */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h2 className="text-xl font-semibold text-gray-900">
                      {professional.name}
                    </h2>

                    <p className="text-blue-600 mt-1">
                      {professional.profession}
                    </p>

                  </div>

                  <span className="text-xl">
                    ❤️
                  </span>

                </div>


                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">

                  <span className="text-yellow-500">
                    ★
                  </span>

                  <span className="font-semibold">
                    {professional.rating}
                  </span>

                  <span className="text-gray-500 text-sm">
                    ({professional.reviews})
                  </span>

                </div>


                {/* Location */}
                <p className="mt-3 text-sm text-gray-500">
                  📍 {professional.location}
                </p>


                {/* Actions */}
                <div className="flex gap-3 mt-5">

                  <Link
                    to={`/professionals/${professional.id}`}
                    className="flex-1 text-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => removeSaved(professional.id)}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
};

export default SavedProfessionals;