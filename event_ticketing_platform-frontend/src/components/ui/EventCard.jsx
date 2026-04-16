import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import getCategoryImage from "../../utils/getCategoryImage";

export default function EventCard({ event }) {
  if (!event) return null;

  const safeImage = event.image || getCategoryImage(event.category);

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-64 lg:h-72">
        <img
          src={safeImage}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getCategoryImage(event.category);
          }}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
            {event.category}
          </span>

          <span className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
            {event.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-slate-600 sm:text-base">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="h-14 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 text-lg font-bold text-white shadow-lg sm:min-w-[150px] sm:w-auto"
          >
            {formatCurrency(event.price)}
          </button>

          <Link
            to={`/events/${event.id}`}
            className="flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 text-base font-semibold text-white shadow-lg sm:flex-1 sm:text-lg"
          >
            View Details <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}