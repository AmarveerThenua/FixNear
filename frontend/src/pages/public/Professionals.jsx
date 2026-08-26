import React, { useState } from 'react'
import professionals from '../../data/professionals'
import ProfessionalCard from '../../components/professionals/ProfessionalCard'

const Professionals = () => {

  const [search, setSearch] = useState("")

  const filteredProfessionals = professionals.filter((professional) => {
    return (
      professional.name.toLowerCase().includes(search.toLowerCase()) ||
      professional.profession.toLowerCase().includes(search.toLowerCase())
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

      
        <div className="max-w-2xl mx-auto mb-12">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name or profession..."
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

        </div>

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
              Try searching for another name or profession.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}

export default Professionals