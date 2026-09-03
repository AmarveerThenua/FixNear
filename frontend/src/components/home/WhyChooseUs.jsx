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
    <section className="py-14 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      
        <div className="text-center mb-9 sm:mb-12 lg:mb-14">

          <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2">
            Why FixNear?
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why Choose FixNear
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We make finding and booking trusted local professionals
            simple, convenient and reliable.
          </p>

        </div>


        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

          {features.map((feature) => (
            <div
              key={feature.id}
              className="
                bg-white
                p-5
                sm:p-6
                lg:p-7
                rounded-2xl
                border
                border-gray-100
                text-center
                hover:shadow-lg
                hover:-translate-y-1
                transition
                duration-300
              "
            >

       

              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl sm:text-2xl">
                {feature.icon}
              </div>


              
              <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>


           
              <p className="mt-2 sm:mt-3 text-sm text-gray-600 leading-relaxed">
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