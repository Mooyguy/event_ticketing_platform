import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import { fetchEventById } from "../services/eventService";
import { formatCurrency } from "../utils/formatCurrency";
import getCategoryImage from "../utils/getCategoryImage";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user in localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoadingEvent(true);
        setEventError("");
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setEventError(err.message || "Failed to load event");
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleProceedToPayment = () => {
    setBookingError("");

    if (!loggedInUser?.id) {
      setBookingError("Please login before booking an event.");
      return;
    }

    if (ticketCount < 1) {
      setBookingError("Ticket quantity must be at least 1.");
      return;
    }

    if (Number(ticketCount) > Number(event.seatsLeft)) {
      setBookingError("Selected ticket quantity exceeds available seats.");
      return;
    }

    navigate("/payment", {
      state: {
        event_id: Number(id),
        eventTitle: event.title,
        category: event.category,
        venue: event.venue,
        location: event.location,
        price: Number(event.price),
        quantity: Number(ticketCount),
      },
    });
  };

  if (loadingEvent) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="rounded-[24px] bg-white p-6 text-center text-base shadow-lg sm:p-8 sm:text-lg">
          Loading event details...
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="rounded-[24px] bg-red-100 p-6 text-center text-base text-red-700 shadow-lg sm:p-8 sm:text-lg">
          {eventError}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        Event not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="overflow-hidden rounded-[28px] bg-slate-200 shadow-lg">
          <img
            src={event.image || getCategoryImage(event.category)}
            alt={event.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getCategoryImage(event.category);
            }}
            className="h-64 w-full object-cover sm:h-80 lg:h-full"
          />
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
          <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
            {event.category}
          </span>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {event.title}
          </h1>

          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {event.description}
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-700 sm:text-base">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>{event.date}</span>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>
                {event.venue}, {event.location}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>Seats left: {event.seatsLeft}</span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 sm:p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Book This Event
            </h2>

            {loggedInUser ? (
              <div className="mb-4 rounded-xl bg-white p-4 text-sm text-slate-700 sm:text-base">
                Booking as <strong>{loggedInUser.name}</strong> ({loggedInUser.email})
              </div>
            ) : (
              <div className="mb-4 rounded-xl bg-amber-100 p-4 text-sm text-amber-800 sm:text-base">
                Please login to continue with your booking and payment.
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block font-semibold text-slate-800">
                Number of Tickets
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 sm:w-40"
              />
            </div>

            <p className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">
              Total: {formatCurrency(Number(event.price) * ticketCount)}
            </p>

            <button
              onClick={handleProceedToPayment}
              className="mt-5 h-14 w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-base font-semibold text-white shadow-lg hover:opacity-95 sm:text-lg"
            >
              Proceed to Payment
            </button>

            {bookingError && (
              <div className="mt-5 rounded-xl bg-red-100 p-4 text-red-700">
                {bookingError}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}