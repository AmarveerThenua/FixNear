import Booking from "../models/Booking.js";
import Professional from "../models/Professional.js";
import Notification from "../models/Notification.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      professional,
      service,
      description,
      address,
      city,
      pincode,
      date,
      time,
    } = req.body;

    if (
      !professional ||
      !service ||
      !address ||
      !city ||
      !pincode ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        message: "Please provide all required booking details",
      });
    }

    const bookingDate = new Date(date);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid booking date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        message: "Booking date cannot be in the past",
      });
    }

    const cleanTime = time.trim();

    if (!cleanTime) {
      return res.status(400).json({
        message: "Please provide a valid booking time",
      });
    }

    const professionalData = await Professional.findById(
      professional
    );

    if (!professionalData) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    if (
      professionalData.user.toString() ===
      userId.toString()
    ) {
      return res.status(400).json({
        message: "You cannot book yourself",
      });
    }

    if (!professionalData.available) {
      return res.status(400).json({
        message: "Professional is currently unavailable",
      });
    }

    const existingBooking = await Booking.findOne({
      professional: professionalData._id,
      date: bookingDate,
      time: cleanTime,
      status: {
        $in: [
          "pending",
          "confirmed",
          "in-progress",
        ],
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "This professional is already booked for this date and time",
      });
    }

    const booking = await Booking.create({
      user: userId,
      professional: professionalData._id,
      service,
      description: description || "",
      address,
      city,
      pincode,
      date: bookingDate,
      time: cleanTime,
      price: professionalData.price,
      status: "pending",
    });

    await Notification.create({
      recipient: professionalData.user,
      type: "new_booking",
      title: "New Booking Request",
      message: `You have received a new booking request for ${service}.`,
      booking: booking._id,
      isRead: false,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      user: userId,
    })
      .populate(
        "professional",
        "name profession image phone price"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "Get bookings error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const userId = req.user.id;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: userId,
    }).populate(
      "professional",
      "name profession image phone price location"
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error(
      "Get booking error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.status === "completed" ||
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "This booking cannot be cancelled",
      });
    }

    const professional = await Professional.findById(
      booking.professional
    );

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    const previousStatus = booking.status;

    booking.status = "cancelled";

    await booking.save();

    if (
      previousStatus === "confirmed" ||
      previousStatus === "in-progress"
    ) {
      professional.available = true;
      await professional.save();
    }

    await Notification.create({
      recipient: professional.user,
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: `The customer has cancelled the ${booking.service} booking.`,
      booking: booking._id,
      isRead: false,
    });

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProfessionalBookings = async (req, res) => {
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

    const bookings = await Booking.find({
      professional: professional._id,
    })
      .populate(
        "user",
        "name email phone location"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "Get professional bookings error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const professional = await Professional.findOne({
      user: userId,
    });

    if (!professional) {
      return res.status(404).json({
        message: "Professional profile not found",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      professional: professional._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (status === "confirmed") {
      if (booking.status !== "pending") {
        return res.status(400).json({
          message: `Booking is already ${booking.status}`,
        });
      }

      if (!professional.available) {
        return res.status(400).json({
          message:
            "You are currently busy with another service",
        });
      }

      booking.status = "confirmed";
      professional.available = false;

      await booking.save();
      await professional.save();

      await Notification.create({
        recipient: booking.user,
        type: "booking_accepted",
        title: "Booking Accepted",
        message:
          `Your ${booking.service} booking has been accepted.`,
        booking: booking._id,
        isRead: false,
      });

      return res.status(200).json({
        message: "Booking accepted successfully",
        booking,
        professional: {
          id: professional._id,
          available: professional.available,
        },
      });
    }

    if (status === "cancelled") {
      if (booking.status !== "pending") {
        return res.status(400).json({
          message:
            `Booking is already ${booking.status}`,
        });
      }

      booking.status = "cancelled";

      await booking.save();

      await Notification.create({
        recipient: booking.user,
        type: "booking_rejected",
        title: "Booking Rejected",
        message:
          "Your booking has been rejected by the professional.",
        booking: booking._id,
        isRead: false,
      });

      return res.status(200).json({
        message: "Booking rejected successfully",
        booking,
        professional: {
          id: professional._id,
          available: professional.available,
        },
      });
    }

    if (status === "completed") {
      if (booking.status !== "confirmed") {
        return res.status(400).json({
          message:
            "Only confirmed bookings can be completed",
        });
      }

      booking.status = "completed";
      professional.available = true;

      await booking.save();
      await professional.save();

      await Notification.create({
        recipient: booking.user,
        type: "booking_completed",
        title: "Service Completed",
        message:
          `Your ${booking.service} service has been completed.`,
        booking: booking._id,
        isRead: false,
      });

      return res.status(200).json({
        message: "Service completed successfully",
        booking,
        professional: {
          id: professional._id,
          available: professional.available,
        },
      });
    }
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        "user",
        "name email phone location"
      )
      .populate(
        "professional",
        "name profession email phone image price"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Admin get bookings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingAdminById = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email phone location"
      )
      .populate(
        "professional",
        "name profession email phone image price"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(
      "Admin get booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

export const updateBookingStatusAdmin = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const oldStatus = booking.status;

    if (oldStatus === status) {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${status}`,
      });
    }

    const professional =
      await Professional.findById(
        booking.professional
      );

    if (status === "confirmed") {
      if (
        professional &&
        oldStatus !== "confirmed" &&
        !professional.available
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Professional is currently unavailable",
        });
      }

      if (professional) {
        professional.available = false;
        await professional.save();
      }
    }

    if (status === "completed") {
      if (professional) {
        professional.available = true;
        await professional.save();
      }
    }

    if (status === "cancelled") {
      if (
        professional &&
        (
          oldStatus === "confirmed" ||
          oldStatus === "in-progress"
        )
      ) {
        professional.available = true;
        await professional.save();
      }
    }

    booking.status = status;

    await booking.save();

    let notificationType = null;
    let notificationTitle = null;
    let notificationMessage = null;
    let recipient = null;

    if (status === "confirmed") {
      notificationType = "booking_accepted";
      notificationTitle = "Booking Accepted";
      notificationMessage =
        `Your ${booking.service} booking has been confirmed by FixNear admin.`;
      recipient = booking.user;
    } else if (status === "completed") {
      notificationType = "booking_completed";
      notificationTitle = "Booking Completed";
      notificationMessage =
        `Your ${booking.service} booking has been marked as completed.`;
      recipient = booking.user;
    } else if (status === "cancelled") {
      notificationType = "booking_cancelled";
      notificationTitle = "Booking Cancelled";
      notificationMessage =
        `Your ${booking.service} booking has been cancelled by FixNear admin.`;
      recipient = booking.user;
    }

    if (
      notificationType &&
      recipient
    ) {
      await Notification.create({
        recipient,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        booking: booking._id,
        isRead: false,
      });
    }

    const updatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "user",
          "name email phone location"
        )
        .populate(
          "professional",
          "name profession email phone image price"
        );

    res.status(200).json({
      success: true,
      message:
        "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Admin update booking status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

export const deleteBookingAdmin = async (
  req,
  res
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.status === "confirmed" ||
      booking.status === "in-progress"
    ) {
      const professional =
        await Professional.findById(
          booking.professional
        );

      if (professional) {
        professional.available = true;
        await professional.save();
      }
    }

    await Booking.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(
      "Admin delete booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};