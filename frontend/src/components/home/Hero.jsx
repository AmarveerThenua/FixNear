import React from 'react'

const Hero = () => {
  return (
    <section className="bg-blue-50 min-h-150 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">

        <div className="max-w-3xl">

          <p className="text-blue-600 font-semibold mb-4">
            Trusted Professionals, Just Around the Corner
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Find Trusted Professionals
            <span className="text-blue-600"> Near You</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            Find skilled and verified professionals for all your home
            service needs. From plumbers and electricians to painters
            and cleaners.
          </p>

        
          <div className="mt-8 bg-white p-3 rounded-xl shadow-lg flex flex-col md:flex-row gap-3">

            {/* Service */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                What service do you need?
              </label>

              <input
                type="text"
                placeholder="e.g. Plumber"
                className="w-full px-3 py-2 outline-none text-gray-800"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Where do you need it?
              </label>

              <input
                type="text"
                placeholder="e.g. Sector 62, Noida"
                className="w-full px-3 py-2 outline-none text-gray-800"
              />
            </div>

       
            <button className="bg-blue-600 text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition">
              Find Professionals
            </button>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero