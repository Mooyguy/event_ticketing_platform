import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import PageHero from "../components/ui/PageHero";
import EventCard from "../components/ui/EventCard";
import { fetchEventById } from "../services/eventService";
import { fetchRecommendedEvents } from "../services/recommendationService";
import { addToCart } from "../services/cartService";
import { formatCurrency } from "../utils/formatCurrency";
import getCategoryImage from "../utils/getCategoryImage";

export default function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const data = await fetchRecommendedEvents(id);
        setRecommendedEvents(data || []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setRecommendedEvents([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (id) {
      loadRecommendations();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!event) return;

    if (Number(event.seatsLeft) <= 0) {
      setCartMessage("This event is sold out.");
      return;
    }

    addToCart(event, Number(quantity));
    setCartMessage(`${quantity} ticket(s) added to cart.`);
    setTimeout(() => setCartMessage(""), 2500);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="rounded-[24px] bg-white p-8 text-center text-lg shadow-lg">
          Loading event...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="rounded-[24px] bg-red-100 p-8 text-center text-lg text-red-700 shadow-lg">
          {error || "Event not found."}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  const safeImage = event.image || getCategoryImage(event.category);
  const isSoldOut = Number(event.seatsLeft) <= 0;

  return (
    <>
      <PageHero
        title={event.title}
        subtitle="View full event details and add tickets to your cart"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-lg">
            <div className="relative h-64 bg-slate-200 sm:h-80 lg:h-[420px]">
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

            <div className="space-y-6 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  {event.category}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                    isSoldOut ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : event.status || "Available"}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>
                    {event.venue}
                    {event.location ? `, ${event.location}` : ""}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-5 w-5 text-blue-600" />
                  <span>{event.seatsLeft} seats left</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">About this event</h3>
                <p className="mt-3 leading-7 text-slate-700">
                  {event.description || "No description available for this event."}
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900">Booking Summary</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Price per ticket</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(event.price)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-600">Availability</span>
                <span className="font-semibold text-slate-900">
                  {isSoldOut ? "Sold Out" : `${event.seatsLeft} seats left`}
                </span>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Number(event.seatsLeft))}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  disabled={isSoldOut}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(Number(event.price) * Number(quantity))}
                  </span>
                </div>
              </div>
            </div>

            {cartMessage && (
              <div className="mt-5 rounded-xl bg-blue-100 p-4 text-blue-700">
                {cartMessage}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <Link
                to="/cart"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                Go to Cart
              </Link>

              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              You May Also Like
            </h3>
            <p className="mt-2 text-slate-600">
              Similar events based on your current selection.
            </p>
          </div>

          {loadingRecommendations ? (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              Loading recommendations...
            </div>
          ) : recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedEvents.map((recommendedEvent) => (
                <EventCard key={recommendedEvent.id} event={recommendedEvent} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-6 text-center shadow-lg">
              No recommendations available right now.
            </div>
          )}
        </section>
      </main>
    </>
  );
}