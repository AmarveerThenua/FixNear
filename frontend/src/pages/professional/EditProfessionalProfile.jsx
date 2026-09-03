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

  const inputClass =
    "w-full h-9 sm:h-10 lg:h-11 px-2.5 sm:px-3 lg:px-4 text-[10px] sm:text-xs lg:text-sm border border-gray-200 rounded-md sm:rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const labelClass =
    "block text-[9px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5";

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-3 md:p-5 lg:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5 lg:mb-6">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
              Edit Professional Profile
            </h1>

            <p className="text-[8px] sm:text-xs lg:text-sm text-gray-500 mt-0.5 truncate">
              Update your professional information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/professional-profile")}
            className="shrink-0 px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2.5 bg-gray-100 text-gray-700 rounded-md sm:rounded-lg hover:bg-gray-200 transition text-[9px] sm:text-xs lg:text-sm font-medium"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-2.5 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md sm:rounded-lg">
            <p className="text-[9px] sm:text-xs lg:text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-2.5 sm:mb-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-md sm:rounded-lg">
            <p className="text-[9px] sm:text-xs lg:text-sm text-green-600 break-words">
              {success}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-2.5 sm:p-4 md:p-5 lg:p-8"
        >
          <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-800 mb-2.5 sm:mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputMode="tel"
                className={inputClass}
              />
            </div>
          </div>

          <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-800 mt-4 sm:mt-6 lg:mt-8 mb-2.5 sm:mb-4">
            Professional Information
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-5">
            <div>
              <label className={labelClass}>Type of Work</label>

              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className={`${inputClass} bg-white`}
              >
                <option value="">Select profession</option>
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
                min="0"
                required
                inputMode="numeric"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <label className={labelClass}>Skills</label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="AC Installation, AC Repair, Servicing"
              required
              className={inputClass}
            />

            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mt-1">
              Separate multiple skills with commas.
            </p>
          </div>

          <div className="mt-2 sm:mt-4">
            <label className={labelClass}>About Your Services</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              required
              className="w-full h-12 sm:h-16 lg:h-20 px-2.5 sm:px-3 lg:px-4 py-2 text-[10px] sm:text-xs lg:text-sm border border-gray-200 rounded-md sm:rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-800 mt-4 sm:mt-6 lg:mt-8 mb-2.5 sm:mb-4">
            Address & Location
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
            <div className="col-span-2 md:col-span-2">
              <label className={labelClass}>Full Address</label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
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
                required
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
                required
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
                required
                maxLength="6"
                inputMode="numeric"
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
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <label className={labelClass}>Service Areas</label>

            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              required
              placeholder="Sector 62, Sector 63, Sector 61"
              className={inputClass}
            />

            <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 mt-1">
              Separate multiple areas with commas.
            </p>
          </div>

          <div className="mt-3 sm:mt-5 flex items-center justify-between gap-3">
            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-blue-600 cursor-pointer shrink-0"
              />

              <span className="text-[9px] sm:text-xs lg:text-sm text-gray-700 truncate">
                Currently available for work
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-5 lg:mt-7">
            <button
              type="submit"
              disabled={saving}
              className="py-2 sm:py-2.5 lg:py-3 px-2 sm:px-4 bg-blue-600 text-white text-[9px] sm:text-xs lg:text-sm font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/professional-profile")}
              disabled={saving}
              className="py-2 sm:py-2.5 lg:py-3 px-2 sm:px-4 bg-gray-100 text-gray-700 text-[9px] sm:text-xs lg:text-sm font-semibold rounded-md sm:rounded-lg hover:bg-gray-200 disabled:cursor-not-allowed transition"
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