import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import professionals from "../../data/professionals";
import { saveBooking } from "../../utils/bookingStorage";

const BookService = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const booking = {
      id: Date.now(),
      professionalId: professional.id,
      professional: professional.name,
      service: professional.profession,
      date: formData.date,
      time: formData.time,
      price: professional.price,
      address: formData.address,
      notes: formData.notes,
      status: "Confirmed"
    };

    saveBooking(booking);

    navigate("/booking-success", {
      state: {
        booking
      }
    });
  };

  
  if (!professional) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Professional Not Found
        </h1>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-3xl mx-auto px-6">

        <Link
          to={`/professionals/${professional.id}`}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Profile
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Book {professional.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {professional.profession} • ₹{professional.price}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Address */}
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />

            </div>

            {/* Notes */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>

              <textarea
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Describe the problem..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />

            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-5">

              <h2 className="font-semibold text-gray-900 mb-3">
                Booking Summary
              </h2>

              <div className="space-y-2 text-gray-700">

                <div className="flex justify-between">
                  <span>Professional</span>
                  <span>{professional.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service</span>
                  <span>{professional.profession}</span>
                </div>

                <div className="flex justify-between">
                  <span>Starting Price</span>
                  <span>₹{professional.price}</span>
                </div>

              </div>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Confirm Booking
            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default BookService;