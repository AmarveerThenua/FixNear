import React from "react";
import { Link } from "react-router-dom";

const BecomeProfessional = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-blue-600">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">


          <div className="text-center md:text-left max-w-2xl">

            <p className="text-blue-200 font-semibold text-sm sm:text-base mb-2 sm:mb-3">
              Are You a Professional?
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Grow Your Business With FixNear
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-100 leading-relaxed">
              Join thousands of professionals and connect with customers
              looking for your services in their area.
            </p>

          </div>


     

          <div className="shrink-0 w-full md:w-auto">

            <Link
              to="/register/worker"
              className="
                block
                w-full
                md:w-auto
                text-center
                px-7
                py-3
                bg-white
                text-blue-600
                font-semibold
                text-sm
                sm:text-base
                rounded-lg
                hover:bg-gray-100
                hover:scale-105
                transition
                duration-300
              "
            >
              Become a Professional
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default BecomeProfessional;