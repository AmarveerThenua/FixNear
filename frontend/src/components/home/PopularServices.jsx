import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "../services/ServiceCard";
import services from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

const PopularServices = () => {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  const visibleServices = showAll ? services : services.slice(0, 6);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(".services-heading", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".service-card",
          {
            y: 50,
            opacity: 0,
            scale: 0.96,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".services-button",
          {
            y: 25,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-12 lg:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
        <div className="services-heading text-center mb-5 sm:mb-8 lg:mb-12">
          <p className="text-blue-600 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-1 sm:mb-2">
            Our Services
          </p>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>

          <p className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find trusted professionals for all your home and everyday service
            needs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="service-card"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {services.length > 6 && (
          <div className="services-button flex justify-center mt-6 sm:mt-8 lg:mt-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              {showAll ? "Show Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularServices;