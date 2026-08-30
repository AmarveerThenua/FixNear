import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <nav className="w-full bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">
            FixNear
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/services"
            className="text-gray-700 hover:text-blue-600"
          >
            Services
          </Link>

          <Link
            to="/professionals"
            className="text-gray-700 hover:text-blue-600"
          >
            Find Professionals
          </Link>

          <Link
            to="/register"
            className="text-gray-700 hover:text-blue-600"
          >
            Become a Professional
          </Link>

        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>

        </div>

      </div>

    </nav>
  )
}

export default Navbar