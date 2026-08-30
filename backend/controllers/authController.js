import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
      location
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      location
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};