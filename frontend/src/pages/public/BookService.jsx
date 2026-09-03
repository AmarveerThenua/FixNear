import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Get Today's Local Date
  // =========================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================
  // Fetch Professional
  // =========================

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/professionals/${id}`
        );

        setProfessional(response.data.professional);
      } catch (error) {
        console.error(
          "Fetch professional error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load professional."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pincode
    if (name === "pincode") {
      const onlyNumbers = value
        .replace(/\D/g, "")
        .slice(0, 6);

      setFormData({
        ...formData,
        [name]: onlyNumbers,
      });

      return;
    }

    // City
    if (name === "city") {
      const cityValue = value
        .replace(/[^a-zA-Z\s]/g, "")
        .slice(0, 50);

      setFormData({
        ...formData,
        [name]: cityValue,
      });

      return;
    }

    // Notes Limit
    if (name === "notes") {
      setFormData({
        ...formData,
        [name]: value.slice(0, 500),
      });

      return;
    }

    // Address Limit
    if (name === "address") {
      setFormData({
        ...formData,
        [name]: value.slice(0, 300),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // Validate Booking Form
  // =========================

  const validateForm = () => {
    const date = formData.date.trim();
    const time = formData.time.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const pincode = formData.pincode.trim();
    const notes = formData.notes.trim();

    // Professional Availability
    if (!professional) {
      return "Professional information is not available.";
    }

    if (!professional.available) {
      return "This professional is currently unavailable.";
    }

    // Date
    if (!date) {
      return "Please select a booking date.";
    }

    const today = getTodayDate();

    if (date < today) {
      return "Booking date cannot be in the past.";
    }

    // Time
    if (!time) {
      return "Please select a booking time.";
    }

    // Prevent past time for today's booking
    if (date === today) {
      const now = new Date();

      const currentHours = String(
        now.getHours()
      ).padStart(2, "0");

      const currentMinutes = String(
        now.getMinutes()
      ).padStart(2, "0");

      const currentTime = `${currentHours}:${currentMinutes}`;

      if (time <= currentTime) {
        return "Please select a future time.";
      }
    }

    // Address
    if (!address) {
      return "Please enter your service address.";
    }

    if (address.length < 10) {
      return "Please enter a complete service address.";
    }

    // City
    if (!city) {
      return "Please enter your city.";
    }

    if (city.length < 2) {
      return "Please enter a valid city name.";
    }

    if (!/^[a-zA-Z\s]+$/.test(city)) {
      return "City name can contain only letters and spaces.";
    }

    // Pincode
    if (!pincode) {
      return "Please enter your pincode.";
    }

    if (!/^\d{6}$/.test(pincode)) {
      return "Please enter a valid 6-digit pincode.";
    }

    // Notes
    if (notes.length > 500) {
      return "Problem description cannot exceed 500 characters.";
    }

    return "";
  };

  // =========================
  // Create Booking
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Prevent Double Submit
    if (bookingLoading) {
      return;
    }

    setBookingLoading(true);

    try {
      // Get JWT
      const token = localStorage.getItem(
        "fixnearToken"
      );

      if (!token) {
        setError(
          "Please login before booking a professional."
        );

        setBookingLoading(false);
        return;
      }

      // Booking Data
      const bookingData = {
        professional: professional._id,
        service: professional.profession,
        description: formData.notes.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        date: formData.date,
        time: formData.time,
      };

      console.log("Booking Data:", bookingData);

      // API Request
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Booking Response:",
        response.data
      );

      // Redirect
      navigate("/booking-success", {
        state: {
          booking: response.data.booking,
        },
      });
    } catch (error) {
      console.error(
        "Create booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading professional...
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // Professional Not Found
  // =========================

  if (!professional) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-2 text-sm sm:text-base text-red-500">
            {error || "Unable to load professional."}
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-5 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Back to Professionals
          </Link>
        </div>
      </section>
    );
  }

  // =========================
  // Booking Page
  // =========================

  return (
    <section className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-3 sm:px-5 md:px-6">
        {/* Back */}

        <Link
          to={`/professionals/${professional._id}`}
          className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 transition"
        >
          ← Back to Profile
        </Link>

        {/* =========================
            Booking Card
        ========================= */}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Book {professional.name}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 break-words">
            {professional.profession} • ₹
            {professional.price}
          </p>

          {/* =========================
              Availability
          ========================= */}

          <div className="mt-3 sm:mt-4">
            {professional.available ? (
              <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                ● Available
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium">
                ● Currently Unavailable
              </span>
            )}
          </div>

          {/* =========================
              Error
          ========================= */}

          {error && (
            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 break-words">
                {error}
              </p>
            </div>
          )}

          {/* =========================
              Unavailable Message
          ========================= */}

          {!professional.available && (
            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed">
                This professional is currently busy
                and cannot accept new bookings.
              </p>

              <Link
                to={`/professionals/${professional._id}`}
                className="inline-block mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Choose another professional →
              </Link>
            </div>
          )}

          {/* =========================
              Form
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 space-y-5 sm:space-y-6"
          >
            {/* =========================
                Date + Time
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Date */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTodayDate()}
                  disabled={!professional.available}
                  required
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Time */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!professional.available}
                  required
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* =========================
                Address
            ========================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Address
              </label>

              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                disabled={!professional.available}
                required
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <p className="mt-1 text-xs text-gray-400">
                Enter at least 10 characters.
              </p>
            </div>

            {/* =========================
                City + Pincode
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* City */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Noida"
                  autoComplete="address-level2"
                  disabled={!professional.available}
                  required
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Pincode */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="201301"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength="6"
                  disabled={!professional.available}
                  required
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Enter a 6-digit pincode.
                </p>
              </div>
            </div>

            {/* =========================
                Notes
            ========================= */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Problem
              </label>

              <textarea
                required
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Describe the problem or service you need..."
                maxLength="500"
                disabled={!professional.available}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <div className="mt-1 text-right text-xs text-gray-400">
                {formData.notes.length}/500
              </div>
            </div>

            {/* =========================
                Summary
            ========================= */}

            <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Booking Summary
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <div className="flex flex-col xs:flex-row xs:justify-between gap-1 sm:gap-4">
                  <span className="text-gray-500">
                    Professional
                  </span>

                  <span className="font-medium text-gray-900 break-words sm:text-right">
                    {professional.name}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row xs:justify-between gap-1 sm:gap-4">
                  <span className="text-gray-500">
                    Service
                  </span>

                  <span className="font-medium text-gray-900 break-words sm:text-right">
                    {professional.profession}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">
                    Starting Price
                  </span>

                  <span className="font-medium text-gray-900 whitespace-nowrap">
                    ₹{professional.price}
                  </span>
                </div>
              </div>
            </div>

            {/* =========================
                Confirm Booking
            ========================= */}

            <button
              type="submit"
              disabled={
                bookingLoading ||
                !professional.available
              }
              className="w-full py-3 sm:py-4 px-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {bookingLoading
                ? "Creating Booking..."
                : professional.available
                ? "Confirm Booking"
                : "Professional Unavailable"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookService;