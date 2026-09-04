import mongoose from "mongoose";

const helpConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      enum: ["user", "professional"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadForAdmin: {
      type: Number,
      default: 0,
    },
    unreadForUser: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

helpConversationSchema.index(
  { user: 1, userRole: 1 },
  { unique: true }
);

const HelpConversation = mongoose.model(
  "HelpConversation",
  helpConversationSchema
);

export default HelpConversation;