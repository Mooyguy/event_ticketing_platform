import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import getCategoryImage from "../../utils/getCategoryImage";

export default function EventCard({ event }) {
  if (!event) return null;

  const safeImage = event.image || getCategoryImage(event.category);

  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden bg-slate-200 sm:h-44 lg:h-48">
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

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white sm:text-xs">
            {event.category}
          </span>

          <span className="rounded-full bg-green-600 px-3 py-1 text-[10px] font-semibold text-white sm:text-xs">
            {event.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-600 sm:text-sm">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
          <button
            type="button"
          className="h-11 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 text-sm font-bold text-white shadow-md sm:w-auto sm:min-w-[120px]"
          >
            {event.isExternal
              ? event.price && Number(event.price) > 0
                ? formatCurrency(event.price)
                : "Price TBA"
              : formatCurrency(event.price)}
          </button>

        {event.isExternal ? (
      <a
        href={event.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 text-sm font-semibold text-white shadow-md sm:flex-1"
      >
      View Event <ArrowRight className="ml-2 h-4 w-4" />
    </a>
       ) : (
    <Link
      to={`/events/${event.id}`}
      className="flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 text-sm font-semibold text-white shadow-md sm:flex-1"
    >
      View Details <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )}
        </div>
      </div>
    </div>
  );
}
