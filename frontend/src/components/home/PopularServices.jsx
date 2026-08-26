import React from 'react'
import ServiceCard from "../services/ServiceCard"
import services from "../../data/services"

const PopularServices = () => {

  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

   
        <div className="text-center mb-12">

          <p className="text-blue-600 font-semibold mb-2">
            Our Services
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Find trusted professionals for all your home and everyday
            service needs.
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}

        </div>

      </div>

    </section>
  )
}

export default PopularServices