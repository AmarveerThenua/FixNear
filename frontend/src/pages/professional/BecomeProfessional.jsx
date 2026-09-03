import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BecomeProfessional = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    location: "",
    serviceArea: "",
    price: "",
    available: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        setError("Please login before becoming a professional.");
        setLoading(false);
        return;
      }

      const professionalData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        serviceArea: formData.serviceArea
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
        price: Number(formData.price),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/professionals`,
        professionalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem(
          "fixnearToken",
          response.data.token
        );
      }

      if (response.data.user) {
        localStorage.setItem(
          "fixnearUser",
          JSON.stringify(response.data.user)
        );
      }

      setSuccess(
        "Professional profile created successfully! Redirecting..."
      );

      setFormData({
        name: "",
        profession: "",
        email: "",
        phone: "",
        skills: "",
        experience: "",
        description: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        location: "",
        serviceArea: "",
        price: "",
        available: true,
      });

      setTimeout(() => {
        navigate("/professional-dashboard", {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.error("Professional Registration Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create professional profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-9 sm:h-10 px-2.5 sm:px-3 text-[11px] sm:text-xs lg:text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const labelClass =
    "block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1";

  return (
    <section className="min-h-screen bg-gray-50 py-3 sm:py-4 lg:py-5 px-2.5 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Become a Professional
          </h1>

          <p className="mt-0.5 text-[10px] sm:text-xs lg:text-sm text-gray-600">
            Join FixNear and offer your services to customers near you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-5">
          {error && (
            <div className="mb-3 p-2 sm:p-2.5 bg-red-50 border border-red-200 rounded-md">
              <p className="text-[10px] sm:text-xs text-red-600 break-words">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-3 p-2 sm:p-2.5 bg-green-50 border border-green-200 rounded-md">
              <p className="text-[10px] sm:text-xs text-green-600 break-words">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div>
                <label className={labelClass}>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Type of Work</label>

                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  className={`${inputClass} bg-white`}
                >
                  <option value="">
                    Select profession
                  </option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Appliance Repair">
                    Appliance Repair
                  </option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Beautician">Beautician</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-3 sm:mt-4 mb-2">
              Professional Information
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div>
                <label className={labelClass}>Experience</label>

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Starting Price</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹299"
                  min="0"
                  required
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="House Wiring, Fan Installation, Switch Repair"
                  required
                  className={inputClass}
                />
              </div>

              <div className="col-span-2 lg:col-span-4">
                <label className={labelClass}>
                  About Your Services
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your experience and services..."
                  rows="2"
                  required
                  className="w-full h-14 sm:h-16 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs lg:text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                />
              </div>
            </div>

            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mt-3 sm:mt-4 mb-2">
              Address & Location
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 sm:gap-3">
              <div className="col-span-2 lg:col-span-3">
                <label className={labelClass}>Full Address</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat, Street, Sector"
                  required
                  autoComplete="street-address"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Noida"
                  required
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>State</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Uttar Pradesh"
                  required
                  autoComplete="address-level1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="201301"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength="6"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location / Area</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Sector 62"
                  required
                  className={inputClass}
                />
              </div>

              <div className="col-span-2 lg:col-span-6">
                <label className={labelClass}>Service Areas</label>

                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="Sector 62, Sector 63, Sector 61"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />

                <span className="text-[10px] sm:text-xs lg:text-sm text-gray-700">
                  Currently available for work
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-[10px] sm:text-xs lg:text-sm font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition whitespace-nowrap"
              >
                {loading
                  ? "Creating..."
                  : "Create Professional Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BecomeProfessional;