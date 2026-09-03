import React from "react";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Rahul Verma",
      service: "Plumbing Service",
      rating: 5,
      review:
        "I found a plumber within a few minutes. He arrived on time and fixed the problem quickly.",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 2,
      name: "Anjali Sharma",
      service: "Electrical Service",
      rating: 5,
      review:
        "The electrician was professional and explained everything clearly. Great experience with FixNear.",
      image: "https://i.pravatar.cc/100?img=47",
    },
    {
      id: 3,
      name: "Mohit Kumar",
      service: "Painting Service",
      rating: 4,
      review:
        "Very easy to find professionals near my location. The painter did a really good job.",
      image: "https://i.pravatar.cc/100?img=13",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
        <div className="text-center mb-6 sm:mb-9 lg:mb-14">
          <p className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-1 sm:mb-2">
            Customer Stories
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See what people are saying about their experience with
            professionals on FixNear.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 lg:gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-2.5 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition duration-300 min-w-0"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                  <h3 className="text-[9px] sm:text-xs md:text-sm lg:text-base font-semibold text-gray-900 truncate">
                    {review.name}
                  </h3>

                  <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500 truncate">
                    {review.service}
                  </p>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 md:mt-4 flex gap-0.5 sm:gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <span
                    key={index}
                    className="text-yellow-500 text-[9px] sm:text-xs md:text-sm lg:text-base"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-2 sm:mt-3 md:mt-4 text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 leading-relaxed">
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;