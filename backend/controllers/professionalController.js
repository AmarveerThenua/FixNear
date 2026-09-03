import jwt from "jsonwebtoken";
import Professional from "../models/Professional.js";
import User from "../models/User.js";

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

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin account cannot become a professional",
      });
    }

    const existingProfessional = await Professional.findOne({
      user: userId,
    });

    if (existingProfessional) {
      return res.status(400).json({
        message: "You already have a professional profile",
      });
    }

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
        message: "Please provide all required professional details",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await Professional.findOne({
      email: normalizedEmail,
    });

    if (
      existingEmail &&
      existingEmail.user.toString() !== userId.toString()
    ) {
      return res.status(400).json({
        message:
          "This email is already registered to another professional",
      });
    }

    const professional = await Professional.create({
      user: userId,
      name,
      profession,
      email: normalizedEmail,
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
        available !== undefined ? available : true,
      isVerified: false,
    });

    user.role = "professional";

    await user.save();

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

    res.status(201).json({
      message: "Professional profile created successfully",
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
    console.error("Create professional error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      professionals,
    });
  } catch (error) {
    console.error("Get professionals error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    res.status(200).json({
      professional,
    });
  } catch (error) {
    console.error("Get professional error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyProfessionalProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const professional = await Professional.findOne({
      user: userId,
    });

    if (!professional) {
      return res.status(404).json({
        message: "Professional profile not found",
      });
    }

    res.status(200).json({
      professional,
    });
  } catch (error) {
    console.error("Get my professional profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateMyProfessionalProfile = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const professional = await Professional.findOne({
      user: userId,
    });

    if (!professional) {
      return res.status(404).json({
        message: "Professional profile not found",
      });
    }

    const {
      name,
      profession,
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
      available,
      image,
    } = req.body;

    if (
      !name ||
      !profession ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required professional details",
      });
    }

    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      return res.status(400).json({
        message: "Please provide a valid price",
      });
    }

    professional.name = name.trim();
    professional.profession = profession.trim();
    professional.phone = phone.trim();

    professional.skills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    professional.experience = experience || "";
    professional.description = description || "";
    professional.address = address.trim();
    professional.city = city.trim();
    professional.state = state.trim();
    professional.pincode = pincode.trim();
    professional.location = location?.trim() || city.trim();

    professional.serviceArea = Array.isArray(serviceArea)
      ? serviceArea
      : typeof serviceArea === "string"
      ? serviceArea
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean)
      : [];

    professional.price = Number(price);

    if (available !== undefined) {
      professional.available = Boolean(available);
    }

    if (image !== undefined) {
      professional.image = image;
    }

    await professional.save();

    const user = await User.findById(userId);

    if (user) {
      user.name = professional.name;
      user.phone = professional.phone;
      user.location = professional.location;

      await user.save();
    }

    res.status(200).json({
      message: "Professional profile updated successfully",
      professional,
    });
  } catch (error) {
    console.error(
      "Update professional profile error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllProfessionalsAdmin = async (req, res) => {
  try {
    const professionals = await Professional.find()
      .populate("user", "name email phone role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: professionals.length,
      professionals,
    });
  } catch (error) {
    console.error("Admin get professionals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch professionals",
    });
  }
};

export const getProfessionalAdminById = async (req, res) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    ).populate("user", "name email phone role");

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.status(200).json({
      success: true,
      professional,
    });
  } catch (error) {
    console.error("Admin get professional error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch professional",
    });
  }
};

export const verifyProfessional = async (req, res) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    );

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    professional.isVerified = true;

    await professional.save();

    res.status(200).json({
      success: true,
      message: "Professional verified successfully",
      professional,
    });
  } catch (error) {
    console.error("Verify professional error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify professional",
    });
  }
};

export const unverifyProfessional = async (req, res) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    );

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    professional.isVerified = false;

    await professional.save();

    res.status(200).json({
      success: true,
      message: "Professional verification removed",
      professional,
    });
  } catch (error) {
    console.error("Unverify professional error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update verification",
    });
  }
};

export const toggleProfessionalAvailability = async (
  req,
  res
) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    );

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    professional.available = !professional.available;

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
      message: "Failed to update availability",
    });
  }
};

export const deleteProfessional = async (req, res) => {
  try {
    const professional = await Professional.findById(
      req.params.id
    );

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    const userId = professional.user;

    await Professional.findByIdAndDelete(req.params.id);

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        role: "user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional deleted successfully",
    });
  } catch (error) {
    console.error("Delete professional error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete professional",
    });
  }
};