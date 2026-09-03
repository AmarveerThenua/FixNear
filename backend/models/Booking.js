  import mongoose from "mongoose";

  const bookingSchema = new mongoose.Schema(
    {
      // ====================
      // Customer
      // ====================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      // ====================
      // Professional
      // ====================

      professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true
      },

      // ====================
      // Service
      // ====================

      service: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        default: "",
        trim: true
      },

      // ====================
      // Booking Address
      // ====================

      address: {
        type: String,
        required: true,
        trim: true
      },

      city: {
        type: String,
        required: true,
        trim: true
      },

      pincode: {
        type: String,
        required: true,
        trim: true
      },

      // ====================
      // Schedule
      // ====================

      date: {
        type: Date,
        required: true
      },

      time: {
        type: String,
        required: true
      },

      // ====================
      // Price
      // ====================

      price: {
        type: Number,
        required: true,
        min: 0
      },

      // ====================
      // Booking Status
      // ====================

      status: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "in-progress",
          "completed",
          "cancelled"
        ],
        default: "pending"
      }
    },
    {
      timestamps: true
    }
  );

  const Booking = mongoose.model(
    "Booking",
    bookingSchema
  );

  export default Booking;