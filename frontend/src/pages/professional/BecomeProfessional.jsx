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
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
    
      const token =
        localStorage.getItem(
          "fixnearToken"
        );

      if (!token) {
        setError(
          "Please login before becoming a professional."
        );

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
        "http://localhost:5000/api/professionals",
        professionalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Professional Registration:",
        response.data
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
          JSON.stringify(
            response.data.user
          )
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
        navigate(
          "/professional-dashboard",
          {
            replace: true,
          }
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Professional Registration Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create professional profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
       

        <div className="text-center mb-7 sm:mb-9 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Become a Professional
          </h1>

          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join FixNear and offer your services to
            customers near you.
          </p>
        </div>

     

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Error */}

          {error && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 break-words leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs sm:text-sm text-green-600 break-words leading-relaxed">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
           

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
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
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
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
                  placeholder="Enter your phone number"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

           

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 sm:mt-10 mb-4 sm:mb-5">
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
                >
                  <option value="">
                    Select your profession
                  </option>

                  <option value="Electrician">
                    Electrician
                  </option>

                  <option value="Plumber">
                    Plumber
                  </option>

                  <option value="Carpenter">
                    Carpenter
                  </option>

                  <option value="Painter">
                    Painter
                  </option>

                  <option value="AC Repair">
                    AC Repair
                  </option>

                  <option value="Appliance Repair">
                    Appliance Repair
                  </option>

                  <option value="Cleaning">
                    Cleaning
                  </option>

                  <option value="Beautician">
                    Beautician
                  </option>

                  <option value="Mechanic">
                    Mechanic
                  </option>

                  <option value="Other">
                    Other
                  </option>
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

         

            <div className="mt-4 sm:mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="House Wiring, Fan Installation, Switch Repair"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Separate multiple skills with commas.
              </p>
            </div>

        

            <div className="mt-4 sm:mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Your Services
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your experience and services..."
                rows="4"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
              />
            </div>

         

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 sm:mt-10 mb-4 sm:mb-5">
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
                placeholder="House/Flat number, Street, Sector..."
                rows="3"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
              />
            </div>

            

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-5">
             
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
                  required
                  autoComplete="address-level2"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  placeholder="Uttar Pradesh"
                  required
                  autoComplete="address-level1"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  placeholder="201301"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength="6"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            

            <div className="mt-4 sm:mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location / Area
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sector 62, Noida"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

       

            <div className="mt-4 sm:mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Areas
              </label>

              <input
                type="text"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="Sector 62, Sector 63, Sector 61"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Separate multiple areas with commas.
              </p>
            </div>

           

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 sm:mt-10 mb-4 sm:mb-5">
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
                  placeholder="299"
                  min="0"
                  required
                  inputMode="numeric"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

      

              <div className="flex items-center min-h-[48px] md:mt-7">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-5 h-5 flex-shrink-0 accent-blue-600 cursor-pointer"
                />

                <label className="ml-3 text-sm sm:text-base text-gray-700 leading-relaxed cursor-pointer">
                  I am currently available for work
                </label>
              </div>
            </div>

        
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 sm:mt-10 py-3 sm:py-4 px-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Creating Professional Profile..."
                : "Create Professional Profile"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BecomeProfessional;