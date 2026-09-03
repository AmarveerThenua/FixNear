import User from "../models/User.js";
import Review from "../models/Review.js";
import Professional from "../models/Professional.js";
import Notification from "../models/Notification.js";


// ====================
// Update User Profile
// ====================

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
    } = req.body;

    // Find logged-in user
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (location !== undefined) {
      user.location = location;
    }

    // Save changes
    await user.save();

    // Send updated user
    res.status(200).json({
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Admin - Get All Users
// ====================

export const getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error(
      "Get all users error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch users",
    });
  }
};


// ====================
// Admin - Get User By ID
// ====================

export const getUserById = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "Get user by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch user",
    });
  }
};


// ====================
// Admin - Change User Role
// ====================

export const updateUserRole = async (
  req,
  res
) => {
  try {
    const {
      role,
    } = req.body;

    // Allowed roles
    const allowedRoles = [
      "user",
      "professional",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing
    // their own role
    if (
      user._id.toString() ===
      req.user.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
};


// ==================================================
// ADMIN - DELETE USER
// ==================================================

export const deleteUser = async (
  req,
  res
) => {
  try {
    const userId = req.params.id;

    // ====================
    // Find User
    // ====================

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ====================
    // Prevent Self Delete
    // ====================

    if (
      user._id.toString() ===
      req.user.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });
    }

    // ==================================================
    // FIND USER'S REVIEWS
    // ==================================================

    const userReviews = await Review.find({
      user: userId,
    }).select(
      "_id professional"
    );

    // ==================================================
    // GET AFFECTED PROFESSIONALS
    // ==================================================

    const affectedProfessionalIds = [
      ...new Set(
        userReviews
          .map((review) =>
            review.professional?.toString()
          )
          .filter(Boolean)
      ),
    ];

    // ==================================================
    // DELETE USER'S REVIEWS
    // ==================================================

    if (userReviews.length > 0) {
      await Review.deleteMany({
        user: userId,
      });
    }

    // ==================================================
    // DELETE REVIEW NOTIFICATIONS
    // ==================================================

    if (userReviews.length > 0) {
      const reviewIds =
        userReviews.map(
          (review) => review._id
        );

      await Notification.deleteMany({
        review: {
          $in: reviewIds,
        },
      });
    }

    // ==================================================
    // RECALCULATE PROFESSIONAL RATINGS
    // ==================================================

    for (
      const professionalId
      of affectedProfessionalIds
    ) {
      const remainingReviews =
        await Review.find({
          professional:
            professionalId,
        });

      const totalReviews =
        remainingReviews.length;

      const totalRating =
        remainingReviews.reduce(
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

      await Professional.findByIdAndUpdate(
        professionalId,
        {
          rating: averageRating,
          reviews: totalReviews,
        }
      );
    }

    // ==================================================
    // DELETE USER
    // ==================================================

    await User.findByIdAndDelete(
      userId
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message:
        "User and related reviews deleted successfully",
      deletedReviews:
        userReviews.length,
      updatedProfessionals:
        affectedProfessionalIds.length,
    });

  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete user",
    });
  }
};