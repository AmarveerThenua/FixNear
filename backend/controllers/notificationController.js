import Notification from "../models/Notification.js";

// ====================
// Get My Notifications
// ====================

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("booking", "service date time status")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Mark Notification As Read
// ====================

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Mark All Notifications As Read
// ====================

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ====================
// Delete Notification
// ====================

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};