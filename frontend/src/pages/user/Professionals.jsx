import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import stateCities, { indianStates } from "../../data/indianCities";

const serviceCategories = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "AC Repair",
  "Appliance Repair",
  "Cleaning",
  "Beautician",
  "Mechanic",
  "Other",
];

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals`
        );

        setProfessionals(response.data.professionals || []);
      } catch (error) {
        console.error("Fetch professionals error:", error);
        setError("Unable to load professionals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const getState = (professional) => {
    return professional.state || professional.locationState || "";
  };

  const getCity = (professional) => {
    return professional.city || professional.locationCity || "";
  };

  const getService = (professional) => {
    return professional.profession || professional.service || "";
  };

  const cities = useMemo(() => {
    if (!selectedState) {
      return [];
    }

    return stateCities[selectedState] || [];
  }, [selectedState]);

  const filteredProfessionals = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return professionals.filter((professional) => {
      const name = professional.name || "";
      const profession = professional.profession || "";
      const service = professional.service || "";
      const location = professional.location || "";
      const state = getState(professional);
      const city = getCity(professional);

      const matchesSearch =
        !searchValue ||
        name.toLowerCase().includes(searchValue) ||
        profession.toLowerCase().includes(searchValue) ||
        service.toLowerCase().includes(searchValue) ||
        location.toLowerCase().includes(searchValue) ||
        state.toLowerCase().includes(searchValue) ||
        city.toLowerCase().includes(searchValue);

      const matchesService =
        !selectedService ||
        getService(professional).toLowerCase() ===
          selectedService.toLowerCase();

      const matchesState =
        !selectedState || state === selectedState;

      const matchesCity =
        !selectedCity || city === selectedCity;

      return (
        matchesSearch &&
        matchesService &&
        matchesState &&
        matchesCity
      );
    });
  }, [
    professionals,
    search,
    selectedService,
    selectedState,
    selectedCity,
  ]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedService("");
    setSelectedState("");
    setSelectedCity("");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-xs sm:text-sm text-gray-600">
              Loading professionals...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="text-xs sm:text-sm text-red-600 text-center">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-3 sm:py-6 lg:py-9 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-6">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Find Professionals
          </h1>

          <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm lg:text-base text-gray-600">
            Find trusted professionals near you.
          </p>
        </div>

        {professionals.length > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-2.5 sm:p-4 lg:p-5 mb-4 sm:mb-6 lg:mb-7">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
              <div className="col-span-2 lg:col-span-1">
                <label className="block text-[9px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Search
                </label>

                <div className="relative">
                  <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] sm:text-sm">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search professional..."
                    className="w-full h-8 sm:h-11 pl-7 sm:pl-9 pr-2.5 sm:pr-3 border border-gray-300 rounded-md sm:rounded-lg text-[10px] sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Service
                </label>

                <select
                  value={selectedService}
                  onChange={(event) =>
                    setSelectedService(event.target.value)
                  }
                  className="w-full h-9 sm:h-11 px-2 sm:px-3 border border-gray-300 rounded-md sm:rounded-lg text-[10px] sm:text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Services</option>

                  {serviceCategories.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] sm:text-xs font-semibold text-gray-700 mb-1">
                  State
                </label>

                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full h-9 sm:h-11 px-2 sm:px-3 border border-gray-300 rounded-md sm:rounded-lg text-[10px] sm:text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All States</option>

                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] sm:text-xs font-semibold text-gray-700 mb-1">
                  City
                </label>

                <select
                  value={selectedCity}
                  onChange={(event) =>
                    setSelectedCity(event.target.value)
                  }
                  disabled={!selectedState}
                  className="w-full h-9 sm:h-11 px-2 sm:px-3 border border-gray-300 rounded-md sm:rounded-lg text-[10px] sm:text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {selectedState ? "All Cities" : "Select State First"}
                  </option>

                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end col-span-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full h-9 sm:h-11 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-[10px] sm:text-sm font-semibold rounded-md sm:rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="mt-2.5 sm:mt-3">
              <p className="text-[9px] sm:text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredProfessionals.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {professionals.length}
                </span>{" "}
                professionals
              </p>
            </div>
          </div>
        )}

        {professionals.length === 0 ? (
          <div className="text-center py-10 sm:py-14 px-3">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              No professionals found
            </h2>

            <p className="mt-1.5 text-[10px] sm:text-sm text-gray-500">
              Professionals will appear here once they register.
            </p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 text-center py-8 sm:py-14 px-3">
            <div className="text-2xl sm:text-4xl mb-2">
              🔍
            </div>

            <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
              No matching professionals
            </h2>

            <p className="mt-1.5 text-[10px] sm:text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[10px] sm:text-sm font-semibold rounded-md sm:rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 min-[640px]:grid-cols-3 min-[1024px]:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
            {filteredProfessionals.map((professional) => (
              <div
                key={professional._id}
                className="bg-white rounded-md sm:rounded-lg lg:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition min-w-0 flex flex-col"
              >
                <div className="h-24 min-[400px]:h-28 sm:h-36 lg:h-40 bg-gray-100">
                  {professional.image ? (
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl">
                        👤
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-1.5 min-[400px]:p-2 sm:p-3 lg:p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 min-w-0">
                    <div className="min-w-0">
                      <h2 className="text-[10px] min-[400px]:text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                        {professional.name}
                      </h2>

                      <p className="mt-0.5 text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm text-blue-600 font-medium truncate">
                        {professional.profession}
                      </p>
                    </div>

                    {professional.isVerified && (
                      <span className="shrink-0 text-[6px] min-[400px]:text-[7px] sm:text-[9px] lg:text-[10px] bg-green-100 text-green-700 px-1 min-[400px]:px-1.5 sm:px-2 py-0.5 rounded-full">
                        ✓
                        <span className="hidden min-[400px]:inline ml-0.5">
                          Verified
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 sm:gap-1 mt-1.5 sm:mt-2.5">
                    <span className="text-yellow-500 text-[10px] sm:text-sm">
                      ★
                    </span>

                    <span className="text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm font-semibold text-gray-900">
                      {professional.rating}
                    </span>

                    <span className="text-gray-500 text-[7px] min-[400px]:text-[8px] sm:text-[10px] lg:text-xs truncate">
                      ({professional.reviews})
                    </span>
                  </div>

                  <p className="mt-1 sm:mt-1.5 text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm text-gray-600 truncate">
                    📍 {professional.location || getCity(professional)}
                  </p>

                  <p className="mt-0.5 sm:mt-1 text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm text-gray-600 truncate">
                    🛠️ {professional.experience}
                  </p>

                  <p className="mt-1.5 sm:mt-2.5 text-[10px] min-[400px]:text-xs sm:text-sm lg:text-base font-bold text-gray-900 truncate">
                    ₹{professional.price}
                  </p>

                  <div className="mt-0.5 sm:mt-1.5">
                    {professional.available ? (
                      <span className="text-[7px] min-[400px]:text-[8px] sm:text-xs lg:text-sm text-green-600 font-medium truncate block">
                        ● Available
                      </span>
                    ) : (
                      <span className="text-[7px] min-[400px]:text-[8px] sm:text-xs lg:text-sm text-gray-500 font-medium truncate block">
                        ● Unavailable
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/professionals/${professional._id}`}
                    className="block w-full mt-auto pt-1.5 sm:pt-3"
                  >
                    <span className="flex items-center justify-center w-full min-h-7 sm:min-h-9 lg:min-h-10 px-1 py-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm font-semibold rounded sm:rounded-lg transition">
                      View Profile
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Professionals;