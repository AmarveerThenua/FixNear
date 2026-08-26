import React, { useState } from 'react'
import services from '../../data/services'
import ServiceCard from '../../components/services/ServiceCard'

const Services = () => {

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const categories = [
    "All",
    "Home Repair",
    "Electrical",
    "Home Improvement",
    "Cleaning",
    "Appliance Repair",
    "Construction"
  ]

  const filteredServices = services.filter((service) => {

    const matchesSearch = service.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || service.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <section className="py-16 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">

          <p className="text-blue-600 font-semibold mb-2">
            What We Offer
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            All Services
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Find trusted professionals for all your home and everyday
            service needs.
          </p>

        </div>


        <div className="max-w-xl mx-auto mb-8">

          <input
            type="text"
            placeholder="🔍 Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      
        <div className="flex flex-wrap justify-center gap-3 mb-10">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-full border transition ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredServices.map((service) => (

              <ServiceCard
                key={service.id}
                service={service}
              />

            ))}

          </div>

        ) : (

          <div className="text-center py-16">

            <p className="text-5xl mb-4">
              🔍
            </p>

            <h2 className="text-xl font-semibold text-gray-800">
              No services found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching for another service.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}

export default Services