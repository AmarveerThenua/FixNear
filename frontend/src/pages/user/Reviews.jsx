import React from "react";

const Reviews = () => {

  const reviews = [
    {
      id: 1,
      professional: "Rahul Sharma",
      service: "Plumbing",
      rating: 5,
      comment: "Excellent service. He fixed the issue very quickly.",
      date: "20 August 2026"
    },
    {
      id: 2,
      professional: "Amit Kumar",
      service: "Electrical Repair",
      rating: 4,
      comment: "Good work and professional behavior.",
      date: "15 August 2026"
    }
  ];

  return (
    <section>

      {/* Heading */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          My Reviews
        </h1>

        <p className="mt-2 text-gray-600">
          Reviews and ratings you have given to professionals.
        </p>

      </div>


      {/* Reviews */}
      <div className="space-y-5">

        {reviews.map((review) => (

          <div
            key={review.id}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <h2 className="text-xl font-semibold text-gray-900">
                  {review.professional}
                </h2>

                <p className="text-sm text-blue-600 mt-1">
                  {review.service}
                </p>

              </div>

              <p className="text-sm text-gray-500">
                {review.date}
              </p>

            </div>


            {/* Rating */}
            <div className="flex items-center gap-1 mt-4">

              {Array.from({ length: 5 }).map((_, index) => (

                <span
                  key={index}
                  className={
                    index < review.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>

              ))}

              <span className="ml-2 text-sm font-medium text-gray-700">
                {review.rating}/5
              </span>

            </div>


            {/* Comment */}
            <p className="mt-4 text-gray-600 leading-relaxed">
              "{review.comment}"
            </p>


            {/* Action */}
            <div className="mt-5">

              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Review
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Reviews;