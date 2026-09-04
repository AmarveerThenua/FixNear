import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Professional from "../models/Professional.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      location: location || "",
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
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
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const registerProfessional = async (req, res) => {
  try {
    const {
      name,
      profession,
      email,
      password,
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

    if (
      !name ||
      !profession ||
      !email ||
      !password ||
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

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account already exists with this email",
      });
    }

    const existingProfessional = await Professional.findOne({
      email: normalizedEmail,
    });

    if (existingProfessional) {
      return res.status(400).json({
        message: "A professional account already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      location: location?.trim() || city.trim(),
      role: "professional",
    });

    try {
      const professional = await Professional.create({
        user: user._id,
        name: name.trim(),
        profession: profession.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        skills: Array.isArray(skills)
          ? skills
          : typeof skills === "string"
          ? skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
        experience: experience || "",
        description: description || "",
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        location: location?.trim() || city.trim(),
        serviceArea: Array.isArray(serviceArea)
          ? serviceArea
          : typeof serviceArea === "string"
          ? serviceArea
              .split(",")
              .map((area) => area.trim())
              .filter(Boolean)
          : [],
        price: Number(price),
        image: image || "",
        available:
          available !== undefined ? Boolean(available) : true,
        isVerified: false,
      });

      const token = jwt.sign(
        {
          id: user._id,
          role: "professional",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(201).json({
        message: "Professional account created successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          role: user.role,
        },
        professional,
      });
    } catch (professionalError) {
      await User.findByIdAndDelete(user._id);
      throw professionalError;
    }
  } catch (error) {
    console.error("Professional registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
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
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};