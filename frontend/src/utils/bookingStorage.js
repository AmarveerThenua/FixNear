const BOOKING_KEY = "fixnearBookings";

export const getBookings = () => {
  const bookings = localStorage.getItem(BOOKING_KEY);

  if (!bookings) {
    return [];
  }

  return JSON.parse(bookings);
};

export const saveBooking = (booking) => {
  const bookings = getBookings();

  const updatedBookings = [
    ...bookings,
    booking
  ];

  localStorage.setItem(
    BOOKING_KEY,
    JSON.stringify(updatedBookings)
  );

  return booking;
};

export const getBookingById = (id) => {
  const bookings = getBookings();

  return bookings.find(
    (booking) => booking.id === Number(id)
  );
};

export const cancelBooking = (id) => {
  const bookings = getBookings();

  const updatedBookings = bookings.map((booking) =>
    booking.id === Number(id)
      ? {
          ...booking,
          status: "Cancelled"
        }
      : booking
  );

  localStorage.setItem(
    BOOKING_KEY,
    JSON.stringify(updatedBookings)
  );

  return updatedBookings;
};