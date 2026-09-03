import jwt from "jsonwebtoken";

import Professional from "../models/Professional.js";
import User from "../models/User.js";


// ==================================================
// CREATE PROFESSIONAL
// ==================================================

export const createProfessional = async (req, res) => {
  try {
    const {
      name,
      profession,
      email,
      phone,
      skills,
      experience,
      description,
      address,
      city,
      state,
      pincode,
      location,
      serviceArea,
      price,
      image,
      available,
    } = req.body;

    // ====================
    // Check Authentication
    // ====================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userId = req.user.id;

    // ====================
    // Find User
    // ====================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ====================
    // Prevent Admin
    // ====================

    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin account cannot become a professional",
      });
    }

    // ====================
    // Prevent Duplicate
    // ====================

    const existingProfessional =
      await Professional.findOne({
        user: userId,
      });

    if (existingProfessional) {
      return res.status(400).json({
        message:
          "You already have a professional profile",
      });
    }

    // ====================
    // Required Fields
    // ====================

    if (
      !name ||
      !profession ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required professional details",
      });
    }

    // ====================
    // Check Email
    // ====================

    const existingEmail =
      await Professional.findOne({
        email: email.toLowerCase(),
      });

    if (existingEmail) {
      return res.status(400).json({
        message:
          "Professional already exists with this email",
      });
    }

    // ====================
    // Create Professional
    // ====================

    const professional =
      await Professional.create({
        user: userId,

        name,
        profession,
        email: email.toLowerCase(),
        phone,

        skills: skills || [],

        experience: experience || "",

        description: description || "",

        address,
        city,
        state,
        pincode,

        location: location || city,

        serviceArea: serviceArea || [],

        price,

        image: image || "",

        available:
          available !== undefined
            ? available
            : true,

        // New professionals need admin verification
        isVerified: false,
      });

    // ====================
    // CHANGE USER ROLE
    // ====================

    user.role = "professional";

    await user.save();

    // ====================
    // Create New JWT
    // ====================
    // The old token contains role: "user".
    // Therefore we create a new token containing
    // role: "professional".

    const newToken = jwt.sign(
      {
        id: user._id,
        role: "professional",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ====================
    // Response
    // ====================

    res.status(201).json({
      message:
        "Professional profile created successfully",

      token: newToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
      },

      professional: {
        id: professional._id,
        user: professional.user,
        name: professional.name,
        profession: professional.profession,
        email: professional.email,
        phone: professional.phone,
        skills: professional.skills,
        experience: professional.experience,
        description: professional.description,
        address: professional.address,
        city: professional.city,
        state: professional.state,
        pincode: professional.pincode,
        location: professional.location,
        serviceArea: professional.serviceArea,
        price: professional.price,
        image: professional.image,
        available: professional.available,
        rating: professional.rating,
        reviews: professional.reviews,
        isVerified: professional.isVerified,
      },
    });

  } catch (error) {
    console.error(
      "Create professional error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================================================
// GET ALL PROFESSIONALS
// ==================================================

export const getProfessionals = async (
  req,
  res
) => {
  try {
    const professionals =
      await Professional.find()
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      professionals,
    });

  } catch (error) {
    console.error(
      "Get professionals error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================================================
// GET SINGLE PROFESSIONAL
// ==================================================

export const getProfessionalById = async (
  req,
  res
) => {
  try {
    const professional =
      await Professional.findById(
        req.params.id
      );

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    res.status(200).json({
      professional,
    });

  } catch (error) {
    console.error(
      "Get professional error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================================================
// GET MY PROFESSIONAL PROFILE
// ==================================================

export const getMyProfessionalProfile =
  async (req, res) => {
    try {
      const userId = req.user.id;

      const professional =
        await Professional.findOne({
          user: userId,
        });

      if (!professional) {
        return res.status(404).json({
          message:
            "Professional profile not found",
        });
      }

      res.status(200).json({
        professional,
      });

    } catch (error) {
      console.error(
        "Get my professional profile error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  };


// ==================================================
// ADMIN PROFESSIONAL MANAGEMENT
// ==================================================


// ====================
// Admin - Get All Professionals
// ====================

export const getAllProfessionalsAdmin =
  async (req, res) => {
    try {
      const professionals =
        await Professional.find()
          .populate(
            "user",
            "name email phone role"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: professionals.length,
        professionals,
      });

    } catch (error) {
      console.error(
        "Admin get professionals error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch professionals",
      });
    }
  };


// ====================
// Admin - Get Professional By ID
// ====================

export const getProfessionalAdminById =
  async (req, res) => {
    try {
      const professional =
        await Professional.findById(
          req.params.id
        ).populate(
          "user",
          "name email phone role"
        );

      if (!professional) {
        return res.status(404).json({
          success: false,
          message:
            "Professional not found",
        });
      }

      res.status(200).json({
        success: true,
        professional,
      });

    } catch (error) {
      console.error(
        "Admin get professional error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch professional",
      });
    }
  };


// ====================
// Admin - Verify Professional
// ====================

export const verifyProfessional =
  async (req, res) => {
    try {
      const professional =
        await Professional.findById(
          req.params.id
        );

      if (!professional) {
        return res.status(404).json({
          success: false,
          message:
            "Professional not found",
        });
      }

      professional.isVerified = true;

      await professional.save();

      res.status(200).json({
        success: true,
        message:
          "Professional verified successfully",
        professional,
      });

    } catch (error) {
      console.error(
        "Verify professional error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to verify professional",
      });
    }
  };


// ====================
// Admin - Unverify Professional
// ====================

export const unverifyProfessional =
  async (req, res) => {
    try {
      const professional =
        await Professional.findById(
          req.params.id
        );

      if (!professional) {
        return res.status(404).json({
          success: false,
          message:
            "Professional not found",
        });
      }

      professional.isVerified = false;

      await professional.save();

      res.status(200).json({
        success: true,
        message:
          "Professional verification removed",
        professional,
      });

    } catch (error) {
      console.error(
        "Unverify professional error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update verification",
      });
    }
  };


// ====================
// Admin - Toggle Availability
// ====================

export const toggleProfessionalAvailability =
  async (req, res) => {
    try {
      const professional =
        await Professional.findById(
          req.params.id
        );

      if (!professional) {
        return res.status(404).json({
          success: false,
          message:
            "Professional not found",
        });
      }

      professional.available =
        !professional.available;

      await professional.save();

      res.status(200).json({
        success: true,
        message: professional.available
          ? "Professional is now available"
          : "Professional is now unavailable",
        professional,
      });

    } catch (error) {
      console.error(
        "Toggle professional availability error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update availability",
      });
    }
  };


// ====================
// Admin - Delete Professional
// ====================

export const deleteProfessional =
  async (req, res) => {
    try {
      const professional =
        await Professional.findById(
          req.params.id
        );

      if (!professional) {
        return res.status(404).json({
          success: false,
          message:
            "Professional not found",
        });
      }

      const userId =
        professional.user;

      // Delete professional profile
      await Professional.findByIdAndDelete(
        req.params.id
      );

      // Change associated account back
      // to normal user
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          {
            role: "user",
          }
        );
      }

      res.status(200).json({
        success: true,
        message:
          "Professional deleted successfully",
      });

    } catch (error) {
      console.error(
        "Delete professional error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete professional",
      });
    }
  };