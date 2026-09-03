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

      const professionalData =
        await professionalResponse.json();

      if (!professionalResponse.ok) {
        setError(
          professionalData.message ||
            "Failed to load professional profile"
        );
        return;
      }

      const professionalId =
        professionalData.professional?._id;

      if (!professionalId) {
        setError("Professional profile not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/professional/${professionalId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load reviews"
        );
        return;
      }

      setReviews(data.reviews || []);
      setTotalReviews(data.totalReviews || 0);
      setAverageRating(data.averageRating || 0);
    } catch (error) {
      console.error(
        "Fetch professional reviews error:",
        error
      );

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const Stars = ({ rating, size = "text-xl" }) => {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
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
      <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

          <p className="text-sm sm:text-base text-gray-500 mt-3">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 sm:p-5 text-sm sm:text-base break-words">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-8">
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Reviews
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 leading-relaxed">
          See what customers say about your services.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-yellow-500">
                {averageRating}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Average Rating
              </h2>

              <div className="mt-1">
                <Stars
                  rating={Math.round(averageRating)}
                  size="text-base sm:text-xl"
                />
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Based on {totalReviews}{" "}
                {totalReviews === 1
                  ? "review"
                  : "reviews"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {totalReviews}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Customer Reviews
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                People who reviewed your service
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Customer Feedback
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Reviews from your customers
            </p>
          </div>

          <span className="self-start sm:self-auto text-xs sm:text-sm text-gray-500">
            {totalReviews}{" "}
            {totalReviews === 1
              ? "review"
              : "reviews"}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-7 sm:p-10 md:p-12 text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
              ⭐
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              No reviews yet
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Complete your first service and ask your
              customer to leave a review.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-5">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-base sm:text-lg">
                        {review.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {review.user?.name ||
                          "Customer"}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500">
                        Customer
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <Stars
                      rating={review.rating}
                      size="text-base sm:text-xl"
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-5">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString("en-IN", {
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