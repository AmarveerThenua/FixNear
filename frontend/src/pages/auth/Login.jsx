import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowRight,
  faShieldHalved,
  faBolt,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/FixNearLogo.png";

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
    <section className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-137px)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-100/50 lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="mr-2 text-sm"
                />
                <span className="text-sm font-medium">
                  Secure & Trusted
                </span>
              </div>

              <h2 className="max-w-md text-3xl font-bold leading-tight xl:text-4xl">
                Your trusted services are just a few clicks away.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-blue-100 xl:text-base">
                Login to FixNear and find reliable professionals for your
                everyday home service needs.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <span className="text-sm text-blue-50">
                  Verified local professionals
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faBolt} />
                </div>
                <span className="text-sm text-blue-50">
                  Fast and convenient booking
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <span className="text-sm text-blue-50">
                  Safe and secure platform
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10 lg:p-10 xl:p-12">
            <div className="mb-7 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <img
                  src={Logo}
                  alt="FixNear"
                  className="h-10 w-auto sm:h-12"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Login to continue to your FixNear account
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs leading-5 text-red-600 sm:text-sm">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:py-3.5 sm:text-base"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:py-3.5 sm:text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none sm:py-3.5 sm:text-base"
              >
                <span>
                  {loading ? "Logging in..." : "Login to FixNear"}
                </span>

                {!loading && (
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xs transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-center">
              <p className="text-xs text-gray-600 sm:text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-[10px] text-gray-400 sm:text-xs">
              By continuing, you agree to use FixNear responsibly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;