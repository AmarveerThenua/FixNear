import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 sm:px-6 py-10 overflow-hidden">
      {/* =========================
          Animated Background Circles
      ========================= */}

      <div className="absolute top-10 left-0 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/40 rounded-full animate-bounce" />

      <div className="absolute bottom-10 right-0 sm:bottom-20 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-blue-300/30 rounded-full animate-pulse" />

      <div className="absolute top-1/2 left-[15%] sm:left-1/4 w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-full animate-ping" />

      {/* =========================
          Main Content
      ========================= */}

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* FixNear Logo */}

        <Link
          to="/"
          className="inline-block mb-5 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            FixNear
          </h1>
        </Link>

        {/* =========================
            404
        ========================= */}

        <div className="relative">
          <h2
            className="
              text-[80px]
              xs:text-[100px]
              sm:text-[150px]
              md:text-[190px]
              lg:text-[200px]
              font-black
              leading-none
              text-blue-600
              select-none
              animate-pulse
            "
          >
            404
          </h2>

          {/* Floating Question Mark */}

          <span
            className="
              absolute
              -top-1
              left-1/2
              -translate-x-1/2
              text-3xl
              sm:text-5xl
              animate-bounce
            "
          >
            ?
          </span>
        </div>

        {/* =========================
            Message
        ========================= */}

        <div className="animate-[fadeIn_1s_ease-in-out]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-3 sm:mt-4">
            Page Not Found
          </h3>

          <p className="mt-3 sm:mt-4 px-2 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist
            or may have been moved.
          </p>
        </div>

        {/* =========================
            Buttons
        ========================= */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Go Home */}

          <Link
            to="/"
            className="
              w-full
              sm:w-auto
              px-6
              sm:px-7
              py-2.5
              sm:py-3
              bg-blue-600
              text-white
              rounded-xl
              font-semibold
              text-sm
              sm:text-base
              shadow-lg
              hover:bg-blue-700
              hover:scale-105
              transition
              duration-300
            "
          >
            Go to Home
          </Link>

          {/* Go Back */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              w-full
              sm:w-auto
              px-6
              sm:px-7
              py-2.5
              sm:py-3
              border
              border-gray-300
              bg-white/60
              text-gray-700
              rounded-xl
              font-semibold
              text-sm
              sm:text-base
              hover:bg-white
              hover:scale-105
              transition
              duration-300
            "
          >
            Go Back
          </button>
        </div>

        {/* =========================
            Bottom Text
        ========================= */}

        <p className="mt-7 sm:mt-10 text-xs sm:text-sm text-gray-400">
          Let's get you back to FixNear.
        </p>
      </div>

      {/* =========================
          Custom Animation
      ========================= */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ErrorPage;