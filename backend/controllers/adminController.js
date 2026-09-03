import User from "../models/User.js";
import Professional from "../models/Professional.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";

// ====================
// Admin Dashboard
// ====================

export const getAdminDashboard = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalProfessionals = await User.countDocuments({
      role: "professional",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // Professional statistics
    const verifiedProfessionals =
      await Professional.countDocuments({
        isVerified: true,
      });

    const unverifiedProfessionals =
      await Professional.countDocuments({
        isVerified: false,
      });

    // Booking statistics
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    const inProgressBookings = await Booking.countDocuments({
      status: "in-progress",
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Review statistics
    const totalReviews = await Review.countDocuments();

    // Notification statistics
    const totalNotifications =
      await Notification.countDocuments();

    const unreadNotifications =
      await Notification.countDocuments({
        isRead: false,
      });

    // Revenue
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Send dashboard data
    res.status(200).json({
      success: true,

      users: {
        total: totalUsers,
        professionals: totalProfessionals,
        admins: totalAdmins,
      },

      professionals: {
        total: await Professional.countDocuments(),
        verified: verifiedProfessionals,
        unverified: unverifiedProfessionals,
      },

      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        inProgress: inProgressBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },

      reviews: {
        total: totalReviews,
      },

      notifications: {
        total: totalNotifications,
        unread: unreadNotifications,
      },

      revenue: {
        total: totalRevenue,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};