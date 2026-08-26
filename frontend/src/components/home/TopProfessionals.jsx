import React from 'react'
import professionals from '../../data/professionals'
import ProfessionalCard from '../professionals/ProfessionalCard'

const TopProfessionals = () => {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

      
        <div className="text-center mb-12">

          <p className="text-blue-600 font-semibold mb-2">
            Trusted Experts
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Top Professionals Near You
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Connect with experienced and highly rated professionals
            available in your area.
          </p>

        </div>

  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}

        </div>


        <div className="text-center mt-10">

          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition">
            View All Professionals
          </button>

        </div>

      </div>

    </section>
  )
}

export default TopProfessionals