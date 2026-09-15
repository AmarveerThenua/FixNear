import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowRight,
  faShieldHalved,
  faWrench,
  faUserCheck,
  faLocationDot,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/FixNearLogo.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      );

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-blue-100/50 sm:rounded-3xl lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                <FontAwesomeIcon
                  icon={faUserCheck}
                  className="mr-2 text-sm"
                />
                <span className="text-sm font-medium">
                  Join FixNear
                </span>
              </div>

              <h2 className="max-w-md text-3xl font-bold leading-tight xl:text-4xl">
                Find trusted professionals for your everyday needs.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-blue-100 xl:text-base">
                Create your FixNear account and connect with reliable local
                service professionals quickly and easily.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>

                <span className="text-sm text-blue-50">
                  Discover trusted professionals
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faWrench} />
                </div>

                <span className="text-sm text-blue-50">
                  Book services with ease
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>

                <span className="text-sm text-blue-50">
                  Secure and convenient platform
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10 lg:p-10 xl:p-12">
            <div className="mb-6 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <img
                  src={Logo}
                  alt="FixNear"
                  className="h-10 w-auto sm:h-12"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Join FixNear and find trusted professionals
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <FontAwesomeIcon icon={faWrench} className="text-sm" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Are you a service professional?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                    Join FixNear and offer your services to customers near
                    you.
                  </p>

                  <Link
                    to="/professional-register"
                    className="group mt-3 inline-flex items-center rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:text-sm"
                  >
                    Register as a Professional

                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 text-[10px] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="break-words text-xs leading-5 text-red-600 sm:text-sm">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="break-words text-xs leading-5 text-green-600 sm:text-sm">
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4.5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:py-3.5 sm:text-base"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength="6"
                    autoComplete="new-password"
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

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:py-3.5 sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Location
                </label>

                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    autoComplete="address-level2"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:py-3.5 sm:text-base"
                  />

                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none sm:py-3.5 sm:text-base"
              >
                <span>
                  {loading ? "Creating Account..." : "Create Account"}
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

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs text-gray-600 sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-[10px] text-gray-400 sm:text-xs">
              Create your account and start using FixNear today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;