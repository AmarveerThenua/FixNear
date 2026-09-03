import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    // ====================
    // User Account
    // ====================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },


    // ====================
    // Basic Information
    // ====================

    name: {
      type: String,
      required: true,
      trim: true
    },

    profession: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },


    // ====================
    // Worker Details
    // ====================

    skills: {
      type: [String],
      default: []
    },

    experience: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },


    // ====================
    // Address
    // ====================

    address: {
      type: String,
      default: "",
      trim: true
    },

    city: {
      type: String,
      default: "",
      trim: true
    },

    state: {
      type: String,
      default: "",
      trim: true
    },

    pincode: {
      type: String,
      default: "",
      trim: true
    },

    location: {
      type: String,
      default: "",
      trim: true
    },

    serviceArea: {
      type: [String],
      default: []
    },


    // ====================
    // Profile
    // ====================

    image: {
      type: String,
      default: ""
    },


    // ====================
    // Pricing
    // ====================

    price: {
      type: Number,
      required: true,
      min: 0
    },


    // ====================
    // Reviews
    // ====================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0
    },


    // ====================
    // Availability
    // ====================

    available: {
      type: Boolean,
      default: true
    },


    // ====================
    // Verification
    // ====================

    isVerified: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);


const Professional = mongoose.model(
  "Professional",
  professionalSchema
);

export default Professional;