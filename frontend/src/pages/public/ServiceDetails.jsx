import React from 'react'
import { useParams } from 'react-router-dom'
import services from '../../data/services'

const ServiceDetails = () => {

  const { id } = useParams()

  const service = services.find(
    (item) => item.id === Number(id)
  )

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Service Not Found
        </h1>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">

      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">


          <div className="text-7xl">
            {service.icon}
          </div>

 
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            {service.name} Services
          </h1>

   
          <p className="mt-3 text-blue-600 font-medium">
            {service.category}
          </p>

          
          <p className="mt-6 text-lg text-gray-600 max-w-3xl leading-relaxed">
            {service.description}
          </p>

         
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-gray-900">
              Why choose FixNear?
            </h2>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900">
                  ✓ Verified Professionals
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Connect with trusted professionals.
                </p>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900">
                  📍 Near Your Location
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Find professionals available nearby.
                </p>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900">
                  ⭐ Trusted Reviews
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Check ratings before making a decision.
                </p>
              </div>

            </div>

          </div>


          <button className="mt-10 px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Find Professionals
          </button>

        </div>

      </div>

    </section>
  )
}

export default ServiceDetails