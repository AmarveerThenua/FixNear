import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Professional from "../models/Professional.js";
import Notification from "../models/Notification.js";

// ====================
// Create Review
// ====================

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bookingId,
      rating,
      comment,
    } = req.body;

    // ====================
    // Required Fields
    // ====================

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        message:
          "Booking, rating and comment are required",
      });
    }

    // ====================
    // Validate Rating
    // ====================

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // ====================
    // Find Booking
    // ====================

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // ====================
    // Only Completed Booking
    // ====================

    if (booking.status !== "completed") {
      return res.status(400).json({
        message:
          "You can review only after the service is completed",
      });
    }

    // ====================
    // Check Existing Review
    // ====================

    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message:
          "You have already reviewed this booking",
      });
    }

    // ====================
    // Find Professional
    // ====================

    const professional = await Professional.findById(
      booking.professional
    );

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    // ====================
    // Create Review
    // ====================

    const review = await Review.create({
      user: userId,
      professional: booking.professional,
      booking: booking._id,
      rating,
      comment,
    });

    // ====================
    // Calculate New Rating
    // ====================

    const reviews = await Review.find({
      professional: booking.professional,
    });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      totalRating / reviews.length;

    await Professional.findByIdAndUpdate(
      booking.professional,
      {
        rating: Number(
          averageRating.toFixed(1)
        ),
        reviews: reviews.length,
      }
    );

    // ====================
    // Create Notification
    // ====================

    await Notification.create({
      recipient: professional.user,
      type: "new_review",
      title: "New Review Received",
      message: `You received a ${rating}-star review for your ${booking.service} service.`,
      booking: booking._id,
      review: review._id,
      isRead: false,
    });

    // ====================
    // Response
    // ====================

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Get Reviews For Professional
// ====================

export const getProfessionalReviews = async (
  req,
  res
) => {
  try {
    const {
      professionalId,
    } = req.params;

    const reviews = await Review.find({
      professional: professionalId,
    })
      .populate(
        "user",
        "name"
      )
      .sort({
        createdAt: -1,
      });

    // ====================
    // Calculate Average Rating
    // ====================

    const totalReviews =
      reviews.length;

    const totalRating =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      );

    const averageRating =
      totalReviews > 0
        ? Number(
            (
              totalRating /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating,
    });

  } catch (error) {
    console.error(
      "Get professional reviews error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Get My Reviews
// ====================

export const getMyReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      user: req.user.id,
    })
      .populate(
        "professional",
        "name profession image"
      )
      .populate(
        "booking",
        "service date"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      reviews,
    });

  } catch (error) {
    console.error(
      "Get my reviews error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Get Reviewable Bookings
// ====================

export const getReviewableBookings = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    // ====================
    // Get Completed Bookings
    // ====================

    const completedBookings =
      await Booking.find({
        user: userId,
        status: "completed",
      })
        .populate(
          "professional",
          "name profession image"
        )
        .sort({
          date: -1,
        });

    // ====================
    // Get Existing Reviews
    // ====================

    const existingReviews =
      await Review.find({
        user: userId,
      }).select("booking");

    const reviewedBookingIds =
      new Set(
        existingReviews.map(
          (review) =>
            review.booking.toString()
        )
      );

    // ====================
    // Filter Reviewable
    // ====================

    const reviewableBookings =
      completedBookings.filter(
        (booking) =>
          !reviewedBookingIds.has(
            booking._id.toString()
          )
      );

    res.status(200).json({
      bookings: reviewableBookings,
    });

  } catch (error) {
    console.error(
      "Get reviewable bookings error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================================================
// ADMIN REVIEW FUNCTIONS
// ==================================================


// ====================
// Get All Reviews - Admin
// ====================

export const getAllReviewsAdmin = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find()
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "professional",
        "name profession phone image"
      )
      .populate(
        "booking",
        "service date time price status"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      reviews,
      totalReviews: reviews.length,
    });

  } catch (error) {
    console.error(
      "Get all reviews admin error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Get Single Review - Admin
// ====================

export const getReviewAdminById = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const review = await Review.findById(id)
      .populate(
        "user",
        "name email phone location role"
      )
      .populate(
        "professional",
        "name profession phone email image rating reviews"
      )
      .populate(
        "booking",
        "service description address city pincode date time price status createdAt"
      );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      review,
    });

  } catch (error) {
    console.error(
      "Get review admin by id error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Delete Review - Admin
// ====================

export const deleteReviewAdmin = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const professionalId =
      review.professional;

    // ====================
    // Delete Review
    // ====================

    await Review.findByIdAndDelete(id);

    // ====================
    // Recalculate Professional Rating
    // ====================

    const remainingReviews =
      await Review.find({
        professional: professionalId,
      });

    const totalReviews =
      remainingReviews.length;

    const totalRating =
      remainingReviews.reduce(
        (sum, currentReview) =>
          sum + currentReview.rating,
        0
      );

    const averageRating =
      totalReviews > 0
        ? Number(
            (
              totalRating /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    await Professional.findByIdAndUpdate(
      professionalId,
      {
        rating: averageRating,
        reviews: totalReviews,
      }
    );

    // ====================
    // Delete Related Notification
    // ====================

    await Notification.deleteMany({
      review: review._id,
    });

    // ====================
    // Response
    // ====================

    res.status(200).json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete review admin error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};