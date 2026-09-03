import React, { useState } from "react";
import services from "../../data/services";
import ServiceCard from "../../components/services/ServiceCard";

const Services = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Home Repair",
    "Electrical",
    "Home Improvement",
    "Cleaning",
    "Appliance Repair",
    "Construction",
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="text-center mb-5 sm:mb-7 lg:mb-8">
          <p className="text-blue-600 text-xs sm:text-sm font-semibold mb-1">
            What We Offer
          </p>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            All Services
          </h1>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
            Find trusted professionals for all your home and everyday
            service needs.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-4 sm:mb-5 lg:mb-6">
          <input
            type="text"
            placeholder="🔍 Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 sm:h-10 lg:h-11 px-3 sm:px-4 lg:px-5 text-xs sm:text-sm lg:text-base bg-white border border-gray-200 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:gap-2.5 mb-5 sm:mb-7 lg:mb-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full border text-[9px] sm:text-xs lg:text-sm transition ${
                category === item
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-3 min-[768px]:grid-cols-4 min-[1200px]:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12 lg:py-16">
            <p className="text-3xl sm:text-4xl mb-2 sm:mb-3">
              🔍
            </p>

            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
              No services found
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Try searching for another service.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;