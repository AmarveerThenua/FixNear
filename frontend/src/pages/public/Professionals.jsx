import React, { useState } from 'react'
import professionals from '../../data/professionals'
import ProfessionalCard from '../../components/professionals/ProfessionalCard'

const Professionals = () => {

  const [search, setSearch] = useState("")
  const [service, setService] = useState("All")
  const [rating, setRating] = useState("All")
  const [availability, setAvailability] = useState("All")
  const [location, setLocation] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")

  const getUserLocation = () => {

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    setLocationLoading(true)
    setLocationError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        setUserLocation({
          latitude,
          longitude
        })

        setLocationLoading(false)
      },

      (error) => {

        setLocationLoading(false)

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access."
          )
        } else if (error.code === 2) {
          setLocationError(
            "Your location could not be detected."
          )
        } else {
          setLocationError(
            "Unable to get your location."
          )
        }
      }
    )
  }

  const filteredProfessionals = professionals.filter((professional) => {

    const matchesSearch =
      professional.name.toLowerCase().includes(search.toLowerCase()) ||
      professional.profession.toLowerCase().includes(search.toLowerCase())

    const matchesService =
      service === "All" || professional.service === service

    const matchesRating =
      rating === "All" ||
      professional.rating >= Number(rating)

    const matchesAvailability =
      availability === "All" ||
      (availability === "Available" && professional.available)

    const matchesLocation =
      location === "" ||
      professional.location.toLowerCase().includes(location.toLowerCase())

    return (
      matchesSearch &&
      matchesService &&
      matchesRating &&
      matchesAvailability &&
      matchesLocation
    )
  })

  return (
    <section className="min-h-screen bg-gray-50 py-16">

      <div className="max-w-7xl mx-auto px-6">

   
        <div className="text-center mb-10">

          <p className="text-blue-600 font-semibold mb-2">
            Find Your Expert
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Find Professionals Near You
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Find trusted and experienced professionals for your
            home and everyday service needs.
          </p>

        </div>

    
        <div className="max-w-2xl mx-auto mb-8">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name or profession..."
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

        </div>

        <div className="max-w-2xl mx-auto mb-8">

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="📍 Enter your location..."
              className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={getUserLocation}
              disabled={locationLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {locationLoading
                ? "Getting Location..."
                : "Use My Location"}
            </button>

          </div>

          {/* Location Result */}
          {userLocation && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">

              <p className="text-green-700 font-medium">
                📍 Location detected successfully
              </p>

              <p className="mt-1 text-sm text-green-600">
                Latitude: {userLocation.latitude}
              </p>

              <p className="text-sm text-green-600">
                Longitude: {userLocation.longitude}
              </p>

            </div>
          )}

          {/* Location Error */}
          {locationError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">

              <p className="text-red-600 text-sm">
                {locationError}
              </p>

            </div>
          )}

        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Services</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Painter">Painter</option>
              <option value="Carpenter">Carpenter</option>
            </select>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Ratings</option>
              <option value="4">4+ ⭐</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4.8">4.8+ ⭐</option>
            </select>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Professionals</option>
              <option value="Available">Available Now</option>
            </select>

          </div>

        </div>

        {/* Result Count */}
        <p className="mb-5 text-gray-600">
          <span className="font-semibold text-gray-900">
            {filteredProfessionals.length}
          </span>{" "}
          professionals found
        </p>

        {/* Professionals */}
        {filteredProfessionals.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
              />
            ))}

          </div>

        ) : (

          <div className="text-center py-16">

            <p className="text-5xl mb-4">
              🔍
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              No professionals found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}

export default Professionals