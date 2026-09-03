import React from "react";

const Hero = () => {
  return (
    <section className="bg-blue-50 min-h-137.5 sm:min-h-150 flex items-center py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        <div className="max-w-4xl">

   

          <p className="text-blue-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4">
            Trusted Professionals, Just Around the Corner
          </p>


         
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Find Trusted Professionals
            <span className="text-blue-600"> Near You</span>
          </h1>


        

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Find skilled and verified professionals for all your home
            service needs. From plumbers and electricians to painters
            and cleaners.
          </p>


  

          <div className="mt-7 sm:mt-8 bg-white p-3 sm:p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-3">


            <div className="flex-1 min-w-0">

              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                What service do you need?
              </label>

              <input
                type="text"
                placeholder="e.g. Plumber"
                className="
                  w-full
                  px-3
                  py-2.5
                  outline-none
                  text-gray-800
                  text-sm sm:text-base
                  border
                  border-gray-200
                  rounded-lg
                  focus:border-blue-500
                  transition
                "
              />

            </div>



            <div className="flex-1 min-w-0">

              <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                Where do you need it?
              </label>

              <input
                type="text"
                placeholder="e.g. Sector 62, Noida"
                className="
                  w-full
                  px-3
                  py-2.5
                  outline-none
                  text-gray-800
                  text-sm sm:text-base
                  border
                  border-gray-200
                  rounded-lg
                  focus:border-blue-500
                  transition
                "
              />

            </div>


         

            <button
              className="
                w-full
                md:w-auto
                md:self-end
                bg-blue-600
                text-white
                px-6
                sm:px-7
                py-3
                rounded-lg
                hover:bg-blue-700
                transition
                font-medium
                whitespace-nowrap
              "
            >
              Find Professionals
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;