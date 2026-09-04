import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import professionalRoutes from "./routes/professionalRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import helpRoutes from "./routes/helpRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://fix-near-delta.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/help", helpRoutes);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.id || !decoded?.role) {
      return next(new Error("Invalid authentication token"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  const role = socket.user.role;

  if (role === "admin") {
    socket.join("admin-room");
  } else if (
    role === "user" ||
    role === "professional"
  ) {
    socket.join(`user-${userId}`);
  }

  socket.on("join-conversation", async (conversationId) => {
    if (!conversationId) {
      return;
    }

    try {
      const HelpConversation = (
        await import("./models/HelpConversation.js")
      ).default;

      const conversation =
        await HelpConversation.findById(conversationId).select(
          "user userRole"
        );

      if (!conversation) {
        return;
      }

      const isAdmin = role === "admin";
      const isOwner =
        conversation.user.toString() === userId &&
        conversation.userRole === role;

      if (isAdmin || isOwner) {
        socket.join(`conversation-${conversationId}`);
      }
    } catch (error) {
      console.error(
        "Socket conversation join error:",
        error.message
      );
    }
  });

  socket.on("leave-conversation", (conversationId) => {
    if (conversationId) {
      socket.leave(`conversation-${conversationId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });

app.get("/", (req, res) => {
  res.json({
    message: "FixNear API is running",
  });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});