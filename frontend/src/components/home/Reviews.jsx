import React from 'react'

const Reviews = () => {

  const reviews = [
    {
      id: 1,
      name: "Rahul Verma",
      service: "Plumbing Service",
      rating: 5,
      review:
        "I found a plumber within a few minutes. He arrived on time and fixed the problem quickly.",
      image: "https://i.pravatar.cc/100?img=12"
    },
    {
      id: 2,
      name: "Anjali Sharma",
      service: "Electrical Service",
      rating: 5,
      review:
        "The electrician was professional and explained everything clearly. Great experience with FixNear.",
      image: "https://i.pravatar.cc/100?img=47"
    },
    {
      id: 3,
      name: "Mohit Kumar",
      service: "Painting Service",
      rating: 4,
      review:
        "Very easy to find professionals near my location. The painter did a really good job.",
      image: "https://i.pravatar.cc/100?img=13"
    }
  ]

  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <p className="text-blue-600 font-semibold mb-2">
            Customer Stories
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            See what people are saying about their experience with
            professionals on FixNear.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition duration-300"
            >

       
              <div className="flex items-center gap-4">

                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {review.service}
                  </p>
                </div>

              </div>

              
              <div className="mt-5 flex gap-1">

                {[...Array(review.rating)].map((_, index) => (
                  <span
                    key={index}
                    className="text-yellow-500"
                  >
                    ★
                  </span>
                ))}

              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">
                "{review.review}"
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}

export default Reviews