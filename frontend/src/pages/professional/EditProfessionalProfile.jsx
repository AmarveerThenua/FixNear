import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfessionalProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("fixnearToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/professionals/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const professional = response.data.professional;

        setFormData({
          name: professional.name || "",
          profession: professional.profession || "",
          email: professional.email || "",
          phone: professional.phone || "",
          skills: Array.isArray(professional.skills)
            ? professional.skills.join(", ")
            : "",
          experience: professional.experience || "",
          description: professional.description || "",
          address: professional.address || "",
          city: professional.city || "",
          state: professional.state || "",
          pincode: professional.pincode || "",
          location: professional.location || "",
          serviceArea: Array.isArray(professional.serviceArea)
            ? professional.serviceArea.join(", ")
            : "",
          price: professional.price ?? "",
          available:
            professional.available !== undefined
              ? professional.available
              : true,
        });
      } catch (error) {
        console.error(
          "Failed to fetch professional profile:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load professional profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("fixnearToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const professionalData = {
        name: formData.name,
        profession: formData.profession,
        phone: formData.phone,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: formData.experience,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        location: formData.location,
        serviceArea: formData.serviceArea
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
        price: Number(formData.price),
        available: formData.available,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/professionals/me`,
        professionalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Professional profile updated successfully.");

      setTimeout(() => {
        navigate("/professional-profile");
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update professional profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update professional profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Edit Professional Profile
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Update your professional information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/professional-profile")}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            Back to Profile
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 break-words">
              {success}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-5">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />

              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputMode="tel"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-8 mb-5">
            Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Work
              </label>

              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select your profession</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 5 years"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="AC Installation, AC Repair, Servicing"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate multiple skills with commas.
            </p>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Your Services
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-8 mb-5">
            Address & Location
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                maxLength="6"
                inputMode="numeric"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location / Area
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Areas
            </label>

            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              required
              placeholder="Sector 62, Sector 63, Sector 61"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <p className="text-xs text-gray-500 mt-2">
              Separate multiple areas with commas.
            </p>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-8 mb-5">
            Service Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                inputMode="numeric"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center min-h-[48px] md:mt-7">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />

              <label className="ml-3 text-sm sm:text-base text-gray-700 cursor-pointer">
                I am currently available for work
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/professional-profile")}
              disabled={saving}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfessionalProfile;