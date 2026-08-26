import React from 'react'
import { Link } from 'react-router-dom'

const ServiceCard = ({ service }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition duration-300">

      <div className="text-4xl mb-4">
        {service.icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900">
        {service.name}
      </h3>

      <p className="mt-2 text-gray-500 text-sm">
        {service.description}
      </p>

      <Link
        to={`/services/${service.id}`}
        className="inline-block mt-5 text-blue-600 font-medium hover:text-blue-800"
      >
        View Service →
      </Link>

    </div>
  )
}

export default ServiceCard