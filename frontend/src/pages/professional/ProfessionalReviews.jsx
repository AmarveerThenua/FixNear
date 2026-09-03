import { useEffect, useState } from "react";

const ProfessionalReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fixnearToken");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const professionalResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/professionals/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const professionalData = await professionalResponse.json();

      if (!professionalResponse.ok) {
        setError(
          professionalData.message ||
            "Failed to load professional profile"
        );
        return;
      }

      const professionalId = professionalData.professional?._id;

      if (!professionalId) {
        setError("Professional profile not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/professional/${professionalId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load reviews");
        return;
      }

      setReviews(data.reviews || []);
      setTotalReviews(data.totalReviews || 0);
      setAverageRating(data.averageRating || 0);
    } catch (error) {
      console.error("Fetch professional reviews error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const Stars = ({ rating, size = "text-base sm:text-xl" }) => {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} leading-none ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center p-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

          <p className="text-[10px] sm:text-sm lg:text-base text-gray-500 mt-2 sm:mt-3">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-[10px] sm:text-sm lg:text-base break-words">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-3 md:px-5 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 lg:mb-8">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
            Reviews
          </h1>

          <p className="text-[9px] sm:text-xs lg:text-base text-gray-500 mt-0.5 sm:mt-1.5 leading-relaxed">
            See what customers say about your services.
          </p>
        </div>

        <div className="shrink-0 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg">
          <span className="text-[8px] sm:text-xs lg:text-sm text-gray-500 whitespace-nowrap">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-4 md:p-5 lg:p-6 shadow-sm mb-4 sm:mb-6 lg:mb-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 min-w-0">
            <div className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-500">
                {averageRating}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-[10px] sm:text-sm lg:text-lg font-semibold text-gray-900 truncate">
                Average Rating
              </h2>

              <div className="mt-1 sm:mt-1.5">
                <Stars
                  rating={Math.round(averageRating)}
                  size="text-[10px] sm:text-base lg:text-xl"
                />
              </div>

              <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500 mt-1 truncate">
                Based on {totalReviews}{" "}
                {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 min-w-0">
            <div className="w-11 h-11 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {totalReviews}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-[10px] sm:text-sm lg:text-lg font-semibold text-gray-900 truncate">
                Customer Reviews
              </h2>

              <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500 mt-1 leading-relaxed">
                People who reviewed your service
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 lg:mb-5">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
              Customer Feedback
            </h2>

            <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500 mt-0.5">
              Reviews from your customers
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-6 sm:p-9 lg:p-12 text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">
              ⭐
            </div>

            <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-800">
              No reviews yet
            </h3>

            <p className="text-[9px] sm:text-xs lg:text-base text-gray-500 mt-1.5 sm:mt-2 max-w-md mx-auto leading-relaxed">
              Complete your first service and ask your customer to leave a
              review.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs sm:text-sm lg:text-lg">
                        {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[10px] sm:text-sm lg:text-base text-gray-900 truncate">
                        {review.user?.name || "Customer"}
                      </h3>

                      <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500">
                        Customer
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Stars
                      rating={review.rating}
                      size="text-[10px] sm:text-base lg:text-xl"
                    />
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-4 lg:mt-5">
                  <p className="text-[10px] sm:text-sm lg:text-base text-gray-700 leading-relaxed break-words">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
                  <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalReviews;