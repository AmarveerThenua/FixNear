import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      const loggedInUser = response.data.user;
      const token = response.data.token;

      login(loggedInUser, token);

      if (loggedInUser?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (loggedInUser?.role === "professional") {
        navigate("/professional-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Login to your FixNear account.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          {error && (
            <div className="mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 wrap-break-word">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 text-sm sm:text-base border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50 transition"
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

            <div className="flex justify-end mt-3">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 sm:mt-6 py-2.5 sm:py-3 px-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 sm:mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;