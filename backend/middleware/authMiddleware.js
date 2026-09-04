import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized. Please login.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};

export const userOrProfessionalOnly = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized. Please login.",
    });
  }

  if (
    req.user.role !== "user" &&
    req.user.role !== "professional"
  ) {
    return res.status(403).json({
      message:
        "Access denied. Users and professionals only.",
    });
  }

  next();
};