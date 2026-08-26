import React from 'react'
import { Link } from 'react-router-dom'

const BecomeProfessional = () => {
  return (
    <section className="py-20 bg-blue-600">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

       
          <div className="text-center md:text-left">

            <p className="text-blue-200 font-semibold mb-3">
              Are You a Professional?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Grow Your Business With FixNear
            </h2>

            <p className="mt-4 text-blue-100 max-w-2xl leading-relaxed">
              Join thousands of professionals and connect with customers
              looking for your services in their area.
            </p>

          </div>

          <div className="shrink-0">

            <Link
              to="/register/worker"
              className="inline-block px-7 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Become a Professional
            </Link>

          </div>

        </div>

      </div>

    </section>
  )
}

export default BecomeProfessional