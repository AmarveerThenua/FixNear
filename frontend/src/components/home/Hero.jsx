import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".hero-badge", {
        y: 25,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          ".hero-title",
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          ".hero-description",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-feature",
          {
            y: 25,
            opacity: 0,
            stagger: 0.12,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          ".hero-stat",
          {
            y: 25,
            opacity: 0,
            stagger: 0.12,
            duration: 0.5,
          },
          "-=0.25"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="bg-blue-50 min-h-[460px] sm:min-h-[500px] lg:min-h-[560px] flex items-center py-8 sm:py-12 lg:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl">
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 rounded-full mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></span>

            <p className="text-[10px] sm:text-xs md:text-sm text-blue-600 font-semibold">
              Trusted Professionals, Just Around the Corner
            </p>
          </div>

          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight">
            Find Trusted
            <br className="hidden sm:block" />
            Professionals
            <span className="text-blue-600"> Near You</span>
          </h1>

          <p className="hero-description mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
            Find skilled and verified professionals for all your home service
            needs. From plumbers and electricians to painters and cleaners.
          </p>

          <div className="mt-5 sm:mt-6 lg:mt-8 flex flex-wrap gap-2 sm:gap-3">
            <div className="hero-feature flex items-center gap-2 bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-sm">
              <span className="text-base sm:text-lg">✓</span>

              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                Verified Professionals
              </span>
            </div>

            <div className="hero-feature flex items-center gap-2 bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-sm">
              <span className="text-base sm:text-lg">📍</span>

              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                Near Your Location
              </span>
            </div>

            <div className="hero-feature flex items-center gap-2 bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-sm">
              <span className="text-base sm:text-lg">⭐</span>

              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                Trusted Reviews
              </span>
            </div>
          </div>

          <div className="mt-6 sm:mt-7 lg:mt-9 flex items-center gap-4 sm:gap-6">
            <div className="hero-stat">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                100+
              </p>

              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Professionals
              </p>
            </div>

            <div className="w-px h-8 sm:h-10 bg-gray-300"></div>

            <div className="hero-stat">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                500+
              </p>

              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                Services
              </p>
            </div>

            <div className="w-px h-8 sm:h-10 bg-gray-300"></div>

            <div className="hero-stat">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                4.8★
              </p>

              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                User Rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;