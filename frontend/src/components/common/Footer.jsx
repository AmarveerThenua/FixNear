import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-7">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <Link
              to="/"
              className="inline-block text-lg sm:text-xl lg:text-2xl font-bold text-white"
            >
              FixNear
            </Link>

            <p className="mt-2 text-[10px] sm:text-xs lg:text-sm leading-relaxed text-gray-400 max-w-xs">
              Find trusted professionals near you for all your home and
              everyday service needs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base mb-2">
              Quick Links
            </h3>

            <div className="space-y-1 text-[10px] sm:text-xs lg:text-sm">
              <Link to="/" className="block hover:text-white transition">
                Home
              </Link>

              <Link
                to="/services"
                className="block hover:text-white transition"
              >
                Services
              </Link>

              <Link
                to="/professionals"
                className="block hover:text-white transition"
              >
                Find Professionals
              </Link>

              <Link
                to="/about"
                className="block hover:text-white transition"
              >
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base mb-2">
              For Professionals
            </h3>

            <div className="space-y-1 text-[10px] sm:text-xs lg:text-sm">
              <Link
                to="/become-professional"
                className="block hover:text-white transition"
              >
                Become a Professional
              </Link>

              <Link
                to="/login"
                className="block hover:text-white transition"
              >
                Professional Login
              </Link>

              <Link
                to="/how-it-works"
                className="block hover:text-white transition"
              >
                How It Works
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base mb-2">
              Contact Us
            </h3>

            <div className="space-y-1 text-[10px] sm:text-xs lg:text-sm text-gray-400 break-words">
              <p>📍 Noida, India</p>
              <p>📧 support@fixnear.com</p>
              <p>📞 +91 95483 96081</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 sm:mt-5 pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[9px] sm:text-xs text-gray-500">
            © 2026 FixNear. All rights reserved.
          </p>

          <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-xs">
            <Link
              to="/privacy"
              className="hover:text-white transition"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white transition"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;