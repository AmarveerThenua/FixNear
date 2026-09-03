import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProfessionalCard from "../professionals/ProfessionalCard";

const TopProfessionals = () => {
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
        console.error("Failed to fetch professionals:", error);
        setError("Failed to load professionals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const topProfessionals = [...professionals]
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      return b.reviews - a.reviews;
    })
    .slice(0, 4);

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2">
            Trusted Experts
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Top Professionals Near You
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with experienced and highly rated professionals available
            in your area.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-8 sm:py-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-8 sm:py-10 px-4">
            <p className="text-sm sm:text-base text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && topProfessionals.length === 0 && (
          <div className="text-center py-8 sm:py-10 px-4">
            <p className="text-sm sm:text-base text-gray-500">
              No professionals available yet.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          topProfessionals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {topProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional._id}
                  professional={professional}
                />
              ))}
            </div>
          )}

        {!loading && !error && professionals.length > 4 && (
          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/professionals"
              className="
                inline-block
                w-full
                sm:w-auto
                px-6
                py-3
                border
                border-blue-600
                text-blue-600
                rounded-lg
                font-medium
                text-sm
                sm:text-base
                hover:bg-blue-600
                hover:text-white
                transition
              "
            >
              View All Professionals
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProfessionals;