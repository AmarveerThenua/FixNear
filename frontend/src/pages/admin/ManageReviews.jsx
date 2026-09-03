import React, { useEffect, useState } from "react";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        throw new Error("Please login as an admin.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    let result = [...reviews];

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((review) => {
        return (
          review.comment?.toLowerCase().includes(searchValue) ||
          review.user?.name?.toLowerCase().includes(searchValue) ||
          review.user?.email?.toLowerCase().includes(searchValue) ||
          review.professional?.name?.toLowerCase().includes(searchValue) ||
          review.professional?.profession
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (ratingFilter !== "all") {
      result = result.filter(
        (review) => String(review.rating) === String(ratingFilter)
      );
    }

    setFilteredReviews(result);
  }, [reviews, search, ratingFilter]);

  const deleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("fixnearToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/admin/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      setSelectedReview(null);
      setShowDetails(false);

      alert("Review deleted successfully.");
    } catch (error) {
      console.error("Delete review error:", error);
      alert(error.message);
    }
  };

  const viewReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("fixnearToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/admin/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch review");
      }

      setSelectedReview(data.review);
      setShowDetails(true);
    } catch (error) {
      console.error("View review error:", error);
      alert(error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= value ? "text-yellow-500" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const totalReviews = reviews.length;

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const lowRatingReviews = reviews.filter(
    (review) => Number(review.rating) <= 2
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const clearFilters = () => {
    setSearch("");
    setRatingFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-xs sm:text-base text-gray-500">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6 w-full min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-800 truncate">
            Manage Reviews
          </h1>

          <p className="text-[10px] sm:text-base text-gray-500 mt-0.5 sm:mt-1 truncate">
            View and manage customer reviews and ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-blue-600 text-white text-[10px] sm:text-sm rounded-lg hover:bg-blue-700 transition"
        >
          🔄 <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Total Reviews
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">
            {totalReviews}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Average Rating
          </p>

          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              {averageRating}
            </h2>

            <span className="text-yellow-500 text-base sm:text-xl">
              ★
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            5 Star Reviews
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-green-600 mt-1 sm:mt-2">
            {fiveStarReviews}
          </h2>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
          <p className="text-[9px] sm:text-sm text-gray-500">
            Low Ratings
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-red-600 mt-1 sm:mt-2">
            {lowRatingReviews}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-2.5 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-2 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Search Reviews
            </label>

            <input
              type="text"
              placeholder="Search by customer, professional or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg outline-none text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Rating
            </label>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg outline-none text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {(search || ratingFilter !== "all") && (
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
            <p className="text-[10px] sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredReviews.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {reviews.length}
              </span>
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] sm:text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs sm:text-sm wrap-break-word">
          {error}
        </div>
      )}

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-10 text-center">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
            ⭐
          </div>

          <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
            No reviews found
          </h3>

          <p className="text-[10px] sm:text-sm text-gray-500 mt-1">
            Try changing your search or rating filter.
          </p>

          {(search || ratingFilter !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="lg:hidden space-y-2.5">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {review.user?.name || "N/A"}
                    </p>

                    <p className="text-[9px] text-gray-500 truncate mt-0.5">
                      {review.user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {renderStars(review.rating)}

                    <p className="text-[9px] text-gray-500 mt-0.5">
                      {review.rating}/5
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase font-medium">
                    Professional
                  </p>

                  <p className="text-xs font-medium text-gray-800 mt-0.5 truncate">
                    {review.professional?.name || "N/A"}
                  </p>

                  <p className="text-[9px] text-gray-500 truncate">
                    {review.professional?.profession || ""}
                  </p>
                </div>

                <div className="mt-2.5">
                  <p className="text-[9px] text-gray-400 uppercase font-medium">
                    Review
                  </p>

                  <p className="text-xs text-gray-700 mt-0.5 leading-4 wrap-break-word">
                    {review.comment || "No comment"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-[9px] text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => viewReview(review._id)}
                      className="px-2.5 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteReview(review._id)}
                      className="px-2.5 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Professional
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Rating
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Review
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredReviews.map((review) => (
                    <tr
                      key={review._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="min-w-42.5">
                          <p className="font-medium text-sm text-gray-800 truncate max-w-45">
                            {review.user?.name || "N/A"}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-50">
                            {review.user?.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-37.5">
                          <p className="font-medium text-sm text-gray-800 truncate max-w-45">
                            {review.professional?.name || "N/A"}
                          </p>

                          <p className="text-xs text-gray-500 truncate max-w-45">
                            {review.professional?.profession || ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {renderStars(review.rating)}

                        <p className="text-xs text-gray-500 mt-1">
                          {review.rating}/5
                        </p>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm text-gray-700 truncate max-w-[220px]">
                          {review.comment || "No comment"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 whitespace-nowrap">
                          {formatDate(review.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2 min-w-[150px]">
                          <button
                            type="button"
                            onClick={() => viewReview(review._id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteReview(review._id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredReviews.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {reviews.length}
                </span>{" "}
                reviews
              </p>
            </div>
          </div>

          <div className="lg:hidden text-center">
            <p className="text-[10px] text-gray-500">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
          </div>
        </>
      )}

      {showDetails && selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2.5 sm:p-4"
          onClick={() => {
            setShowDetails(false);
            setSelectedReview(null);
          }}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[94vh] overflow-hidden flex flex-col shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200 shrink-0">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-gray-800">
                  Review Details
                </h2>

                <p className="text-[9px] sm:text-xs text-gray-500 mt-1 break-all">
                  {selectedReview._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedReview(null);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3 sm:p-6 space-y-3 sm:space-y-5 overflow-y-auto">
              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
                <p className="text-[10px] sm:text-sm text-gray-500 mb-1.5 sm:mb-2">
                  Rating
                </p>

                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}

                  <span className="font-semibold text-xs sm:text-base text-gray-800">
                    {selectedReview.rating}/5
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Customer
                </h3>

                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedReview.user?.name || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 break-all">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedReview.user?.email || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedReview.user?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Professional
                </h3>

                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedReview.professional?.name || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                    <span className="font-medium">Profession:</span>{" "}
                    {selectedReview.professional?.profession || "N/A"}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedReview.professional?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  Customer Review
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 leading-5 sm:leading-6 whitespace-pre-wrap wrap-break-word">
                  {selectedReview.comment || "No comment"}
                </p>
              </div>

              {selectedReview.booking && (
                <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-base">
                    Booking
                  </h3>

                  <div className="space-y-1.5">
                    <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">
                      <span className="font-medium">Service:</span>{" "}
                      {selectedReview.booking?.service || "N/A"}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(selectedReview.booking?.date)}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="capitalize">
                        {selectedReview.booking?.status || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="text-[10px] sm:text-sm text-gray-500">
                Review submitted on{" "}
                <span className="font-medium text-gray-700">
                  {formatDate(selectedReview.createdAt)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteReview(selectedReview._id)}
                className="w-full px-4 py-2.5 bg-red-600 text-white text-xs sm:text-sm rounded-lg hover:bg-red-700 transition"
              >
                Delete Review
              </button>
            </div>

            <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedReview(null);
                }}
                className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;