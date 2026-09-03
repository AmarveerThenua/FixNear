import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">

       

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-block text-2xl sm:text-3xl font-bold text-white"
            >
              FixNear
            </Link>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-400 max-w-md lg:max-w-none">
              Find trusted professionals near you for all your
              home and everyday service needs.
            </p>
          </div>

   
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4">
              Quick Links
            </h3>

            <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <Link
                to="/"
                className="block hover:text-white transition"
              >
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
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4">
              For Professionals
            </h3>

            <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
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
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4">
              Contact Us
            </h3>

            <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-400 wrap-break-word">
              <p>📍 Noida, India</p>
              <p>📧 support@fixnear.com</p>
              <p>📞 +91 95483 96081</p>
            </div>
          </div>
        </div>

      

        <div className="border-t border-gray-800 mt-10 sm:mt-12 pt-6 sm:pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          <p className="text-xs sm:text-sm text-gray-500">
            © 2026 FixNear. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
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