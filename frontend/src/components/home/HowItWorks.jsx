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
    <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
        <div className="text-center mb-6 sm:mb-9 lg:mb-14">
          <p className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-1 sm:mb-2">
            Simple & Easy
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            How FixNear Works
          </h2>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get the help you need in just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="text-center min-w-0"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] sm:text-sm md:text-lg lg:text-xl font-bold">
                {step.number}
              </div>

              <h3 className="mt-2 sm:mt-3 md:mt-5 lg:mt-6 text-[10px] sm:text-sm md:text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                {step.title}
              </h3>

              <p className="mt-1 sm:mt-2 md:mt-3 text-[8px] sm:text-[10px] md:text-sm lg:text-base text-gray-600 leading-relaxed">
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