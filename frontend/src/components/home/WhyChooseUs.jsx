import React from "react";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "✓",
      title: "Verified Professionals",
      description:
        "We help you connect with trusted and verified professionals for your service needs.",
    },
    {
      id: 2,
      icon: "📍",
      title: "Professionals Near You",
      description:
        "Find skilled professionals available in your local area without wasting time.",
    },
    {
      id: 3,
      icon: "⭐",
      title: "Trusted Reviews",
      description:
        "Check ratings and reviews from other customers before choosing a professional.",
    },
    {
      id: 4,
      icon: "🔒",
      title: "Safe & Reliable",
      description:
        "Book services with confidence through a simple and reliable platform.",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
        <div className="text-center mb-6 sm:mb-9 lg:mb-14">
          <p className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-1 sm:mb-2">
            Why FixNear?
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Why Choose FixNear
          </h2>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We make finding and booking trusted local professionals simple,
            convenient and reliable.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-2.5 sm:p-4 md:p-5 lg:p-7 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300 min-w-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm sm:text-base md:text-xl lg:text-2xl">
                {feature.icon}
              </div>

              <h3 className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-[9px] sm:text-xs md:text-sm lg:text-lg font-semibold text-gray-900 leading-tight">
                {feature.title}
              </h3>

              <p className="mt-1 sm:mt-2 md:mt-3 text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;