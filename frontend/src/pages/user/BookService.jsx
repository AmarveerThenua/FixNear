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

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals/${id}`
        );

        setProfessional(response.data.professional);
      } catch (error) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      setFormData({
        ...formData,
        [name]: value.replace(/\D/g, "").slice(0, 6),
      });
      return;
    }

    if (name === "city") {
      setFormData({
        ...formData,
        [name]: value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50),
      });
      return;
    }

    if (name === "notes") {
      setFormData({
        ...formData,
        [name]: value.slice(0, 500),
      });
      return;
    }

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

  const validateForm = () => {
    const date = formData.date.trim();
    const time = formData.time.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const pincode = formData.pincode.trim();
    const notes = formData.notes.trim();

    if (!professional) {
      return "Professional information is not available.";
    }

    if (!professional.available) {
      return "This professional is currently unavailable.";
    }

    if (!date) {
      return "Please select a booking date.";
    }

    const today = getTodayDate();

    if (date < today) {
      return "Booking date cannot be in the past.";
    }

    if (!time) {
      return "Please select a booking time.";
    }

    if (date === today) {
      const now = new Date();

      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${currentHours}:${currentMinutes}`;

      if (time <= currentTime) {
        return "Please select a future time.";
      }
    }

    if (!address) {
      return "Please enter your service address.";
    }

    if (address.length < 10) {
      return "Please enter a complete service address.";
    }

    if (!city) {
      return "Please enter your city.";
    }

    if (city.length < 2) {
      return "Please enter a valid city name.";
    }

    if (!/^[a-zA-Z\s]+$/.test(city)) {
      return "City name can contain only letters and spaces.";
    }

    if (!pincode) {
      return "Please enter your pincode.";
    }

    if (!/^\d{6}$/.test(pincode)) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (notes.length > 500) {
      return "Problem description cannot exceed 500 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (bookingLoading) {
      return;
    }

    setBookingLoading(true);

    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login before booking a professional.");
        setBookingLoading(false);
        return;
      }

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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/booking-success", {
        state: {
          booking: response.data.booking,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="mt-3 text-xs sm:text-base text-gray-600">
            Loading professional...
          </p>
        </div>
      </section>
    );
  }

  if (!professional) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-3">
        <div className="text-center max-w-md">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-2 text-xs sm:text-base text-red-500">
            {error || "Unable to load professional."}
          </p>

          <Link
            to="/professionals"
            className="inline-block mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-xs sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Back to Professionals
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-3 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-2.5 sm:px-5 md:px-6">
        <Link
          to={`/professionals/${professional._id}`}
          className="inline-flex items-center text-xs sm:text-base text-blue-600 hover:text-blue-700 transition"
        >
          ← Back to Profile
        </Link>

        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 md:p-8 mt-3 sm:mt-6">
          <h1 className="text-lg sm:text-3xl font-bold text-gray-900 break-words">
            Book {professional.name}
          </h1>

          <p className="mt-1 text-xs sm:text-base text-gray-600 break-words">
            {professional.profession} • ₹{professional.price}
          </p>

          <div className="mt-2 sm:mt-4">
            {professional.available ? (
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-[9px] sm:text-sm font-medium">
                ● Available
              </span>
            ) : (
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-full text-[9px] sm:text-sm font-medium">
                ● Currently Unavailable
              </span>
            )}
          </div>

          {error && (
            <div className="mt-3 sm:mt-6 p-2.5 sm:p-4 bg-red-50 border border-red-200 rounded-md sm:rounded-lg">
              <p className="text-[10px] sm:text-sm text-red-600 break-words">
                {error}
              </p>
            </div>
          )}

          {!professional.available && (
            <div className="mt-3 sm:mt-6 p-2.5 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md sm:rounded-lg">
              <p className="text-[10px] sm:text-sm text-yellow-700 leading-relaxed">
                This professional is currently busy and cannot accept new bookings.
              </p>

              <Link
                to="/professionals"
                className="inline-block mt-2 text-[10px] sm:text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Choose another professional →
              </Link>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-4 sm:mt-8 space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full h-9 sm:h-auto px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Select Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!professional.available}
                  required
                  className="w-full h-9 sm:h-auto px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Service Address
              </label>

              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                disabled={!professional.available}
                required
                className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <p className="mt-0.5 text-[8px] sm:text-xs text-gray-400">
                Enter at least 10 characters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full h-9 sm:h-auto px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  className="w-full h-9 sm:h-auto px-2 sm:px-4 py-1.5 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <p className="mt-0.5 text-[8px] sm:text-xs text-gray-400">
                  6-digit pincode.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Describe Your Problem
              </label>

              <textarea
                required
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Describe the problem or service you need..."
                maxLength="500"
                disabled={!professional.available}
                className="w-full px-2.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <div className="mt-0.5 text-right text-[8px] sm:text-xs text-gray-400">
                {formData.notes.length}/500
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-5">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Booking Summary
              </h2>

              <div className="space-y-1.5 sm:space-y-3 text-[10px] sm:text-base text-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">
                    Professional
                  </span>

                  <span className="font-medium text-gray-900 text-right break-words">
                    {professional.name}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">
                    Service
                  </span>

                  <span className="font-medium text-gray-900 text-right break-words">
                    {professional.profession}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-500">
                    Starting Price
                  </span>

                  <span className="font-medium text-gray-900 whitespace-nowrap">
                    ₹{professional.price}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                bookingLoading ||
                !professional.available
              }
              className="w-full h-10 sm:h-auto py-2 sm:py-4 px-3 bg-blue-600 text-white text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
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