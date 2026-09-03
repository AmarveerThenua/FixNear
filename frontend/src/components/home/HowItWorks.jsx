import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      number: "01",
      title: "Choose a Service",
      description:
        "Tell us what service you need, whether it's plumbing, electrical work, painting or something else.",
    },
    {
      id: 2,
      number: "02",
      title: "Find a Professional",
      description:
        "Discover trusted professionals near your location and compare their ratings, experience and prices.",
    },
    {
      id: 3,
      number: "03",
      title: "Book & Relax",
      description:
        "Choose a suitable professional, select a time and book the service. We'll take care of the rest.",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

       

        <div className="text-center mb-10 sm:mb-12 lg:mb-14">

          <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2">
            Simple & Easy
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How FixNear Works
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get the help you need in just three simple steps.
          </p>

        </div>


      

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {steps.map((step) => (
            <div
              key={step.id}
              className="text-center max-w-md mx-auto md:max-w-none"
            >

          

              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white text-lg sm:text-xl font-bold">
                {step.number}
              </div>


      

              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-semibold text-gray-900">
                {step.title}
              </h3>



              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;