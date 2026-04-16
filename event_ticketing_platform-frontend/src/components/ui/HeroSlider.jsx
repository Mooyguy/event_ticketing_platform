import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getCategoryImage from "../../utils/getCategoryImage";

export default function HeroSlider({ events = [] }) {
  const featuredEvents = events.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === featuredEvents.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  if (featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];
  const image = currentEvent.image || getCategoryImage(currentEvent.category);

  return (
    <div className="mx-auto mt-4 max-w-7xl overflow-hidden rounded-xl bg-white shadow-md">
      
      {/* 👇 Reduced height */}
      <div className="relative h-[140px] sm:h-[180px] lg:h-[220px]">
        <img
          src={image}
          alt={currentEvent.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getCategoryImage(currentEvent.category);
          }}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* 👇 Reduced padding */}
        <div className="absolute inset-0 flex items-end p-4 sm:p-6">
          <div className="max-w-xl text-white">

            <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold sm:text-xs">
              {currentEvent.category}
            </span>

            {/* 👇 Smaller heading */}
            <h2 className="mt-2 text-lg font-bold sm:text-2xl lg:text-3xl">
              {currentEvent.title}
            </h2>

            {/* 👇 Smaller text */}
            <p className="mt-1 text-xs sm:text-sm">
              {currentEvent.date} • {currentEvent.venue}
            </p>

            {/* 👇 Smaller button */}
            <Link
              to={`/events/${currentEvent.id}`}
              className="mt-3 inline-block rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 sm:text-sm"
            >
              View Event
            </Link>

          </div>
        </div>
      </div>

      {/* 👇 Smaller dots */}
      <div className="flex justify-center gap-2 py-2">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition ${
              index === currentIndex ? "bg-blue-600" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
