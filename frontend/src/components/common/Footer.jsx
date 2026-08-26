import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white"
            >
              FixNear
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Find trusted professionals near you for all your
              home and everyday service needs.
            </p>
          </div>

        
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">

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

          {/* For Professionals */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              For Professionals
            </h3>

            <div className="space-y-3 text-sm">

              <Link
                to="/register/worker"
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
            <h3 className="text-white font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-sm text-gray-400">

              <p>📍 Noida, India</p>

              <p>📧 support@fixnear.com</p>

              <p>📞 +91 00000 00000</p>

            </div>
          </div>

        </div>

     
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-500">
            © 2026 FixNear. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">

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
  )
}

export default Footer