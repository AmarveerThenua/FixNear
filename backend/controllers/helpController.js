import HelpConversation from "../models/HelpConversation.js";
import HelpMessage from "../models/HelpMessage.js";
import User from "../models/User.js";

const getIo = (req) => {
  return req.app.get("io");
};

const getConversationForUser = async (userId, role) => {
  let conversation = await HelpConversation.findOne({
    user: userId,
    userRole: role,
  });

  if (!conversation) {
    conversation = await HelpConversation.create({
      user: userId,
      userRole: role,
    });
  }

  return conversation;
};

export const getMyConversation = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !== "user" &&
      req.user.role !== "professional"
    ) {
      return res.status(403).json({
        message:
          "Only users and professionals can access Help & Support.",
      });
    }

    const conversation = await getConversationForUser(
      req.user.id,
      req.user.role
    );

    const messages = await HelpMessage.find({
      conversation: conversation._id,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    await HelpMessage.updateMany(
      {
        conversation: conversation._id,
        senderRole: "admin",
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    conversation.unreadForUser = 0;
    await conversation.save();

    return res.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error(
      "Get help conversation error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to load Help & Support.",
    });
  }
};

export const sendHelpMessage = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !== "user" &&
      req.user.role !== "professional"
    ) {
      return res.status(403).json({
        message:
          "Only users and professionals can send help messages.",
      });
    }

    const messageText = req.body.message?.trim();

    if (!messageText) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    if (messageText.length > 2000) {
      return res.status(400).json({
        message:
          "Message cannot be longer than 2000 characters.",
      });
    }

    const conversation = await getConversationForUser(
      req.user.id,
      req.user.role
    );

    const message = await HelpMessage.create({
      conversation: conversation._id,
      sender: req.user.id,
      senderRole: req.user.role,
      message: messageText,
      read: false,
    });

    conversation.lastMessage = messageText;
    conversation.lastMessageAt = message.createdAt;
    conversation.status = "open";
    conversation.unreadForAdmin += 1;

    await conversation.save();

    const populatedMessage =
      await HelpMessage.findById(message._id).populate(
        "sender",
        "name email role"
      );

    const io = getIo(req);

    io.to("admin-room").emit(
      "new-help-message",
      {
        conversationId: conversation._id,
        message: populatedMessage,
        senderRole: req.user.role,
      }
    );

    io.to(`conversation-${conversation._id}`).emit(
      "help-message",
      {
        conversationId: conversation._id,
        message: populatedMessage,
        senderRole: req.user.role,
      }
    );

    return res.status(201).json({
      message: populatedMessage,
      conversation,
    });
  } catch (error) {
    console.error(
      "Send help message error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to send help message.",
    });
  }
};

export const getAllHelpConversations = async (
  req,
  res
) => {
  try {
    const role = req.query.role;

    const filter = {};

    if (
      role === "user" ||
      role === "professional"
    ) {
      filter.userRole = role;
    }

    const conversations =
      await HelpConversation.find(filter)
        .populate(
          "user",
          "name email phone role"
        )
        .sort({
          lastMessageAt: -1,
        });

    return res.json({
      conversations,
    });
  } catch (error) {
    console.error(
      "Get help conversations error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to load Help & Support conversations.",
    });
  }
};

export const getHelpConversationById = async (
  req,
  res
) => {
  try {
    const conversation =
      await HelpConversation.findById(req.params.id).populate(
        "user",
        "name email phone role"
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    const messages = await HelpMessage.find({
      conversation: conversation._id,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    conversation.unreadForAdmin = 0;
    await conversation.save();

    await HelpMessage.updateMany(
      {
        conversation: conversation._id,
        senderRole: {
          $in: ["user", "professional"],
        },
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    return res.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error(
      "Get help conversation by ID error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to load conversation.",
    });
  }
};

export const sendAdminHelpMessage = async (
  req,
  res
) => {
  try {
    const messageText = req.body.message?.trim();

    if (!messageText) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    if (messageText.length > 2000) {
      return res.status(400).json({
        message:
          "Message cannot be longer than 2000 characters.",
      });
    }

    const conversation =
      await HelpConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    const message = await HelpMessage.create({
      conversation: conversation._id,
      sender: req.user.id,
      senderRole: "admin",
      message: messageText,
      read: false,
    });

    conversation.lastMessage = messageText;
    conversation.lastMessageAt = message.createdAt;
    conversation.status = "in-progress";
    conversation.unreadForUser += 1;
    conversation.unreadForAdmin = 0;

    await conversation.save();

    const populatedMessage =
      await HelpMessage.findById(message._id).populate(
        "sender",
        "name email role"
      );

    const io = getIo(req);

    io.to(`user-${conversation.user}`).emit(
      "new-help-message",
      {
        conversationId: conversation._id,
        message: populatedMessage,
        senderRole: "admin",
      }
    );

    io.to(`conversation-${conversation._id}`).emit(
      "help-message",
      {
        conversationId: conversation._id,
        message: populatedMessage,
        senderRole: "admin",
      }
    );

    return res.status(201).json({
      message: populatedMessage,
      conversation,
    });
  } catch (error) {
    console.error(
      "Send admin help message error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to send admin message.",
    });
  }
};

export const resolveHelpConversation = async (
  req,
  res
) => {
  try {
    const conversation =
      await HelpConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    conversation.status = "resolved";
    conversation.unreadForAdmin = 0;
    await conversation.save();

    const io = getIo(req);

    io.to(`user-${conversation.user}`).emit(
      "help-conversation-updated",
      {
        conversationId: conversation._id,
        status: "resolved",
      }
    );

    io.to(`conversation-${conversation._id}`).emit(
      "help-conversation-updated",
      {
        conversationId: conversation._id,
        status: "resolved",
      }
    );

    return res.json({
      message: "Conversation resolved successfully.",
      conversation,
    });
  } catch (error) {
    console.error(
      "Resolve help conversation error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to resolve conversation.",
    });
  }
};