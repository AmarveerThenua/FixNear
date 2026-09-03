import React, { useEffect, useState } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewableBookings, setReviewableBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("fixnearToken");

  // =========================
  // Fetch Existing Reviews
  // =========================

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };

  // =========================
  // Fetch Reviewable Bookings
  // =========================

  const fetchReviewableBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews/reviewable",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviewableBookings(data.bookings || []);
      }
    } catch (error) {
      console.error(
        "Fetch reviewable bookings error:",
        error
      );
    }
  };

  // =========================
  // Fetch Everything
  // =========================

  const fetchData = async () => {
    setLoading(true);

    await Promise.all([
      fetchReviews(),
      fetchReviewableBookings(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // Open Review Modal
  // =========================

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);

    setRating(0);
    setHoverRating(0);
    setComment("");

    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setSelectedBooking(null);
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  // =========================
  // Submit Review
  // =========================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a star rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: selectedBooking._id,
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to submit review"
        );
        return;
      }

      alert("Review submitted successfully ⭐");

      closeModal();

      await fetchData();
    } catch (error) {
      console.error(
        "Submit review error:",
        error
      );

      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Display Stars
  // =========================

  const DisplayStars = ({ rating }) => {
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-lg sm:text-xl"
          >
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  // =========================
  // Interactive Stars
  // =========================

  const InteractiveStars = () => {
    const currentRating =
      hoverRating || rating;

    return (
      <div className="flex justify-center gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() =>
              setHoverRating(star)
            }
            onMouseLeave={() =>
              setHoverRating(0)
            }
            onClick={() => setRating(star)}
            className="text-4xl sm:text-5xl transition-transform hover:scale-110 focus:outline-none"
            aria-label={`${star} star`}
          >
            {star <= currentRating
              ? "★"
              : "☆"}
          </button>
        ))}
      </div>
    );
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* =========================
          Page Header
      ========================= */}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Reviews
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2 leading-relaxed">
          Share your experience with the professionals you hired.
        </p>
      </div>

      {/* =====================================
          SERVICES WAITING FOR REVIEW
      ===================================== */}

      {reviewableBookings.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Services Waiting for Review
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Tell us about your experience.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-5">
            {reviewableBookings.map(
              (booking) => (
                <div
                  key={booking._id}
                  className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition"
                >
                  {/* Professional + Button */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
                    {/* Professional */}

                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {booking.professional?.image ? (
                          <img
                            src={
                              booking.professional
                                .image
                            }
                            alt={
                              booking.professional
                                .name
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl">
                            👤
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                          {booking.professional
                            ?.name ||
                            "Professional"}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                          {booking.professional
                            ?.profession ||
                            "Service Professional"}
                        </p>
                      </div>
                    </div>

                    {/* Button */}

                    <button
                      type="button"
                      onClick={() =>
                        openReviewModal(
                          booking
                        )
                      }
                      className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                      Write Review
                    </button>
                  </div>

                  {/* Booking Details */}

                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                      <p className="text-gray-600 break-words">
                        <span className="font-medium text-gray-800">
                          Service:
                        </span>{" "}
                        {booking.service}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-medium text-gray-800">
                          Completed:
                        </span>{" "}
                        {new Date(
                          booking.date
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* =====================================
          EXISTING REVIEWS
      ===================================== */}

      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
          Your Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-7 sm:p-10 text-center">
            <div className="text-4xl sm:text-5xl mb-4">
              ⭐
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              No reviews yet
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Your submitted reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-5">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {review.professional
                        ?.name ||
                        "Professional"}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {review.professional
                        ?.profession ||
                        "Service Professional"}
                    </p>
                  </div>

                  <DisplayStars
                    rating={review.rating}
                  />
                </div>

                <p className="text-sm sm:text-base text-gray-700 mt-4 sm:mt-5 leading-relaxed break-words">
                  {review.comment}
                </p>

                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500">
                  {review.booking
                    ?.service && (
                    <>
                      <span>
                        Service:{" "}
                        {
                          review.booking
                            .service
                        }
                      </span>

                      <span className="hidden sm:inline">
                        •
                      </span>
                    </>
                  )}

                  <span>
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================
          REVIEW MODAL
      ===================================== */}

      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4 py-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Review Professional
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  {
                    selectedBooking
                      .professional
                      ?.name
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex-shrink-0 text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <form
              onSubmit={handleSubmitReview}
              className="p-4 sm:p-6"
            >
              {/* Rating */}

              <div className="text-center mb-6 sm:mb-7">
                <p className="text-sm sm:text-base font-medium text-gray-800 mb-3 sm:mb-4">
                  How was your experience?
                </p>

                <InteractiveStars />

                {rating > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-3">
                    Thank you for your rating!
                  </p>
                )}
              </div>

              {/* Comment */}

              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(
                      e.target.value
                    )
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us about your experience..."
                  className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="text-right text-[11px] sm:text-xs text-gray-400 mt-1">
                  {comment.length}/500
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    rating === 0 ||
                    !comment.trim()
                  }
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;