import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfessionalRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    email: "",
    password: "",
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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
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
        `${import.meta.env.VITE_API_URL}/auth/register-professional`,
        professionalData
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
        "Professional account created successfully! Redirecting..."
      );

      setTimeout(() => {
        navigate("/professional-dashboard", {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.error(
        "Professional registration error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create professional account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-2";

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Professional Registration
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Join FixNear and offer your services to customers near you.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-7 md:p-8">
          {error && (
            <div className="mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 break-words">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 break-words">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              Account Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength="6"
                    autoComplete="new-password"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputClass}
                />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-5">
              Professional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>
                  Type of Work
                </label>

                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  className={`${inputClass} bg-white`}
                >
                  <option value="">
                    Select your profession
                  </option>
                  <option value="Electrician">
                    Electrician
                  </option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">
                    Carpenter
                  </option>
                  <option value="Painter">Painter</option>
                  <option value="AC Repair">
                    AC Repair
                  </option>
                  <option value="Appliance Repair">
                    Appliance Repair
                  </option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Beautician">
                    Beautician
                  </option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Experience
                </label>

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

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="AC Repair, Installation, Servicing"
                  required
                  className={inputClass}
                />

                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple skills with commas.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  About Your Services
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your experience and services..."
                  rows="4"
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-5">
              Address & Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="sm:col-span-2 md:col-span-3">
                <label className={labelClass}>
                  Full Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat, Street, Sector"
                  required
                  autoComplete="street-address"
                  rows="3"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  City
                </label>

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
                <label className={labelClass}>
                  State
                </label>

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
                <label className={labelClass}>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="201301"
                  required
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Location / Area
                </label>

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

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Service Areas
                </label>

                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="Sector 62, Sector 63, Sector 61"
                  required
                  className={inputClass}
                />

                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple areas with commas.
                </p>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-5">
              Service Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelClass}>
                  Starting Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299"
                  min="0"
                  required
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />

                <label className="ml-3 text-sm text-gray-700 cursor-pointer">
                  I am currently available for work
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Creating Professional Account..."
                : "Create Professional Account"}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Login
              </Link>
            </p>

            <p className="text-sm text-gray-600">
              Want to create a customer account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                User Registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalRegister;